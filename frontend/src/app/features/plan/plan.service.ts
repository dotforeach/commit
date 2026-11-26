import { Injectable, computed, effect, inject, signal, untracked } from '@angular/core';
import { KeyVaultService } from '../../core/crypto/key-vault.service';
import { todayIso } from '../../core/dates/dates';
import { HouseholdContextService } from '../../core/households/household-context.service';
import { addDecimals, ZERO } from '../../core/money/decimal';
import { AccountsService } from '../accounts/accounts.service';
import { shiftMonth, statementMonthOf } from '../cards/card-cycle';
import { estimateStatement } from '../cards/card-statement';
import { InstallmentsService } from '../cards/installments.service';
import { frenchPayment } from '../debts/debt-math';
import { DebtsService } from '../debts/debts.service';
import { lastFullMonths, ProgressService } from '../progress/progress.service';
import { RatesService } from '../rates/rates.service';
import { goalProgress } from '../savings/savings-math';
import { SavingsService } from '../savings/savings.service';
import { TransactionsService } from '../transactions/transactions.service';
import { buildPlan, type PlanInput, type PlanResult } from './plan-engine';

const storageKey = (householdId: string) => `commit.plan.${householdId}`;

/** Arma los datos del Plan mágico a partir de lo que ya está descifrado en memoria. */
@Injectable({ providedIn: 'root' })
export class PlanService {
  private readonly hh = inject(HouseholdContextService);
  private readonly progress = inject(ProgressService);
  private readonly accounts = inject(AccountsService);
  private readonly transactions = inject(TransactionsService);
  private readonly debts = inject(DebtsService);
  private readonly installments = inject(InstallmentsService);
  private readonly savings = inject(SavingsService);
  private readonly rates = inject(RatesService);

  /** Inflación mensual esperada (fracción). Se guarda cifrada con la clave del hogar, en este dispositivo. */
  readonly monthlyInflation = signal<number | null>(null);

  constructor() {
    const vault = inject(KeyVaultService);
    effect(() => {
      vault.generation();
      untracked(() => this.monthlyInflation.set(null));
    });
  }

  async ensureLoaded() {
    await Promise.all([this.progress.ensureLoaded(), this.installments.ensureLoaded(), this.savings.ensureLoaded(), this.rates.ensureLoaded()]);
    await this.loadInflation();
  }

  private async loadInflation() {
    const hid = this.hh.household()?.id;
    const raw = hid ? localStorage.getItem(storageKey(hid)) : null;
    if (!hid || !raw) return this.monthlyInflation.set(null);
    try {
      const { payload, keyVersion } = JSON.parse(raw) as { payload: string; keyVersion: number };
      const { monthlyInflation } = await this.hh.open<{ monthlyInflation: number | null }>('plan_settings', hid, payload, keyVersion);
      this.monthlyInflation.set(monthlyInflation);
    } catch {
      this.monthlyInflation.set(null); // de otra clave (rotada) o dañado: se vuelve a cargar
    }
  }

  async setInflation(monthlyInflation: number | null) {
    const hid = this.hh.requireHousehold().id;
    if (monthlyInflation === null) localStorage.removeItem(storageKey(hid));
    else localStorage.setItem(storageKey(hid), JSON.stringify(await this.hh.seal('plan_settings', hid, { monthlyInflation })));
    this.monthlyInflation.set(monthlyInflation);
  }

  readonly input = computed<PlanInput>(() => {
    const base = this.hh.baseCurrency();
    const conv = this.rates.converter();
    const toBase = (n: number, from: string) => {
      const r = conv.rate(from, base);
      return r === null ? 0 : n * r;
    };
    const snap = this.progress.snapshot();
    const accounts = this.accounts.accounts();
    const currencyOf = (id: string) => accounts.find((a) => a.id === id)?.currency ?? base;
    const txs = this.transactions.transactions();
    const today = todayIso();

    // Pagos de deudas registrados (promedio de los mismos meses que Progreso): se sacan del gasto de vida.
    const months = lastFullMonths(today);
    const withData = months.filter((m) => txs.some((t) => t.date.startsWith(m))).length;
    const debtPayments =
      withData > 0
        ? txs.filter((t) => t.type === 'EXPENSE' && t.debtId && months.some((m) => t.date.startsWith(m))).reduce((s, t) => s + toBase(Number(t.amount), currencyOf(t.accountId)), 0) / withData
        : 0;

    const debts = this.debts
      .debts()
      .filter((d) => d.status === 'ACTIVE' && conv.rate(d.currency, base) !== null)
      .map((d) => {
        const min = d.minimumPayment ? Number(d.minimumPayment) : d.termMonths ? frenchPayment(Number(d.originalAmount), Number(d.annualRate ?? 0), d.termMonths) : 0;
        return {
          id: d.id,
          name: d.name,
          balance: toBase(Number(this.debts.balance(d)), d.currency),
          annualRate: Number(d.annualRate ?? 0),
          rateType: d.rateType,
          minimumPayment: toBase(min, d.currency),
          paymentDay: d.paymentDay,
          inflationExposed: d.currency === base,
        };
      });

    const plans = this.installments.plans();
    const cards = this.accounts
      .active()
      .filter((a) => a.type === 'CREDIT_CARD' && a.creditCard)
      .map((a) => {
        const card = { id: a.id, closingDay: a.creditCard!.closingDay, dueDay: a.creditCard!.dueDay };
        const st = estimateStatement(card, shiftMonth(statementMonthOf(today, card.closingDay), -1), txs, plans);
        return { accountId: a.id, name: a.name, due: toBase(Number(st.due), a.currency), dueDate: st.cycle.due };
      });

    const balances = this.transactions.balances();
    const goals = this.savings
      .goals()
      .filter((g) => g.kind !== 'EMERGENCY_FUND' && g.status === 'ACTIVE')
      .map((g) => {
        const current = g.accountId ? Number(balances.get(g.accountId)?.amount ?? 0) : Number(addDecimals(ZERO, ...g.contributions.map((c) => c.amount)));
        const needed = goalProgress(Number(g.targetAmount), current, g.targetDate, today).monthlyNeeded;
        return { id: g.id, name: g.name, monthlyNeeded: needed === null ? null : toBase(needed, g.currency), targetDate: g.targetDate };
      });

    return {
      avgIncome: snap.avgIncome,
      avgLivingExpenses: Math.max(snap.avgExpenses - debtPayments, 0),
      avgExpenses: snap.avgExpenses,
      emergencySaved: snap.emergencySaved,
      debts,
      cards,
      goals,
      monthlyInflation: this.monthlyInflation(),
    };
  });

  readonly plan = computed<PlanResult>(() => buildPlan(this.input()));
}
