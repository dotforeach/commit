import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators, type AbstractControl, type ValidationErrors } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { CurrenciesService } from '../../../core/currencies/currencies.service';
import { toIsoDate } from '../../../core/dates/dates';
import { compareDecimals, formatMoney, parseDecimalInput } from '../../../core/money/decimal';
import { AccountsService } from '../../accounts/accounts.service';
import { CategoriesService } from '../../categories/categories.service';
import { cashAmount } from '../savings-math';
import { toMoneyString } from '../savings-format';
import type { AssetClass, TradeType } from '../savings.models';
import { SavingsService } from '../savings.service';

/** Cantidades con hasta 10 decimales (cripto); precios con hasta 4. */
const quantity = (c: AbstractControl<string>): ValidationErrors | null => {
  const s = (c.value ?? '').trim().replace(',', '.');
  return /^\d{1,12}(\.\d{1,10})?$/.test(s) && Number(s) > 0 ? null : { invalid: true };
};
const positive = (c: AbstractControl<string>): ValidationErrors | null => {
  const v = parseDecimalInput(c.value ?? '');
  return v === null || compareDecimals(v, '0') <= 0 ? { invalid: true } : null;
};
const optional = (c: AbstractControl<string>): ValidationErrors | null => (!c.value?.trim() || parseDecimalInput(c.value) !== null ? null : { invalid: true });

@Component({
  selector: 'app-trade-dialog',
  imports: [ReactiveFormsModule, TranslocoDirective, MatButtonModule, MatButtonToggleModule, MatDatepickerModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  templateUrl: './trade-dialog.html',
  styleUrl: '../../transactions/transaction-dialog/transaction-dialog.scss',
})
export class TradeDialog {
  readonly savings = inject(SavingsService);
  private readonly ref = inject(MatDialogRef<TradeDialog>);
  private readonly transloco = inject(TranslocoService);
  private readonly currencies = inject(CurrenciesService);
  private readonly categories = inject(CategoriesService);
  private readonly accountsSvc = inject(AccountsService);
  readonly accounts = computed(() => this.accountsSvc.active().filter((a) => a.type === 'INVESTMENT'));
  readonly types: TradeType[] = ['BUY', 'SELL', 'DIVIDEND', 'INTEREST', 'FEE'];
  readonly classes: AssetClass[] = ['CEDEAR', 'STOCK', 'BOND', 'ETF', 'MUTUAL_FUND', 'CRYPTO', 'STABLECOIN', 'OTHER'];
  readonly error = signal<string | null>(null);
  readonly busy = signal(false);

  readonly form = inject(FormBuilder).nonNullable.group({
    type: ['BUY' as TradeType],
    accountId: [this.accounts()[0]?.id ?? '', Validators.required],
    assetId: ['' as string],
    newSymbol: [''],
    newName: [''],
    newClass: ['CEDEAR' as AssetClass],
    date: [new Date(), Validators.required],
    quantity: ['', quantity],
    unitPrice: ['', positive],
    fees: ['', optional],
  });

  private readonly v = toSignal(this.form.valueChanges, { initialValue: this.form.getRawValue() });
  readonly type = computed(() => this.v().type ?? 'BUY');
  private readonly currency = computed(() => this.accountsSvc.accounts().find((a) => a.id === this.v().accountId)?.currency ?? 'ARS');
  /** Activos que cotizan en la moneda de la cuenta. */
  readonly assets = computed(() => this.savings.assets().filter((a) => a.currency === this.currency()));
  readonly creatingAsset = computed(() => !this.v().assetId);
  /** Dividendo/interés: cantidad 1 × monto. */
  readonly incomeLike = computed(() => this.type() === 'DIVIDEND' || this.type() === 'INTEREST' || this.type() === 'FEE');

  readonly cash = computed(() => {
    const v = this.v();
    const q = this.incomeLike() ? 1 : Number((v.quantity ?? '').replace(',', '.'));
    const p = Number(parseDecimalInput(v.unitPrice ?? '') ?? NaN);
    const f = Number(parseDecimalInput(v.fees || '0') ?? 0);
    if (!q || !p) return null;
    return formatMoney(toMoneyString(cashAmount({ type: this.type(), quantity: q, unitPrice: p, fees: f })), this.currencies.get(this.currency()));
  });

  constructor() {
    const syncQty = () => {
      if (this.incomeLike()) {
        this.form.controls.quantity.setValue('1', { emitEvent: false });
        this.form.controls.quantity.disable({ emitEvent: false });
      } else this.form.controls.quantity.enable({ emitEvent: false });
    };
    syncQty();
    this.form.controls.type.valueChanges.subscribe(() => queueMicrotask(syncQty));
  }

  async save() {
    const v = this.form.getRawValue();
    if (this.form.invalid || this.busy()) return;
    if (!v.assetId && (!v.newSymbol.trim() || !v.newName.trim())) {
      this.error.set('errors.asset');
      return;
    }
    this.busy.set(true);
    this.error.set(null);
    try {
      const assetId = v.assetId || (await this.savings.createAsset({ assetClass: v.newClass, currency: this.currency(), symbol: v.newSymbol.trim().toUpperCase(), name: v.newName.trim() }));
      const symbol = this.savings.assets().find((a) => a.id === assetId)?.symbol ?? '';
      const income = this.categories.categories().find((c) => c.systemKey === 'income.other');
      await this.savings.addTrade(
        {
          accountId: v.accountId,
          assetId,
          type: v.type,
          date: toIsoDate(v.date),
          quantity: this.incomeLike() ? '1' : v.quantity.trim().replace(',', '.'),
          unitPrice: parseDecimalInput(v.unitPrice)!,
          fees: parseDecimalInput(v.fees || '0')!,
          notes: null,
        },
        this.transloco.translate(`savings.investments.tx.${v.type}`, { symbol }),
        income?.id ?? null,
      );
      this.ref.close(true);
    } catch {
      this.error.set('errors.generic');
    } finally {
      this.busy.set(false);
    }
  }
}
