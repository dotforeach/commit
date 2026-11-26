import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { OfflineCacheService } from '../../core/offline/offline-cache.service';
import { Injectable, computed, effect, inject, signal, untracked } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { v7 as uuidv7 } from 'uuid';
import { KeyVaultService } from '../../core/crypto/key-vault.service';
import { todayIso } from '../../core/dates/dates';
import { HouseholdContextService } from '../../core/households/household-context.service';
import { SessionService } from '../../core/session/session.service';
import { addDecimals, ZERO } from '../../core/money/decimal';
import { AccountsService } from '../accounts/accounts.service';
import { computeBudget } from '../budget/budget-math';
import { BudgetsService } from '../budget/budgets.service';
import { CategoriesService } from '../categories/categories.service';
import { frenchPayment } from '../debts/debt-math';
import { DebtsService } from '../debts/debts.service';
import { NetWorthService } from '../networth/net-worth.service';
import { RatesService } from '../rates/rates.service';
import { RecurringService } from '../recurring/recurring.service';
import { SavingsService } from '../savings/savings.service';
import { TransactionsService } from '../transactions/transactions.service';
import { healthScore, levels, tips, type FinanceSnapshot, type HealthScore } from './progress-engine';

const LIQUID = new Set(['CASH', 'CHECKING', 'SAVINGS', 'DIGITAL_WALLET']);

/** Los 3 meses completos anteriores a hoy ("YYYY-MM"). */
export function lastFullMonths(today: string, n = 3): string[] {
  const [y, m] = today.split('-').map(Number);
  return Array.from({ length: n }, (_, i) => {
    const t = y * 12 + (m - 1) - (i + 1);
    return `${Math.floor(t / 12)}-${String((t % 12) + 1).padStart(2, '0')}`;
  });
}

@Injectable({ providedIn: 'root' })
export class ProgressService {
  private readonly offlineCache = inject(OfflineCacheService);
  private readonly http = inject(HttpClient);
  private readonly hh = inject(HouseholdContextService);
  private readonly session = inject(SessionService);
  private readonly accounts = inject(AccountsService);
  private readonly transactions = inject(TransactionsService);
  private readonly budgets = inject(BudgetsService);
  private readonly categories = inject(CategoriesService);
  private readonly debts = inject(DebtsService);
  private readonly savings = inject(SavingsService);
  private readonly recurring = inject(RecurringService);
  private readonly rates = inject(RatesService);
  private readonly netWorth = inject(NetWorthService);

  readonly dismissed = signal<string[]>([]);
  readonly history = signal<{ id: string; date: string; score: number }[]>([]);
  readonly achieved = signal<{ key: string; at: string }[]>([]);
  private loaded = false;

  constructor() {
    const vault = inject(KeyVaultService);
    effect(() => {
      // Al bloquear o cambiar de hogar, los datos descifrados no quedan en memoria.
      vault.generation();
      untracked(() => {
        this.history.set([]);
        this.achieved.set([]);
        this.loaded = false;
      });
    });
  }

  private url(path: string) {
    return `/api/households/${this.hh.requireHousehold().id}/${path}`;
  }

  readonly snapshot = computed<FinanceSnapshot>(() => {
    const base = this.hh.baseCurrency();
    const conv = this.rates.converter();
    const accounts = this.accounts.accounts();
    const currencyOf = (id: string) => accounts.find((a) => a.id === id)?.currency ?? base;
    const toBase = (amount: number, from: string) => {
      const r = conv.rate(from, base);
      return r === null ? 0 : amount * r;
    };
    const txs = this.transactions.transactions();
    const months = lastFullMonths(todayIso());
    const monthly = (type: 'INCOME' | 'EXPENSE') => {
      const totals = months.map((m) => txs.filter((t) => t.type === type && t.date.startsWith(m)).reduce((s, t) => s + toBase(Number(t.amount), currencyOf(t.accountId)), 0));
      const withData = months.filter((m) => txs.some((t) => t.date.startsWith(m))).length;
      return withData > 0 ? totals.reduce((a, b) => a + b, 0) / withData : 0;
    };
    const balances = this.transactions.balances();
    const goalCurrent = (g: ReturnType<SavingsService['goals']>[number]) =>
      g.accountId ? Number(balances.get(g.accountId)?.amount ?? 0) : Number(addDecimals(ZERO, ...g.contributions.map((c) => c.amount)));
    const emergency = this.savings.goals().filter((g) => g.kind === 'EMERGENCY_FUND' && (g.status === 'ACTIVE' || g.status === 'ACHIEVED'));
    const activeDebts = this.debts.debts().filter((d) => d.status === 'ACTIVE');
    const now = new Date();
    const budget = this.budgets.budgets().find((b) => b.year === now.getFullYear() && b.month === now.getMonth() + 1);
    const progress = budget
      ? computeBudget(budget, {
          transactions: txs,
          currencyOfAccount: currencyOf,
          categoriesById: this.categories.byId(),
          budgets: this.budgets.budgets(),
          convert: (a, f, t) => conv.convert(a, f, t),
        })
      : null;
    const holdings = this.netWorth.holdings().filter((h) => h.quantity > 0);
    const assetsById = new Map(this.savings.assets().map((a) => [a.id, a]));
    const classes = new Set(holdings.map((h) => assetsById.get(h.assetId)?.assetClass));
    const activeDeposits = this.savings.deposits().filter((d) => d.status === 'ACTIVE');
    if (activeDeposits.length > 0) classes.add('DEPOSIT' as never);
    return {
      avgIncome: monthly('INCOME'),
      avgExpenses: monthly('EXPENSE'),
      emergencySaved: emergency.reduce((s, g) => s + toBase(goalCurrent(g), g.currency), 0),
      hasEmergencyGoal: emergency.length > 0,
      monthlyDebtPayments: activeDebts.reduce((s, d) => {
        const min = d.minimumPayment ? Number(d.minimumPayment) : d.termMonths ? frenchPayment(Number(d.originalAmount), Number(d.annualRate ?? 0), d.termMonths) : 0;
        return s + toBase(min, d.currency);
      }, 0),
      highRateDebts: activeDebts.filter((d) => d.kind === 'CREDIT_CARD_BALANCE' || Number(d.annualRate ?? 0) >= 0.3).length,
      budget: progress && budget!.items.length > 0 ? { items: progress.items.length, over: progress.items.filter((i) => i.status === 'over').length } : null,
      monthsRecorded: months.filter((m) => txs.some((t) => t.date.startsWith(m))).length,
      accounts: this.accounts.active().length,
      transactions: txs.length,
      hasIncomeSource: txs.some((t) => t.type === 'INCOME') || this.recurring.rules().some((r) => r.type === 'INCOME' && r.active),
      liquidCash: this.accounts
        .active()
        .filter((a) => LIQUID.has(a.type))
        .reduce((s, a) => s + Math.max(toBase(Number(balances.get(a.id)?.amount ?? 0), a.currency), 0), 0),
      investmentClasses: classes.size,
      investedValue:
        holdings.reduce((s, h) => s + toBase(h.marketValue ?? h.costBasis, assetsById.get(h.assetId)?.currency ?? base), 0) +
        activeDeposits.reduce((s, d) => s + toBase(Number(d.principal), d.currency), 0),
      onboardingDone: !!this.session.me()?.user.onboardingCompletedAt,
    };
  });

  readonly score = computed<HealthScore>(() => healthScore(this.snapshot()));
  readonly path = computed(() => levels(this.snapshot()));
  readonly tips = computed(() => tips(this.snapshot()).filter((t) => !this.dismissed().includes(t.key)));

  async ensureLoaded() {
    await Promise.all([
      this.accounts.load(),
      this.transactions.ensureLoaded(),
      this.categories.ensureLoaded(),
      this.budgets.ensureLoaded(),
      this.debts.ensureLoaded(),
      this.recurring.ensureLoaded(),
      this.netWorth.ensureLoaded(),
    ]);
    if (this.loaded) return;
    const [tipsRes, scores, milestones] = await Promise.all([
      this.offlineCache.cached('/api/me/tips', () => firstValueFrom(this.http.get<{ dismissed: string[] }>('/api/me/tips'))),
      this.offlineCache.cached(this.url('health-scores'), () => firstValueFrom(this.http.get<{ items: { id: string; date: string; payload: string; keyVersion: number }[] }>(this.url('health-scores')))),
      this.offlineCache.cached(this.url('milestones'), () => firstValueFrom(this.http.get<{ items: { id: string; completedAt: string; payload: string; keyVersion: number }[] }>(this.url('milestones')))),
    ]);
    this.dismissed.set(tipsRes.dismissed);
    this.history.set(await Promise.all(scores.items.map(async (s) => ({ id: s.id, date: s.date, ...(await this.hh.open<{ score: number }>('financial_health_scores', s.id, s.payload, s.keyVersion)) }))));
    this.achieved.set(
      await Promise.all(milestones.items.map(async (m) => ({ key: (await this.hh.open<{ milestoneKey: string }>('milestone_completions', m.id, m.payload, m.keyVersion)).milestoneKey, at: m.completedAt }))),
    );
    this.loaded = true;
  }

  /** Guarda el puntaje del día (cifrado) y los niveles nuevos completados. Devuelve los niveles recién logrados. */
  async record(): Promise<string[]> {
    if (!this.hh.canWrite()) return [];
    const today = todayIso();
    const { score, components } = this.score();
    const existing = this.history().find((h) => h.date === today);
    if (!existing || existing.score !== score) {
      const id = existing?.id ?? uuidv7();
      try {
        await firstValueFrom(this.http.put(this.url(`health-scores/${today}/${id}`), await this.hh.seal('financial_health_scores', id, { score, components })));
        this.history.update((l) => [...l.filter((h) => h.date !== today), { id, date: today, score }]);
      } catch (e) {
        if (!(e instanceof HttpErrorResponse && e.status === 409)) throw e; // otro dispositivo ya lo guardó hoy
      }
    }
    const { levels: all } = this.path();
    const fresh: string[] = [];
    for (const level of all) {
      if (!level.done) break;
      const key = `level.${level.key}`;
      if (this.achieved().some((a) => a.key === key)) continue;
      const id = uuidv7();
      await firstValueFrom(this.http.post(this.url('milestones'), { id, ...(await this.hh.seal('milestone_completions', id, { milestoneKey: key })) }));
      this.achieved.update((l) => [...l, { key, at: new Date().toISOString() }]);
      fresh.push(level.key);
    }
    return fresh;
  }

  async dismiss(key: string) {
    await firstValueFrom(this.http.post(`/api/me/tips/${key}/dismiss`, {}));
    this.dismissed.update((l) => [...l, key]);
  }

  async setOnboarding(step: number, completed: boolean) {
    await firstValueFrom(this.http.put('/api/me/onboarding', { step, completed }));
    await this.session.load();
  }
}
