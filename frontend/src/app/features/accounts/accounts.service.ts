import { HttpClient } from '@angular/common/http';
import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { v7 as uuidv7 } from 'uuid';
import { KeyVaultService } from '../../core/crypto/key-vault.service';
import { HouseholdContextService } from '../../core/households/household-context.service';
import type { Account, AccountDraft, AccountDto, AccountPayload, CreditCardPayload } from './account.model';

/**
 * Cuentas del hogar activo. Cifra antes de enviar y descifra al recibir:
 * el servidor solo ve tipo, moneda y días de cierre/vencimiento.
 */
@Injectable({ providedIn: 'root' })
export class AccountsService {
  private readonly http = inject(HttpClient);
  private readonly household = inject(HouseholdContextService);

  private readonly state = signal<Account[]>([]);
  readonly loading = signal(false);
  readonly accounts = this.state.asReadonly();
  readonly active = computed(() => this.state().filter((a) => !a.archived));
  readonly archived = computed(() => this.state().filter((a) => a.archived));

  constructor() {
    // Al bloquear la bóveda, los datos descifrados no pueden quedar en memoria.
    const vault = inject(KeyVaultService);
    effect(() => {
      if (!vault.isUnlocked()) this.clear();
    });
  }

  private base() {
    return `/api/households/${this.household.requireHousehold().id}/accounts`;
  }

  async load(): Promise<void> {
    this.loading.set(true);
    try {
      const { items } = await firstValueFrom(this.http.get<{ items: AccountDto[] }>(this.base()));
      this.state.set(await Promise.all(items.map((dto) => this.decrypt(dto))));
    } finally {
      this.loading.set(false);
    }
  }

  async create(draft: AccountDraft): Promise<Account> {
    const id = uuidv7();
    const dto = await firstValueFrom(this.http.post<AccountDto>(this.base(), { id, ...(await this.encrypt(id, draft)) }));
    const account = await this.decrypt(dto);
    this.state.update((list) => [...list, account]);
    return account;
  }

  async update(account: Account, draft: AccountDraft, archived = account.archived): Promise<Account> {
    const body = { expectedRevision: account.revision, archived, ...(await this.encrypt(account.id, draft)) };
    const dto = await firstValueFrom(this.http.put<AccountDto>(`${this.base()}/${account.id}`, body));
    const updated = await this.decrypt(dto);
    this.state.update((list) => list.map((a) => (a.id === updated.id ? updated : a)));
    return updated;
  }

  setArchived(account: Account, archived: boolean) {
    return this.update(account, toDraft(account), archived);
  }

  async remove(account: Account): Promise<void> {
    await firstValueFrom(
      this.http.delete(`${this.base()}/${account.id}`, { params: { expectedRevision: account.revision } }),
    );
    this.state.update((list) => list.filter((a) => a.id !== account.id));
  }

  clear() {
    this.state.set([]);
  }

  private async encrypt(id: string, draft: AccountDraft) {
    const payload: AccountPayload = {
      name: draft.name,
      initialBalance: draft.initialBalance,
      institution: draft.institution,
      color: draft.color,
      icon: draft.icon,
      includeInNetWorth: draft.includeInNetWorth,
    };
    const sealed = await this.household.seal('accounts', id, payload);
    let creditCard = null;
    if (draft.type === 'CREDIT_CARD' && draft.creditCard) {
      const { closingDay, dueDay, network, lastFour, creditLimit } = draft.creditCard;
      const cardPayload: CreditCardPayload = { network, lastFour, creditLimit };
      creditCard = { closingDay, dueDay, ...(await this.household.seal('credit_cards', id, cardPayload)) };
    }
    return { ownerUserId: draft.ownerUserId, type: draft.type, currency: draft.currency, ...sealed, creditCard };
  }

  private async decrypt(dto: AccountDto): Promise<Account> {
    const payload = await this.household.open<AccountPayload>('accounts', dto.id, dto.payload, dto.keyVersion);
    let creditCard: Account['creditCard'] = null;
    if (dto.creditCard) {
      const card = await this.household.open<CreditCardPayload>(
        'credit_cards',
        dto.id,
        dto.creditCard.payload,
        dto.creditCard.keyVersion,
      );
      creditCard = { ...card, closingDay: dto.creditCard.closingDay, dueDay: dto.creditCard.dueDay };
    }
    return {
      ...payload,
      id: dto.id,
      ownerUserId: dto.ownerUserId,
      type: dto.type,
      currency: dto.currency,
      archived: dto.archivedAt !== null,
      revision: dto.revision,
      creditCard,
    };
  }
}

export function toDraft(a: Account): AccountDraft {
  const { id: _id, revision: _revision, archived: _archived, ...draft } = a;
  return draft;
}
