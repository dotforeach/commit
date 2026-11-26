/**
 * Ciclo de la tarjeta de crédito sobre fechas ISO (en UTC, sin corrimientos).
 * Una compra entra en el resumen que cierra en su mes si es hasta el día de cierre; si no, en el siguiente.
 */
const pad = (n: number) => String(n).padStart(2, '0');
const daysIn = (y: number, m: number) => new Date(Date.UTC(y, m, 0)).getUTCDate();
const iso = (y: number, m: number, d: number) => `${y}-${pad(m)}-${pad(d)}`;

function shift(y: number, m: number, delta: number) {
  const t = y * 12 + (m - 1) + delta;
  return { y: Math.floor(t / 12), m: (t % 12) + 1 };
}

/** Fecha de cierre del resumen de ese mes (si el mes es corto, el último día). */
export function closingDate(year: number, month: number, closingDay: number): string {
  return iso(year, month, Math.min(closingDay, daysIn(year, month)));
}

/** Mes del resumen ("YYYY-MM") en el que entra un consumo de esa fecha. */
export function statementMonthOf(date: string, closingDay: number): string {
  const [y, m] = date.split('-').map(Number);
  if (date <= closingDate(y, m, closingDay)) return `${y}-${pad(m)}`;
  const n = shift(y, m, 1);
  return `${n.y}-${pad(n.m)}`;
}

export interface Cycle {
  month: string; // YYYY-MM del cierre
  start: string; // día siguiente al cierre anterior
  closing: string;
  due: string;
}

/** Ciclo completo del resumen que cierra en `month`. El vencimiento es el primer `dueDay` posterior al cierre. */
export function cycleFor(month: string, closingDay: number, dueDay: number): Cycle {
  const [y, m] = month.split('-').map(Number);
  const closing = closingDate(y, m, closingDay);
  const prev = shift(y, m, -1);
  const prevClosing = closingDate(prev.y, prev.m, closingDay);
  const startDate = new Date(`${prevClosing}T00:00:00Z`);
  startDate.setUTCDate(startDate.getUTCDate() + 1);
  const dueSameMonth = Math.min(dueDay, daysIn(y, m));
  const next = shift(y, m, 1);
  const due = dueSameMonth > Number(closing.slice(8)) ? iso(y, m, dueSameMonth) : iso(next.y, next.m, Math.min(dueDay, daysIn(next.y, next.m)));
  return { month, start: startDate.toISOString().slice(0, 10), closing, due };
}

/** Meses de resumen ("YYYY-MM-01") de cada cuota de una compra en `count` cuotas. */
export function installmentMonths(purchaseDate: string, closingDay: number, count: number): string[] {
  const [y, m] = statementMonthOf(purchaseDate, closingDay).split('-').map(Number);
  return Array.from({ length: count }, (_, i) => {
    const s = shift(y, m, i);
    return iso(s.y, s.m, 1);
  });
}

export function shiftMonth(month: string, delta: number): string {
  const [y, m] = month.split('-').map(Number);
  const s = shift(y, m, delta);
  return `${s.y}-${pad(s.m)}`;
}
