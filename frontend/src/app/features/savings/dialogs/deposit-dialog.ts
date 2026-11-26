import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators, type AbstractControl, type ValidationErrors } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { CurrenciesService } from '../../../core/currencies/currencies.service';
import { toIsoDate, todayIso } from '../../../core/dates/dates';
import { compareDecimals, formatMoney, parseDecimalInput } from '../../../core/money/decimal';
import { AccountsService } from '../../accounts/accounts.service';
import { percentToFraction } from '../../debts/debt-dialog/debt-dialog';
import { depositProjection, toMoneyString } from '../savings-format';
import { SavingsService } from '../savings.service';

const positive = (c: AbstractControl<string>): ValidationErrors | null => {
  const v = parseDecimalInput(c.value ?? '');
  return v === null || compareDecimals(v, '0') <= 0 ? { invalid: true } : null;
};

@Component({
  selector: 'app-deposit-dialog',
  imports: [ReactiveFormsModule, TranslocoDirective, MatButtonModule, MatCheckboxModule, MatDatepickerModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  templateUrl: './deposit-dialog.html',
  styleUrl: '../../transactions/transaction-dialog/transaction-dialog.scss',
})
export class DepositDialog {
  private readonly savings = inject(SavingsService);
  private readonly ref = inject(MatDialogRef<DepositDialog>);
  private readonly transloco = inject(TranslocoService);
  private readonly currencies = inject(CurrenciesService);
  private readonly accountsSvc = inject(AccountsService);
  readonly accounts = computed(() => this.accountsSvc.active().filter((a) => a.type !== 'CREDIT_CARD' && a.type !== 'LOAN' && a.type !== 'INVESTMENT'));
  readonly error = signal<string | null>(null);

  private readonly in30 = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d;
  })();

  readonly form = inject(FormBuilder).nonNullable.group({
    accountId: [this.accountsSvc.active().find((a) => a.type === 'CHECKING' || a.type === 'SAVINGS')?.id ?? '', Validators.required],
    institution: ['', [Validators.required, Validators.maxLength(80)]],
    principal: ['', positive],
    rate: ['', positive],
    startDate: [new Date(), Validators.required],
    maturityDate: [this.in30, Validators.required],
    autoRenew: [false],
  });

  private readonly values = toSignal(this.form.valueChanges, { initialValue: this.form.getRawValue() });

  /** Proyección en vivo del interés al vencimiento. */
  readonly projection = computed(() => {
    const v = this.values();
    const principal = parseDecimalInput(v.principal ?? '');
    const rate = parseDecimalInput(v.rate ?? '');
    if (!principal || !rate || !v.startDate || !v.maturityDate) return null;
    const p = depositProjection(Number(principal), Number(percentToFraction(rate)), toIsoDate(v.startDate), toIsoDate(v.maturityDate), todayIso());
    if (p.days <= 0) return null;
    const currency = this.currencies.get(this.accountsSvc.accounts().find((a) => a.id === v.accountId)?.currency ?? 'ARS');
    return { days: p.days, interest: formatMoney(toMoneyString(p.interest), currency), total: formatMoney(toMoneyString(p.total), currency) };
  });

  invalidDates() {
    const { startDate, maturityDate } = this.form.getRawValue();
    return maturityDate <= startDate;
  }

  async save() {
    if (this.form.invalid || this.invalidDates()) return;
    const v = this.form.getRawValue();
    const account = this.accountsSvc.accounts().find((a) => a.id === v.accountId)!;
    try {
      await this.savings.createDeposit(
        {
          accountId: v.accountId,
          currency: account.currency,
          rateType: 'FIXED',
          startDate: toIsoDate(v.startDate),
          maturityDate: toIsoDate(v.maturityDate),
          autoRenew: v.autoRenew,
          institution: v.institution.trim(),
          principal: parseDecimalInput(v.principal)!,
          annualRate: percentToFraction(parseDecimalInput(v.rate)!),
        },
        this.transloco.translate('savings.deposits.txOpen', { institution: v.institution.trim() }),
      );
      this.ref.close(true);
    } catch {
      this.error.set('errors.generic');
    }
  }
}
