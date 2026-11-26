import { HttpClient } from '@angular/common/http';
import { Injectable, effect, inject, signal, untracked } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { v7 as uuidv7 } from 'uuid';
import { KeyVaultService } from '../../core/crypto/key-vault.service';
import { HouseholdContextService } from '../../core/households/household-context.service';
import type { Budget, BudgetDraft, BudgetDto } from './budget.model';

/** Presupuestos del hogar (uno por mes). Montos e ingreso esperado van cifrados. */
@Injectable({ providedIn: 'root' })
export class BudgetsService {
  private readonly http = inject(HttpClient);
  private readonly household = inject(HouseholdContextService);
  private readonly state = signal<Budget[]>([]);
  private loaded = false;

  readonly budgets = this.state.asReadonly();

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
    return `/api/households/${this.household.requireHousehold().id}/budgets`;
  }

  async ensureLoaded() {
    if (this.loaded) return;
    const { items } = await firstValueFrom(this.http.get<{ items: BudgetDto[] }>(this.base()));
    this.state.set(await Promise.all(items.map((dto) => this.decrypt(dto))));
    this.loaded = true;
  }

  find(year: number, month: number): Budget | undefined {
    return this.state().find((b) => b.year === year && b.month === month);
  }

  /** El presupuesto más reciente anterior al mes dado (para copiarlo). */
  latestBefore(year: number, month: number): Budget | undefined {
    const key = year * 12 + month;
    return this.state()
      .filter((b) => b.year * 12 + b.month < key)
      .sort((a, b) => b.year * 12 + b.month - (a.year * 12 + a.month))[0];
  }

  async create(year: number, month: number, draft: BudgetDraft): Promise<Budget> {
    const id = uuidv7();
    const body = { id, year, month, ...(await this.encrypt(id, draft, false)) };
    return this.upsert(await this.decrypt(await firstValueFrom(this.http.post<BudgetDto>(this.base(), body))));
  }

  async update(budget: Budget, draft: BudgetDraft): Promise<Budget> {
    const body = { expectedRevision: budget.revision, ...(await this.encrypt(budget.id, draft, true)) };
    return this.upsert(await this.decrypt(await firstValueFrom(this.http.put<BudgetDto>(`${this.base()}/${budget.id}`, body))));
  }

  /** Copia otro presupuesto a este mes (ítems nuevos: cada payload se cifra con su propio ID). */
  copy(from: Budget, year: number, month: number): Promise<Budget> {
    return this.create(year, month, {
      method: from.method,
      currency: from.currency,
      expectedIncome: from.expectedIncome,
      items: from.items.map(({ categoryId, amount, rollover, alertThreshold }) => ({ categoryId, amount, rollover, alertThreshold })),
    });
  }

  async remove(budget: Budget): Promise<void> {
    await firstValueFrom(this.http.delete(`${this.base()}/${budget.id}`, { params: { expectedRevision: budget.revision } }));
    this.state.update((list) => list.filter((b) => b.id !== budget.id));
  }

  private upsert(b: Budget) {
    this.state.update((list) => [...list.filter((x) => x.id !== b.id), b]);
    return b;
  }

  private async encrypt(id: string, d: BudgetDraft, keepItemIds: boolean) {
    const sealed = await this.household.seal('budgets', id, { expectedIncome: d.expectedIncome });
    const items = await Promise.all(
      d.items.map(async (i) => {
        const itemId = (keepItemIds && i.id) || uuidv7();
        return {
          id: itemId,
          categoryId: i.categoryId,
          rollover: i.rollover,
          alertThreshold: i.alertThreshold,
          ...(await this.household.seal('budget_items', itemId, { amount: i.amount })),
        };
      }),
    );
    return { method: d.method, currency: d.currency, ...sealed, items };
  }

  private async decrypt(dto: BudgetDto): Promise<Budget> {
    const { expectedIncome } = await this.household.open<{ expectedIncome: string | null }>('budgets', dto.id, dto.payload, dto.keyVersion);
    const items = await Promise.all(
      dto.items.map(async (i) => {
        const { amount } = await this.household.open<{ amount: string }>('budget_items', i.id, i.payload, i.keyVersion);
        return { id: i.id, categoryId: i.categoryId, rollover: i.rollover, alertThreshold: i.alertThreshold, amount, revision: i.revision };
      }),
    );
    return { id: dto.id, year: dto.year, month: dto.month, method: dto.method, currency: dto.currency, revision: dto.revision, expectedIncome, items };
  }
}
