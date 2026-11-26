/**
 * Cálculo de ocurrencias de reglas recurrentes sobre fechas ISO ("YYYY-MM-DD"),
 * con aritmética en UTC para que la zona horaria nunca corra un día.
 */
export type Frequency = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';

export interface RecurrenceRule {
  frequency: Frequency;
  interval: number;
  /** Solo mensual: día del mes (si el mes es más corto, cae el último día). */
  dayOfMonth: number | null;
  startDate: string;
  endDate: string | null;
}

const parse = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  return { y, m, d };
};
const format = (y: number, m: number, d: number) =>
  `${String(y).padStart(4, '0')}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
const daysInMonth = (y: number, m: number) => new Date(Date.UTC(y, m, 0)).getUTCDate();

function addDays(iso: string, days: number): string {
  const { y, m, d } = parse(iso);
  const t = new Date(Date.UTC(y, m - 1, d + days));
  return format(t.getUTCFullYear(), t.getUTCMonth() + 1, t.getUTCDate());
}

/** Mes `m` (1-12) del año `y` desplazado `delta` meses. */
function shiftMonth(y: number, m: number, delta: number) {
  const total = y * 12 + (m - 1) + delta;
  return { y: Math.floor(total / 12), m: (total % 12) + 1 };
}

/** Primera ocurrencia en o después de la fecha de inicio. */
export function firstOccurrence(rule: RecurrenceRule): string {
  if (rule.frequency !== 'MONTHLY' || rule.dayOfMonth === null) return rule.startDate;
  const { y, m, d } = parse(rule.startDate);
  const thisMonth = Math.min(rule.dayOfMonth, daysInMonth(y, m));
  if (thisMonth >= d) return format(y, m, thisMonth);
  const next = shiftMonth(y, m, 1);
  return format(next.y, next.m, Math.min(rule.dayOfMonth, daysInMonth(next.y, next.m)));
}

/** La ocurrencia siguiente a `date` (que debe ser una ocurrencia de la regla). */
export function nextOccurrence(rule: RecurrenceRule, date: string): string {
  const { y, m } = parse(date);
  switch (rule.frequency) {
    case 'DAILY':
      return addDays(date, rule.interval);
    case 'WEEKLY':
      return addDays(date, 7 * rule.interval);
    case 'MONTHLY': {
      const next = shiftMonth(y, m, rule.interval);
      const day = rule.dayOfMonth ?? parse(rule.startDate).d;
      return format(next.y, next.m, Math.min(day, daysInMonth(next.y, next.m)));
    }
    case 'YEARLY': {
      const start = parse(rule.startDate);
      const year = y + rule.interval;
      return format(year, start.m, Math.min(start.d, daysInMonth(year, start.m)));
    }
  }
}

export interface DueOccurrences {
  /** Fechas vencidas (≤ hoy) a registrar o confirmar. */
  dates: string[];
  /** Próxima fecha pendiente después de las vencidas. */
  next: string;
  /** La regla terminó (la próxima fecha queda después de la fecha de fin). */
  finished: boolean;
}

/** Ocurrencias vencidas desde `nextRunOn` hasta `today` inclusive, con tope para no explotar tras años sin abrir. */
export function dueOccurrences(rule: RecurrenceRule, nextRunOn: string, today: string, max = 24): DueOccurrences {
  const dates: string[] = [];
  let cursor = nextRunOn;
  while (cursor <= today && (rule.endDate === null || cursor <= rule.endDate) && dates.length < max) {
    dates.push(cursor);
    cursor = nextOccurrence(rule, cursor);
  }
  return { dates, next: cursor, finished: rule.endDate !== null && cursor > rule.endDate };
}
