import { Injectable, computed, inject } from '@angular/core';
import { todayIso } from '../../core/dates/dates';
import { HouseholdContextService } from '../../core/households/household-context.service';
import { AccountsService } from '../accounts/accounts.service';
import { DebtsService } from '../debts/debts.service';
import { RatesService } from '../rates/rates.service';
import { computeHoldings } from '../savings/savings-math';
import { SavingsService } from '../savings/savings.service';
import { TransactionsService } from '../transactions/transactions.service';
import { computeNetWorth, type NetWorthItem } from './net-worth';

const CRYPTO = new Set(['BTC', 'ETH', 'USDT', 'USDC']);

/** Patrimonio neto del hogar en su moneda principal, con lo que haya cargado en cada módulo. */
@Injectable({ providedIn: 'root' })
export class NetWorthService {
  private readonly hh = inject(HouseholdContextService);
  private readonly accounts = inject(AccountsService);
  private readonly transactions = inject(TransactionsService);
  private readonly savings = inject(SavingsService);
  private readonly debts = inject(DebtsService);
  private readonly rates = inject(RatesService);

  /** Último precio de un activo: el manual de hoy, si no la cotización pública (cripto), si no el último manual. */
  readonly priceOf = computed(() => {
    const converter = this.rates.converter();
    const today = todayIso();
    return (assetId: string): number | null => {
      const asset = this.savings.assets().find((a) => a.id === assetId);
      const manual = this.savings.lastPrice(assetId);
      if (manual && manual.date >= today) return Number(manual.price);
      if (asset && CRYPTO.has(asset.symbol)) {
        const auto = converter.rate(asset.symbol, asset.currency);
        if (auto !== null) return auto;
      }
      return manual ? Number(manual.price) : null;
    };
  });

  readonly holdings = computed(() => {
    const priceOf = this.priceOf();
    const trades = this.savings.trades().map((t) => ({ assetId: t.assetId, type: t.type, date: t.date, quantity: Number(t.quantity), unitPrice: Number(t.unitPrice), fees: Number(t.fees) }));
    return computeHoldings(trades, priceOf);
  });

  readonly netWorth = computed(() => {
    const items: NetWorthItem[] = [];
    const balances = this.transactions.balances();
    for (const a of this.accounts.active()) {
      if (!a.includeInNetWorth) continue;
      const b = balances.get(a.id);
      if (!b) continue;
      items.push({ kind: 'account', label: a.name, currency: a.currency, amount: (b.isDebt ? -1 : 1) * Number(b.amount) });
    }
    for (const d of this.savings.deposits()) {
      if (d.status === 'ACTIVE') items.push({ kind: 'deposit', label: d.institution, currency: d.currency, amount: Number(d.principal) });
    }
    for (const h of this.holdings()) {
      const asset = this.savings.assets().find((a) => a.id === h.assetId);
      if (!asset || h.quantity <= 0) continue;
      items.push({ kind: 'investment', label: asset.symbol, currency: asset.currency, amount: h.marketValue ?? h.costBasis });
    }
    for (const d of this.debts.debts()) {
      // Si la deuda tiene una cuenta de préstamo vinculada, ya está en las cuentas.
      if (d.status !== 'ACTIVE' || d.accountId) continue;
      items.push({ kind: 'debt', label: d.name, currency: d.currency, amount: -Number(this.debts.balance(d)) });
    }
    return computeNetWorth(items, this.hh.baseCurrency(), this.rates.converter());
  });

  async ensureLoaded() {
    await Promise.all([this.accounts.load(), this.transactions.ensureLoaded(), this.savings.ensureLoaded(), this.debts.ensureLoaded(), this.rates.ensureLoaded()]);
  }
}
