import { addDecimals, compareDecimals, formatMoney, negateDecimal, parseDecimalInput, subDecimals, toInputValue } from './decimal';

const ARS = { code: 'ARS', symbol: '$', decimals: 2 };
const BTC = { code: 'BTC', symbol: '₿', decimals: 8 };

describe('parseDecimalInput', () => {
  it.each([
    ['1.234,56', '1234.56'],
    ['1234,56', '1234.56'],
    ['1234.56', '1234.56'],
    ['1.500', '1500'],
    ['1.500.000', '1500000'],
    ['  -500 ', '-500'],
    ['+15', '15'],
    ['0,10', '0.1'],
    ['007', '7'],
    ['-0', '0'],
    ['0,0001', '0.0001'],
    ['999999999999999,9999', '999999999999999.9999'],
  ])('%s → %s', (input, expected) => {
    expect(parseDecimalInput(input)).toBe(expected);
  });

  it.each(['', 'abc', '1,2,3', '12,34567', '1e5', '1234567890123456', '--5', '1..2', '12.34.5', '1.23,5'])('rechaza %j', (input) => {
    expect(parseDecimalInput(input)).toBeNull();
  });
});

describe('formatMoney', () => {
  it('formatea en es-AR sin perder precisión', () => {
    expect(formatMoney('1234567.5', ARS)).toBe('$ 1.234.567,50');
    expect(formatMoney('-15', ARS)).toBe('-$ 15,00');
    expect(formatMoney('999999999999999.99', ARS)).toBe('$ 999.999.999.999.999,99');
    expect(formatMoney('0.00012345', BTC)).toBe('₿ 0,00012345');
  });

  it('prepara el valor para editar', () => {
    expect(toInputValue('1234.5')).toBe('1234,5');
  });
});


describe('aritmética decimal exacta', () => {
  it('suma sin errores de punto flotante', () => {
    expect(addDecimals('0.1', '0.2')).toBe('0.3');
    expect(addDecimals('999999999999999.9999', '0.0001')).toBe('1000000000000000');
    expect(addDecimals()).toBe('0');
    expect(addDecimals('-5', '5')).toBe('0');
  });

  it('resta, niega y compara', () => {
    expect(subDecimals('100', '150.25')).toBe('-50.25');
    expect(negateDecimal('-3.5')).toBe('3.5');
    expect(negateDecimal('0')).toBe('0');
    expect(compareDecimals('10', '9.9999')).toBe(1);
    expect(compareDecimals('-1', '1')).toBe(-1);
    expect(compareDecimals('2.50', '2.5')).toBe(0);
  });
});

describe('percentOf y ratioOf', () => {
  it('porcentajes exactos', async () => {
    const { percentOf, ratioOf } = await import('./decimal');
    expect(percentOf('1000000', 50)).toBe('500000');
    expect(percentOf('333.33', 30)).toBe('99.999');
    expect(ratioOf('85000', '100000')).toBe(0.85);
    expect(ratioOf('5', '0')).toBe(0);
  });
});
