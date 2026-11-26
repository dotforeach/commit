/**
 * "De 0 a 100": puntaje de salud financiera, ruta de niveles y tips, calculados en el navegador
 * a partir de un resumen de las finanzas (todo en la moneda principal del hogar).
 */
export interface FinanceSnapshot {
  /** Promedios mensuales de los últimos 3 meses completos. */
  avgIncome: number;
  avgExpenses: number;
  /** Lo acumulado en metas de fondo de emergencia. */
  emergencySaved: number;
  hasEmergencyGoal: boolean;
  /** Cuotas/pagos mínimos mensuales de deudas activas. */
  monthlyDebtPayments: number;
  highRateDebts: number;
  /** Ítems del presupuesto del mes: total y excedidos (null si no hay presupuesto). */
  budget: { items: number; over: number } | null;
  /** Meses (de los últimos 3 completos) con al menos un movimiento. */
  monthsRecorded: number;
  accounts: number;
  transactions: number;
  hasIncomeSource: boolean;
  /** Plata líquida (efectivo, cuentas, billeteras) sin invertir. */
  liquidCash: number;
  /** Clases de inversión con valor (contando plazos fijos como una). */
  investmentClasses: number;
  investedValue: number;
  onboardingDone: boolean;
}

export type ComponentKey = 'savings' | 'emergency' | 'debt' | 'budget' | 'consistency';
export interface ScoreComponent {
  key: ComponentKey;
  points: number;
  max: number;
  /** Valor medido (tasa, meses, ratio…), para explicar el puntaje. */
  value: number | null;
}
export interface HealthScore {
  score: number;
  components: ScoreComponent[];
}

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const pts = (ratio: number, max: number) => Math.round(clamp01(ratio) * max * 10) / 10;

export const savingsRate = (s: FinanceSnapshot) => (s.avgIncome > 0 ? (s.avgIncome - s.avgExpenses) / s.avgIncome : 0);
export const emergencyMonths = (s: FinanceSnapshot) => (s.avgExpenses > 0 ? s.emergencySaved / s.avgExpenses : s.emergencySaved > 0 ? 6 : 0);

export function healthScore(s: FinanceSnapshot): HealthScore {
  const rate = savingsRate(s);
  const months = emergencyMonths(s);
  const debtRatio = s.avgIncome > 0 ? s.monthlyDebtPayments / s.avgIncome : s.monthlyDebtPayments > 0 ? 1 : 0;
  const adherence = s.budget && s.budget.items > 0 ? (s.budget.items - s.budget.over) / s.budget.items : null;
  const components: ScoreComponent[] = [
    // Ahorrar el 20% o más del ingreso = puntaje completo.
    { key: 'savings', max: 25, points: s.avgIncome > 0 ? pts(rate / 0.2, 25) : 0, value: s.avgIncome > 0 ? rate : null },
    // 6 meses de gastos cubiertos = puntaje completo.
    { key: 'emergency', max: 25, points: pts(months / 6, 25), value: months },
    // Cuotas ≤ 10% del ingreso = completo; ≥ 50% = cero.
    { key: 'debt', max: 25, points: pts((0.5 - debtRatio) / 0.4, 25), value: debtRatio },
    { key: 'budget', max: 15, points: adherence === null ? 0 : pts(adherence, 15), value: adherence },
    { key: 'consistency', max: 10, points: pts(s.monthsRecorded / 3, 10), value: s.monthsRecorded },
  ];
  return { score: Math.round(components.reduce((a, c) => a + c.points, 0)), components };
}

// ── Ruta de niveles ──────────────────────────────────────────────────────────
export type LevelKey = 'start' | 'control' | 'cushion' | 'debtFree' | 'fullFund' | 'saving' | 'investing';
export interface Check {
  key: string;
  done: boolean;
}
export interface Level {
  key: LevelKey;
  checks: Check[];
  done: boolean;
}

export function levels(s: FinanceSnapshot): { levels: Level[]; current: number } {
  const months = emergencyMonths(s);
  const defs: { key: LevelKey; checks: Check[] }[] = [
    {
      key: 'start',
      checks: [
        { key: 'account', done: s.accounts > 0 },
        { key: 'income', done: s.hasIncomeSource },
        { key: 'transactions', done: s.transactions >= 5 },
      ],
    },
    {
      key: 'control',
      checks: [
        { key: 'budget', done: s.budget !== null && s.budget.items > 0 },
        { key: 'recordMonth', done: s.monthsRecorded >= 1 },
      ],
    },
    { key: 'cushion', checks: [{ key: 'goal', done: s.hasEmergencyGoal }, { key: 'oneMonth', done: months >= 1 }] },
    { key: 'debtFree', checks: [{ key: 'noHighRate', done: s.highRateDebts === 0 }] },
    { key: 'fullFund', checks: [{ key: 'threeMonths', done: months >= 3 }] },
    { key: 'saving', checks: [{ key: 'twentyPercent', done: s.avgIncome > 0 && savingsRate(s) >= 0.2 }] },
    { key: 'investing', checks: [{ key: 'invested', done: s.investedValue > 0 }, { key: 'diversified', done: s.investmentClasses >= 2 }] },
  ];
  const all = defs.map((d) => ({ ...d, done: d.checks.every((c) => c.done) }));
  const current = all.findIndex((l) => !l.done);
  return { levels: all, current: current === -1 ? all.length : current };
}

// ── Tips ─────────────────────────────────────────────────────────────────────
export interface Tip {
  key: string;
  route: string;
  /** Mayor = más importante. */
  priority: number;
}

export function tips(s: FinanceSnapshot): Tip[] {
  const months = emergencyMonths(s);
  const rate = savingsRate(s);
  const list: (Tip & { when: boolean })[] = [
    { key: 'onboarding.finish', route: '/bienvenida', priority: 100, when: !s.onboardingDone },
    { key: 'debt.avalanche', route: '/deudas', priority: 90, when: s.highRateDebts > 0 },
    { key: 'emergency.start', route: '/ahorro', priority: 80, when: !s.hasEmergencyGoal },
    { key: 'budget.create', route: '/presupuesto', priority: 75, when: s.budget === null },
    { key: 'budget.over', route: '/presupuesto', priority: 70, when: !!s.budget && s.budget.over > 0 },
    { key: 'savings.low', route: '/movimientos', priority: 60, when: s.avgIncome > 0 && rate < 0.1 },
    { key: 'emergency.grow', route: '/ahorro', priority: 50, when: s.hasEmergencyGoal && months < 3 },
    { key: 'cash.idle', route: '/ahorro', priority: 40, when: s.avgExpenses > 0 && s.liquidCash > 2 * s.avgExpenses && months >= 1 },
    { key: 'invest.diversify', route: '/ahorro', priority: 30, when: s.investedValue > 0 && s.investmentClasses < 2 },
    { key: 'record.consistency', route: '/movimientos', priority: 20, when: s.transactions > 0 && s.monthsRecorded < 3 },
  ];
  return list.filter((t) => t.when).map(({ when: _w, ...t }) => t).sort((a, b) => b.priority - a.priority);
}
