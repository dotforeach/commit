import { Converter } from '../rates/converter';
import { computeNetWorth } from './net-worth';

const converter = new Converter(
  [
    { base: 'USD', quote: 'ARS', rate: 1665, rateType: 'mep', date: '2026-11-26', source: 'public' },
    { base: 'BTC', quote: 'USD', rate: 60000, rateType: 'market', date: '2026-11-26', source: 'public' },
  ],
  { usdRateType: 'mep' },
);

describe('patrimonio neto', () => {
  it('suma activos y resta pasivos, todo en la moneda base', () => {
    const nw = computeNetWorth(
      [
        { kind: 'account', label: 'Banco', currency: 'ARS', amount: 500_000 },
        { kind: 'account', label: 'Dólares', currency: 'USD', amount: 1000 },
        { kind: 'account', label: 'Visa', currency: 'ARS', amount: -120_000 },
        { kind: 'deposit', label: 'Plazo fijo', currency: 'ARS', amount: 300_000 },
        { kind: 'investment', label: 'BTC', currency: 'BTC', amount: 0.01 },
        { kind: 'debt', label: 'Préstamo', currency: 'ARS', amount: -400_000 },
      ],
      'ARS',
      converter,
    );
    // activos 500k + 1.665k + 300k + 0,01×60k×1665 (999k) = 3.464k; pasivos 520k
    expect(nw).toMatchObject({ assets: 3_464_000, liabilities: 520_000, total: 2_944_000, missing: [] });
    expect(nw.byKind).toEqual({ account: 2_045_000, deposit: 300_000, investment: 999_000, debt: -400_000 });
  });

  it('informa lo que no se puede convertir en vez de inventarlo', () => {
    const nw = computeNetWorth([{ kind: 'account', label: 'Reales', currency: 'BRL', amount: 100 }], 'ARS', converter);
    expect(nw.total).toBe(0);
    expect(nw.missing).toEqual([{ label: 'Reales', currency: 'BRL' }]);
  });
});
