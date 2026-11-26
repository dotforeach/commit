import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators, type AbstractControl, type ValidationErrors } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { TranslocoDirective } from '@jsverse/transloco';
import { fromIsoDate, toIsoDate } from '../../../core/dates/dates';
import type { Frequency } from '../../../core/dates/recurrence';
import { compareDecimals, parseDecimalInput, toInputValue } from '../../../core/money/decimal';
import { AccountsService } from '../../accounts/accounts.service';
import { CategoriesService } from '../../categories/categories.service';
import type { RecurringRule, RuleDraft } from '../recurring.model';
import { RecurringService } from '../recurring.service';

const positiveAmount = (c: AbstractControl<string>): ValidationErrors | null => {
  const v = parseDecimalInput(c.value ?? '');
  if (v === null) return { decimal: true };
  return compareDecimals(v, '0') <= 0 ? { positive: true } : null;
};

@Component({
  selector: 'app-rule-dialog',
  imports: [
    ReactiveFormsModule,
    TranslocoDirective,
    MatButtonModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
  ],
  templateUrl: './rule-dialog.html',
  styleUrl: '../../transactions/transaction-dialog/transaction-dialog.scss',
})
export class RuleDialog {
  private readonly recurring = inject(RecurringService);
  private readonly ref = inject(MatDialogRef<RuleDialog>);
  readonly accounts = inject(AccountsService).active;
  readonly categories = inject(CategoriesService);
  readonly editing = inject<RecurringRule | null>(MAT_DIALOG_DATA, { optional: true });

  readonly busy = signal(false);
  readonly error = signal<string | null>(null);
  readonly frequencies: Frequency[] = ['MONTHLY', 'WEEKLY', 'DAILY', 'YEARLY'];

  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly e = this.editing;
  readonly form = this.fb.group({
    type: [this.e?.type ?? ('EXPENSE' as 'INCOME' | 'EXPENSE')],
    description: [this.e?.description ?? '', [Validators.required, Validators.maxLength(140)]],
    amount: [this.e ? toInputValue(this.e.amount) : '', positiveAmount],
    accountId: [this.e?.accountId ?? this.accounts()[0]?.id ?? '', Validators.required],
    categoryId: [this.e?.categoryId ?? ''],
    frequency: [this.e?.frequency ?? ('MONTHLY' as Frequency)],
    interval: [this.e?.interval ?? 1, [Validators.required, Validators.min(1), Validators.max(365)]],
    dayOfMonth: [this.e?.dayOfMonth ?? new Date().getDate(), [Validators.required, Validators.min(1), Validators.max(31)]],
    startDate: [this.e ? fromIsoDate(this.e.startDate) : new Date(), Validators.required],
    endDate: [this.e?.endDate ? fromIsoDate(this.e.endDate) : (null as Date | null)],
    autoPost: [this.e?.autoPost ?? true],
    isSalary: [this.e?.isSalary ?? false],
  });

  readonly type = toSignal(this.form.controls.type.valueChanges, { initialValue: this.form.controls.type.value });
  readonly frequency = toSignal(this.form.controls.frequency.valueChanges, { initialValue: this.form.controls.frequency.value });
  readonly categoryOptions = computed(() => (this.type() === 'INCOME' ? this.categories.income() : this.categories.expense()));

  constructor() {
    if (this.editing) this.form.controls.type.disable({ emitEvent: false });
    this.form.controls.type.valueChanges.subscribe(() => this.form.controls.categoryId.setValue(''));
    const syncDay = (f: Frequency) =>
      f === 'MONTHLY' ? this.form.controls.dayOfMonth.enable({ emitEvent: false }) : this.form.controls.dayOfMonth.disable({ emitEvent: false });
    syncDay(this.form.controls.frequency.value);
    this.form.controls.frequency.valueChanges.subscribe(syncDay);
  }

  endBeforeStart() {
    const { startDate, endDate } = this.form.getRawValue();
    return !!endDate && endDate < startDate;
  }

  async save() {
    if (this.form.invalid || this.endBeforeStart() || this.busy()) return;
    this.busy.set(true);
    this.error.set(null);
    const v = this.form.getRawValue();
    const draft: RuleDraft = {
      type: v.type,
      description: v.description.trim(),
      amount: parseDecimalInput(v.amount)!,
      accountId: v.accountId,
      categoryId: v.categoryId || null,
      frequency: v.frequency,
      interval: v.interval,
      dayOfMonth: v.frequency === 'MONTHLY' ? v.dayOfMonth : null,
      startDate: toIsoDate(v.startDate),
      endDate: v.endDate ? toIsoDate(v.endDate) : null,
      autoPost: v.autoPost,
      isSalary: v.type === 'INCOME' && v.isSalary,
      active: this.editing?.active ?? true,
    };
    try {
      if (this.editing) await this.recurring.update(this.editing, draft);
      else await this.recurring.create(draft);
      this.ref.close(true);
    } catch (e) {
      this.error.set(e instanceof HttpErrorResponse && e.status === 409 ? 'errors.conflict' : 'errors.generic');
    } finally {
      this.busy.set(false);
    }
  }
}
