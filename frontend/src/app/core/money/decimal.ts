/**
 * Montos como strings decimales canónicos ("-1234.5"): nunca `number`, para no perder precisión.
 * Hasta 15 dígitos enteros y 4 decimales (Decimal(19,4)).
 */
const CANONICAL = /^-?\d{1,15}(\.\d{1,4})?$/;
/** Entero con puntos de miles bien agrupados: "1.234.567". */
const THOUSANDS = /^-?\d{1,3}(\.\d{3})+$/;

function stripThousands(int: string): string | null {
  if (!int.includes('.')) return int;
  return THOUSANDS.test(int) ? int.replace(/\./g, '') : null;
}

/**
 * Interpreta lo que escribe el usuario. Acepta "1.234,56" (es-AR), "1234,56", "1234.56" y "-500".
 * Con coma, la coma es el separador decimal y los puntos son de miles. Sin coma, un único punto
 * seguido de 1 o 2 dígitos es decimal; si no, los puntos son de miles ("1.500" = 1500).
 */
export function parseDecimalInput(input: string): string | null {
  let s = input.trim().replace(/\s/g, '').replace(/^\+/, '');
  if (s === '') return null;
  if (s.includes(',')) {
    const parts = s.split(',');
    if (parts.length > 2) return null;
    const int = stripThousands(parts[0]);
    if (int === null) return null;
    s = `${int}.${parts[1]}`;
  } else {
    const parts = s.split('.');
    const isDecimalPoint = parts.length === 2 && parts[1].length >= 1 && parts[1].length <= 2;
    if (!isDecimalPoint) {
      const int = stripThousands(s);
      if (int === null) return null;
      s = int;
    }
  }
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
export function formatMoney(amount: string, currency: { code: string; symbol: string; decimals: number }, locale = 'es-AR') {
  const negative = amount.startsWith('-');
  const [int, frac = ''] = amount.replace('-', '').split('.');
  const digits = `${frac}${'0'.repeat(currency.decimals)}`.slice(0, currency.decimals);
  // Intl formatea el entero como BigInt (sin pérdida) y armamos los decimales a mano.
  const intPart = new Intl.NumberFormat(locale).format(BigInt(int));
  const decimalSep = new Intl.NumberFormat(locale).formatToParts(1.1).find((p) => p.type === 'decimal')?.value ?? ',';
  const number = currency.decimals > 0 ? `${intPart}${decimalSep}${digits}` : intPart;
  return `${negative ? '-' : ''}${currency.symbol} ${number}`;
}

/** Valor para editar en un input (formato es-AR, sin símbolo): "1234.5" → "1234,5". */
export function toInputValue(amount: string): string {
  return amount.replace('.', ',');
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
