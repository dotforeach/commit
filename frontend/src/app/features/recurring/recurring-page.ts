import { DatePipe, NgTemplateOutlet } from '@angular/common';
import { Component, Injector, computed, inject, signal, type OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import type { Observable } from 'rxjs';
import { CurrenciesService } from '../../core/currencies/currencies.service';
import { HouseholdContextService } from '../../core/households/household-context.service';
import { formatMoney } from '../../core/money/decimal';
import { confirmDialog } from '../../shared/confirm-dialog/confirm-dialog';
import { AccountsService } from '../accounts/accounts.service';
import { CategoriesService } from '../categories/categories.service';
import { TransactionsService } from '../transactions/transactions.service';
import { PendingList } from './pending-list/pending-list';
import type { RecurringRule } from './recurring.model';
import { RecurringService } from './recurring.service';
import { RuleDialog } from './rule-dialog/rule-dialog';

@Component({
  selector: 'app-recurring-page',
  imports: [DatePipe, NgTemplateOutlet, RouterLink, TranslocoDirective, MatButtonModule, MatCardModule, MatIconModule, MatMenuModule, MatProgressBarModule, PendingList],
  templateUrl: './recurring-page.html',
  styleUrl: './recurring-page.scss',
})
export class RecurringPage implements OnInit {
  readonly recurring = inject(RecurringService);
  readonly accounts = inject(AccountsService);
  readonly household = inject(HouseholdContextService);
  private readonly categories = inject(CategoriesService);
  private readonly transactions = inject(TransactionsService);
  private readonly currencies = inject(CurrenciesService);
  private readonly dialog = inject(MatDialog);
  private readonly snack = inject(MatSnackBar);
  private readonly transloco = inject(TranslocoService);
  private readonly injector = inject(Injector);

  readonly loading = signal(true);
  readonly loadError = signal(false);
  readonly active = computed(() => this.recurring.rules().filter((r) => r.active));
  readonly paused = computed(() => this.recurring.rules().filter((r) => !r.active));

  async ngOnInit() {
    try {
      await Promise.all([this.accounts.load(), this.categories.ensureLoaded(), this.transactions.ensureLoaded()]);
      await this.recurring.load();
      const created = await this.recurring.processDue();
      if (created > 0) this.snack.open(this.transloco.translate('recurring.autoPosted', { n: created }), undefined, { duration: 4000 });
    } catch {
      this.loadError.set(true);
    } finally {
      this.loading.set(false);
    }
  }

  money(r: RecurringRule) {
    const currency = this.accounts.accounts().find((a) => a.id === r.accountId)?.currency ?? 'ARS';
    return `${r.type === 'INCOME' ? '+' : '-'}${formatMoney(r.amount, this.currencies.get(currency))}`;
  }

  accountName(id: string) {
    return this.accounts.accounts().find((a) => a.id === id)?.name ?? '—';
  }

  schedule(r: RecurringRule) {
    const t = (key: string, params?: object) => this.transloco.translate(`recurring.schedule.${key}`, params);
    const base = r.interval === 1 ? t(`every.${r.frequency}`) : t(`everyN.${r.frequency}`, { n: r.interval });
    return r.frequency === 'MONTHLY' ? `${base}, ${t('onDay', { day: r.dayOfMonth })}` : base;
  }

  openNew() {
    this.afterSave(this.dialog.open(RuleDialog, { injector: this.injector, autoFocus: 'first-tabbable' }).afterClosed());
  }

  edit(r: RecurringRule) {
    this.afterSave(this.dialog.open(RuleDialog, { data: r, injector: this.injector, autoFocus: 'first-tabbable' }).afterClosed());
  }

  /** Si la regla es automática y ya tiene fechas vencidas, se registran en el momento. */
  private afterSave(closed: Observable<unknown>) {
    closed.subscribe(async (saved) => {
      if (!saved) return;
      const created = await this.recurring.processDue();
      if (created > 0) this.snack.open(this.transloco.translate('recurring.autoPosted', { n: created }), undefined, { duration: 4000 });
    });
  }

  async toggle(r: RecurringRule) {
    await this.run(() => this.recurring.setActive(r, !r.active), r.active ? 'recurring.paused' : 'recurring.resumed');
  }

  async remove(r: RecurringRule) {
    const t = (key: string, params?: object) => this.transloco.translate(`recurring.deleteDialog.${key}`, params);
    const ok = await confirmDialog(this.dialog, {
      title: t('title'),
      message: t('message', { description: r.description }),
      confirm: t('confirm'),
      cancel: t('cancel'),
      destructive: true,
    });
    if (ok) await this.run(() => this.recurring.remove(r), 'recurring.deleted');
  }

  private async run(fn: () => Promise<unknown>, key: string) {
    try {
      await fn();
      this.snack.open(this.transloco.translate(key), undefined, { duration: 3000 });
    } catch {
      this.snack.open(this.transloco.translate('recurring.errors.generic'), undefined, { duration: 5000 });
      await this.recurring.load();
    }
  }
}
