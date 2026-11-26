import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, type AbstractControl, type ValidationErrors } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { toIsoDate } from '../../../core/dates/dates';
import { compareDecimals, parseDecimalInput, toInputValue } from '../../../core/money/decimal';

export interface AmountDialogData {
  title: string;
  message?: string;
  amountLabel: string;
  amount?: string;
  allowNegative?: boolean;
  withNote?: string; // etiqueta del campo nota
  dateLabel: string;
  confirm: string;
  cancel: string;
}
export interface AmountDialogResult {
  amount: string;
  date: string;
  note: string | null;
}

const amountValidator = (allowNegative: boolean) => (c: AbstractControl<string>): ValidationErrors | null => {
  const v = parseDecimalInput(c.value ?? '');
  if (v === null) return { decimal: true };
  const cmp = compareDecimals(v, '0');
  return cmp === 0 || (!allowNegative && cmp < 0) ? { invalid: true } : null;
};

/** Diálogo genérico: monto + fecha (+ nota). Lo usan aportes, cobros y precios. */
@Component({
  selector: 'app-amount-dialog',
  imports: [ReactiveFormsModule, MatButtonModule, MatDatepickerModule, MatDialogModule, MatFormFieldModule, MatInputModule],
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <form [formGroup]="form" (ngSubmit)="save()">
      <mat-dialog-content class="fields">
        @if (data.message) {
          <p>{{ data.message }}</p>
        }
        <div class="row">
          <mat-form-field>
            <mat-label>{{ data.amountLabel }}</mat-label>
            <input matInput formControlName="amount" inputmode="decimal" cdkFocusInitial />
          </mat-form-field>
          <mat-form-field>
            <mat-label>{{ data.dateLabel }}</mat-label>
            <input matInput [matDatepicker]="picker" formControlName="date" />
            <mat-datepicker-toggle matIconSuffix [for]="picker" />
            <mat-datepicker #picker />
          </mat-form-field>
        </div>
        @if (data.withNote) {
          <mat-form-field>
            <mat-label>{{ data.withNote }}</mat-label>
            <input matInput formControlName="note" />
          </mat-form-field>
        }
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button type="button" mat-dialog-close>{{ data.cancel }}</button>
        <button mat-flat-button type="submit" [disabled]="form.invalid">{{ data.confirm }}</button>
      </mat-dialog-actions>
    </form>
  `,
  styleUrl: '../../transactions/transaction-dialog/transaction-dialog.scss',
})
export class AmountDialog {
  readonly data = inject<AmountDialogData>(MAT_DIALOG_DATA);
  private readonly ref = inject(MatDialogRef<AmountDialog, AmountDialogResult>);
  readonly form = inject(FormBuilder).nonNullable.group({
    amount: [this.data.amount ? toInputValue(this.data.amount) : '', amountValidator(!!this.data.allowNegative)],
    date: [new Date(), Validators.required],
    note: [''],
  });

  save() {
    if (this.form.invalid) return;
    const v = this.form.getRawValue();
    this.ref.close({ amount: parseDecimalInput(v.amount)!, date: toIsoDate(v.date), note: v.note.trim() || null });
  }
}
