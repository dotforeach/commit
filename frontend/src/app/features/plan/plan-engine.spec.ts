import { buildPlan, effectiveRate, type PlanDebt, type PlanInput } from './plan-engine';

const debt = (over: Partial<PlanDebt>): PlanDebt => ({
  id: 'd',
  name: 'Deuda',
  balance: 100_000,
  annualRate: 0.6,
  rateType: 'FIXED',
  minimumPayment: 10_000,
  paymentDay: 10,
  inflationExposed: true,
  ...over,
});
const base = (over: Partial<PlanInput> = {}): PlanInput => ({
  avgIncome: 1_000_000,
  avgLivingExpenses: 700_000,
  avgExpenses: 700_000,
  emergencySaved: 700_000, // mini fondo cubierto
  debts: [],
  cards: [],
  goals: [],
  monthlyInflation: null,
  ...over,
});
const kinds = (p: ReturnType<typeof buildPlan>) => p.steps.map((s) => s.kind);

describe('effectiveRate', () => {
  it('sin inflación o en otra moneda: nominal', () => {
    expect(effectiveRate(debt({}), null)).toBe(0.6);
    expect(effectiveRate(debt({ inflationExposed: false }), 0.05)).toBe(0.6);
  });
  it('fija en pesos con inflación: tasa real (negativa si la inflación le gana)', () => {
    expect(effectiveRate(debt({ annualRate: 0.24 }), 0.03)).toBeLessThan(0); // 2% mensual vs 3%
    expect(effectiveRate(debt({ annualRate: 0.6 }), 0.03)).toBeCloseTo(((1.05 / 1.03) - 1) * 12, 6);
  });
  it('indexada (UVA): la tasa ya es real', () => {
    expect(effectiveRate(debt({ rateType: 'INDEXED', annualRate: 0.08 }), 0.03)).toBe(0.08);
  });
});

describe('buildPlan', () => {
  it('sin ingresos registrados pide datos', () => {
    expect(buildPlan(base({ avgIncome: 0 })).needsData).toBe(true);
  });

  it('escalera: mínimos → tarjetas → mini fondo → deuda cara → fondo completo → metas → invertir', () => {
    const p = buildPlan(
      base({
        avgIncome: 2_000_000,
        emergencySaved: 0,
        debts: [debt({ id: 'a', name: 'Préstamo', balance: 300_000 })],
        cards: [{ accountId: 'c', name: 'Visa', due: 150_000, dueDate: '2026-12-10' }],
        goals: [{ id: 'g', name: 'Viaje', monthlyNeeded: 50_000, targetDate: '2027-06-01' }],
      }),
    );
    // capacidad 1.300.000: mínimo 10k · mini fondo 700k · adelanto 290k · fondo completo 300k · (nada para metas)
    expect(p.capacity).toBe(1_300_000);
    expect(kinds(p)).toEqual(['minimums', 'cards', 'miniFund', 'prepay', 'fullFund']);
    expect(p.steps.find((s) => s.kind === 'prepay')!.amount).toBe(290_000);
    expect(p.steps.find((s) => s.kind === 'fullFund')!.amount).toBe(300_000);
  });

  it('adelanta primero la de mayor costo; con tasas parecidas, la de menor saldo', () => {
    const p = buildPlan(
      base({
        avgIncome: 760_000,
        debts: [
          debt({ id: 'barata', annualRate: 0.3, balance: 50_000, minimumPayment: 0 }),
          debt({ id: 'cara-grande', annualRate: 0.9, balance: 500_000, minimumPayment: 0 }),
          debt({ id: 'cara-chica', annualRate: 0.89, balance: 40_000, minimumPayment: 0 }),
        ],
      }),
    );
    const order = p.steps.filter((s) => s.kind === 'prepay').map((s) => (s as { debtId: string }).debtId);
    expect(order).toEqual(['cara-chica', 'cara-grande']); // 60k: 40k cancela la chica, 20k a la grande
  });

  it('con inflación alta no recomienda adelantar deudas licuadas', () => {
    const p = buildPlan(base({ monthlyInflation: 0.04, debts: [debt({ id: 'tasa-fija', annualRate: 0.3 })] }));
    expect(kinds(p)).toContain('dontPrepay');
    expect(kinds(p)).not.toContain('prepay');
  });

  it('si no alcanza para los mínimos, avisa cuánto falta y no recomienda ahorrar', () => {
    const p = buildPlan(base({ avgIncome: 705_000, debts: [debt({ minimumPayment: 20_000 })] }));
    expect(p.steps.find((s) => s.kind === 'shortfall')!.amount).toBe(15_000);
    expect(kinds(p)).toEqual(['minimums', 'shortfall']);
  });

  it('el impacto compara contra pagar solo mínimos', () => {
    const p = buildPlan(base({ avgIncome: 750_000, debts: [debt({ balance: 200_000, minimumPayment: 10_000 })] }));
    expect(p.impact!.plan.months).toBeLessThan(p.impact!.baseline.months);
    expect(p.impact!.plan.interest).toBeLessThan(p.impact!.baseline.interest);
  });

  it('sin deudas ni faltantes, lo que sobra va a metas e inversión', () => {
    const p = buildPlan(base({ emergencySaved: 2_100_000, goals: [{ id: 'g', name: 'Auto', monthlyNeeded: 100_000, targetDate: '2027-01-01' }] }));
    expect(p.steps).toEqual([
      { kind: 'goal', amount: 100_000, goalId: 'g', name: 'Auto' },
      { kind: 'invest', amount: 200_000 },
    ]);
  });
});
