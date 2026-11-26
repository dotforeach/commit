import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, type AbstractControl, type ValidationErrors } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { TranslocoDirective } from '@jsverse/transloco';
import { CurrenciesService } from '../../../core/currencies/currencies.service';
import { fromIsoDate, toIsoDate } from '../../../core/dates/dates';
import { HouseholdContextService } from '../../../core/households/household-context.service';
import { compareDecimals, parseDecimalInput, toInputValue } from '../../../core/money/decimal';
import type { Amortization } from '../debt-math';
import type { Debt, DebtDraft, DebtKind, DebtStatus, RateType } from '../debt.model';
import { DebtsService } from '../debts.service';

const amount = (required: boolean) => (c: AbstractControl<string>): ValidationErrors | null => {
  if (!c.value?.trim()) return required ? { required: true } : null;
  const v = parseDecimalInput(c.value);
  if (v === null) return { decimal: true };
  return compareDecimals(v, '0') < 0 ? { positive: true } : null;
};

/** Corre la coma `places` lugares a la izquierda (negativo: a la derecha), sin pasar por number. */
function shiftPoint(value: string, places: number): string {
  const [int, frac = ''] = value.split('.');
  const scale = frac.length + places; // decimales del resultado
  let digits = `${int}${frac}`.replace(/^0+(?=\d)/, '');
  if (scale <= 0) return (digits + '0'.repeat(-scale)).replace(/^0+(?=\d)/, '');
  digits = digits.padStart(scale + 1, '0');
  const whole = digits.slice(0, -scale).replace(/^0+(?=\d)/, '');
  const rest = digits.slice(-scale).replace(/0+$/, '');
  return rest ? `${whole}.${rest}` : whole;
}

/** "60" (%) → "0.6" (fracción). */
export const percentToFraction = (pct: string) => shiftPoint(pct, 2);
/** "0.6" (fracción) → "60" (%). */
export const fractionToPercent = (fraction: string) => shiftPoint(fraction, -2);

@Component({
  selector: 'app-debt-dialog',
  imports: [ReactiveFormsModule, TranslocoDirective, MatButtonModule, MatDatepickerModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatProgressSpinnerModule, MatSelectModule],
  templateUrl: './debt-dialog.html',
  styleUrl: '../../transactions/transaction-dialog/transaction-dialog.scss',
})
export class DebtDialog {
  private readonly debts = inject(DebtsService);
  private readonly ref = inject(MatDialogRef<DebtDialog>);
  readonly currencies = inject(CurrenciesService);
  readonly editing = inject<Debt | null>(MAT_DIALOG_DATA, { optional: true });
  private readonly base = inject(HouseholdContextService).baseCurrency();

  readonly busy = signal(false);
  readonly error = signal<string | null>(null);
  readonly kinds: DebtKind[] = ['PERSONAL_LOAN', 'MORTGAGE', 'CAR_LOAN', 'CREDIT_CARD_BALANCE', 'FAMILY_OR_FRIEND', 'OTHER'];
  readonly rateTypes: RateType[] = ['FIXED', 'VARIABLE', 'INDEXED', 'NONE'];
  readonly systems: Amortization[] = ['FRENCH', 'GERMAN', 'BULLET', 'CUSTOM'];
  readonly statuses: DebtStatus[] = ['ACTIVE', 'PAID_OFF', 'DEFAULTED', 'CANCELLED'];

  private readonly e = this.editing;
  readonly form = inject(FormBuilder).nonNullable.group({
    name: [this.e?.name ?? '', [Validators.required, Validators.maxLength(80)]],
    kind: [this.e?.kind ?? ('PERSONAL_LOAN' as DebtKind)],
    lender: [this.e?.lender ?? '', Validators.maxLength(80)],
    currency: [this.e?.currency ?? this.base, Validators.required],
    originalAmount: [this.e ? toInputValue(this.e.originalAmount) : '', amount(true)],
    annualRate: [this.e?.annualRate ? toInputValue(fractionToPercent(this.e.annualRate)) : '', amount(false)],
    rateType: [this.e?.rateType ?? ('FIXED' as RateType)],
    amortization: [this.e?.amortization ?? ('FRENCH' as Amortization)],
    termMonths: [this.e?.termMonths ?? (null as number | null), [Validators.min(1), Validators.max(600)]],
    startDate: [this.e ? fromIsoDate(this.e.startDate) : new Date(), Validators.required],
    paymentDay: [this.e?.paymentDay ?? (null as number | null), [Validators.min(1), Validators.max(31)]],
    minimumPayment: [this.e?.minimumPayment ? toInputValue(this.e.minimumPayment) : '', amount(false)],
    status: [this.e?.status ?? ('ACTIVE' as DebtStatus)],
  });

  async save() {
    if (this.form.invalid || this.busy()) return;
    this.busy.set(true);
    this.error.set(null);
    const v = this.form.getRawValue();
    const rate = v.annualRate.trim() ? parseDecimalInput(v.annualRate) : null;
    const draft: DebtDraft = {
      name: v.name.trim(),
      kind: v.kind,
      lender: v.lender.trim() || null,
      currency: v.currency,
      originalAmount: parseDecimalInput(v.originalAmount)!,
      annualRate: rate ? percentToFraction(rate) : null,
      indexName: v.rateType === 'INDEXED' ? (this.e?.indexName ?? 'UVA') : null,
      minimumPayment: v.minimumPayment.trim() ? parseDecimalInput(v.minimumPayment) : null,
      rateType: rate ? v.rateType : 'NONE',
      amortization: v.amortization,
      termMonths: v.termMonths || null,
      startDate: toIsoDate(v.startDate),
      paymentDay: v.paymentDay || null,
      status: v.status,
      accountId: this.e?.accountId ?? null,
    };
    try {
      if (this.e) await this.debts.update(this.e, draft);
      else await this.debts.create(draft);
      this.ref.close(true);
    } catch (err) {
      this.error.set(err instanceof HttpErrorResponse && err.status === 409 ? 'errors.conflict' : 'errors.generic');
    } finally {
      this.busy.set(false);
    }
  }
}
