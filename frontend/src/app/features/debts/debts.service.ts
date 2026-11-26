import { HttpClient } from '@angular/common/http';
import { Injectable, effect, inject, signal, untracked } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { v7 as uuidv7 } from 'uuid';
import { KeyVaultService } from '../../core/crypto/key-vault.service';
import { HouseholdContextService } from '../../core/households/household-context.service';
import type { TransactionPayload } from '../transactions/transaction.model';
import { TransactionsService } from '../transactions/transactions.service';
import { outstandingBalance } from './debt-math';
import type { Debt, DebtDraft, DebtDto, DebtPayload, PaymentDraft, PaymentPayload } from './debt.model';

@Injectable({ providedIn: 'root' })
export class DebtsService {
  private readonly http = inject(HttpClient);
  private readonly household = inject(HouseholdContextService);
  private readonly transactions = inject(TransactionsService);
  private readonly state = signal<Debt[]>([]);
  private loaded = false;

  readonly debts = this.state.asReadonly();

  constructor() {
    const vault = inject(KeyVaultService);
    effect(() => {
      // Al bloquear o cambiar de hogar, los datos descifrados no quedan en memoria.
      vault.generation();
      untracked(() => {
        this.state.set([]);
        this.loaded = false;
      });
    });
  }

  private base() {
    return `/api/households/${this.household.requireHousehold().id}/debts`;
  }

  balance(d: Debt): string {
    return outstandingBalance(d.originalAmount, d.payments);
  }

  async ensureLoaded() {
    if (this.loaded) return;
    await this.load();
  }

  async load() {
    const { items } = await firstValueFrom(this.http.get<{ items: DebtDto[] }>(this.base()));
    this.state.set(await Promise.all(items.map((dto) => this.decrypt(dto))));
    this.loaded = true;
  }

  async create(draft: DebtDraft) {
    const id = uuidv7();
    this.upsert(await this.decrypt(await firstValueFrom(this.http.post<DebtDto>(this.base(), { id, ...(await this.encrypt(id, draft)) }))));
  }

  async update(debt: Debt, draft: DebtDraft) {
    const body = { expectedRevision: debt.revision, ...(await this.encrypt(debt.id, draft)) };
    this.upsert(await this.decrypt(await firstValueFrom(this.http.put<DebtDto>(`${this.base()}/${debt.id}`, body))));
  }

  async remove(debt: Debt) {
    await firstValueFrom(this.http.delete(`${this.base()}/${debt.id}`, { params: { expectedRevision: debt.revision } }));
    this.state.update((l) => l.filter((d) => d.id !== debt.id));
  }

  /** Registra el pago (gasto en la cuenta + pago de la deuda) y recarga los movimientos. */
  async addPayment(debt: Debt, p: PaymentDraft) {
    const id = uuidv7();
    const txId = uuidv7();
    const paymentPayload: PaymentPayload = { amount: p.amount, principalPart: p.principalPart, interestPart: p.interestPart, feesPart: null };
    const txPayload: TransactionPayload = { amount: p.amount, description: p.description, notes: null };
    const body = {
      id,
      date: p.date,
      ...(await this.household.seal('debt_payments', id, paymentPayload)),
      transaction: { id: txId, accountId: p.accountId, categoryId: p.categoryId, ...(await this.household.seal('transactions', txId, txPayload)) },
    };
    this.upsert(await this.decrypt(await firstValueFrom(this.http.post<DebtDto>(`${this.base()}/${debt.id}/payments`, body))));
    await this.transactions.load();
  }

  async removePayment(debt: Debt, paymentId: string) {
    this.upsert(await this.decrypt(await firstValueFrom(this.http.delete<DebtDto>(`${this.base()}/${debt.id}/payments/${paymentId}`))));
    await this.transactions.load();
  }

  private upsert(d: Debt) {
    this.state.update((l) => [...l.filter((x) => x.id !== d.id), d]);
  }

  private async encrypt(id: string, d: DebtDraft) {
    const payload: DebtPayload = {
      name: d.name,
      lender: d.lender,
      originalAmount: d.originalAmount,
      annualRate: d.annualRate,
      indexName: d.indexName,
      minimumPayment: d.minimumPayment,
    };
    return {
      accountId: d.accountId,
      kind: d.kind,
      currency: d.currency,
      rateType: d.rateType,
      amortization: d.amortization,
      termMonths: d.termMonths,
      startDate: d.startDate,
      paymentDay: d.paymentDay,
      status: d.status,
      ...(await this.household.seal('debts', id, payload)),
    };
  }

  private async decrypt(dto: DebtDto): Promise<Debt> {
    const p = await this.household.open<DebtPayload>('debts', dto.id, dto.payload, dto.keyVersion);
    const payments = await Promise.all(
      dto.payments.map(async (x) => ({
        id: x.id,
        transactionId: x.transactionId,
        date: x.date,
        ...(await this.household.open<PaymentPayload>('debt_payments', x.id, x.payload, x.keyVersion)),
      })),
    );
    const { payload: _p, keyVersion: _k, payments: _pp, ...meta } = dto;
    return { ...meta, ...p, payments };
  }
}
