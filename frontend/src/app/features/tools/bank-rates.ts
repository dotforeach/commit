/**
 * Tasas de referencia publicadas, con su fuente y fecha. Se actualizan a mano:
 * revisar las fuentes, cambiar los valores y la fecha `checkedAt`. Son referencias,
 * no ofertas: cada banco define la tasa final según el cliente.
 */
export interface RateSource {
  label: string;
  url: string;
  /** Fecha del dato según la fuente. */
  asOf: string;
}
export interface BankRate {
  bank: string;
  product: string;
  /** Tasa anual (fracción). */
  rate: number;
  annualFee?: number;
  source: RateSource;
}

/** Cuándo se revisaron por última vez estas tablas. */
export const CHECKED_AT = '2026-11-27';

const SBP_JULY_2026: RateSource = {
  label: 'Superintendencia de Bancos, tarifario de tasas nominales (julio 2026), vía Nexo',
  url: 'https://nexo.la/banca-estatal-hipotecas-tasa-itbi/',
  asOf: '2026-07',
};

/** Hipotecas de vivienda no preferencial. */
export const MORTGAGE_RATES: BankRate[] = [
  { bank: 'Banistmo', product: 'Hipoteca (no preferencial)', rate: 0.062, source: SBP_JULY_2026 },
  { bank: 'Banco General', product: 'Hipoteca (no preferencial)', rate: 0.07, source: SBP_JULY_2026 },
  { bank: 'Caja de Ahorros', product: 'Hipoteca (no preferencial)', rate: 0.0725, source: SBP_JULY_2026 },
  { bank: 'Banco Nacional de Panamá', product: 'Hipoteca (no preferencial)', rate: 0.08, source: SBP_JULY_2026 },
];
/** Promedio del sistema (mayo 2026, misma fuente). */
export const MORTGAGE_SYSTEM_AVERAGE = { rate: 0.0623, source: SBP_JULY_2026 };

const ACODECO_MAY_2026: RateSource = {
  label: 'Acodeco, estudio de tarjetas de crédito (mayo 2026), vía La Estrella de Panamá',
  url: 'https://www.laestrella.com.pa/amp/economia/acodeco-revela-las-tarjetas-de-credito-con-las-tasas-y-anualidades-mas-bajas-en-panama-PN23483268',
  asOf: '2026-05',
};

/** Tarjetas de crédito personales (se omiten las empresariales/corporativas). */
export const CARD_RATES: BankRate[] = [
  { bank: 'Banco de Occidente', product: 'Platino', rate: 0.12, source: ACODECO_MAY_2026 },
  { bank: 'Banistmo', product: 'Oro / Gold', rate: 0.165, annualFee: 0, source: ACODECO_MAY_2026 },
  { bank: 'Banco Nacional de Panamá', product: 'Varios productos', rate: 0.18, source: ACODECO_MAY_2026 },
  { bank: 'Mercantil Bank', product: 'Varios productos', rate: 0.18, source: ACODECO_MAY_2026 },
  { bank: 'Banco General', product: 'Cash Back Clásica / Esencial', rate: 0.1899, annualFee: 0, source: ACODECO_MAY_2026 },
  { bank: 'Global Bank', product: 'Cash Back Clásica / Esencial', rate: 0.1899, annualFee: 50, source: ACODECO_MAY_2026 },
];

/** Regla de la Superintendencia para cuentas de ahorro (Acuerdo 4-2011), citada en el tarifario de BAC. */
export const SAVINGS_RULE: RateSource = {
  label: 'Superintendencia de Bancos, Acuerdo 4-2011 (citado en el tarifario de BAC Panamá, julio 2025)',
  url: 'https://www.baccredomatic.com/sites/default/files/2025-07/PAN_Tarifas_Cuentas_Julio2025.pdf',
  asOf: '2025-07',
};
