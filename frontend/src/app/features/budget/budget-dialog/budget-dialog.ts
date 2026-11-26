import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators, type AbstractControl, type ValidationErrors } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { TranslocoDirective } from '@jsverse/transloco';
import { CurrenciesService } from '../../../core/currencies/currencies.service';
import { addDecimals, formatMoney, parseDecimalInput, toInputValue } from '../../../core/money/decimal';
import { AccountsService } from '../../accounts/accounts.service';
import { CategoriesService } from '../../categories/categories.service';
import { RecurringService } from '../../recurring/recurring.service';
import type { Budget, BudgetDraft, BudgetMethod } from '../budget.model';
import { BudgetsService } from '../budgets.service';

export interface BudgetDialogData {
  year: number;
  month: number;
  budget: Budget | null;
  defaultCurrency: string;
}

const optionalAmount = (c: AbstractControl<string>): ValidationErrors | null =>
  !c.value?.trim() || parseDecimalInput(c.value) !== null ? null : { decimal: true };

@Component({
  selector: 'app-budget-dialog',
  imports: [
    ReactiveFormsModule,
    TranslocoDirective,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
  ],
  templateUrl: './budget-dialog.html',
  styleUrl: './budget-dialog.scss',
})
export class BudgetDialog {
  private readonly budgets = inject(BudgetsService);
  private readonly ref = inject(MatDialogRef<BudgetDialog>);
  private readonly accounts = inject(AccountsService);
  private readonly recurring = inject(RecurringService);
  readonly currencies = inject(CurrenciesService);
  readonly categories = inject(CategoriesService).expense;
  readonly data = inject<BudgetDialogData>(MAT_DIALOG_DATA);

  readonly busy = signal(false);
  readonly error = signal<string | null>(null);
  readonly methods: BudgetMethod[] = ['CATEGORY', 'FIFTY_THIRTY_TWENTY', 'ENVELOPE'];

  private readonly fb = inject(FormBuilder).nonNullable;
  readonly b = this.data.budget;
  readonly form = this.fb.group({
    method: [this.b?.method ?? ('CATEGORY' as BudgetMethod)],
    currency: [this.b?.currency ?? this.data.defaultCurrency, Validators.required],
    expectedIncome: [this.b?.expectedIncome ? toInputValue(this.b.expectedIncome) : '', optionalAmount],
    items: this.fb.array(
      this.categories().map((c) => {
        const existing = this.b?.items.find((i) => i.categoryId === c.id);
        return this.fb.group({
          id: [existing?.id ?? ''],
          categoryId: [c.id],
          amount: [existing ? toInputValue(existing.amount) : '', optionalAmount],
          rollover: [existing?.rollover ?? false],
          alertThreshold: [existing?.alertThreshold ?? 80, [Validators.min(1), Validators.max(100)]],
        });
      }),
    ),
  });

  readonly method = toSignal(this.form.controls.method.valueChanges, { initialValue: this.form.controls.method.value });
  private readonly currency = toSignal(this.form.controls.currency.valueChanges, { initialValue: this.form.controls.currency.value });
  private readonly itemValues = toSignal(this.form.controls.items.valueChanges, { initialValue: this.form.controls.items.getRawValue() });

  get itemsArray(): FormArray {
    return this.form.controls.items;
  }

  readonly assigned = computed(() =>
    addDecimals(...(this.itemValues() ?? []).map((i) => parseDecimalInput(i?.amount ?? '') ?? '0')),
  );

  /** Ingresos recurrentes mensuales en la moneda elegida: sugerencia para el ingreso esperado. */
  readonly recurringIncome = computed(() => {
    const currency = this.currency();
    const amounts = this.recurring
      .rules()
      .filter((r) => r.active && r.type === 'INCOME' && r.frequency === 'MONTHLY' && r.interval === 1)
      .filter((r) => this.accounts.accounts().find((a) => a.id === r.accountId)?.currency === currency)
      .map((r) => r.amount);
    return amounts.length > 0 ? addDecimals(...amounts) : null;
  });

  money(amount: string) {
    return formatMoney(amount, this.currencies.get(this.form.controls.currency.value));
  }

  categoryName(id: string) {
    return this.categories().find((c) => c.id === id)?.name ?? '';
  }

  useRecurringIncome() {
    const v = this.recurringIncome();
    if (v) this.form.controls.expectedIncome.setValue(toInputValue(v));
  }

  async save() {
    if (this.form.invalid || this.busy()) return;
    const v = this.form.getRawValue();
    const needsIncome = v.method !== 'CATEGORY';
    if (needsIncome && !v.expectedIncome.trim()) {
      this.error.set('errors.incomeRequired');
      return;
    }
    this.busy.set(true);
    this.error.set(null);
    const draft: BudgetDraft = {
      method: v.method,
      currency: v.currency,
      expectedIncome: v.expectedIncome.trim() ? parseDecimalInput(v.expectedIncome) : null,
      items: v.items
        .filter((i) => i.amount.trim())
        .map((i) => ({
          id: i.id || undefined,
          categoryId: i.categoryId,
          amount: parseDecimalInput(i.amount)!,
          rollover: i.rollover,
          alertThreshold: i.alertThreshold,
        })),
    };
    try {
      if (this.b) await this.budgets.update(this.b, draft);
      else await this.budgets.create(this.data.year, this.data.month, draft);
      this.ref.close(true);
    } catch (e) {
      this.error.set(e instanceof HttpErrorResponse && e.status === 409 ? 'errors.conflict' : 'errors.generic');
    } finally {
      this.busy.set(false);
    }
  }
}
