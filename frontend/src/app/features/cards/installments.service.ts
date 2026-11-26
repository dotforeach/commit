import { HttpClient } from '@angular/common/http';
import { OfflineCacheService } from '../../core/offline/offline-cache.service';
import { Injectable, effect, inject, signal, untracked } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { v7 as uuidv7 } from 'uuid';
import { KeyVaultService } from '../../core/crypto/key-vault.service';
import { HouseholdContextService } from '../../core/households/household-context.service';

import type { RequestBody } from '../../core/api/api-contract';
import type { TransactionPayload } from '../transactions/transaction.model';
import { TransactionsService } from '../transactions/transactions.service';
import { cycleFor, installmentMonths } from './card-cycle';

export interface Installment {
  id: string;
  number: number;
  dueMonth: string; // YYYY-MM-01
  amount: string;
}

export interface InstallmentPlan {
  id: string;
  creditCardId: string;
  transactionId: string;
  installmentsCount: number;
  interestFree: boolean;
  totalAmount: string;
  installmentAmount: string;
  installments: Installment[];
}

interface PlanDto {
  id: string;
  creditCardId: string;
  transactionId: string;
  installmentsCount: number;
  interestFree: boolean;
  payload: string;
  keyVersion: number;
  installments: { id: string; number: number; dueMonth: string; payload: string; keyVersion: number }[];
}

/**
 * Divide un total en N cuotas exactas a centavos: N−1 cuotas iguales (truncadas) y la última
 * absorbe la diferencia, así la suma da exactamente el total.
 */
export function splitInstallments(total: string, count: number): string[] {
  const [int, frac = ''] = total.split('.');
  const cents = BigInt(int) * 100n + BigInt((frac + '00').slice(0, 2));
  const each = cents / BigInt(count);
  const toStr = (c: bigint) => `${c / 100n}.${String(c % 100n).padStart(2, '0')}`.replace(/\.00$/, '').replace(/(\.\d)0$/, '$1');
  const parts = Array.from({ length: count - 1 }, () => toStr(each));
  parts.push(toStr(cents - each * BigInt(count - 1)));
  return parts;
}

@Injectable({ providedIn: 'root' })
export class InstallmentsService {
  private readonly offlineCache = inject(OfflineCacheService);
  private readonly http = inject(HttpClient);
  private readonly household = inject(HouseholdContextService);
  private readonly transactions = inject(TransactionsService);
  private readonly state = signal<InstallmentPlan[]>([]);
  private loaded = false;

  readonly plans = this.state.asReadonly();

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
    return `/api/households/${this.household.requireHousehold().id}/installment-plans`;
  }

  async ensureLoaded() {
    if (!this.loaded) await this.load();
  }

  async load() {
    const { items } = await this.offlineCache.cached(this.base(), () => firstValueFrom(this.http.get<{ items: PlanDto[] }>(this.base())));
    this.state.set(await Promise.all(items.map((dto) => this.decrypt(dto))));
    this.loaded = true;
  }

  /** Compra en cuotas: gasto total en la tarjeta + plan + una cuota por resumen. */
  async create(card: { id: string; closingDay: number; dueDay: number }, d: { date: string; total: string; count: number; categoryId: string | null; description: string; notes: string | null }) {
    const id = uuidv7();
    const txId = uuidv7();
    const months = installmentMonths(d.date, card.closingDay, d.count);
    const amounts = splitInstallments(d.total, d.count);
    const installments = await Promise.all(
      months.map(async (dueMonth, i) => {
        const iid = uuidv7();
        return { id: iid, number: i + 1, dueMonth, ...(await this.household.seal('card_installments', iid, { amount: amounts[i] })) };
      }),
    );
    const txPayload: TransactionPayload = { amount: d.total, description: d.description, notes: d.notes };
    const body = {
      id,
      creditCardId: card.id,
      installmentsCount: d.count,
      interestFree: true,
      firstStatementOn: cycleFor(months[0].slice(0, 7), card.closingDay, card.dueDay).closing,
      ...(await this.household.seal('installment_plans', id, { totalAmount: d.total, installmentAmount: amounts[0] })),
      transaction: { id: txId, categoryId: d.categoryId, date: d.date, ...(await this.household.seal('transactions', txId, txPayload)) },
      installments,
    } satisfies RequestBody<'/api/households/{householdId}/installment-plans', 'post'>;
    const dto = await firstValueFrom(this.http.post<PlanDto>(this.base(), body));
    const plan = await this.decrypt(dto);
    this.state.update((l) => [...l, plan]);
    await this.transactions.load();
  }

  /** Cuánto queda por pagar de un plan desde un mes (cuotas aún no facturadas). */
  remainingFrom(plan: InstallmentPlan, month: string) {
    return plan.installments.filter((i) => i.dueMonth.slice(0, 7) > month);
  }

  /** Tras borrar el movimiento de una compra en cuotas, el plan desaparece. */
  forgetByTransaction(transactionId: string) {
    this.state.update((l) => l.filter((p) => p.transactionId !== transactionId));
  }

  private async decrypt(dto: PlanDto): Promise<InstallmentPlan> {
    const p = await this.household.open<{ totalAmount: string; installmentAmount: string }>('installment_plans', dto.id, dto.payload, dto.keyVersion);
    const installments = await Promise.all(
      dto.installments.map(async (i) => ({
        id: i.id,
        number: i.number,
        dueMonth: i.dueMonth,
        ...(await this.household.open<{ amount: string }>('card_installments', i.id, i.payload, i.keyVersion)),
      })),
    );
    return { id: dto.id, creditCardId: dto.creditCardId, transactionId: dto.transactionId, installmentsCount: dto.installmentsCount, interestFree: dto.interestFree, ...p, installments };
  }
}

