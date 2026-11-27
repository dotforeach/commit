import { Converter, type Quote } from './converter';

const q = (base: string, quote: string, rate: number, rateType = 'official', source: Quote['source'] = 'public', date = '2026-11-26'): Quote => ({ base, quote, rate, rateType, source, date });

const quotes = [
  q('USD', 'ARS', 1600, 'official'),
  q('USD', 'ARS', 1665, 'mep'),
  q('USD', 'ARS', 1700, 'blue'),
  q('EUR', 'ARS', 1760),
  q('BTC', 'USD', 60000, 'market'),
  q('BTC', 'ARS', 96_000_000, 'market'),
];

describe('Converter', () => {
  it('usa el tipo de dólar elegido por el hogar', () => {
    expect(new Converter(quotes, { usdRateType: 'mep' }).convert('100', 'USD', 'ARS')).toBe('166500');
    expect(new Converter(quotes, { usdRateType: 'blue' }).convert('100', 'USD', 'ARS')).toBe('170000');
  });

  it('inversa y triangulación por ARS o USD', () => {
    const c = new Converter(quotes, { usdRateType: 'mep' });
    expect(c.convert('166500', 'ARS', 'USD')).toBe('100');
    expect(c.convert('1665', 'EUR', 'USD')).toBe('1760'); // EUR→ARS→USD: 1665 × 1760 / 1665
    expect(c.convert('0.5', 'BTC', 'USD')).toBe('30000');
    expect(c.convert('1', 'XYZ', 'ARS')).toBeNull();
    expect(c.convert('5', 'ARS', 'ARS')).toBe('5');
  });

  it('una cotización manual del hogar tiene prioridad', () => {
    const c = new Converter([...quotes, q('USD', 'ARS', 1500, 'mep', 'manual', '2026-11-01')], { usdRateType: 'mep' });
    expect(c.convert('1', 'USD', 'ARS')).toBe('1500');
    expect(c.quoteFor('USD', 'ARS')?.source).toBe('manual');
  });

  it('si no está el tipo preferido usa otro', () => {
    expect(new Converter([q('USD', 'ARS', 1600, 'official')], { usdRateType: 'mep' }).convert('1', 'USD', 'ARS')).toBe('1600');
  });
});

describe('balboa', () => {
  it('vale lo mismo que el dólar aunque no haya cotizaciones', () => {
    const c = new Converter([], { usdRateType: 'mep' });
    expect(c.rate('PAB', 'USD')).toBe(1);
    expect(c.convert('25.5', 'USD', 'PAB')).toBe('25.5');
  });
});
