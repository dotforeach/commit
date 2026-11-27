/**
 * Descuentos de ley sobre el salario en Panamá (asalariados).
 *
 * - Seguro Social (CSS): 9.75 % del salario.
 * - Seguro Educativo: 1.25 % del salario.
 * - Impuesto sobre la renta (ISR): tabla anual progresiva sobre el salario × 13
 *   (12 meses + décimo tercer mes), repartida en 13 pagos:
 *     hasta B/.11,000 → 0 %; de 11,000 a 50,000 → 15 % del excedente;
 *     más de 50,000 → B/.5,850 + 25 % del excedente de 50,000.
 *
 * Es la retención habitual de planilla. No considera deducciones personales
 * (intereses hipotecarios, gastos médicos, etc.), que se aplican en la declaración anual.
 */

export const PANAMA_TAX = {
  socialSecurity: 0.0975,
  educationInsurance: 0.0125,
  /** Pagos al año sobre los que se calcula y reparte el ISR (12 + décimo tercer mes). */
  paymentsPerYear: 13,
  brackets: [
    { from: 0, to: 11_000, rate: 0, base: 0 },
    { from: 11_000, to: 50_000, rate: 0.15, base: 0 },
    { from: 50_000, to: Infinity, rate: 0.25, base: 5_850 },
  ],
} as const;

export interface TaxSource {
  label: string;
  url: string;
}
/** Fuentes consultadas (revisadas el 2026-11-27). */
export const TAX_SOURCES: TaxSource[] = [
  { label: 'WalletPTY, ISR Panamá 2026: tabla progresiva', url: 'https://www.walletpty.com/blog/impuesto-renta-isr-panama-2026' },
  { label: 'Legal Solutions Panamá, guía para calcular el ISR', url: 'https://legalsolutionspanama.com/blog/guia-para-calcular-el-impuesto-sobre-la-renta-en-panama/' },
  { label: 'TopTrabajos, deducciones al salario (SS, SE e ISR)', url: 'https://www.toptrabajos.com/pa/blog/deducciones-al-salario-ss-se-isr/' },
];

const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;

/** ISR anual según la tabla progresiva. */
export function annualIncomeTax(annualIncome: number): number {
  for (const b of [...PANAMA_TAX.brackets].reverse()) {
    if (annualIncome > b.from) return round2(b.base + (annualIncome - b.from) * b.rate);
  }
  return 0;
}

export interface TaxRates {
  /** Fracción (0.0975). */
  socialSecurity: number;
  /** Fracción (0.0125). */
  educationInsurance: number;
}

export interface SalaryBreakdown {
  gross: number;
  socialSecurity: number;
  educationInsurance: number;
  incomeTax: number;
  totalDeductions: number;
  net: number;
}

/** Descuentos de un salario mensual (los montos son mensuales). */
export function salaryBreakdown(monthlyGross: number, rates: TaxRates = PANAMA_TAX): SalaryBreakdown {
  const gross = Math.max(monthlyGross, 0);
  const socialSecurity = round2(gross * rates.socialSecurity);
  const educationInsurance = round2(gross * rates.educationInsurance);
  const incomeTax = round2(annualIncomeTax(gross * PANAMA_TAX.paymentsPerYear) / PANAMA_TAX.paymentsPerYear);
  const totalDeductions = round2(socialSecurity + educationInsurance + incomeTax);
  return { gross, socialSecurity, educationInsurance, incomeTax, totalDeductions, net: round2(gross - totalDeductions) };
}

export type PayPeriod = 'monthly' | 'biweekly';

/** Pasa un desglose mensual a quincenal (la mitad de cada monto). */
export function toPeriod(b: SalaryBreakdown, period: PayPeriod): SalaryBreakdown {
  if (period === 'monthly') return b;
  const half = (n: number) => round2(n / 2);
  return {
    gross: half(b.gross),
    socialSecurity: half(b.socialSecurity),
    educationInsurance: half(b.educationInsurance),
    incomeTax: half(b.incomeTax),
    totalDeductions: half(b.totalDeductions),
    net: half(b.net),
  };
}

/** Máximo de filas de la tabla (evita rangos absurdos). */
export const MAX_ROWS = 200;

/** Tabla de salarios mensuales desde `from` hasta `to` (inclusive) cada `step`. */
export function salaryTable(from: number, to: number, step: number, rates: TaxRates = PANAMA_TAX): SalaryBreakdown[] {
  if (!(step > 0) || !(from >= 0) || !(to >= from)) return [];
  const rows: SalaryBreakdown[] = [];
  for (let s = from; s <= to + 1e-9 && rows.length < MAX_ROWS; s = round2(s + step)) rows.push(salaryBreakdown(s, rates));
  return rows;
}
