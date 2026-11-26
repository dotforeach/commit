import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators, type AbstractControl, type ValidationErrors } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { TranslocoDirective } from '@jsverse/transloco';
import { fromIsoDate, toIsoDate } from '../../../core/dates/dates';
import { compareDecimals, parseDecimalInput, toInputValue } from '../../../core/money/decimal';
import { AccountsService } from '../../accounts/accounts.service';
import { accountIcon } from '../../accounts/account.model';
import { CategoriesService } from '../../categories/categories.service';
import type { LedgerEntry } from '../transaction.model';
import { TransactionsService } from '../transactions.service';

type Mode = 'EXPENSE' | 'INCOME' | 'TRANSFER';

/** Monto positivo válido (o vacío si no es obligatorio). */
const positiveAmount = (c: AbstractControl<string>): ValidationErrors | null => {
  if (!c.value?.trim()) return { required: true };
  const v = parseDecimalInput(c.value);
  if (v === null) return { decimal: true };
  return compareDecimals(v, '0') <= 0 ? { positive: true } : null;
};

@Component({
  selector: 'app-transaction-dialog',
  imports: [
    ReactiveFormsModule,
    TranslocoDirective,
    MatButtonModule,
    MatButtonToggleModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
  ],
  templateUrl: './transaction-dialog.html',
  styleUrl: './transaction-dialog.scss',
})
export class TransactionDialog {
  private readonly transactions = inject(TransactionsService);
  private readonly ref = inject(MatDialogRef<TransactionDialog>);
  readonly accountsService = inject(AccountsService);
  readonly categories = inject(CategoriesService);
  readonly entry = inject<LedgerEntry | null>(MAT_DIALOG_DATA, { optional: true });
  readonly icon = accountIcon;

  readonly busy = signal(false);
  readonly error = signal<string | null>(null);
  readonly accounts = this.accountsService.active;

  private readonly fb = inject(FormBuilder).nonNullable;
  readonly form = this.fb.group({
    mode: [this.initialMode()],
    date: [this.entry ? fromIsoDate(this.entry.date) : new Date(), Validators.required],
    amount: [this.initial('amount'), positiveAmount],
    amountIn: [this.entry?.kind === 'transfer' ? toInputValue(this.entry.in.amount) : '', positiveAmount],
    accountId: [this.initial('accountId'), Validators.required],
    toAccountId: [this.entry?.kind === 'transfer' ? this.entry.in.accountId : '', Validators.required],
    categoryId: [this.entry?.kind === 'single' ? (this.entry.tx.categoryId ?? '') : ''],
    description: [this.initial('description'), [Validators.required, Validators.maxLength(140)]],
    notes: [this.initial('notes'), Validators.maxLength(1000)],
  });

  readonly mode = toSignal(this.form.controls.mode.valueChanges, { initialValue: this.form.controls.mode.value });
  private readonly from = toSignal(this.form.controls.accountId.valueChanges, { initialValue: this.form.controls.accountId.value });
  private readonly to = toSignal(this.form.controls.toAccountId.valueChanges, { initialValue: this.form.controls.toAccountId.value });

  readonly categoryOptions = computed(() => (this.mode() === 'INCOME' ? this.categories.income() : this.categories.expense()));
  readonly currencyOf = (id: string) => this.accountsService.accounts().find((a) => a.id === id)?.currency ?? '';
  /** Transferencia entre monedas distintas: hay que indicar cuánto llega. */
  readonly crossCurrency = computed(
    () => this.mode() === 'TRANSFER' && !!this.from() && !!this.to() && this.currencyOf(this.from()) !== this.currencyOf(this.to()),
  );

  constructor() {
    // Al editar no se cambia el tipo (un gasto no se convierte en transferencia).
    if (this.entry) this.form.controls.mode.disable({ emitEvent: false });
    this.syncValidators();
    this.form.controls.mode.valueChanges.subscribe(() => {
      this.form.controls.categoryId.setValue('');
      this.syncValidators();
    });
    this.form.controls.accountId.valueChanges.subscribe(() => this.syncValidators());
    this.form.controls.toAccountId.valueChanges.subscribe(() => this.syncValidators());
    if (!this.form.controls.accountId.value && this.accounts().length > 0) {
      this.form.controls.accountId.setValue(this.accounts()[0].id);
    }
  }

  /** Cuenta destino y monto recibido solo aplican a transferencias (el monto recibido, si cambian de moneda). */
  private syncValidators() {
    const transfer = this.form.controls.mode.value === 'TRANSFER';
    const toggle = (c: AbstractControl, on: boolean) => (on ? c.enable({ emitEvent: false }) : c.disable({ emitEvent: false }));
    toggle(this.form.controls.toAccountId, transfer);
    toggle(this.form.controls.categoryId, !transfer);
    const from = this.form.controls.accountId.value;
    const to = this.form.controls.toAccountId.value;
    toggle(this.form.controls.amountIn, transfer && !!from && !!to && this.currencyOf(from) !== this.currencyOf(to));
  }

  sameAccount() {
    const v = this.form.getRawValue();
    return v.mode === 'TRANSFER' && v.accountId !== '' && v.accountId === v.toAccountId;
  }

  async save() {
    if (this.form.invalid || this.sameAccount() || this.busy()) return;
    this.busy.set(true);
    this.error.set(null);
    const v = this.form.getRawValue();
    const date = toIsoDate(v.date);
    const amount = parseDecimalInput(v.amount)!;
    const description = v.description.trim();
    const notes = v.notes.trim() || null;
    try {
      if (v.mode === 'TRANSFER') {
        const draft = {
          fromAccountId: v.accountId,
          toAccountId: v.toAccountId,
          date,
          amountOut: amount,
          amountIn: this.crossCurrency() ? parseDecimalInput(v.amountIn)! : amount,
          description,
          notes,
        };
        if (this.entry?.kind === 'transfer') await this.transactions.updateTransfer(this.entry.out, this.entry.in, draft);
        else await this.transactions.createTransfer(draft);
      } else {
        const draft = { type: v.mode, accountId: v.accountId, categoryId: v.categoryId || null, date, amount, description, notes };
        if (this.entry?.kind === 'single') await this.transactions.updateSingle(this.entry.tx, draft);
        else await this.transactions.createSingle(draft);
      }
      this.ref.close(true);
    } catch (e) {
      this.error.set(e instanceof HttpErrorResponse && e.status === 409 ? 'errors.conflict' : 'errors.generic');
    } finally {
      this.busy.set(false);
    }
  }

  private initialMode(): Mode {
    if (!this.entry) return 'EXPENSE';
    if (this.entry.kind === 'transfer') return 'TRANSFER';
    return this.entry.tx.type === 'INCOME' ? 'INCOME' : 'EXPENSE';
  }

  private initial(field: 'amount' | 'accountId' | 'description' | 'notes'): string {
    const t = this.entry?.kind === 'single' ? this.entry.tx : this.entry?.kind === 'transfer' ? this.entry.out : null;
    if (!t) return '';
    if (field === 'amount') return toInputValue(t.amount);
    return t[field] ?? '';
  }
}
