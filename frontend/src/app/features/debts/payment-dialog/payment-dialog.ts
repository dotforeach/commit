import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, type AbstractControl, type ValidationErrors } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { toIsoDate } from '../../../core/dates/dates';
import { compareDecimals, parseDecimalInput, subDecimals, toInputValue } from '../../../core/money/decimal';
import { AccountsService } from '../../accounts/accounts.service';
import { CategoriesService } from '../../categories/categories.service';
import { amortizationSchedule, suggestSplit, toMoney } from '../debt-math';
import type { Debt } from '../debt.model';
import { DebtsService } from '../debts.service';

const positive = (c: AbstractControl<string>): ValidationErrors | null => {
  const v = parseDecimalInput(c.value ?? '');
  if (v === null) return { decimal: true };
  return compareDecimals(v, '0') <= 0 ? { positive: true } : null;
};

@Component({
  selector: 'app-payment-dialog',
  imports: [ReactiveFormsModule, TranslocoDirective, MatButtonModule, MatDatepickerModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatProgressSpinnerModule, MatSelectModule],
  templateUrl: './payment-dialog.html',
  styleUrl: '../../transactions/transaction-dialog/transaction-dialog.scss',
})
export class PaymentDialog {
  private readonly debts = inject(DebtsService);
  private readonly ref = inject(MatDialogRef<PaymentDialog>);
  private readonly categories = inject(CategoriesService);
  private readonly transloco = inject(TranslocoService);
  readonly debt = inject<Debt>(MAT_DIALOG_DATA);
  private readonly accountsSvc = inject(AccountsService);
  readonly accounts = computed(() =>
    this.accountsSvc.active().filter((a) => a.currency === this.debt.currency && a.type !== 'CREDIT_CARD' && a.type !== 'LOAN'),
  );

  readonly busy = signal(false);
  readonly error = signal<string | null>(null);
  private readonly balance = Number(this.debts.balance(this.debt));
  private readonly rate = Number(this.debt.annualRate ?? 0);

  /** Cuota sugerida: la del cronograma (siguiente pago) o el mínimo informado. */
  private readonly suggested = (() => {
    if (this.debt.minimumPayment) return this.debt.minimumPayment;
    if (this.debt.termMonths) {
      const row = amortizationSchedule(Number(this.debt.originalAmount), this.rate, this.debt.termMonths, this.debt.amortization)[this.debt.payments.length];
      if (row) return toMoney(Math.min(row.payment, this.balance + this.balance * (this.rate / 12)));
    }
    return '';
  })();

  readonly form = inject(FormBuilder).nonNullable.group({
    date: [new Date(), Validators.required],
    accountId: ['', Validators.required],
    amount: [this.suggested ? toInputValue(this.suggested) : '', positive],
    interest: [''],
  });

  constructor() {
    const first = this.accountsSvc.active().find((a) => a.currency === this.debt.currency && a.type !== 'CREDIT_CARD' && a.type !== 'LOAN');
    if (first) this.form.controls.accountId.setValue(first.id);
    this.updateSplit();
    this.form.controls.amount.valueChanges.subscribe(() => this.updateSplit());
  }

  /** Propone el interés del mes sobre el saldo; el resto es capital. Editable. */
  private updateSplit() {
    const amount = parseDecimalInput(this.form.controls.amount.value);
    if (!amount || !this.rate) {
      this.form.controls.interest.setValue('0', { emitEvent: false });
      return;
    }
    const { interest } = suggestSplit(this.balance, this.rate, Number(amount));
    this.form.controls.interest.setValue(toInputValue(toMoney(interest)), { emitEvent: false });
  }

  principal(): string {
    const amount = parseDecimalInput(this.form.controls.amount.value) ?? '0';
    const interest = parseDecimalInput(this.form.controls.interest.value || '0') ?? '0';
    return subDecimals(amount, interest);
  }

  invalidSplit() {
    const interest = parseDecimalInput(this.form.controls.interest.value || '0');
    return interest === null || compareDecimals(interest, '0') < 0 || compareDecimals(this.principal(), '0') < 0;
  }

  async save() {
    if (this.form.invalid || this.invalidSplit() || this.busy()) return;
    this.busy.set(true);
    this.error.set(null);
    const v = this.form.getRawValue();
    const amount = parseDecimalInput(v.amount)!;
    const interest = parseDecimalInput(v.interest || '0')!;
    const category = this.categories.categories().find((c) => c.systemKey === 'debt.payments');
    try {
      await this.debts.addPayment(this.debt, {
        date: toIsoDate(v.date),
        accountId: v.accountId,
        categoryId: category?.id ?? null,
        amount,
        interestPart: interest,
        principalPart: this.principal(),
        description: this.transloco.translate('debts.payment.description', { name: this.debt.name }),
      });
      this.ref.close(true);
    } catch {
      this.error.set('errors.generic');
    } finally {
      this.busy.set(false);
    }
  }
}
