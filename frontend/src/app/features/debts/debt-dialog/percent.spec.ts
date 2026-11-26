import { fractionToPercent, percentToFraction } from './debt-dialog';

describe('tasa: porcentaje ↔ fracción sin perder decimales', () => {
  it.each([
    ['60', '0.6'],
    ['5', '0.05'],
    ['120', '1.2'],
    ['45.5', '0.455'],
    ['0.75', '0.0075'],
    ['0', '0'],
  ])('%s%% ↔ %s', (pct, fraction) => {
    expect(percentToFraction(pct)).toBe(fraction);
    expect(fractionToPercent(fraction)).toBe(pct);
  });
});
