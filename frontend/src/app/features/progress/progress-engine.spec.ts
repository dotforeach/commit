import { healthScore, levels, tips, type FinanceSnapshot } from './progress-engine';

const base: FinanceSnapshot = {
  avgIncome: 0,
  avgExpenses: 0,
  emergencySaved: 0,
  hasEmergencyGoal: false,
  monthlyDebtPayments: 0,
  highRateDebts: 0,
  budget: null,
  monthsRecorded: 0,
  accounts: 0,
  transactions: 0,
  hasIncomeSource: false,
  liquidCash: 0,
  investmentClasses: 0,
  investedValue: 0,
  onboardingDone: false,
};

const solid: FinanceSnapshot = {
  ...base,
  avgIncome: 1_000_000,
  avgExpenses: 750_000, // ahorra 25%
  emergencySaved: 4_500_000, // 6 meses
  hasEmergencyGoal: true,
  monthlyDebtPayments: 50_000, // 5%
  budget: { items: 5, over: 0 },
  monthsRecorded: 3,
  accounts: 3,
  transactions: 120,
  hasIncomeSource: true,
  liquidCash: 900_000,
  investmentClasses: 2,
  investedValue: 2_000_000,
  onboardingDone: true,
};

describe('puntaje de salud financiera', () => {
  it('alguien que recién empieza: deudas en cero suman, el resto no', () => {
    const s = healthScore(base);
    expect(s.score).toBe(25);
    expect(s.components.find((c) => c.key === 'debt')!.points).toBe(25);
  });

  it('perfil sólido: 100', () => {
    expect(healthScore(solid).score).toBe(100);
  });

  it('puntajes parciales y proporcionales', () => {
    const s = healthScore({ ...solid, avgExpenses: 900_000, emergencySaved: 1_800_000, monthlyDebtPayments: 300_000, budget: { items: 4, over: 1 }, monthsRecorded: 2 });
    const byKey = Object.fromEntries(s.components.map((c) => [c.key, c.points]));
    // ahorro 10% → 12,5; fondo 2 meses → 8,3; deuda 30% → 12,5; presupuesto 3/4 → 11,3; constancia 2/3 → 6,7
    expect(byKey).toEqual({ savings: 12.5, emergency: 8.3, debt: 12.5, budget: 11.3, consistency: 6.7 });
    expect(s.score).toBe(51);
  });
});

describe('ruta de niveles', () => {
  it('nivel actual = el primero incompleto', () => {
    expect(levels(base).current).toBe(0);
    expect(levels({ ...base, accounts: 1, hasIncomeSource: true, transactions: 5 }).current).toBe(1);
    expect(levels(solid).current).toBe(7);
    // con deudas caras se frena en "salir de deudas" aunque tenga fondo
    expect(levels({ ...solid, highRateDebts: 1 }).current).toBe(3);
  });
});

describe('tips', () => {
  it('prioriza deudas caras y no repite lo resuelto', () => {
    const t = tips({ ...solid, highRateDebts: 2, budget: null });
    expect(t.map((x) => x.key)).toEqual(['debt.avalanche', 'budget.create']);
    expect(tips(solid)).toEqual([]);
  });

  it('para quien empieza: terminar el onboarding y armar el fondo', () => {
    expect(tips(base).map((x) => x.key)).toEqual(['onboarding.finish', 'emergency.start', 'budget.create']);
  });

  it('plata quieta con colchón armado: invertir', () => {
    const t = tips({ ...solid, liquidCash: 3_000_000, investedValue: 0, investmentClasses: 0 });
    expect(t.map((x) => x.key)).toContain('cash.idle');
  });
});
