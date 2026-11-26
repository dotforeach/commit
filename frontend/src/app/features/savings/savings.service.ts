import { HttpClient } from '@angular/common/http';
import { OfflineCacheService } from '../../core/offline/offline-cache.service';
import { Injectable, effect, inject, signal, untracked } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { v7 as uuidv7 } from 'uuid';
import { KeyVaultService } from '../../core/crypto/key-vault.service';
import { HouseholdContextService } from '../../core/households/household-context.service';
import type { TransactionPayload } from '../transactions/transaction.model';
import { TransactionsService } from '../transactions/transactions.service';
import { cashAmount, type Trade } from './savings-math';
import type { Asset, AssetClass, Contribution, Deposit, DepositPayload, Goal, GoalDraft, GoalPayload, InvestmentTrade, ManualPrice, TradeType } from './savings.models';

interface Sealed {
  payload: string;
  keyVersion: number;
}
interface GoalDto extends Omit<Goal, keyof GoalPayload | 'contributions'>, Sealed {
  contributions: ({ id: string; date: string } & Sealed)[];
}
type DepositDto = Omit<Deposit, keyof DepositPayload> & Sealed;
interface InvestmentsDto {
  assets: ({ id: string; householdId: string | null; assetClass: AssetClass; currency: string; symbol: string | null; name: string | null; payload: string | null; keyVersion: number | null })[];
  prices: ({ id: string; assetId: string; date: string } & Sealed)[];
  trades: ({ id: string; accountId: string; assetId: string; cashTransactionId: string | null; type: TradeType; date: string } & Sealed)[];
}

/** Metas, plazos fijos e inversiones del hogar activo (todo cifrado salvo fechas, tipos y monedas). */
@Injectable({ providedIn: 'root' })
export class SavingsService {
  private readonly offlineCache = inject(OfflineCacheService);
  private readonly http = inject(HttpClient);
  private readonly hh = inject(HouseholdContextService);
  private readonly transactions = inject(TransactionsService);

  readonly goals = signal<Goal[]>([]);
  readonly deposits = signal<Deposit[]>([]);
  readonly assets = signal<Asset[]>([]);
  readonly prices = signal<ManualPrice[]>([]);
  readonly trades = signal<InvestmentTrade[]>([]);
  private loaded = false;

  constructor() {
    const vault = inject(KeyVaultService);
    effect(() => {
      // Al bloquear o cambiar de hogar, los datos descifrados no quedan en memoria.
      vault.generation();
      untracked(() => {
        for (const s of [this.goals, this.deposits, this.assets, this.prices, this.trades]) (s as ReturnType<typeof signal<unknown[]>>).set([]);
        this.loaded = false;
      });
    });
  }

  private url(path: string) {
    return `/api/households/${this.hh.requireHousehold().id}/${path}`;
  }

  async ensureLoaded() {
    if (this.loaded) return;
    const [g, d, inv] = await Promise.all([
      this.offlineCache.cached(this.url('goals'), () => firstValueFrom(this.http.get<{ items: GoalDto[] }>(this.url('goals')))),
      this.offlineCache.cached(this.url('deposits'), () => firstValueFrom(this.http.get<{ items: DepositDto[] }>(this.url('deposits')))),
      this.offlineCache.cached(this.url('investments'), () => firstValueFrom(this.http.get<InvestmentsDto>(this.url('investments')))),
    ]);
    this.goals.set(await Promise.all(g.items.map((x) => this.openGoal(x))));
    this.deposits.set(await Promise.all(d.items.map((x) => this.openDeposit(x))));
    this.assets.set(
      await Promise.all(
        inv.assets.map(async (a) => {
          const p = a.payload
            ? await this.hh.open<{ symbol: string; name: string }>('assets', a.id, a.payload, a.keyVersion!)
            : { symbol: a.symbol ?? '', name: a.name ?? '' };
          return { id: a.id, assetClass: a.assetClass, currency: a.currency, symbol: p.symbol, name: p.name };
        }),
      ),
    );
    this.prices.set(await Promise.all(inv.prices.map(async (p) => ({ id: p.id, assetId: p.assetId, date: p.date, ...(await this.hh.open<{ price: string }>('manual_asset_prices', p.id, p.payload, p.keyVersion)) }))));
    this.trades.set(
      await Promise.all(
        inv.trades.map(async (t) => ({
          id: t.id,
          accountId: t.accountId,
          assetId: t.assetId,
          cashTransactionId: t.cashTransactionId,
          type: t.type,
          date: t.date,
          ...(await this.hh.open<{ quantity: string; unitPrice: string; fees: string; notes: string | null }>('investment_transactions', t.id, t.payload, t.keyVersion)),
        })),
      ),
    );
    this.loaded = true;
  }

  // ── Metas ──
  async saveGoal(draft: GoalDraft, existing?: Goal) {
    const id = existing?.id ?? uuidv7();
    const payload: GoalPayload = { name: draft.name, targetAmount: draft.targetAmount, monthsOfExpenses: draft.monthsOfExpenses };
    const body = {
      accountId: draft.accountId,
      kind: draft.kind,
      currency: draft.currency,
      targetDate: draft.targetDate,
      priority: draft.priority,
      status: draft.status,
      ...(await this.hh.seal('savings_goals', id, payload)),
    };
    const dto = existing
      ? await firstValueFrom(this.http.put<GoalDto>(this.url(`goals/${id}`), { expectedRevision: existing.revision, ...body }))
      : await firstValueFrom(this.http.post<GoalDto>(this.url('goals'), { id, ...body }));
    this.upsert(this.goals, await this.openGoal(dto));
  }

  async removeGoal(goal: Goal) {
    await firstValueFrom(this.http.delete(this.url(`goals/${goal.id}`), { params: { expectedRevision: goal.revision } }));
    this.goals.update((l) => l.filter((g) => g.id !== goal.id));
  }

  async contribute(goal: Goal, amount: string, date: string, note: string | null) {
    const id = uuidv7();
    const body = { id, date, ...(await this.hh.seal('goal_contributions', id, { amount, note })) };
    this.upsert(this.goals, await this.openGoal(await firstValueFrom(this.http.post<GoalDto>(this.url(`goals/${goal.id}/contributions`), body))));
  }

  // ── Plazos fijos ──
  async createDeposit(d: Omit<Deposit, 'id' | 'revision' | 'status'>, description: string) {
    const id = uuidv7();
    const txId = uuidv7();
    const tx: TransactionPayload = { amount: d.principal, description, notes: null };
    const body = {
      id,
      accountId: d.accountId,
      currency: d.currency,
      rateType: d.rateType,
      startDate: d.startDate,
      maturityDate: d.maturityDate,
      autoRenew: d.autoRenew,
      ...(await this.hh.seal('fixed_term_deposits', id, { institution: d.institution, principal: d.principal, annualRate: d.annualRate })),
      transaction: { id: txId, categoryId: null, ...(await this.hh.seal('transactions', txId, tx)) },
    };
    this.upsert(this.deposits, await this.openDeposit(await firstValueFrom(this.http.post<DepositDto>(this.url('deposits'), body))));
    await this.transactions.load();
  }

  /** Cobro: vuelve el capital y el interés entra como ingreso. */
  async collect(d: Deposit, date: string, interest: string, incomeCategoryId: string | null, description: string) {
    const pid = uuidv7();
    const iid = uuidv7();
    const principal: TransactionPayload = { amount: d.principal, description, notes: null };
    const income: TransactionPayload = { amount: interest, description, notes: null };
    const body = {
      expectedRevision: d.revision,
      date,
      principal: { id: pid, categoryId: null, ...(await this.hh.seal('transactions', pid, principal)) },
      interest: Number(interest) > 0 ? { id: iid, categoryId: incomeCategoryId, ...(await this.hh.seal('transactions', iid, income)) } : null,
    };
    this.upsert(this.deposits, await this.openDeposit(await firstValueFrom(this.http.post<DepositDto>(this.url(`deposits/${d.id}/collect`), body))));
    await this.transactions.load();
  }

  async removeDeposit(d: Deposit) {
    await firstValueFrom(this.http.delete(this.url(`deposits/${d.id}`), { params: { expectedRevision: d.revision } }));
    this.deposits.update((l) => l.filter((x) => x.id !== d.id));
  }

  // ── Inversiones ──
  async createAsset(a: Omit<Asset, 'id'>) {
    const id = uuidv7();
    await firstValueFrom(this.http.post(this.url('investments/assets'), { id, assetClass: a.assetClass, currency: a.currency, ...(await this.hh.seal('assets', id, { symbol: a.symbol, name: a.name, market: null })) }));
    this.assets.update((l) => [...l, { id, ...a }]);
    return id;
  }

  async addPrice(assetId: string, date: string, price: string) {
    const id = uuidv7();
    await firstValueFrom(this.http.post(this.url('investments/prices'), { id, assetId, date, ...(await this.hh.seal('manual_asset_prices', id, { price })) }));
    this.prices.update((l) => [...l, { id, assetId, date, price }]);
  }

  /** Operación + movimiento de efectivo en la cuenta de inversión. */
  async addTrade(t: Omit<InvestmentTrade, 'id' | 'cashTransactionId'>, description: string, incomeCategoryId: string | null) {
    const id = uuidv7();
    const cashId = uuidv7();
    const trade: Trade = { assetId: t.assetId, type: t.type, date: t.date, quantity: Number(t.quantity), unitPrice: Number(t.unitPrice), fees: Number(t.fees) };
    const amount = String(cashAmount(trade));
    const cash: TransactionPayload = { amount, description, notes: t.notes };
    const isIncome = t.type === 'DIVIDEND' || t.type === 'INTEREST';
    const body = {
      id,
      accountId: t.accountId,
      assetId: t.assetId,
      type: t.type,
      date: t.date,
      ...(await this.hh.seal('investment_transactions', id, { quantity: t.quantity, unitPrice: t.unitPrice, fees: t.fees, notes: t.notes })),
      cash: { id: cashId, categoryId: isIncome ? incomeCategoryId : null, ...(await this.hh.seal('transactions', cashId, cash)) },
    };
    await firstValueFrom(this.http.post(this.url('investments/trades'), body));
    this.trades.update((l) => [...l, { ...t, id, cashTransactionId: cashId }]);
    await this.transactions.load();
  }

  async removeTrade(t: InvestmentTrade) {
    await firstValueFrom(this.http.delete(this.url(`investments/trades/${t.id}`)));
    this.trades.update((l) => l.filter((x) => x.id !== t.id));
    await this.transactions.load();
  }

  lastPrice(assetId: string): ManualPrice | undefined {
    return this.prices()
      .filter((p) => p.assetId === assetId)
      .sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id))[0];
  }

  // ── helpers ──
  private upsert<T extends { id: string }>(s: ReturnType<typeof signal<T[]>>, item: T) {
    s.update((l) => [...l.filter((x) => x.id !== item.id), item]);
  }

  private async openGoal(dto: GoalDto): Promise<Goal> {
    const p = await this.hh.open<GoalPayload>('savings_goals', dto.id, dto.payload, dto.keyVersion);
    const contributions: Contribution[] = await Promise.all(
      dto.contributions.map(async (c) => ({ id: c.id, date: c.date, ...(await this.hh.open<{ amount: string; note: string | null }>('goal_contributions', c.id, c.payload, c.keyVersion)) })),
    );
    const { payload: _p, keyVersion: _k, contributions: _c, ...meta } = dto;
    return { ...meta, ...p, contributions };
  }

  private async openDeposit(dto: DepositDto): Promise<Deposit> {
    const p = await this.hh.open<DepositPayload>('fixed_term_deposits', dto.id, dto.payload, dto.keyVersion);
    const { payload: _p, keyVersion: _k, ...meta } = dto;
    return { ...meta, ...p };
  }
}
