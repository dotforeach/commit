import { addDecimals, ZERO } from '../../core/money/decimal';
import type { Transaction } from '../transactions/transaction.model';

const round2 = (n: number) => Math.round(n * 100) / 100;
const DAY = 86_400_000;
const utc = (iso: string) => Date.parse(`${iso}T00:00:00Z`);
export const daysBetween = (from: string, to: string) => Math.round((utc(to) - utc(from)) / DAY);

// ── Metas ────────────────────────────────────────────────────────────────────
export interface GoalProgress {
  ratio: number; // 0..1+
  remaining: number;
  monthsLeft: number | null;
  monthlyNeeded: number | null;
  reached: boolean;
}

/** Avance de una meta y cuánto hay que ahorrar por mes para llegar a la fecha. */
export function goalProgress(target: number, current: number, targetDate: string | null, today: string): GoalProgress {
  const remaining = round2(Math.max(target - current, 0));
  let monthsLeft: number | null = null;
  if (targetDate) {
    const [ty, tm] = targetDate.split('-').map(Number);
    const [y, m, d] = today.split('-').map(Number);
    const td = Number(targetDate.slice(8));
    monthsLeft = Math.max((ty - y) * 12 + (tm - m) + (td >= d ? 0 : -1), 0);
  }
  return {
    ratio: target > 0 ? current / target : 0,
    remaining,
    monthsLeft,
    monthlyNeeded: monthsLeft === null || remaining === 0 ? null : round2(remaining / Math.max(monthsLeft, 1)),
    reached: current >= target && target > 0,
  };
}

/** Gasto mensual promedio de los últimos `months` meses COMPLETOS (sin el actual), en una moneda. Exacto. */
export function averageMonthlyExpenses(
  transactions: Transaction[],
  currencyOf: (accountId: string) => string | undefined,
  currency: string,
  today: string,
  months = 3,
): { average: string; monthsWithData: number } {
  const [y, m] = today.split('-').map(Number);
  const keys = Array.from({ length: months }, (_, i) => {
    const t = y * 12 + (m - 1) - (i + 1);
    return `${Math.floor(t / 12)}-${String((t % 12) + 1).padStart(2, '0')}`;
  });
  const byMonth = new Map(keys.map((k) => [k, [] as string[]]));
  for (const t of transactions) {
    if (t.type !== 'EXPENSE' || currencyOf(t.accountId) !== currency) continue;
    byMonth.get(t.date.slice(0, 7))?.push(t.amount);
  }
  const totals = keys.map((k) => addDecimals(ZERO, ...byMonth.get(k)!));
  const withData = totals.filter((x) => x !== '0').length;
  if (withData === 0) return { average: '0', monthsWithData: 0 };
  const sum = addDecimals(...totals);
  // promedio sobre los meses con datos, redondeado a centavos
  return { average: String(round2(Number(sum) / withData)), monthsWithData: withData };
}

// ── Plazo fijo ───────────────────────────────────────────────────────────────
export interface DepositProjection {
  days: number;
  interest: number;
  total: number;
  daysLeft: number;
  matured: boolean;
}

/** Interés simple sobre TNA, base 365 días (convención de los bancos argentinos). */
export function depositProjection(principal: number, annualRate: number, start: string, maturity: string, today: string): DepositProjection {
  const days = daysBetween(start, maturity);
  const interest = round2((principal * annualRate * days) / 365);
  const daysLeft = Math.max(daysBetween(today, maturity), 0);
  return { days, interest, total: round2(principal + interest), daysLeft, matured: today >= maturity };
}

// ── Inversiones ──────────────────────────────────────────────────────────────
export interface Trade {
  assetId: string;
  type: 'BUY' | 'SELL' | 'DIVIDEND' | 'INTEREST' | 'FEE';
  date: string;
  quantity: number;
  unitPrice: number;
  fees: number;
}

export interface Holding {
  assetId: string;
  quantity: number;
  costBasis: number;
  avgCost: number;
  lastPrice: number | null;
  marketValue: number | null;
  unrealized: number | null;
  realized: number;
  income: number;
}

/**
 * Tenencias por costo promedio ponderado. Compras suman cantidad y costo (con comisiones);
 * ventas realizan la diferencia contra el costo promedio; dividendos e intereses son renta.
 */
export function computeHoldings(trades: Trade[], lastPriceOf: (assetId: string) => number | null): Holding[] {
  const map = new Map<string, Holding>();
  const sorted = [...trades].sort((a, b) => a.date.localeCompare(b.date));
  for (const t of sorted) {
    const h = map.get(t.assetId) ?? { assetId: t.assetId, quantity: 0, costBasis: 0, avgCost: 0, lastPrice: null, marketValue: null, unrealized: null, realized: 0, income: 0 };
    switch (t.type) {
      case 'BUY':
        h.costBasis += t.quantity * t.unitPrice + t.fees;
        h.quantity += t.quantity;
        break;
      case 'SELL': {
        const avg = h.quantity > 0 ? h.costBasis / h.quantity : 0;
        const qty = Math.min(t.quantity, h.quantity);
        h.realized += qty * t.unitPrice - t.fees - avg * qty;
        h.costBasis -= avg * qty;
        h.quantity -= qty;
        break;
      }
      case 'DIVIDEND':
      case 'INTEREST':
        h.income += t.quantity * t.unitPrice - t.fees;
        break;
      case 'FEE':
        h.realized -= t.quantity * t.unitPrice + t.fees;
        break;
    }
    map.set(t.assetId, h);
  }
  return [...map.values()].map((h) => {
    const quantity = Math.round(h.quantity * 1e10) / 1e10;
    const lastPrice = lastPriceOf(h.assetId);
    const marketValue = lastPrice === null ? null : round2(quantity * lastPrice);
    return {
      ...h,
      quantity,
      costBasis: round2(h.costBasis),
      avgCost: quantity > 0 ? h.costBasis / quantity : 0,
      lastPrice,
      marketValue,
      unrealized: marketValue === null ? null : round2(marketValue - h.costBasis),
      realized: round2(h.realized),
      income: round2(h.income),
    };
  });
}

/** Monto en efectivo que mueve una operación (siempre positivo). */
export function cashAmount(t: Pick<Trade, 'type' | 'quantity' | 'unitPrice' | 'fees'>): number {
  const gross = t.quantity * t.unitPrice;
  if (t.type === 'BUY') return round2(gross + t.fees);
  if (t.type === 'FEE') return round2(gross + t.fees);
  return round2(gross - t.fees);
}
