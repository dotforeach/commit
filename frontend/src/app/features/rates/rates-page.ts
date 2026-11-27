import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal, type OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { CurrenciesService } from '../../core/currencies/currencies.service';
import { todayIso } from '../../core/dates/dates';
import { HouseholdContextService } from '../../core/households/household-context.service';
import { compareDecimals, formatMoney, parseDecimalInput } from '../../core/money/decimal';
import { AccountsService } from '../accounts/accounts.service';
import { RatesService, type ManualRate } from './rates.service';

const USD_TYPES = ['mep', 'official', 'blue', 'ccl', 'card', 'crypto', 'wholesale'];
/** Monedas que se muestran aunque no tengas cuentas en ellas: región, socios comerciales y cripto. */
const RELEVANT = ['PAB', 'EUR', 'COP', 'CRC', 'MXN', 'CAD', 'GBP', 'CNY', 'BTC', 'ETH', 'USDT'];

@Component({
  selector: 'app-rates-page',
  imports: [DatePipe, ReactiveFormsModule, TranslocoDirective, MatButtonModule, MatCardModule, MatFormFieldModule, MatIconModule, MatInputModule, MatRadioModule, MatSelectModule],
  templateUrl: './rates-page.html',
  styleUrl: './rates-page.scss',
})
export class RatesPage implements OnInit {
  readonly rates = inject(RatesService);
  readonly household = inject(HouseholdContextService);
  readonly currencies = inject(CurrenciesService);
  private readonly accounts = inject(AccountsService);
  private readonly snack = inject(MatSnackBar);
  private readonly transloco = inject(TranslocoService);

  readonly loading = signal(true);
  readonly usdTypes = USD_TYPES;

  readonly dollar = computed(() =>
    USD_TYPES.flatMap((type) => {
      const r = this.rates.publicRates().find((x) => x.base === 'USD' && x.quote === 'ARS' && x.rateType === type);
      return r ? [{ type, rate: r.rate, date: r.date }] : [];
    }),
  );
  /** Cuánto vale 1 unidad de cada moneda relevante en la moneda principal del hogar. */
  readonly mine = computed(() => {
    const base = this.household.baseCurrency();
    const conv = this.rates.converter();
    const own = this.accounts.accounts().map((a) => a.currency);
    const codes = [...new Set([...own, ...RELEVANT, ...(this.rates.usesArs() ? ['ARS'] : [])])].filter((c) => c !== base);
    return codes.flatMap((code) => {
      const rate = conv.rate(code, base);
      if (rate === null) return [];
      const q = conv.quoteFor(base, code) ?? conv.quoteFor(code, base) ?? conv.quoteFor('USD', code) ?? conv.quoteFor(code, 'USD');
      return [{ code, rate: rate.toFixed(rate < 1 ? 6 : 4).replace(/\.?0+$/, ''), source: q?.source === 'manual' ? 'manual' : q?.rateType === 'market' ? 'coingecko' : code === 'PAB' ? 'fixed' : 'ecb', date: q?.date ?? null }];
    });
  });

  readonly form = inject(FormBuilder).nonNullable.group({
    base: ['EUR', Validators.required],
    quote: [inject(HouseholdContextService).baseCurrency(), Validators.required],
    rateType: ['official', Validators.required],
    rate: ['', Validators.required],
  });

  async ngOnInit() {
    try {
      await Promise.all([this.rates.ensureLoaded(), this.accounts.load()]);
    } finally {
      this.loading.set(false);
    }
  }

  money(rate: string, quote: string) {
    return formatMoney(rate, { ...this.currencies.get(quote), decimals: quote === 'ARS' && Number(rate) < 10 ? 4 : 2 });
  }

  async setUsd(type: string) {
    await this.rates.setUsdRateType(type);
    this.snack.open(this.transloco.translate('rates.saved'), undefined, { duration: 3000 });
  }

  async addManual() {
    const v = this.form.getRawValue();
    const rate = parseDecimalInput(v.rate);
    if (!rate || compareDecimals(rate, '0') <= 0 || v.base === v.quote) return;
    await this.rates.addManual({ base: v.base, quote: v.quote, rateType: v.rateType, date: todayIso(), rate });
    this.form.controls.rate.reset('');
    this.snack.open(this.transloco.translate('rates.manualSaved'), undefined, { duration: 3000 });
  }

  removeManual(r: ManualRate) {
    return this.rates.removeManual(r);
  }
}
