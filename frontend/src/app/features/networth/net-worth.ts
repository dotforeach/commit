import type { Converter } from '../rates/converter';

export interface NetWorthItem {
  kind: 'account' | 'deposit' | 'investment' | 'debt';
  label: string;
  currency: string;
  /** Positivo = activo, negativo = pasivo. En la moneda original. */
  amount: number;
}

export interface NetWorth {
  currency: string;
  assets: number;
  liabilities: number;
  total: number;
  byKind: Record<NetWorthItem['kind'], number>;
  /** Partidas que no se pudieron convertir por falta de cotización. */
  missing: { label: string; currency: string }[];
}

const round2 = (n: number) => Math.round(n * 100) / 100;

/** Suma todo convertido a la moneda base. Es una estimación (depende de las cotizaciones). */
export function computeNetWorth(items: NetWorthItem[], base: string, converter: Converter): NetWorth {
  const byKind: NetWorth['byKind'] = { account: 0, deposit: 0, investment: 0, debt: 0 };
  const missing: NetWorth['missing'] = [];
  let assets = 0;
  let liabilities = 0;
  for (const item of items) {
    if (item.amount === 0) continue;
    const rate = converter.rate(item.currency, base);
    if (rate === null) {
      missing.push({ label: item.label, currency: item.currency });
      continue;
    }
    const value = item.amount * rate;
    byKind[item.kind] += value;
    if (value >= 0) assets += value;
    else liabilities += -value;
  }
  for (const k of Object.keys(byKind) as (keyof typeof byKind)[]) byKind[k] = round2(byKind[k]);
  return { currency: base, assets: round2(assets), liabilities: round2(liabilities), total: round2(assets - liabilities), byKind, missing };
}
