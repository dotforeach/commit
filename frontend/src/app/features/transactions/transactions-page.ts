import { DatePipe, NgTemplateOutlet } from '@angular/common';
import { Component, Injector, computed, inject, signal, type OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { CurrenciesService } from '../../core/currencies/currencies.service';
import { fromIsoDate, monthOf, todayIso } from '../../core/dates/dates';
import { HouseholdContextService } from '../../core/households/household-context.service';
import { formatMoney } from '../../core/money/decimal';
import { confirmDialog } from '../../shared/confirm-dialog/confirm-dialog';
import { AccountsService } from '../accounts/accounts.service';
import { CategoriesService } from '../categories/categories.service';
import { totalsByCurrency } from './ledger';
import { TransactionDialog } from './transaction-dialog/transaction-dialog';
import type { LedgerEntry, Transaction } from './transaction.model';
import { TransactionsService } from './transactions.service';

function shiftMonth(month: string, delta: number): string {
  const [y, m] = month.split('-').map(Number);
  const d = new Date(y, m - 1 + delta, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

@Component({
  selector: 'app-transactions-page',
  imports: [
    DatePipe,
    NgTemplateOutlet,
    FormsModule,
    RouterLink,
    TranslocoDirective,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatMenuModule,
    MatProgressBarModule,
    MatSelectModule,
  ],
  templateUrl: './transactions-page.html',
  styleUrl: './transactions-page.scss',
})
export class TransactionsPage implements OnInit {
  readonly transactions = inject(TransactionsService);
  readonly accounts = inject(AccountsService);
  readonly categories = inject(CategoriesService);
  readonly household = inject(HouseholdContextService);
  private readonly currencies = inject(CurrenciesService);
  private readonly dialog = inject(MatDialog);
  private readonly snack = inject(MatSnackBar);
  private readonly transloco = inject(TranslocoService);
  /** El injector de la ruta tiene los providers del datepicker (DATE_PROVIDERS); MatDialog usaría el raíz. */
  private readonly injector = inject(Injector);

  readonly month = signal(monthOf(todayIso()));
  readonly accountFilter = signal<string>('');
  readonly loadError = signal(false);
  readonly monthDate = computed(() => fromIsoDate(`${this.month()}-01`));

  private readonly accountById = computed(() => new Map(this.accounts.accounts().map((a) => [a.id, a])));

  /** Movimientos del mes (y de la cuenta elegida), agrupados por día. */
  readonly days = computed(() => {
    const account = this.accountFilter();
    const entries = this.transactions
      .ledger()
      .filter((e) => monthOf(e.date) === this.month())
      .filter((e) => !account || (e.kind === 'single' ? e.tx.accountId === account : e.out.accountId === account || e.in.accountId === account));
    const days: { date: string; entries: LedgerEntry[] }[] = [];
    for (const e of entries) {
      const last = days.at(-1);
      if (last?.date === e.date) last.entries.push(e);
      else days.push({ date: e.date, entries: [e] });
    }
    return days;
  });

  readonly totals = computed(() => {
    const account = this.accountFilter();
    const inMonth = this.transactions
      .transactions()
      .filter((t) => monthOf(t.date) === this.month() && (!account || t.accountId === account));
    return totalsByCurrency(inMonth, (id) => this.accountById().get(id)?.currency ?? '?');
  });

  async ngOnInit() {
    try {
      await Promise.all([this.accounts.load(), this.categories.ensureLoaded(), this.transactions.ensureLoaded()]);
    } catch {
      this.loadError.set(true);
    }
  }

  prevMonth() {
    this.month.update((m) => shiftMonth(m, -1));
  }

  nextMonth() {
    this.month.update((m) => shiftMonth(m, 1));
  }

  accountName(id: string) {
    return this.accountById().get(id)?.name ?? '—';
  }

  category(t: Transaction) {
    return t.categoryId ? this.categories.byId().get(t.categoryId) : undefined;
  }

  money(amount: string, accountId: string, sign: '+' | '-' | '' = '') {
    const currency = this.accountById().get(accountId)?.currency ?? 'ARS';
    return `${sign}${formatMoney(amount, this.currencies.get(currency))}`;
  }

  moneyIn(amount: string, currency: string) {
    return formatMoney(amount, this.currencies.get(currency));
  }

  openNew() {
    this.dialog.open(TransactionDialog, { autoFocus: 'first-tabbable', injector: this.injector });
  }

  edit(entry: LedgerEntry) {
    this.dialog.open(TransactionDialog, { data: entry, autoFocus: 'first-tabbable', injector: this.injector });
  }

  async remove(entry: LedgerEntry) {
    const t = (key: string, params?: object) => this.transloco.translate(`transactions.deleteDialog.${key}`, params);
    const tx = entry.kind === 'single' ? entry.tx : entry.out;
    const ok = await confirmDialog(this.dialog, {
      title: t('title'),
      message: t(entry.kind === 'transfer' ? 'messageTransfer' : 'message', { description: tx.description }),
      confirm: t('confirm'),
      cancel: t('cancel'),
      destructive: true,
    });
    if (!ok) return;
    try {
      await this.transactions.remove(tx);
      this.snack.open(this.transloco.translate('transactions.deleted'), undefined, { duration: 3000 });
    } catch {
      this.snack.open(this.transloco.translate('transactions.errors.generic'), undefined, { duration: 5000 });
      await this.transactions.load();
    }
  }
}
