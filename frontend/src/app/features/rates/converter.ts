/**
 * Conversión entre monedas con las cotizaciones disponibles. Las conversiones son estimaciones
 * (punto flotante, redondeo a centavos): los saldos de cada cuenta siguen siendo exactos.
 */
export interface Quote {
  base: string;
  quote: string;
  rateType: string;
  rate: number;
  date: string;
  source: 'manual' | 'public';
}

export interface ConverterOptions {
  /** Tipo de cambio para USD↔ARS (mep, official, blue…). */
  usdRateType: string;
}

export class Converter {
  private readonly pairs = new Map<string, Quote>();

  constructor(quotes: Quote[], private readonly opts: ConverterOptions) {
    // El balboa circula a la par del dólar por ley: no depende de ninguna cotización.
    quotes = [{ base: 'USD', quote: 'PAB', rateType: 'official', rate: 1, date: '1904-01-01', source: 'public' }, ...quotes];
    // Prioridad: manual más reciente > público del tipo preferido (USD/ARS) > cualquier público más reciente.
    const score = (q: Quote) => {
      const preferredUsd = q.base === 'USD' && q.quote === 'ARS' ? (q.rateType === opts.usdRateType ? 1 : 0) : 1;
      return (q.source === 'manual' ? 100 : 0) + preferredUsd * 10;
    };
    for (const q of quotes) {
      if (!(q.rate > 0)) continue;
      const key = `${q.base}/${q.quote}`;
      const current = this.pairs.get(key);
      if (!current || score(q) > score(current) || (score(q) === score(current) && q.date > current.date)) this.pairs.set(key, q);
    }
  }

  /** Cuánto vale 1 `from` en `to`, o null si no hay forma de calcularlo. */
  rate(from: string, to: string): number | null {
    if (from === to) return 1;
    const direct = this.pairs.get(`${from}/${to}`);
    if (direct) return direct.rate;
    const inverse = this.pairs.get(`${to}/${from}`);
    if (inverse) return 1 / inverse.rate;
    for (const pivot of ['USD', 'ARS']) {
      if (pivot === from || pivot === to) continue;
      const a = this.rateDirect(from, pivot);
      const b = this.rateDirect(pivot, to);
      if (a !== null && b !== null) return a * b;
    }
    return null;
  }

  /** Convierte un monto (string decimal) y lo devuelve redondeado a 2 decimales, o null. */
  convert(amount: string, from: string, to: string): string | null {
    const r = this.rate(from, to);
    if (r === null) return null;
    const value = Math.round(Number(amount) * r * 100) / 100;
    return value.toFixed(2).replace(/\.?0+$/, '') || '0';
  }

  /** La cotización usada para un par (para mostrar de dónde sale). */
  quoteFor(base: string, quote: string): Quote | undefined {
    return this.pairs.get(`${base}/${quote}`);
  }

  private rateDirect(from: string, to: string): number | null {
    const d = this.pairs.get(`${from}/${to}`);
    if (d) return d.rate;
    const i = this.pairs.get(`${to}/${from}`);
    return i ? 1 / i.rate : null;
  }

  get usdRateType() {
    return this.opts.usdRateType;
  }
}
