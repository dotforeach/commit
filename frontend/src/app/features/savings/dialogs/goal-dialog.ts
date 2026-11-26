import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators, type AbstractControl, type ValidationErrors } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslocoDirective } from '@jsverse/transloco';
import { CurrenciesService } from '../../../core/currencies/currencies.service';
import { fromIsoDate, toIsoDate, todayIso } from '../../../core/dates/dates';
import { HouseholdContextService } from '../../../core/households/household-context.service';
import { compareDecimals, formatMoney, parseDecimalInput, toInputValue } from '../../../core/money/decimal';
import { AccountsService } from '../../accounts/accounts.service';
import { TransactionsService } from '../../transactions/transactions.service';
import { averageMonthlyExpenses } from '../savings-math';
import type { Goal, GoalKind } from '../savings.models';
import { SavingsService } from '../savings.service';

const positive = (c: AbstractControl<string>): ValidationErrors | null => {
  const v = parseDecimalInput(c.value ?? '');
  return v === null || compareDecimals(v, '0') <= 0 ? { invalid: true } : null;
};

@Component({
  selector: 'app-goal-dialog',
  imports: [ReactiveFormsModule, TranslocoDirective, MatButtonModule, MatDatepickerModule, MatDialogModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSelectModule],
  templateUrl: './goal-dialog.html',
  styleUrl: '../../transactions/transaction-dialog/transaction-dialog.scss',
})
export class GoalDialog {
  private readonly savings = inject(SavingsService);
  private readonly ref = inject(MatDialogRef<GoalDialog>);
  private readonly transactions = inject(TransactionsService);
  private readonly accountsSvc = inject(AccountsService);
  readonly currencies = inject(CurrenciesService);
  readonly editing = inject<Goal | null>(MAT_DIALOG_DATA, { optional: true });
  private readonly base = inject(HouseholdContextService).baseCurrency();
  readonly kinds: GoalKind[] = ['EMERGENCY_FUND', 'SAVINGS_GOAL', 'RETIREMENT'];
  readonly error = signal<string | null>(null);

  private readonly e = this.editing;
  readonly form = inject(FormBuilder).nonNullable.group({
    name: [this.e?.name ?? '', [Validators.required, Validators.maxLength(80)]],
    kind: [this.e?.kind ?? ('SAVINGS_GOAL' as GoalKind)],
    currency: [this.e?.currency ?? this.base, Validators.required],
    targetAmount: [this.e ? toInputValue(this.e.targetAmount) : '', positive],
    monthsOfExpenses: [this.e?.monthsOfExpenses ?? 3],
    targetDate: [this.e?.targetDate ? fromIsoDate(this.e.targetDate) : (null as Date | null)],
    accountId: [this.e?.accountId ?? ''],
  });

  readonly kind = toSignal(this.form.controls.kind.valueChanges, { initialValue: this.form.controls.kind.value });
  private readonly currency = toSignal(this.form.controls.currency.valueChanges, { initialValue: this.form.controls.currency.value });
  private readonly months = toSignal(this.form.controls.monthsOfExpenses.valueChanges, { initialValue: this.form.controls.monthsOfExpenses.value });

  readonly accounts = computed(() => this.accountsSvc.active().filter((a) => a.currency === this.currency() && a.type !== 'CREDIT_CARD' && a.type !== 'LOAN'));

  /** Fondo de emergencia sugerido: N meses de tu gasto promedio real. */
  readonly suggestion = computed(() => {
    if (this.kind() !== 'EMERGENCY_FUND') return null;
    const accounts = this.accountsSvc.accounts();
    const { average, monthsWithData } = averageMonthlyExpenses(this.transactions.transactions(), (id) => accounts.find((a) => a.id === id)?.currency, this.currency(), todayIso());
    if (monthsWithData === 0) return null;
    const total = String(Math.round(Number(average) * (this.months() || 3) * 100) / 100);
    return { average, total, label: formatMoney(total, this.currencies.get(this.currency())), avgLabel: formatMoney(average, this.currencies.get(this.currency())) };
  });

  useSuggestion() {
    const s = this.suggestion();
    if (s) this.form.controls.targetAmount.setValue(toInputValue(s.total));
  }

  async save() {
    if (this.form.invalid) return;
    const v = this.form.getRawValue();
    try {
      await this.savings.saveGoal(
        {
          name: v.name.trim(),
          kind: v.kind,
          currency: v.currency,
          targetAmount: parseDecimalInput(v.targetAmount)!,
          monthsOfExpenses: v.kind === 'EMERGENCY_FUND' ? v.monthsOfExpenses : null,
          targetDate: v.targetDate ? toIsoDate(v.targetDate) : null,
          accountId: v.accountId || null,
          priority: this.e?.priority ?? 0,
          status: this.e?.status ?? 'ACTIVE',
        },
        this.e ?? undefined,
      );
      this.ref.close(true);
    } catch {
      this.error.set('errors.generic');
    }
  }
}
