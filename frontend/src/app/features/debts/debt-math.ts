import { addDecimals, subDecimals, ZERO } from '../../core/money/decimal';

/**
 * Cálculos de deudas. El SALDO es exacto (decimales). El cronograma y las simulaciones son
 * proyecciones: usan punto flotante y se redondean a centavos para mostrar.
 * Tasa: TNA como fracción (0.6 = 60% anual); interés mensual = TNA / 12 (convención argentina).
 */
export type Amortization = 'FRENCH' | 'GERMAN' | 'BULLET' | 'CUSTOM';

const round2 = (n: number) => Math.round(n * 100) / 100;
export const toMoney = (n: number) => round2(n).toFixed(2).replace(/\.?0+$/, '') || '0';

export function monthlyRate(annualRate: number): number {
  return annualRate / 12;
}

/** Cuota fija del sistema francés. */
export function frenchPayment(principal: number, annualRate: number, months: number): number {
  const r = monthlyRate(annualRate);
  if (r === 0) return principal / months;
  return (principal * r) / (1 - Math.pow(1 + r, -months));
}

export interface ScheduleRow {
  n: number;
  payment: number;
  interest: number;
  principal: number;
  balance: number;
}

/** Cronograma de pagos desde el saldo indicado (por defecto, el monto original). */
export function amortizationSchedule(principal: number, annualRate: number, months: number, system: Amortization): ScheduleRow[] {
  const r = monthlyRate(annualRate);
  const rows: ScheduleRow[] = [];
  let balance = principal;
  const french = frenchPayment(principal, annualRate, months);
  for (let n = 1; n <= months && balance > 0.005; n++) {
    const interest = balance * r;
    let principalPart: number;
    if (system === 'GERMAN') principalPart = principal / months;
    else if (system === 'BULLET') principalPart = n === months ? balance : 0;
    else principalPart = french - interest;
    if (n === months) principalPart = balance; // la última cuota cierra el saldo exacto
    balance -= principalPart;
    rows.push({ n, payment: round2(interest + principalPart), interest: round2(interest), principal: round2(principalPart), balance: round2(Math.max(balance, 0)) });
  }
  return rows;
}

/** Saldo exacto = monto original − capital pagado. */
export function outstandingBalance(originalAmount: string, payments: { principalPart: string | null; amount: string }[]): string {
  const paid = addDecimals(...payments.map((p) => p.principalPart ?? p.amount), ZERO);
  return subDecimals(originalAmount, paid);
}

/** Sugerencia de cuánto de un pago es interés (sobre el saldo actual) y cuánto capital. */
export function suggestSplit(balance: number, annualRate: number, amount: number): { interest: number; principal: number } {
  const interest = Math.min(round2(balance * monthlyRate(annualRate)), amount);
  return { interest, principal: round2(amount - interest) };
}

// ── Estrategias para salir de deudas ─────────────────────────────────────────

export interface StrategyDebt {
  id: string;
  balance: number;
  annualRate: number;
  minimumPayment: number;
}

export interface StrategyResult {
  months: number;
  totalInterest: number;
  /** Mes en que se termina de pagar cada deuda, en orden. */
  payoff: { id: string; month: number }[];
  /** No converge: los pagos no alcanzan a cubrir los intereses. */
  stuck: boolean;
}

/**
 * Simula mes a mes: se pagan todos los mínimos y el extra (más los mínimos de las deudas ya
 * saldadas: el efecto "bola de nieve") va a la deuda prioritaria.
 * - snowball: menor saldo primero (victorias rápidas, más motivación).
 * - avalanche: mayor tasa primero (menos intereses).
 */
export function simulatePayoff(debts: StrategyDebt[], extra: number, strategy: 'snowball' | 'avalanche', maxMonths = 600): StrategyResult {
  const state = debts.filter((d) => d.balance > 0.005).map((d) => ({ ...d }));
  const order = [...state].sort((a, b) =>
    strategy === 'snowball' ? a.balance - b.balance || b.annualRate - a.annualRate : b.annualRate - a.annualRate || a.balance - b.balance,
  );
  const budget = state.reduce((s, d) => s + d.minimumPayment, 0) + extra;
  const payoff: StrategyResult['payoff'] = [];
  let totalInterest = 0;
  let month = 0;
  while (state.some((d) => d.balance > 0.005) && month < maxMonths) {
    month++;
    for (const d of state) {
      if (d.balance <= 0.005) continue;
      const interest = d.balance * monthlyRate(d.annualRate);
      d.balance += interest;
      totalInterest += interest;
    }
    let available = budget;
    // Mínimos primero
    for (const d of state) {
      if (d.balance <= 0.005) continue;
      const pay = Math.min(d.minimumPayment, d.balance, available);
      d.balance -= pay;
      available -= pay;
    }
    // Lo que sobra, a la deuda prioritaria (y si se salda, a la siguiente)
    for (const target of order) {
      const d = state.find((x) => x.id === target.id)!;
      if (d.balance <= 0.005 || available <= 0) continue;
      const pay = Math.min(d.balance, available);
      d.balance -= pay;
      available -= pay;
    }
    for (const d of state) {
      if (d.balance <= 0.005 && !payoff.some((p) => p.id === d.id)) payoff.push({ id: d.id, month });
    }
  }
  return { months: month, totalInterest: round2(totalInterest), payoff, stuck: state.some((d) => d.balance > 0.005) };
}
