import type { Frequency } from '../../core/dates/recurrence';

/** Contenido cifrado de una regla. */
export interface RulePayload {
  amount: string;
  description: string;
}

export interface RuleDto {
  id: string;
  accountId: string;
  categoryId: string | null;
  type: 'INCOME' | 'EXPENSE';
  frequency: Frequency;
  interval: number;
  dayOfMonth: number | null;
  startDate: string;
  endDate: string | null;
  nextRunOn: string;
  autoPost: boolean;
  isSalary: boolean;
  active: boolean;
  payload: string;
  keyVersion: number;
  revision: string;
}

export interface RecurringRule extends Omit<RuleDto, 'payload' | 'keyVersion'>, RulePayload {}

/** Datos del formulario. La próxima fecha la calcula el servicio. */
export type RuleDraft = Omit<RecurringRule, 'id' | 'revision' | 'nextRunOn'>;

/** La ocurrencia vencida más vieja de una regla que espera confirmación (se confirman en orden). */
export interface PendingOccurrence {
  rule: RecurringRule;
  date: string;
  /** Cuántas más quedan pendientes después de esta. */
  more: number;
}
