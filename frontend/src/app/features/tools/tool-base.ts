import { formatMoney, parseDecimalInput } from '../../core/money/decimal';

/** Las herramientas son públicas: no consultan el catálogo de monedas (requiere sesión). */
const USD = { code: 'USD', symbol: '$', decimals: 2 };

/** Lee un número escrito por la persona ("1,500.50"); 0 si está vacío o es inválido. */
export const num = (s: string) => Number(parseDecimalInput(s) ?? '0') || 0;
/** Lee un porcentaje ("18.99") como fracción (0.1899). */
export const pct = (s: string) => num(s) / 100;

export function moneyFormatter() {
  return (n: number) => formatMoney((Math.round(n * 100) / 100).toFixed(2), USD);
}

export const percentText = (fraction: number) => `${(Math.round(fraction * 10000) / 100).toString()} %`;
