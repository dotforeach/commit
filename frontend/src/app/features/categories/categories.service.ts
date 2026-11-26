import { HttpClient } from '@angular/common/http';
import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { KeyVaultService } from '../../core/crypto/key-vault.service';
import { HouseholdContextService } from '../../core/households/household-context.service';

export interface Category {
  id: string;
  parentId: string | null;
  kind: 'INCOME' | 'EXPENSE';
  budgetGroup: 'NEEDS' | 'WANTS' | 'SAVINGS' | null;
  systemKey: string | null;
  archived: boolean;
  name: string;
  icon: string | null;
  color: string | null;
}

interface CategoryDto extends Omit<Category, 'archived' | 'name' | 'icon' | 'color'> {
  archivedAt: string | null;
  payload: string;
  keyVersion: number;
}

/** Categorías del hogar activo, descifradas. */
@Injectable({ providedIn: 'root' })
export class CategoriesService {
  private readonly http = inject(HttpClient);
  private readonly household = inject(HouseholdContextService);
  private readonly state = signal<Category[]>([]);

  readonly categories = this.state.asReadonly();
  readonly byId = computed(() => new Map(this.state().map((c) => [c.id, c])));
  readonly expense = computed(() => this.sorted('EXPENSE'));
  readonly income = computed(() => this.sorted('INCOME'));

  constructor() {
    const vault = inject(KeyVaultService);
    effect(() => {
      if (!vault.isUnlocked()) this.state.set([]);
    });
  }

  async ensureLoaded(): Promise<void> {
    if (this.state().length > 0) return;
    const hid = this.household.requireHousehold().id;
    const { items } = await firstValueFrom(this.http.get<{ items: CategoryDto[] }>(`/api/households/${hid}/categories`));
    const categories = await Promise.all(
      items.map(async (dto) => {
        const p = await this.household.open<{ name: string; icon: string | null; color: string | null }>(
          'categories',
          dto.id,
          dto.payload,
          dto.keyVersion,
        );
        return {
          id: dto.id,
          parentId: dto.parentId,
          kind: dto.kind,
          budgetGroup: dto.budgetGroup,
          systemKey: dto.systemKey,
          archived: dto.archivedAt !== null,
          ...p,
        };
      }),
    );
    this.state.set(categories);
  }

  private sorted(kind: Category['kind']) {
    return this.state()
      .filter((c) => c.kind === kind && !c.archived)
      .sort((a, b) => a.name.localeCompare(b.name, 'es'));
  }
}
