import type { Transaction } from '../transactions/transaction.model';
import { averageMonthlyExpenses, cashAmount, computeHoldings, depositProjection, goalProgress, type Trade } from './savings-math';

let seq = 0;
const expense = (amount: string, date: string, accountId = 'ars'): Transaction => ({
  id: `t${++seq}`, accountId, categoryId: null, type: 'EXPENSE', amount, date, status: 'CLEARED',
  transferGroupId: null, createdById: 'u', revision: '1', description: '', notes: null,
});

describe('metas', () => {
  it('avance y ahorro mensual necesario hasta la fecha', () => {
    expect(goalProgress(1_200_000, 300_000, '2027-05-26', '2026-11-26')).toEqual({ ratio: 0.25, remaining: 900_000, monthsLeft: 6, monthlyNeeded: 150_000, reached: false });
    expect(goalProgress(100, 150, null, '2026-11-26')).toMatchObject({ remaining: 0, monthlyNeeded: null, reached: true });
    expect(goalProgress(1000, 0, '2026-11-01', '2026-11-26').monthsLeft).toBe(0); // vencida: todo este mes
  });

  it('gasto promedio de los últimos 3 meses completos (sin el actual ni otras monedas)', () => {
    const txs = [
      expense('300000', '2026-08-15'),
      expense('200000', '2026-09-10'),
      expense('100000', '2026-10-05'),
      expense('99999', '2026-11-20'), // mes en curso
      expense('5', '2026-10-01', 'usd'),
      expense('7', '2026-07-31'), // fuera de la ventana
    ];
    const currency = (id: string) => (id === 'usd' ? 'USD' : 'ARS');
    expect(averageMonthlyExpenses(txs, currency, 'ARS', '2026-11-26')).toEqual({ average: '200000', monthsWithData: 3 });
    expect(averageMonthlyExpenses([], currency, 'ARS', '2026-11-26')).toEqual({ average: '0', monthsWithData: 0 });
  });
});

describe('plazo fijo', () => {
  it('interés simple TNA / 365', () => {
    expect(depositProjection(1_000_000, 0.365, '2026-10-01', '2026-10-31', '2026-10-15')).toEqual({ days: 30, interest: 30000, total: 1_030_000, daysLeft: 16, matured: false });
    expect(depositProjection(1_000_000, 0.365, '2026-10-01', '2026-10-31', '2026-11-02').matured).toBe(true);
  });
});

describe('tenencias', () => {
  it('costo promedio, venta realizada, renta y valuación', () => {
    const trades: Trade[] = [
      { assetId: 'aapl', type: 'BUY', date: '2026-01-10', quantity: 10, unitPrice: 100, fees: 10 },
      { assetId: 'aapl', type: 'BUY', date: '2026-02-10', quantity: 10, unitPrice: 200, fees: 10 },
      { assetId: 'aapl', type: 'SELL', date: '2026-03-10', quantity: 5, unitPrice: 300, fees: 0 },
      { assetId: 'aapl', type: 'DIVIDEND', date: '2026-04-10', quantity: 1, unitPrice: 50, fees: 0 },
    ];
    const [h] = computeHoldings(trades, () => 250);
    // costo 3020 por 20 → promedio 151; venta 5 → realizado 1500 − 755 = 745; quedan 15 con costo 2265
    expect(h).toMatchObject({ quantity: 15, costBasis: 2265, realized: 745, income: 50, marketValue: 3750, unrealized: 1485 });
    expect(h.avgCost).toBeCloseTo(151, 6);
  });

  it('sin precio no hay valuación; cantidades fraccionarias (cripto)', () => {
    const [h] = computeHoldings([{ assetId: 'btc', type: 'BUY', date: '2026-01-01', quantity: 0.00012345, unitPrice: 90000, fees: 0 }], () => null);
    expect(h).toMatchObject({ quantity: 0.00012345, marketValue: null, unrealized: null });
  });

  it('efectivo que mueve cada operación', () => {
    expect(cashAmount({ type: 'BUY', quantity: 10, unitPrice: 100, fees: 5 })).toBe(1005);
    expect(cashAmount({ type: 'SELL', quantity: 10, unitPrice: 100, fees: 5 })).toBe(995);
  });
});
