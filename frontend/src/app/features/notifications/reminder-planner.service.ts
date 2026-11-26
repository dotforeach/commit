import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { firstValueFrom } from 'rxjs';
import { v7 as uuidv7 } from 'uuid';
import { CurrenciesService } from '../../core/currencies/currencies.service';
import { todayIso } from '../../core/dates/dates';
import { nextOccurrence } from '../../core/dates/recurrence';
import { HouseholdContextService } from '../../core/households/household-context.service';
import { formatMoney } from '../../core/money/decimal';
import { AccountsService } from '../accounts/accounts.service';
import { estimateStatement } from '../cards/card-statement';
import { statementMonthOf, shiftMonth } from '../cards/card-cycle';
import { InstallmentsService } from '../cards/installments.service';
import { DebtsService } from '../debts/debts.service';
import { RecurringService } from '../recurring/recurring.service';
import { SavingsService } from '../savings/savings.service';
import { TransactionsService } from '../transactions/transactions.service';
import { planReminders, type PlannedReminder } from './reminder-plan';

/**
 * Programa en el servidor los recordatorios de los próximos días (texto cifrado; el servidor solo
 * conoce la fecha). Es idempotente: no repite los que ya están programados para la misma fuente y hora.
 */
@Injectable({ providedIn: 'root' })
export class ReminderPlannerService {
  private readonly http = inject(HttpClient);
  private readonly hh = inject(HouseholdContextService);
  private readonly accounts = inject(AccountsService);
  private readonly transactions = inject(TransactionsService);
  private readonly installments = inject(InstallmentsService);
  private readonly debts = inject(DebtsService);
  private readonly savings = inject(SavingsService);
  private readonly recurring = inject(RecurringService);
  private readonly currencies = inject(CurrenciesService);
  private readonly t = inject(TranslocoService);
  private running: Promise<number> | null = null;

  plan(): Promise<number> {
    this.running ??= this.run().finally(() => (this.running = null));
    return this.running;
  }

  private async run(): Promise<number> {
    if (!this.hh.canWrite()) return 0;
    await Promise.all([this.installments.ensureLoaded(), this.debts.ensureLoaded(), this.savings.ensureLoaded(), this.recurring.ensureLoaded()]);
    const hid = this.hh.requireHousehold().id;
    const today = todayIso();
    const money = (a: string, c: string) => formatMoney(a, this.currencies.get(c));

    const cards = this.accounts
      .active()
      .filter((a) => a.type === 'CREDIT_CARD' && a.creditCard)
      .map((a) => {
        const card = { id: a.id, closingDay: a.creditCard!.closingDay, dueDay: a.creditCard!.dueDay };
        const closed = estimateStatement(card, shiftMonth(statementMonthOf(today, card.closingDay), -1), this.transactions.transactions(), this.installments.plans());
        return { id: a.id, name: a.name, due: closed.cycle.due, amount: closed.due, label: money(closed.due, a.currency) };
      });
    const debts = this.debts
      .debts()
      .filter((d) => d.status === 'ACTIVE' && d.paymentDay)
      .map((d) => ({ id: d.id, name: d.name, paymentDay: d.paymentDay!, amount: d.minimumPayment ? money(d.minimumPayment, d.currency) : null }));
    const deposits = this.savings
      .deposits()
      .filter((d) => d.status === 'ACTIVE')
      .map((d) => ({ id: d.id, name: d.institution, maturity: d.maturityDate }));
    const rules = this.recurring
      .rules()
      .filter((r) => r.active && !r.autoPost)
      .map((r) => ({ id: r.id, name: r.description, next: r.nextRunOn, following: nextOccurrence(r, r.nextRunOn) }));

    const planned = planReminders({ today, cards, debts, deposits, rules }, (key, params) => this.t.translate(`reminders.${key}`, params));
    const { items: existing } = await firstValueFrom(this.http.get<{ items: { sourceId: string | null; remindAt: string }[] }>(`/api/households/${hid}/reminders`));
    const already = new Set(existing.map((e) => `${e.sourceId}|${new Date(e.remindAt).toISOString()}`));
    let created = 0;
    for (const r of planned) {
      if (already.has(`${r.sourceId}|${r.remindAt.toISOString()}`)) continue;
      const id = uuidv7();
      const sealed = await this.hh.seal('reminders', id, { title: r.title, body: r.body, link: r.link });
      await firstValueFrom(this.http.post(`/api/households/${hid}/reminders`, { id, sourceId: r.sourceId, remindAt: r.remindAt.toISOString(), ...sealed }));
      created++;
    }
    return created;
  }
}

export type { PlannedReminder };
