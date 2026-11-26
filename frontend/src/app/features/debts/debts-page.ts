import { DatePipe } from '@angular/common';
import { Component, Injector, computed, inject, signal, type OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { CurrenciesService } from '../../core/currencies/currencies.service';
import { todayIso } from '../../core/dates/dates';
import { HouseholdContextService } from '../../core/households/household-context.service';
import { formatMoney, parseDecimalInput, ratioOf, subDecimals } from '../../core/money/decimal';
import { confirmDialog } from '../../shared/confirm-dialog/confirm-dialog';
import { AccountsService } from '../accounts/accounts.service';
import { statementMonthOf, shiftMonth } from '../cards/card-cycle';
import { estimateStatement, upcomingInstallments } from '../cards/card-statement';
import { InstallmentsService } from '../cards/installments.service';
import { CategoriesService } from '../categories/categories.service';
import { TransactionDialog, type TransactionPrefill } from '../transactions/transaction-dialog/transaction-dialog';
import { TransactionsService } from '../transactions/transactions.service';
import { frenchPayment, simulatePayoff, toMoney } from './debt-math';
import { DebtDialog } from './debt-dialog/debt-dialog';
import type { Debt } from './debt.model';
import { DebtsService } from './debts.service';
import { RatesService } from '../rates/rates.service';
import { PaymentDialog } from './payment-dialog/payment-dialog';
import { ScheduleDialog } from './schedule-dialog/schedule-dialog';

@Component({
  selector: 'app-debts-page',
  imports: [
    RouterLink,
    DatePipe,
    FormsModule,
    TranslocoDirective,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatProgressBarModule,
  ],
  templateUrl: './debts-page.html',
  styleUrl: './debts-page.scss',
})
export class DebtsPage implements OnInit {
  readonly debts = inject(DebtsService);
  readonly household = inject(HouseholdContextService);
  private readonly accounts = inject(AccountsService);
  private readonly categories = inject(CategoriesService);
  private readonly transactions = inject(TransactionsService);
  private readonly installments = inject(InstallmentsService);
  private readonly currencies = inject(CurrenciesService);
  private readonly dialog = inject(MatDialog);
  private readonly snack = inject(MatSnackBar);
  private readonly transloco = inject(TranslocoService);
  private readonly injector = inject(Injector);
  private readonly rates = inject(RatesService);

  readonly loading = signal(true);
  readonly loadError = signal(false);
  readonly extra = signal('0');

  readonly active = computed(() => this.debts.debts().filter((d) => d.status === 'ACTIVE'));
  readonly closed = computed(() => this.debts.debts().filter((d) => d.status !== 'ACTIVE'));

  /** Estrategia: solo deudas activas en la moneda principal del hogar (no se mezclan monedas). */
  readonly strategy = computed(() => {
    const base = this.household.baseCurrency();
    const converter = this.rates.converter();
    // Las deudas en otra moneda se convierten a la principal (si hay cotización).
    const convertible = this.active().filter((d) => converter.rate(d.currency, base) !== null);
    const debts = convertible
      .map((d) => {
        const r = converter.rate(d.currency, base)!;
        const min = Number(d.minimumPayment ?? (d.termMonths ? frenchPayment(Number(d.originalAmount), Number(d.annualRate ?? 0), d.termMonths) : 0));
        return { id: d.id, balance: Number(this.debts.balance(d)) * r, annualRate: Number(d.annualRate ?? 0), minimumPayment: min * r };
      })
      .filter((d) => d.balance > 0);
    if (debts.length < 2) return null;
    const extra = Number(parseDecimalInput(this.extra()) ?? '0');
    const snowball = simulatePayoff(debts, extra, 'snowball');
    const avalanche = simulatePayoff(debts, extra, 'avalanche');
    const name = (id: string) => this.debts.debts().find((d) => d.id === id)?.name ?? '';
    return {
      currency: base,
      skipped: this.active().length - convertible.length,
      snowball: { ...snowball, order: snowball.payoff.map((p) => name(p.id)) },
      avalanche: { ...avalanche, order: avalanche.payoff.map((p) => name(p.id)) },
      saves: toMoney(Math.max(snowball.totalInterest - avalanche.totalInterest, 0)),
    };
  });

  /** Resumen estimado de cada tarjeta: el último cerrado (a pagar) y cuotas comprometidas. */
  readonly cards = computed(() => {
    const today = todayIso();
    return this.accounts
      .active()
      .filter((a) => a.type === 'CREDIT_CARD' && a.creditCard)
      .map((a) => {
        const card = { id: a.id, closingDay: a.creditCard!.closingDay, dueDay: a.creditCard!.dueDay };
        const open = statementMonthOf(today, card.closingDay);
        const closedMonth = shiftMonth(open, -1);
        const txs = this.transactions.transactions();
        const plans = this.installments.plans();
        return {
          account: a,
          closed: estimateStatement(card, closedMonth, txs, plans),
          current: estimateStatement(card, open, txs, plans),
          upcoming: upcomingInstallments(a.id, open, plans),
        };
      });
  });

  async ngOnInit() {
    try {
      await Promise.all([
        this.accounts.load(),
        this.categories.ensureLoaded(),
        this.transactions.ensureLoaded(),
        this.debts.ensureLoaded(),
        this.installments.ensureLoaded(),
        this.rates.ensureLoaded(),
      ]);
    } catch {
      this.loadError.set(true);
    } finally {
      this.loading.set(false);
    }
  }

  money(amount: string, currency: string) {
    return formatMoney(amount, this.currencies.get(currency));
  }

  moneyN(n: number, currency: string) {
    return this.money(toMoney(n), currency);
  }

  balance(d: Debt) {
    return this.debts.balance(d);
  }

  paidRatio(d: Debt) {
    return Math.min(100, Math.max(0, Math.round(ratioOf(subDecimals(d.originalAmount, this.balance(d)), d.originalAmount) * 100)));
  }

  ratePct(d: Debt) {
    return d.annualRate ? `${Math.round(Number(d.annualRate) * 10000) / 100}%` : null;
  }

  private open<T>(component: T, data?: unknown) {
    return this.dialog.open(component as never, { data, injector: this.injector, autoFocus: 'first-tabbable', maxHeight: '90vh' });
  }

  newDebt() {
    this.open(DebtDialog);
  }

  edit(d: Debt) {
    this.open(DebtDialog, d);
  }

  pay(d: Debt) {
    this.open(PaymentDialog, d)
      .afterClosed()
      .subscribe(async (paid) => {
        if (!paid) return;
        const updated = this.debts.debts().find((x) => x.id === d.id);
        // Saldada: se marca como pagada.
        if (updated && Number(this.debts.balance(updated)) <= 0.005 && updated.status === 'ACTIVE') {
          const { id: _i, revision: _r, payments: _p, ...draft } = updated;
          await this.debts.update(updated, { ...draft, status: 'PAID_OFF' });
          this.snack.open(this.transloco.translate('debts.paidOff', { name: d.name }), undefined, { duration: 5000 });
        }
      });
  }

  schedule(d: Debt) {
    this.dialog.open(ScheduleDialog, { data: d, maxHeight: '90vh' });
  }

  async undoLastPayment(d: Debt) {
    const last = d.payments.at(-1);
    if (!last) return;
    await this.run(() => this.debts.removePayment(d, last.id), 'debts.paymentRemoved');
  }

  async remove(d: Debt) {
    const t = (k: string, p?: object) => this.transloco.translate(`debts.deleteDialog.${k}`, p);
    if (!(await confirmDialog(this.dialog, { title: t('title'), message: t('message', { name: d.name }), confirm: t('confirm'), cancel: t('cancel'), destructive: true }))) return;
    await this.run(() => this.debts.remove(d), 'debts.deleted');
  }

  payStatement(card: ReturnType<DebtsPage['cards']>[number]) {
    const data: TransactionPrefill = {
      prefill: {
        mode: 'TRANSFER',
        toAccountId: card.account.id,
        amount: card.closed.due,
        description: this.transloco.translate('debts.cards.payDescription', { name: card.account.name }),
      },
    };
    this.open(TransactionDialog, data);
  }

  private async run(fn: () => Promise<unknown>, key: string) {
    try {
      await fn();
      this.snack.open(this.transloco.translate(key), undefined, { duration: 3000 });
    } catch {
      this.snack.open(this.transloco.translate('debts.errors.generic'), undefined, { duration: 5000 });
      await this.debts.load();
    }
  }
}
