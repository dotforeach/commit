import { HttpClient } from '@angular/common/http';
import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { v7 as uuidv7 } from 'uuid';
import { KeyVaultService } from '../../core/crypto/key-vault.service';
import { HouseholdContextService } from '../../core/households/household-context.service';
import { AccountsService } from '../accounts/accounts.service';
import { buildLedger, computeBalances } from './ledger';
import type { Transaction, TransactionDto, TransactionPayload, TransactionType } from './transaction.model';

/** Datos de un movimiento simple (ingreso, gasto o ajuste). */
export interface SingleDraft {
  type: Exclude<TransactionType, 'TRANSFER_IN' | 'TRANSFER_OUT'>;
  accountId: string;
  categoryId: string | null;
  date: string;
  amount: string;
  description: string;
  notes: string | null;
}

/** Transferencia: lo que sale de una cuenta y lo que entra en otra (montos distintos si cambian de moneda). */
export interface TransferDraft {
  fromAccountId: string;
  toAccountId: string;
  date: string;
  amountOut: string;
  amountIn: string;
  description: string;
  notes: string | null;
}

interface Page {
  items: TransactionDto[];
  hasMore: boolean;
  nextSince: string | null;
}

/**
 * Movimientos del hogar activo. Se descargan todos (cifrados) y se descifran en memoria:
 * saldos, totales y filtros se calculan acá, nunca en el servidor.
 */
@Injectable({ providedIn: 'root' })
export class TransactionsService {
  private readonly http = inject(HttpClient);
  private readonly household = inject(HouseholdContextService);
  private readonly accounts = inject(AccountsService);
  private readonly state = signal<Transaction[]>([]);
  private loaded = false;

  readonly loading = signal(false);
  readonly transactions = this.state.asReadonly();
  readonly ledger = computed(() => buildLedger(this.state()));
  readonly balances = computed(() => computeBalances(this.accounts.accounts(), this.state()));

  constructor() {
    const vault = inject(KeyVaultService);
    effect(() => {
      if (!vault.isUnlocked()) {
        this.state.set([]);
        this.loaded = false;
      }
    });
  }

  private base() {
    return `/api/households/${this.household.requireHousehold().id}/transactions`;
  }

  async ensureLoaded(): Promise<void> {
    if (!this.loaded) await this.load();
  }

  async load(): Promise<void> {
    this.loading.set(true);
    try {
      const all: TransactionDto[] = [];
      let since = '0';
      for (;;) {
        const page = await firstValueFrom(this.http.get<Page>(this.base(), { params: { since, limit: 1000 } }));
        all.push(...page.items);
        if (!page.hasMore || !page.nextSince) break;
        since = page.nextSince;
      }
      this.state.set(await Promise.all(all.map((dto) => this.decrypt(dto))));
      this.loaded = true;
    } finally {
      this.loading.set(false);
    }
  }

  async createSingle(d: SingleDraft): Promise<void> {
    const id = uuidv7();
    const item = await this.encrypt(id, { ...d, transferGroupId: null });
    await this.save('post', [item]);
  }

  async createTransfer(d: TransferDraft): Promise<void> {
    const group = uuidv7();
    await this.save('post', await this.transferLegs(d, group, uuidv7(), uuidv7()));
  }

  async updateSingle(existing: Transaction, d: SingleDraft): Promise<void> {
    const item = await this.encrypt(existing.id, { ...d, transferGroupId: null });
    await this.save('put', [{ ...item, expectedRevision: existing.revision }]);
  }

  async updateTransfer(out: Transaction, inn: Transaction, d: TransferDraft): Promise<void> {
    const [o, i] = await this.transferLegs(d, out.transferGroupId!, out.id, inn.id);
    await this.save('put', [
      { ...o, expectedRevision: out.revision },
      { ...i, expectedRevision: inn.revision },
    ]);
  }

  /** Incorpora movimientos que creó otro flujo (p. ej. ocurrencias de recurrentes). */
  async ingest(dtos: TransactionDto[]): Promise<void> {
    if (!this.loaded) return; // se verán en la próxima carga completa
    const added = await Promise.all(dtos.map((dto) => this.decrypt(dto)));
    const ids = new Set(added.map((t) => t.id));
    this.state.update((list) => [...list.filter((t) => !ids.has(t.id)), ...added]);
  }

  /** Borra un movimiento (o la transferencia entera). */
  async remove(t: Transaction): Promise<void> {
    await firstValueFrom(this.http.delete(`${this.base()}/${t.id}`, { params: { expectedRevision: t.revision } }));
    this.state.update((list) =>
      list.filter((x) => (t.transferGroupId ? x.transferGroupId !== t.transferGroupId : x.id !== t.id)),
    );
  }

  private async transferLegs(d: TransferDraft, group: string, outId: string, inId: string) {
    const common = { categoryId: null, date: d.date, description: d.description, notes: d.notes, transferGroupId: group };
    return Promise.all([
      this.encrypt(outId, { ...common, type: 'TRANSFER_OUT', accountId: d.fromAccountId, amount: d.amountOut }),
      this.encrypt(inId, { ...common, type: 'TRANSFER_IN', accountId: d.toAccountId, amount: d.amountIn }),
    ]);
  }

  private async save(method: 'post' | 'put', items: object[]) {
    const res = await firstValueFrom(this.http.request<Page>(method, this.base(), { body: { items } }));
    const saved = await Promise.all(res.items.map((dto) => this.decrypt(dto)));
    const ids = new Set(saved.map((t) => t.id));
    this.state.update((list) => [...list.filter((t) => !ids.has(t.id)), ...saved]);
  }

  private async encrypt(
    id: string,
    d: { type: TransactionType; accountId: string; categoryId: string | null; date: string; transferGroupId: string | null } & TransactionPayload,
  ) {
    const payload: TransactionPayload = { amount: d.amount, description: d.description, notes: d.notes };
    return {
      id,
      accountId: d.accountId,
      categoryId: d.categoryId,
      type: d.type,
      status: 'CLEARED',
      date: d.date,
      transferGroupId: d.transferGroupId,
      ...(await this.household.seal('transactions', id, payload)),
    };
  }

  private async decrypt(dto: TransactionDto): Promise<Transaction> {
    const p = await this.household.open<TransactionPayload>('transactions', dto.id, dto.payload, dto.keyVersion);
    return {
      ...p,
      id: dto.id,
      accountId: dto.accountId,
      categoryId: dto.categoryId,
      type: dto.type,
      status: dto.status,
      date: dto.date,
      transferGroupId: dto.transferGroupId,
      createdById: dto.createdById,
      recurringRuleId: dto.recurringRuleId,
      installmentPlanId: dto.installmentPlanId ?? null,
      debtId: dto.debtId ?? null,
      revision: dto.revision,
    };
  }
}
