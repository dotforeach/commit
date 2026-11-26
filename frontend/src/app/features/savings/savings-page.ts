import { DatePipe } from '@angular/common';
import { Component, Injector, computed, inject, signal, type OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { firstValueFrom } from 'rxjs';
import { CurrenciesService } from '../../core/currencies/currencies.service';
import { todayIso } from '../../core/dates/dates';
import { HouseholdContextService } from '../../core/households/household-context.service';
import { addDecimals, formatMoney, ZERO } from '../../core/money/decimal';
import { confirmDialog } from '../../shared/confirm-dialog/confirm-dialog';
import { AccountsService } from '../accounts/accounts.service';
import { CategoriesService } from '../categories/categories.service';
import { TransactionsService } from '../transactions/transactions.service';
import { AmountDialog, type AmountDialogData, type AmountDialogResult } from './dialogs/amount-dialog';
import { DepositDialog } from './dialogs/deposit-dialog';
import { GoalDialog } from './dialogs/goal-dialog';
import { TradeDialog } from './dialogs/trade-dialog';
import { toMoneyString } from './savings-format';
import { computeHoldings, depositProjection, goalProgress } from './savings-math';
import type { Deposit, Goal, InvestmentTrade } from './savings.models';
import { SavingsService } from './savings.service';

@Component({
  selector: 'app-savings-page',
  imports: [DatePipe, TranslocoDirective, MatButtonModule, MatCardModule, MatIconModule, MatMenuModule, MatProgressBarModule, MatTabsModule],
  templateUrl: './savings-page.html',
  styleUrl: './savings-page.scss',
})
export class SavingsPage implements OnInit {
  readonly savings = inject(SavingsService);
  readonly household = inject(HouseholdContextService);
  private readonly accounts = inject(AccountsService);
  private readonly categories = inject(CategoriesService);
  private readonly transactions = inject(TransactionsService);
  private readonly currencies = inject(CurrenciesService);
  private readonly dialog = inject(MatDialog);
  private readonly snack = inject(MatSnackBar);
  private readonly transloco = inject(TranslocoService);
  private readonly injector = inject(Injector);

  readonly loading = signal(true);
  readonly loadError = signal(false);
  readonly today = todayIso();

  /** Avance de cada meta: saldo real de su cuenta vinculada, o la suma de aportes. */
  readonly goals = computed(() =>
    this.savings
      .goals()
      .filter((g) => g.status !== 'CANCELLED')
      .map((g) => {
        const balance = g.accountId ? this.transactions.balances().get(g.accountId)?.amount : undefined;
        const current = balance ?? addDecimals(ZERO, ...g.contributions.map((c) => c.amount));
        return { goal: g, current, progress: goalProgress(Number(g.targetAmount), Number(current), g.targetDate, this.today) };
      }),
  );

  readonly deposits = computed(() =>
    this.savings
      .deposits()
      .map((d) => ({ deposit: d, p: depositProjection(Number(d.principal), Number(d.annualRate), d.startDate, d.maturityDate, this.today) }))
      .sort((a, b) => Number(b.deposit.status === 'ACTIVE') - Number(a.deposit.status === 'ACTIVE') || a.deposit.maturityDate.localeCompare(b.deposit.maturityDate)),
  );

  readonly holdings = computed(() => {
    const trades = this.savings.trades().map((t) => ({ assetId: t.assetId, type: t.type, date: t.date, quantity: Number(t.quantity), unitPrice: Number(t.unitPrice), fees: Number(t.fees) }));
    return computeHoldings(trades, (id) => {
      const p = this.savings.lastPrice(id);
      return p ? Number(p.price) : null;
    }).map((h) => ({ ...h, asset: this.savings.assets().find((a) => a.id === h.assetId)! }));
  });

  readonly recentTrades = computed(() => [...this.savings.trades()].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 15));

  async ngOnInit() {
    try {
      await Promise.all([this.accounts.load(), this.categories.ensureLoaded(), this.transactions.ensureLoaded(), this.savings.ensureLoaded()]);
    } catch {
      this.loadError.set(true);
    } finally {
      this.loading.set(false);
    }
  }

  money(amount: string | number, currency: string) {
    return formatMoney(typeof amount === 'number' ? toMoneyString(amount) : amount, this.currencies.get(currency));
  }

  pct(ratio: number) {
    return Math.min(100, Math.round(ratio * 100));
  }

  accountName(id: string | null) {
    return this.accounts.accounts().find((a) => a.id === id)?.name ?? '';
  }

  assetSymbol(id: string) {
    return this.savings.assets().find((a) => a.id === id)?.symbol ?? '?';
  }

  qty(n: number) {
    return n.toLocaleString('es-AR', { maximumFractionDigits: 10 });
  }

  private t(key: string, params?: object) {
    return this.transloco.translate(`savings.${key}`, params);
  }

  private open(component: unknown, data?: unknown) {
    return this.dialog.open(component as never, { data, injector: this.injector, autoFocus: 'first-tabbable', maxHeight: '90vh' });
  }

  private async ask(data: Omit<AmountDialogData, 'confirm' | 'cancel' | 'dateLabel'> & { confirm?: string }) {
    const full: AmountDialogData = { confirm: this.t('save'), cancel: this.t('cancel'), dateLabel: this.t('date'), ...data };
    return (await firstValueFrom(this.open(AmountDialog, full).afterClosed())) as AmountDialogResult | undefined;
  }

  newGoal() {
    this.open(GoalDialog);
  }

  editGoal(g: Goal) {
    this.open(GoalDialog, g);
  }

  async contribute(g: Goal) {
    const r = await this.ask({ title: this.t('goals.contributeTitle', { name: g.name }), amountLabel: this.t('goals.contributeAmount'), allowNegative: true, withNote: this.t('goals.note') });
    if (r) await this.run(() => this.savings.contribute(g, r.amount, r.date, r.note), 'goals.contributed');
  }

  async removeGoal(g: Goal) {
    if (await this.confirm('goals.deleteTitle', 'goals.deleteMessage', g.name)) await this.run(() => this.savings.removeGoal(g), 'goals.deleted');
  }

  newDeposit() {
    this.open(DepositDialog);
  }

  async collect(d: Deposit) {
    const p = depositProjection(Number(d.principal), Number(d.annualRate), d.startDate, d.maturityDate, this.today);
    const r = await this.ask({
      title: this.t('deposits.collectTitle', { institution: d.institution }),
      message: this.t('deposits.collectMessage', { principal: this.money(d.principal, d.currency) }),
      amountLabel: this.t('deposits.interestReceived'),
      amount: toMoneyString(p.interest),
      confirm: this.t('deposits.collect'),
    });
    if (!r) return;
    const income = this.categories.categories().find((c) => c.systemKey === 'income.other');
    await this.run(() => this.savings.collect(d, r.date, r.amount, income?.id ?? null, this.t('deposits.txCollect', { institution: d.institution })), 'deposits.collected');
  }

  async removeDeposit(d: Deposit) {
    if (await this.confirm('deposits.deleteTitle', 'deposits.deleteMessage', d.institution)) await this.run(() => this.savings.removeDeposit(d), 'deposits.deleted');
  }

  newTrade() {
    this.open(TradeDialog);
  }

  async updatePrice(assetId: string, currency: string) {
    const r = await this.ask({ title: this.t('investments.priceTitle', { symbol: this.assetSymbol(assetId) }), amountLabel: this.t('investments.price', { currency }) });
    if (r) await this.run(() => this.savings.addPrice(assetId, r.date, r.amount), 'investments.priceSaved');
  }

  async removeTrade(t: InvestmentTrade) {
    if (await this.confirm('investments.deleteTitle', 'investments.deleteMessage', this.assetSymbol(t.assetId))) await this.run(() => this.savings.removeTrade(t), 'investments.deleted');
  }

  private confirm(title: string, message: string, name: string) {
    return confirmDialog(this.dialog, { title: this.t(title), message: this.t(message, { name }), confirm: this.t('delete'), cancel: this.t('cancel'), destructive: true });
  }

  private async run(fn: () => Promise<unknown>, key: string) {
    try {
      await fn();
      this.snack.open(this.t(key), undefined, { duration: 3000 });
    } catch {
      this.snack.open(this.t('errors.generic'), undefined, { duration: 5000 });
    }
  }
}
