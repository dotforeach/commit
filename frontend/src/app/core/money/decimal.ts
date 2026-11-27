/**
 * Montos como strings decimales canónicos ("-1234.5"): nunca `number`, para no perder precisión.
 * Hasta 15 dígitos enteros y 4 decimales (Decimal(19,4)).
 */
const CANONICAL = /^-?\d{1,15}(\.\d{1,4})?$/;
/** Entero con separador de miles bien agrupado: "1,234,567" o "1.234.567". */
const THOUSANDS = { ',': /^-?\d{1,3}(,\d{3})+$/, '.': /^-?\d{1,3}(\.\d{3})+$/ };

function stripThousands(int: string, sep: ',' | '.'): string | null {
  if (!int.includes(',') && !int.includes('.')) return int;
  return THOUSANDS[sep].test(int) ? int.split(sep).join('') : null;
}

/** Formato de números de la app (Panamá): punto decimal y coma de miles. */
export const NUMBER_LOCALE = 'es-PA';

/**
 * Interpreta un monto escrito por la persona. Formato de Panamá ("1,234.56"), tolerante:
 * - con punto y coma, el último que aparece es el decimal ("1,234.56" y también "1.234,56");
 * - solo puntos: uno solo es decimal ("12.5"); varios son de miles ("1.234.567");
 * - solo comas: una sola seguida de exactamente 3 dígitos es de miles ("1,500"); si no, decimal ("12,5").
 */
export function parseDecimalInput(input: string): string | null {
  let s = input.trim().replace(/\s/g, '').replace(/^\+/, '');
  if (s === '') return null;
  const lastDot = s.lastIndexOf('.');
  const lastComma = s.lastIndexOf(',');
  let decimalSep: '.' | ',' | null = null;
  if (lastDot >= 0 && lastComma >= 0) decimalSep = lastDot > lastComma ? '.' : ',';
  else if (lastDot >= 0) decimalSep = s.split('.').length === 2 ? '.' : null;
  else if (lastComma >= 0) decimalSep = s.split(',').length === 2 && !/,\d{3}$/.test(s) ? ',' : null;
  const thousandsSep = decimalSep === '.' ? ',' : decimalSep === ',' ? '.' : lastDot >= 0 ? '.' : ',';
  const [intRaw, frac, extra] = decimalSep ? s.split(decimalSep) : [s];
  if (extra !== undefined) return null;
  const int = stripThousands(intRaw, thousandsSep);
  if (int === null) return null;
  s = frac !== undefined ? `${int}.${frac}` : int;
  if (!CANONICAL.test(s)) return null;
  return normalize(s);
}

/** Quita ceros a la izquierda y decimales sobrantes: "-007.50" → "-7.5", "-0" → "0". */
function normalize(s: string): string {
  const negative = s.startsWith('-');
  let [int, frac = ''] = s.replace('-', '').split('.');
  int = int.replace(/^0+(?=\d)/, '');
  frac = frac.replace(/0+$/, '');
  const out = frac ? `${int}.${frac}` : int;
  return negative && out !== '0' ? `-${out}` : out;
}

export function isCanonicalDecimal(value: string): boolean {
  return CANONICAL.test(value);
}

/**
 * Formatea para mostrar. Usa Intl con el código de moneda cuando es ISO 4217;
 * para cripto (USDT, BTC) muestra el número y el símbolo.
 */
export function formatMoney(amount: string, currency: { code: string; symbol: string; decimals: number }, locale = NUMBER_LOCALE) {
  const negative = amount.startsWith('-');
  const [int, frac = ''] = amount.replace('-', '').split('.');
  const digits = `${frac}${'0'.repeat(currency.decimals)}`.slice(0, currency.decimals);
  // Intl formatea el entero como BigInt (sin pérdida) y armamos los decimales a mano.
  const intPart = new Intl.NumberFormat(locale).format(BigInt(int));
  const decimalSep = new Intl.NumberFormat(locale).formatToParts(1.1).find((p) => p.type === 'decimal')?.value ?? '.';
  const number = currency.decimals > 0 ? `${intPart}${decimalSep}${digits}` : intPart;
  // "$1,234.50" para el dólar; el resto, con espacio: "B/. 1,234.50", "€ 10.00".
  const space = currency.symbol === '$' ? '' : ' ';
  return `${negative ? '-' : ''}${currency.symbol}${space}${number}`;
}

/** Valor para editar en un input (punto decimal, sin símbolo ni separador de miles). */
export function toInputValue(amount: string): string {
  return amount;
}

// ── Aritmética exacta: enteros escalados a 4 decimales con BigInt ─────────────
const SCALE = 10_000n;

function toUnits(amount: string): bigint {
  const negative = amount.startsWith('-');
  const [int, frac = ''] = amount.replace('-', '').split('.');
  const units = BigInt(int || '0') * SCALE + BigInt((frac + '0000').slice(0, 4));
  return negative ? -units : units;
}

function fromUnits(units: bigint): string {
  const negative = units < 0n;
  const abs = negative ? -units : units;
  const int = abs / SCALE;
  const frac = (abs % SCALE).toString().padStart(4, '0').replace(/0+$/, '');
  const out = frac ? `${int}.${frac}` : `${int}`;
  return negative && out !== '0' ? `-${out}` : out;
}

export const ZERO = '0';

export function addDecimals(...amounts: string[]): string {
  return fromUnits(amounts.reduce((sum, a) => sum + toUnits(a), 0n));
}

export function subDecimals(a: string, b: string): string {
  return fromUnits(toUnits(a) - toUnits(b));
}

export function negateDecimal(a: string): string {
  return fromUnits(-toUnits(a));
}

export function compareDecimals(a: string, b: string): -1 | 0 | 1 {
  const d = toUnits(a) - toUnits(b);
  return d === 0n ? 0 : d < 0n ? -1 : 1;
}

export function isNegative(a: string): boolean {
  return toUnits(a) < 0n;
}

/** `pct`% de un monto, exacto a 4 decimales (trunca): percentOf("1000", 50) → "500". */
export function percentOf(amount: string, pct: number): string {
  if (!Number.isInteger(pct)) throw new Error('percentOf espera un porcentaje entero');
  return fromUnits((toUnits(amount) * BigInt(pct)) / 100n);
}

/** Proporción a / b como número, solo para mostrar (barras de progreso, %). */
export function ratioOf(a: string, b: string): number {
  const den = toUnits(b);
  return den === 0n ? 0 : Number((toUnits(a) * 10_000n) / den) / 10_000;
}
