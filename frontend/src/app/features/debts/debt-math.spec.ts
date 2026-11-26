import { amortizationSchedule, frenchPayment, outstandingBalance, simulatePayoff, suggestSplit } from './debt-math';

describe('deudas', () => {
  it('sistema francés: cuota fija y el saldo cierra en cero', () => {
    const payment = frenchPayment(1_000_000, 0.6, 12); // TNA 60% → 5% mensual
    expect(payment).toBeCloseTo(112825.41, 2);
    const rows = amortizationSchedule(1_000_000, 0.6, 12, 'FRENCH');
    expect(rows).toHaveLength(12);
    expect(rows[0]).toEqual({ n: 1, payment: 112825.41, interest: 50000, principal: 62825.41, balance: 937174.59 });
    expect(rows.at(-1)!.balance).toBe(0);
  });

  it('sistema alemán: amortización constante, cuotas decrecientes', () => {
    const rows = amortizationSchedule(120_000, 0.12, 12, 'GERMAN');
    expect(rows[0]).toMatchObject({ principal: 10000, interest: 1200, payment: 11200 });
    expect(rows[11]).toMatchObject({ principal: 10000, interest: 100, payment: 10100, balance: 0 });
  });

  it('pago único al final y tasa cero', () => {
    const bullet = amortizationSchedule(100_000, 0.24, 3, 'BULLET');
    expect(bullet.map((r) => r.payment)).toEqual([2000, 2000, 102000]);
    expect(frenchPayment(1200, 0, 12)).toBe(100);
  });

  it('saldo exacto: original menos capital pagado (o el pago entero si no hay división)', () => {
    expect(outstandingBalance('1000000', [{ principalPart: '62825.41', amount: '112825.41' }, { principalPart: null, amount: '100000.1' }])).toBe('837174.49');
  });

  it('sugiere interés sobre el saldo y el resto a capital', () => {
    expect(suggestSplit(937174.59, 0.6, 112825.41)).toEqual({ interest: 46858.73, principal: 65966.68 });
    expect(suggestSplit(1000, 1.2, 5)).toEqual({ interest: 5, principal: 0 });
  });

  it('avalancha paga menos intereses; bola de nieve salda primero la más chica', () => {
    const debts = [
      { id: 'tarjeta', balance: 300_000, annualRate: 1.2, minimumPayment: 30_000 },
      { id: 'familiar', balance: 50_000, annualRate: 0, minimumPayment: 10_000 },
      { id: 'personal', balance: 800_000, annualRate: 0.6, minimumPayment: 60_000 },
    ];
    const snow = simulatePayoff(debts, 50_000, 'snowball');
    const aval = simulatePayoff(debts, 50_000, 'avalanche');
    expect(snow.payoff[0].id).toBe('familiar');
    expect(aval.payoff[0].id).toBe('tarjeta');
    expect(aval.totalInterest).toBeLessThan(snow.totalInterest);
    expect(snow.stuck || aval.stuck).toBe(false);
  });

  it('detecta cuando los pagos no cubren los intereses', () => {
    expect(simulatePayoff([{ id: 'x', balance: 1_000_000, annualRate: 1.2, minimumPayment: 5_000 }], 0, 'avalanche', 120).stuck).toBe(true);
  });
});
