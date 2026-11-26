import { NgTemplateOutlet } from '@angular/common';
import { Component, inject, signal, type OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { CurrenciesService } from '../../core/currencies/currencies.service';
import { HouseholdContextService } from '../../core/households/household-context.service';
import { formatMoney } from '../../core/money/decimal';
import { confirmDialog } from '../../shared/confirm-dialog/confirm-dialog';
import { AccountDialog } from './account-dialog/account-dialog';
import { accountIcon, type Account } from './account.model';
import { AccountsService } from './accounts.service';

@Component({
  selector: 'app-accounts-page',
  imports: [NgTemplateOutlet, TranslocoDirective, MatButtonModule, MatCardModule, MatIconModule, MatMenuModule, MatProgressBarModule],
  templateUrl: './accounts-page.html',
  styleUrl: './accounts-page.scss',
})
export class AccountsPage implements OnInit {
  readonly accounts = inject(AccountsService);
  readonly household = inject(HouseholdContextService);
  private readonly currencies = inject(CurrenciesService);
  private readonly dialog = inject(MatDialog);
  private readonly snack = inject(MatSnackBar);
  private readonly transloco = inject(TranslocoService);

  readonly showArchived = signal(false);
  readonly loadError = signal(false);
  readonly icon = accountIcon;

  async ngOnInit() {
    try {
      await this.accounts.load();
    } catch {
      this.loadError.set(true);
    }
  }

  money(amount: string, currency: string) {
    return formatMoney(amount, this.currencies.get(currency));
  }

  openNew() {
    this.dialog.open(AccountDialog, { autoFocus: 'first-tabbable' });
  }

  edit(account: Account) {
    this.dialog.open(AccountDialog, { data: account, autoFocus: 'first-tabbable' });
  }

  async archive(account: Account, archived: boolean) {
    await this.run(() => this.accounts.setArchived(account, archived), archived ? 'accounts.archived' : 'accounts.unarchived');
  }

  async remove(account: Account) {
    const t = (key: string, params?: object) => this.transloco.translate(`accounts.deleteDialog.${key}`, params);
    const ok = await confirmDialog(this.dialog, {
      title: t('title'),
      message: t('message', { name: account.name }),
      confirm: t('confirm'),
      cancel: t('cancel'),
      destructive: true,
    });
    if (!ok) return;
    await this.run(() => this.accounts.remove(account), 'accounts.deleted');
  }

  private async run(fn: () => Promise<unknown>, successKey: string) {
    try {
      await fn();
      this.snack.open(this.transloco.translate(successKey), undefined, { duration: 3000 });
    } catch {
      this.snack.open(this.transloco.translate('accounts.errors.generic'), undefined, { duration: 5000 });
      await this.accounts.load();
    }
  }
}
