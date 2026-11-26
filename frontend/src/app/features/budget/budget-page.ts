import { DatePipe } from '@angular/common';
import { Component, Injector, computed, inject, signal, type OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { CurrenciesService } from '../../core/currencies/currencies.service';
import { fromIsoDate, monthOf, todayIso } from '../../core/dates/dates';
import { HouseholdContextService } from '../../core/households/household-context.service';
import { formatMoney, isNegative } from '../../core/money/decimal';
import { confirmDialog } from '../../shared/confirm-dialog/confirm-dialog';
import { AccountsService } from '../accounts/accounts.service';
import { CategoriesService } from '../categories/categories.service';
import { RecurringService } from '../recurring/recurring.service';
import { TransactionsService } from '../transactions/transactions.service';
import { BudgetDialog, type BudgetDialogData } from './budget-dialog/budget-dialog';
import { computeBudget } from './budget-math';
import { RatesService } from '../rates/rates.service';
import { BudgetsService } from './budgets.service';

@Component({
  selector: 'app-budget-page',
  imports: [DatePipe, RouterLink, TranslocoDirective, MatButtonModule, MatCardModule, MatIconModule, MatProgressBarModule],
  templateUrl: './budget-page.html',
  styleUrl: './budget-page.scss',
})
export class BudgetPage implements OnInit {
  readonly budgets = inject(BudgetsService);
  readonly household = inject(HouseholdContextService);
  private readonly accounts = inject(AccountsService);
  private readonly categories = inject(CategoriesService);
  private readonly transactions = inject(TransactionsService);
  private readonly recurring = inject(RecurringService);
  private readonly currencies = inject(CurrenciesService);
  private readonly rates = inject(RatesService);
  private readonly dialog = inject(MatDialog);
  private readonly snack = inject(MatSnackBar);
  private readonly transloco = inject(TranslocoService);
  private readonly injector = inject(Injector);

  readonly loading = signal(true);
  readonly loadError = signal(false);
  readonly month = signal(monthOf(todayIso()));
  readonly year = computed(() => Number(this.month().slice(0, 4)));
  readonly monthNum = computed(() => Number(this.month().slice(5, 7)));
  readonly monthDate = computed(() => fromIsoDate(`${this.month()}-01`));

  readonly budget = computed(() => this.budgets.budgets().find((b) => b.year === this.year() && b.month === this.monthNum()));
  readonly previous = computed(() => (this.budget() ? undefined : this.budgets.latestBefore(this.year(), this.monthNum())));

  readonly progress = computed(() => {
    const b = this.budget();
    if (!b) return null;
    const accounts = this.accounts.accounts();
    return computeBudget(b, {
      transactions: this.transactions.transactions(),
      currencyOfAccount: (id) => accounts.find((a) => a.id === id)?.currency,
      categoriesById: this.categories.byId(),
      budgets: this.budgets.budgets(),
      convert: (amount, from, to) => this.rates.converter().convert(amount, from, to),
    });
  });

  async ngOnInit() {
    try {
      await Promise.all([
        this.accounts.load(),
        this.categories.ensureLoaded(),
        this.transactions.ensureLoaded(),
        this.budgets.ensureLoaded(),
        this.recurring.ensureLoaded(),
        this.rates.ensureLoaded(),
      ]);
      await this.recurring.processDue();
    } catch {
      this.loadError.set(true);
    } finally {
      this.loading.set(false);
    }
  }

  shift(delta: number) {
    const d = new Date(this.year(), this.monthNum() - 1 + delta, 1);
    this.month.set(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  }

  money(amount: string) {
    return formatMoney(amount, this.currencies.get(this.budget()?.currency ?? this.household.baseCurrency()));
  }

  negative = isNegative;

  categoryName(id: string | null) {
    return id ? (this.categories.byId().get(id)?.name ?? '—') : this.transloco.translate('budget.uncategorized');
  }

  categoryIcon(id: string | null) {
    return (id && this.categories.byId().get(id)?.icon) || 'label';
  }

  barValue(ratio: number) {
    return Math.min(100, Math.round(ratio * 100));
  }

  percent(ratio: number) {
    return Number.isFinite(ratio) ? `${Math.round(ratio * 100)}%` : '—';
  }

  open() {
    const data: BudgetDialogData = {
      year: this.year(),
      month: this.monthNum(),
      budget: this.budget() ?? null,
      defaultCurrency: this.household.baseCurrency(),
    };
    this.dialog.open(BudgetDialog, { data, injector: this.injector, autoFocus: 'first-tabbable', maxHeight: '90vh' });
  }

  async copyPrevious() {
    const from = this.previous();
    if (!from) return;
    try {
      await this.budgets.copy(from, this.year(), this.monthNum());
      this.snack.open(this.transloco.translate('budget.copied'), undefined, { duration: 3000 });
    } catch {
      this.snack.open(this.transloco.translate('budget.errors.generic'), undefined, { duration: 5000 });
    }
  }

  async remove() {
    const b = this.budget();
    if (!b) return;
    const t = (k: string) => this.transloco.translate(`budget.deleteDialog.${k}`);
    if (!(await confirmDialog(this.dialog, { title: t('title'), message: t('message'), confirm: t('confirm'), cancel: t('cancel'), destructive: true }))) return;
    try {
      await this.budgets.remove(b);
    } catch {
      this.snack.open(this.transloco.translate('budget.errors.generic'), undefined, { duration: 5000 });
    }
  }
}
