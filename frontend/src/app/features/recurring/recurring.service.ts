import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, computed, effect, inject, signal, untracked } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { v7 as uuidv7 } from 'uuid';
import { KeyVaultService } from '../../core/crypto/key-vault.service';
import { todayIso } from '../../core/dates/dates';
import { dueOccurrences, firstOccurrence, nextOccurrence, type RecurrenceRule } from '../../core/dates/recurrence';
import { HouseholdContextService } from '../../core/households/household-context.service';
import type { TransactionDto, TransactionPayload } from '../transactions/transaction.model';
import { TransactionsService } from '../transactions/transactions.service';
import type { PendingOccurrence, RecurringRule, RuleDraft, RuleDto, RulePayload } from './recurring.model';

/** Primera ocurrencia de la regla en o después de `date`. */
function firstOnOrAfter(rule: RecurrenceRule, date: string): string {
  let d = firstOccurrence(rule);
  for (let i = 0; d < date && i < 5000; i++) d = nextOccurrence(rule, d);
  return d;
}

const scheduleOf = (r: Pick<RecurringRule, 'frequency' | 'interval' | 'dayOfMonth' | 'startDate' | 'endDate'>): RecurrenceRule => ({
  frequency: r.frequency,
  interval: r.interval,
  dayOfMonth: r.dayOfMonth,
  startDate: r.startDate,
  endDate: r.endDate,
});

/**
 * Movimientos recurrentes. El servidor no conoce los montos, así que las ocurrencias las genera
 * el navegador; el endpoint de ocurrencias garantiza que se registren una sola vez.
 */
@Injectable({ providedIn: 'root' })
export class RecurringService {
  private readonly http = inject(HttpClient);
  private readonly household = inject(HouseholdContextService);
  private readonly transactions = inject(TransactionsService);
  private readonly state = signal<RecurringRule[]>([]);
  private loaded = false;
  private processing: Promise<number> | null = null;

  readonly rules = this.state.asReadonly();

  /** Por cada regla con confirmación, su ocurrencia vencida más vieja (se confirman en orden). */
  readonly pending = computed<PendingOccurrence[]>(() => {
    const today = todayIso();
    return this.state()
      .filter((r) => r.active && !r.autoPost)
      .flatMap((rule) => {
        const { dates } = dueOccurrences(scheduleOf(rule), rule.nextRunOn, today);
        return dates.length > 0 ? [{ rule, date: dates[0], more: dates.length - 1 }] : [];
      })
      .sort((a, b) => a.date.localeCompare(b.date));
  });

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
    return `/api/households/${this.household.requireHousehold().id}/recurring-rules`;
  }

  async load(): Promise<void> {
    const { items } = await firstValueFrom(this.http.get<{ items: RuleDto[] }>(this.base()));
    this.state.set(await Promise.all(items.map((dto) => this.decrypt(dto))));
    this.loaded = true;
  }

  async ensureLoaded(): Promise<void> {
    if (!this.loaded) await this.load();
  }

  async create(draft: RuleDraft): Promise<void> {
    const id = uuidv7();
    const nextRunOn = firstOccurrence(scheduleOf(draft));
    const dto = await firstValueFrom(this.http.post<RuleDto>(this.base(), { id, ...(await this.encrypt(id, draft, nextRunOn)) }));
    this.upsert(await this.decrypt(dto));
  }

  async update(rule: RecurringRule, draft: RuleDraft): Promise<void> {
    const scheduleChanged = JSON.stringify(scheduleOf(rule)) !== JSON.stringify(scheduleOf(draft));
    // Si cambió el calendario, se retoma desde hoy (no se cargan de golpe fechas pasadas).
    const nextRunOn = scheduleChanged ? firstOnOrAfter(scheduleOf(draft), todayIso()) : rule.nextRunOn;
    const body = { expectedRevision: rule.revision, ...(await this.encrypt(rule.id, draft, nextRunOn)) };
    this.upsert(await this.decrypt(await firstValueFrom(this.http.put<RuleDto>(`${this.base()}/${rule.id}`, body))));
  }

  /** Pausar o reanudar. Al reanudar se retoma desde hoy. */
  async setActive(rule: RecurringRule, active: boolean): Promise<void> {
    const draft: RuleDraft = { ...rule, active };
    const nextRunOn = active ? firstOnOrAfter(scheduleOf(rule), todayIso()) : rule.nextRunOn;
    const body = { expectedRevision: rule.revision, ...(await this.encrypt(rule.id, draft, nextRunOn)) };
    this.upsert(await this.decrypt(await firstValueFrom(this.http.put<RuleDto>(`${this.base()}/${rule.id}`, body))));
  }

  async remove(rule: RecurringRule): Promise<void> {
    await firstValueFrom(this.http.delete(`${this.base()}/${rule.id}`, { params: { expectedRevision: rule.revision } }));
    this.state.update((list) => list.filter((r) => r.id !== rule.id));
  }

  /**
   * Registra las ocurrencias vencidas de las reglas automáticas. Devuelve cuántos movimientos creó.
   * Si otro dispositivo ya las registró (409), recarga y no duplica.
   */
  processDue(): Promise<number> {
    this.processing ??= this.runDue().finally(() => (this.processing = null));
    return this.processing;
  }

  /** Confirma la ocurrencia pendiente más vieja de una regla (con el monto que indique el usuario). */
  confirm(p: PendingOccurrence, amount: string): Promise<void> {
    return this.postOne(p, amount);
  }

  /** Omite una ocurrencia pendiente (no se registra, la regla avanza). */
  skip(p: PendingOccurrence): Promise<void> {
    return this.postOne(p, null);
  }

  private async runDue(): Promise<number> {
    await this.ensureLoaded();
    const today = todayIso();
    let created = 0;
    for (const rule of this.state().filter((r) => r.active && r.autoPost)) {
      const due = dueOccurrences(scheduleOf(rule), rule.nextRunOn, today);
      if (due.dates.length === 0) continue;
      try {
        created += await this.post(rule, due.dates, rule.amount, due.next, !due.finished);
      } catch (e) {
        if (e instanceof HttpErrorResponse && e.status === 409) {
          await Promise.all([this.load(), this.transactions.load()]);
          return created;
        }
        throw e;
      }
    }
    return created;
  }

  private async postOne({ rule, date }: PendingOccurrence, amount: string | null) {
    const next = nextOccurrence(scheduleOf(rule), date);
    const finished = rule.endDate !== null && next > rule.endDate;
    try {
      await this.post(rule, amount === null ? [] : [date], amount ?? rule.amount, next, !finished);
    } catch (e) {
      if (e instanceof HttpErrorResponse && e.status === 409) await this.load();
      throw e;
    }
  }

  private async post(rule: RecurringRule, dates: string[], amount: string, nextRunOn: string, active: boolean) {
    const transactions = await Promise.all(
      dates.map(async (date) => {
        const id = uuidv7();
        const payload: TransactionPayload = { amount, description: rule.description, notes: null };
        return { id, date, ...(await this.household.seal('transactions', id, payload)) };
      }),
    );
    const res = await firstValueFrom(
      this.http.post<{ rule: RuleDto; transactions: TransactionDto[] }>(`${this.base()}/${rule.id}/occurrences`, {
        expectedRevision: rule.revision,
        nextRunOn,
        active,
        transactions,
      }),
    );
    this.upsert(await this.decrypt(res.rule));
    await this.transactions.ingest(res.transactions);
    return res.transactions.length;
  }

  private upsert(rule: RecurringRule) {
    this.state.update((list) => [...list.filter((r) => r.id !== rule.id), rule].sort((a, b) => a.nextRunOn.localeCompare(b.nextRunOn)));
  }

  private async encrypt(id: string, d: RuleDraft, nextRunOn: string) {
    const payload: RulePayload = { amount: d.amount, description: d.description };
    return {
      accountId: d.accountId,
      categoryId: d.categoryId,
      type: d.type,
      frequency: d.frequency,
      interval: d.interval,
      dayOfMonth: d.frequency === 'MONTHLY' ? d.dayOfMonth : null,
      startDate: d.startDate,
      endDate: d.endDate,
      nextRunOn,
      autoPost: d.autoPost,
      isSalary: d.type === 'INCOME' && d.isSalary,
      active: d.active,
      ...(await this.household.seal('recurring_rules', id, payload)),
    };
  }

  private async decrypt(dto: RuleDto): Promise<RecurringRule> {
    const p = await this.household.open<RulePayload>('recurring_rules', dto.id, dto.payload, dto.keyVersion);
    const { payload: _payload, keyVersion: _keyVersion, ...meta } = dto;
    return { ...meta, ...p };
  }
}
