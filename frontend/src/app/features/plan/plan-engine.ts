import { monthlyRate, simulatePayoff } from '../debts/debt-math';
import type { RateType } from '../debts/debt.model';

/**
 * Plan mágico: qué hacer con la plata del mes, en orden de prioridad. Se calcula en el navegador
 * con los datos descifrados (nada sale del dispositivo). Montos en la moneda principal del hogar.
 *
 * Escalera: 1) mínimos (no caer en mora) · 2) total de las tarjetas · 3) mini fondo de emergencia
 * (1 mes de gastos) · 4) adelantar deudas caras (avalancha; con tasas parecidas, la de menor saldo)
 * · 5) fondo completo (3 meses) · 6) metas con fecha · 7) invertir lo que sobra.
 */
export interface PlanDebt {
  id: string;
  name: string;
  balance: number;
  /** TNA como fracción. */
  annualRate: number;
  rateType: RateType;
  minimumPayment: number;
  paymentDay: number | null;
  /** En la moneda principal: le afecta la inflación que ingresó la persona. */
  inflationExposed: boolean;
}

export interface PlanInput {
  avgIncome: number;
  /** Gasto mensual promedio SIN los pagos de deudas (esos los decide el plan). */
  avgLivingExpenses: number;
  /** Gasto mensual promedio total (para dimensionar el fondo de emergencia, como en Progreso). */
  avgExpenses: number;
  emergencySaved: number;
  debts: PlanDebt[];
  cards: { accountId: string; name: string; due: number; dueDate: string }[];
  goals: { id: string; name: string; monthlyNeeded: number | null; targetDate: string | null }[];
  /** Inflación mensual esperada (fracción, 0.03 = 3%); null si no se cargó. */
  monthlyInflation: number | null;
}

export type PlanStep =
  | { kind: 'minimums'; amount: number; items: { debtId: string; name: string; amount: number; paymentDay: number | null }[] }
  | { kind: 'shortfall'; amount: number }
  | { kind: 'cards'; amount: number; items: { accountId: string; name: string; due: number; dueDate: string }[] }
  | { kind: 'miniFund'; amount: number; target: number; saved: number }
  | { kind: 'prepay'; amount: number; debtId: string; name: string; effectiveRate: number }
  | { kind: 'dontPrepay'; amount: 0; items: { debtId: string; name: string; realRate: number }[] }
  | { kind: 'fullFund'; amount: number; target: number; saved: number }
  | { kind: 'goal'; amount: number; goalId: string; name: string }
  | { kind: 'invest'; amount: number };

export interface PlanResult {
  /** Lo que queda por mes para deudas y ahorro: ingresos menos gastos de vida. */
  capacity: number;
  steps: PlanStep[];
  /** Comparación "solo mínimos" vs. el plan (null si no hay deudas o no hay extra). */
  impact: { baseline: { months: number; interest: number; stuck: boolean }; plan: { months: number; interest: number; stuck: boolean } } | null;
  /** Faltan datos para recomendar (sin ingresos registrados). */
  needsData: boolean;
}

const round2 = (n: number) => Math.round(n * 100) / 100;
/** Tasas a menos de 2 puntos se consideran parecidas: primero la de menor saldo (se cancela antes). */
const SIMILAR_RATE = 0.02;
const MINI_FUND_MONTHS = 1;
const FULL_FUND_MONTHS = 3;

/**
 * Costo real anual de una deuda (lo que se ahorra por cada peso que se adelanta):
 * - indexada (UVA/CER): la tasa ya es real (por encima de la inflación);
 * - fija o variable en la moneda principal, con inflación cargada: (1 + i/12) / (1 + π) − 1, anualizado;
 * - en otra moneda o sin inflación: la tasa nominal.
 */
export function effectiveRate(d: Pick<PlanDebt, 'annualRate' | 'rateType' | 'inflationExposed'>, monthlyInflation: number | null): number {
  if (!d.inflationExposed || monthlyInflation === null) return d.annualRate;
  if (d.rateType === 'INDEXED') return d.annualRate;
  return ((1 + monthlyRate(d.annualRate)) / (1 + monthlyInflation) - 1) * 12;
}

export function buildPlan(input: PlanInput): PlanResult {
  const capacity = round2(input.avgIncome - input.avgLivingExpenses);
  const steps: PlanStep[] = [];
  const active = input.debts.filter((d) => d.balance > 0.005);
  if (input.avgIncome <= 0) return { capacity, steps, impact: null, needsData: true };

  let left = capacity;
  const take = (want: number) => {
    const amount = round2(Math.max(Math.min(want, left), 0));
    left = round2(left - amount);
    return amount;
  };

  // 1) Mínimos, por día de pago
  const minimums = active
    .filter((d) => d.minimumPayment > 0)
    .map((d) => ({ debtId: d.id, name: d.name, amount: round2(Math.min(d.minimumPayment, d.balance)), paymentDay: d.paymentDay }))
    .sort((a, b) => (a.paymentDay ?? 99) - (b.paymentDay ?? 99));
  const minTotal = round2(minimums.reduce((s, m) => s + m.amount, 0));
  if (minimums.length > 0) steps.push({ kind: 'minimums', amount: minTotal, items: minimums });
  if (minTotal > left) {
    steps.push({ kind: 'shortfall', amount: round2(minTotal - Math.max(left, 0)) });
    left = 0;
  } else {
    left = round2(left - minTotal);
  }

  // 2) Tarjetas: pagar el TOTAL (los consumos ya están en los gastos; no restan capacidad)
  const cards = input.cards.filter((c) => c.due > 0.005).sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  if (cards.length > 0) steps.push({ kind: 'cards', amount: round2(cards.reduce((s, c) => s + c.due, 0)), items: cards });

  // 3) Mini fondo de emergencia
  const miniTarget = round2(input.avgExpenses * MINI_FUND_MONTHS);
  if (input.emergencySaved < miniTarget) {
    const amount = take(miniTarget - input.emergencySaved);
    if (amount > 0) steps.push({ kind: 'miniFund', amount, target: miniTarget, saved: input.emergencySaved });
  }

  // 4) Adelantar deudas: solo las que cuestan de verdad (costo real > 0)
  const rated = active.map((d) => ({ d, rate: effectiveRate(d, input.monthlyInflation) }));
  const worth = rated.filter((x) => x.rate > 0).sort((a, b) => (Math.abs(a.rate - b.rate) < SIMILAR_RATE ? a.d.balance - b.d.balance : b.rate - a.rate));
  const notWorth = rated.filter((x) => x.rate <= 0);
  const prepayOrder: string[] = [];
  let prepayTotal = 0;
  for (const { d, rate } of worth) {
    const pending = d.balance - Math.min(d.minimumPayment, d.balance);
    const amount = take(pending);
    if (amount <= 0) break;
    prepayOrder.push(d.id);
    prepayTotal += amount;
    steps.push({ kind: 'prepay', amount, debtId: d.id, name: d.name, effectiveRate: rate });
  }
  if (notWorth.length > 0 && input.monthlyInflation !== null) {
    steps.push({ kind: 'dontPrepay', amount: 0, items: notWorth.map(({ d, rate }) => ({ debtId: d.id, name: d.name, realRate: rate })) });
  }

  // 5) Fondo completo
  const fullTarget = round2(input.avgExpenses * FULL_FUND_MONTHS);
  const savedSoFar = input.emergencySaved + (steps.find((s) => s.kind === 'miniFund')?.amount ?? 0);
  if (savedSoFar < fullTarget) {
    const amount = take(fullTarget - savedSoFar);
    if (amount > 0) steps.push({ kind: 'fullFund', amount, target: fullTarget, saved: savedSoFar });
  }

  // 6) Metas con fecha, la más próxima primero
  for (const g of [...input.goals].filter((g) => g.monthlyNeeded).sort((a, b) => (a.targetDate ?? '9999').localeCompare(b.targetDate ?? '9999'))) {
    const amount = take(g.monthlyNeeded!);
    if (amount > 0) steps.push({ kind: 'goal', amount, goalId: g.id, name: g.name });
  }

  // 7) Lo que sobra
  if (left > 0) steps.push({ kind: 'invest', amount: take(left) });

  const sim = active.map((d) => ({ id: d.id, balance: d.balance, annualRate: d.annualRate, minimumPayment: d.minimumPayment }));
  const impact =
    active.length > 0 && prepayTotal > 0
      ? {
          baseline: pick(simulatePayoff(sim, 0, [])),
          plan: pick(simulatePayoff(sim, prepayTotal, prepayOrder)),
        }
      : null;
  return { capacity, steps, impact, needsData: false };
}

const pick = (r: ReturnType<typeof simulatePayoff>) => ({ months: r.months, interest: round2(r.totalInterest), stuck: r.stuck });
