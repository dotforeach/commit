import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators, type AbstractControl, type ValidationErrors } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TranslocoDirective } from '@jsverse/transloco';
import { CurrenciesService } from '../../../core/currencies/currencies.service';
import { HouseholdContextService } from '../../../core/households/household-context.service';
import { parseDecimalInput, toInputValue } from '../../../core/money/decimal';
import { ACCOUNT_TYPES, type Account, type AccountDraft, type AccountType } from '../account.model';
import { AccountsService } from '../accounts.service';

const decimal = (required: boolean) => (c: AbstractControl<string>): ValidationErrors | null => {
  if (!c.value?.trim()) return required ? { required: true } : null;
  return parseDecimalInput(c.value) === null ? { decimal: true } : null;
};

const CARD_NETWORKS = ['visa', 'mastercard', 'amex', 'cabal', 'naranja', 'other'];

@Component({
  selector: 'app-account-dialog',
  imports: [
    ReactiveFormsModule,
    TranslocoDirective,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSlideToggleModule,
  ],
  templateUrl: './account-dialog.html',
  styleUrl: './account-dialog.scss',
})
export class AccountDialog {
  private readonly accounts = inject(AccountsService);
  private readonly ref = inject(MatDialogRef<AccountDialog, Account>);
  private readonly household = inject(HouseholdContextService);
  readonly currencies = inject(CurrenciesService);
  readonly editing = inject<Account | null>(MAT_DIALOG_DATA, { optional: true });

  readonly types = ACCOUNT_TYPES;
  readonly networks = CARD_NETWORKS;
  readonly busy = signal(false);
  readonly error = signal<string | null>(null);

  private readonly fb = inject(FormBuilder).nonNullable;
  readonly form = this.fb.group({
    name: [this.editing?.name ?? '', [Validators.required, Validators.maxLength(80)]],
    type: [this.editing?.type ?? ('CHECKING' as AccountType), Validators.required],
    currency: [this.editing?.currency ?? this.household.baseCurrency(), Validators.required],
    initialBalance: [this.editing ? toInputValue(this.editing.initialBalance) : '0', decimal(true)],
    institution: [this.editing?.institution ?? '', Validators.maxLength(80)],
    includeInNetWorth: [this.editing?.includeInNetWorth ?? true],
    card: this.fb.group({
      network: [this.editing?.creditCard?.network ?? 'visa'],
      lastFour: [this.editing?.creditCard?.lastFour ?? '', Validators.pattern(/^\d{4}$/)],
      creditLimit: [this.editing?.creditCard?.creditLimit ? toInputValue(this.editing.creditCard.creditLimit) : '', decimal(false)],
      closingDay: [this.editing?.creditCard?.closingDay ?? 25, [Validators.required, Validators.min(1), Validators.max(31)]],
      dueDay: [this.editing?.creditCard?.dueDay ?? 5, [Validators.required, Validators.min(1), Validators.max(31)]],
    }),
  });

  private readonly type = toSignal(this.form.controls.type.valueChanges, { initialValue: this.form.controls.type.value });
  readonly isCard = computed(() => this.type() === 'CREDIT_CARD');

  constructor() {
    this.syncCardValidation(this.form.controls.type.value);
    this.form.controls.type.valueChanges.subscribe((t) => this.syncCardValidation(t));
  }

  /** Los datos de tarjeta solo se validan (y se envían) si el tipo es tarjeta de crédito. */
  private syncCardValidation(type: AccountType) {
    const card = this.form.controls.card;
    if (type === 'CREDIT_CARD') card.enable({ emitEvent: false });
    else card.disable({ emitEvent: false });
  }

  async save() {
    if (this.form.invalid || this.busy()) return;
    this.busy.set(true);
    this.error.set(null);
    const v = this.form.getRawValue();
    const draft: AccountDraft = {
      name: v.name.trim(),
      type: v.type,
      currency: v.currency,
      ownerUserId: this.editing?.ownerUserId ?? null,
      initialBalance: parseDecimalInput(v.initialBalance)!,
      institution: v.institution.trim() || null,
      includeInNetWorth: v.includeInNetWorth,
      color: this.editing?.color ?? null,
      icon: this.editing?.icon ?? null,
      creditCard:
        v.type === 'CREDIT_CARD'
          ? {
              network: v.card.network || null,
              lastFour: v.card.lastFour || null,
              creditLimit: v.card.creditLimit.trim() ? parseDecimalInput(v.card.creditLimit) : null,
              closingDay: v.card.closingDay,
              dueDay: v.card.dueDay,
            }
          : null,
    };
    try {
      const saved = this.editing ? await this.accounts.update(this.editing, draft) : await this.accounts.create(draft);
      this.ref.close(saved);
    } catch (e) {
      this.error.set(e instanceof HttpErrorResponse && e.status === 409 ? 'errors.conflict' : 'errors.generic');
    } finally {
      this.busy.set(false);
    }
  }
}
