import { RateSources } from './rate-sources.js';

const json = (body: unknown) => new Response(JSON.stringify(body), { status: 200, headers: { 'content-type': 'application/json' } });

describe('RateSources', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('suma tipos de referencia (BCE) contra el dólar y el balboa a la par, aunque otra fuente falle', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string) => {
        if (url.includes('frankfurter')) return json({ amount: 1, base: 'USD', date: '2026-11-26', rates: { EUR: 0.91, MXN: 19.67 } });
        if (url.includes('coingecko')) return json({ bitcoin: { usd: 90000 } });
        return new Response('caído', { status: 503 }); // DolarApi
      }),
    );
    const rates = await new RateSources().fetchAll();
    expect(rates).toEqual(
      expect.arrayContaining([
        { base: 'USD', quote: 'EUR', rateType: 'official', rate: '0.91', provider: 'ecb' },
        { base: 'USD', quote: 'MXN', rateType: 'official', rate: '19.67', provider: 'ecb' },
        { base: 'USD', quote: 'PAB', rateType: 'official', rate: '1', provider: 'fixed' },
        { base: 'BTC', quote: 'USD', rateType: 'market', rate: '90000', provider: 'coingecko' },
      ]),
    );
    expect(rates.some((r) => r.provider === 'dolarapi')).toBe(false);
  });
});
