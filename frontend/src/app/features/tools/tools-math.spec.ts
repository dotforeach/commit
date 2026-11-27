import { cardPayoff, compoundGrowth, debitAnnualCost, debitVsCredit, mortgage, payment } from './tools-math';

describe('interés compuesto', () => {
  it('sin aportes: 1,000 al 12% nominal mensual por 1 año ≈ 1,126.83', () => {
    const r = compoundGrowth({ initial: 1000, monthly: 0, annualRate: 0.12, years: 1 });
    expect(r.final.balance).toBeCloseTo(1126.83, 2);
    expect(r.effectiveRate).toBeCloseTo(0.126825, 5);
  });
  it('con aportes: suma aportes e intereses por año', () => {
    const r = compoundGrowth({ initial: 0, monthly: 100, annualRate: 0, years: 2 });
    expect(r.rows).toHaveLength(2);
    expect(r.final).toEqual({ year: 2, contributed: 2400, interest: 0, balance: 2400 });
  });
});

describe('hipoteca', () => {
  it('cuota francesa: 180,000 al 6.2% a 30 años ≈ 1,102.44 (coincide con el ejemplo publicado)', () => {
    expect(payment(180_000, 0.062, 360)).toBeCloseTo(1102.44, 1);
    const m = mortgage({ price: 200_000, downPayment: 20_000, annualRate: 0.062, years: 30, subsidyPoints: 0, subsidyYears: 0 });
    expect(m.loan).toBe(180_000);
    expect(m.firstPayment).toBeCloseTo(1102.44, 1);
    expect(m.laterPayment).toBeNull();
    expect(m.yearly.at(-1)!.balance).toBeCloseTo(0, 0);
    expect(m.totalPaid).toBeCloseTo(m.firstPayment * 360, -1);
  });
  it('con subsidio de tasa: cuota baja al principio y sube después', () => {
    const m = mortgage({ price: 100_000, downPayment: 0, annualRate: 0.07, years: 25, subsidyPoints: 0.04, subsidyYears: 7 });
    expect(m.firstPayment).toBeLessThan(m.laterPayment!);
    expect(m.yearly.at(-1)!.balance).toBeCloseTo(0, 0);
  });
});

describe('tarjeta de crédito', () => {
  it('pago fijo: termina y cuesta menos que el mínimo', () => {
    const base = { balance: 2000, annualRate: 0.1899, minimumPct: 0.03, minimumFloor: 25 };
    const fixed = cardPayoff({ ...base, fixedPayment: 200 });
    const minimum = cardPayoff({ ...base, fixedPayment: null });
    expect(fixed.never).toBe(false);
    expect(fixed.months).toBeLessThan(minimum.months);
    expect(fixed.totalInterest).toBeLessThan(minimum.totalInterest);
  });
  it('si el pago no cubre los intereses, no termina nunca', () => {
    expect(cardPayoff({ balance: 5000, annualRate: 0.24, fixedPayment: 50, minimumPct: 0, minimumFloor: 0 }).never).toBe(true);
  });
});

describe('débito', () => {
  it('costo anual neto = cargos − intereses ganados', () => {
    const c = debitAnnualCost({ name: 'X', annualFees: 0, otherAtmPerMonth: 2, otherAtmFee: 1.5, extraTellerPerMonth: 1, tellerFee: 2, annualRate: 0.01, averageBalance: 1000 });
    expect(c).toEqual({ fees: 60, interestEarned: 10, net: 50 });
  });
  it('débito vs. crédito: pagar el total con cashback ahorra; financiar cuesta', () => {
    const [debit, full, financed] = debitVsCredit({ amount: 600, cashbackPct: 0.01, annualRate: 0.1899, months: 6 });
    expect(debit.netCost).toBe(0);
    expect(full.netCost).toBe(-6);
    expect(financed.interest).toBeGreaterThan(0);
    expect(financed.netCost).toBeGreaterThan(0);
  });
});
