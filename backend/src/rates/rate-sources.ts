import { Injectable, Logger } from '@nestjs/common';
import { z } from 'zod';

export interface PublicRate {
  /** 1 base = rate quote */
  base: string;
  quote: string;
  rateType: string;
  rate: string;
  provider: string;
}

/** Tipos de cambio de DolarApi → nombres propios. */
const DOLAR_CASAS: Record<string, string> = {
  oficial: 'official',
  blue: 'blue',
  bolsa: 'mep',
  contadoconliqui: 'ccl',
  tarjeta: 'card',
  cripto: 'crypto',
  mayorista: 'wholesale',
};

const dolarApiItem = z.object({
  moneda: z.string().min(3).max(10),
  casa: z.string(),
  compra: z.number().positive().nullable(),
  venta: z.number().positive().nullable(),
});
const coinGecko = z.record(z.string(), z.object({ usd: z.number().positive().optional(), ars: z.number().positive().optional() }));

const frankfurter = z.object({ base: z.literal('USD'), rates: z.record(z.string().regex(/^[A-Z]{3}$/), z.number().positive()) });

const COINS: Record<string, string> = { bitcoin: 'BTC', ethereum: 'ETH', tether: 'USDT', 'usd-coin': 'USDC' };

/** El balboa circula a la par del dólar por ley: no hace falta consultarlo. */
const FIXED: PublicRate[] = [{ base: 'USD', quote: 'PAB', rateType: 'official', rate: '1', provider: 'fixed' }];

/** Promedio compra/venta como string decimal (10 decimales como máximo). */
function mid(compra: number | null, venta: number | null): string | null {
  const values = [compra, venta].filter((v): v is number => v !== null);
  if (values.length === 0) return null;
  return (values.reduce((a, b) => a + b, 0) / values.length).toFixed(10).replace(/\.?0+$/, '');
}

/**
 * Fuentes públicas de cotizaciones. No reciben ningún dato de los usuarios: el servidor
 * consulta y guarda valores públicos. Cada fuente que falla se registra y se omite.
 */
@Injectable()
export class RateSources {
  private readonly logger = new Logger(RateSources.name);

  async fetchAll(): Promise<PublicRate[]> {
    const results = await Promise.allSettled([this.referenceRates(), this.dolarApi(), this.dolarApiOthers(), this.coinGecko()]);
    return results.flatMap((r, i) => {
      if (r.status === 'fulfilled') return r.value;
      this.logger.warn(`Fuente de cotizaciones ${i} falló: ${(r.reason as Error).message}`);
      return [];
    }).concat(FIXED);
  }

  /** Monedas principales contra el dólar: tipos de referencia del Banco Central Europeo (vía Frankfurter). */
  private async referenceRates(): Promise<PublicRate[]> {
    const data = frankfurter.parse(await this.get('https://api.frankfurter.dev/v1/latest?base=USD'));
    return Object.entries(data.rates).map(([quote, rate]) => ({ base: 'USD', quote, rateType: 'official', rate: String(rate), provider: 'ecb' }));
  }

  private async get(url: string): Promise<unknown> {
    const res = await fetch(url, { signal: AbortSignal.timeout(10_000), headers: { accept: 'application/json', 'user-agent': 'commit-app' } });
    if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
    return res.json();
  }

  /** Argentina (referente regional): el dólar en todas sus versiones contra el peso. */
  private async dolarApi(): Promise<PublicRate[]> {
    const items = z.array(dolarApiItem).parse(await this.get('https://dolarapi.com/v1/dolares'));
    return items.flatMap((i) => {
      const rateType = DOLAR_CASAS[i.casa];
      const rate = mid(i.compra, i.venta);
      return rateType && rate ? [{ base: 'USD', quote: 'ARS', rateType, rate, provider: 'dolarapi' }] : [];
    });
  }

  /** Otras monedas (EUR, BRL, CLP, UYU…) contra el peso, tipo oficial. */
  private async dolarApiOthers(): Promise<PublicRate[]> {
    const items = z.array(dolarApiItem).parse(await this.get('https://dolarapi.com/v1/cotizaciones'));
    return items.flatMap((i) => {
      const rate = mid(i.compra, i.venta);
      return i.moneda !== 'USD' && rate ? [{ base: i.moneda.toUpperCase(), quote: 'ARS', rateType: 'official', rate, provider: 'dolarapi' }] : [];
    });
  }

  /** Cripto en dólares y en pesos. */
  private async coinGecko(): Promise<PublicRate[]> {
    const ids = Object.keys(COINS).join(',');
    const data = coinGecko.parse(await this.get(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd,ars`));
    return Object.entries(data).flatMap(([id, prices]) => {
      const base = COINS[id];
      if (!base) return [];
      return (['usd', 'ars'] as const).flatMap((q) =>
        prices[q] ? [{ base, quote: q.toUpperCase(), rateType: 'market', rate: String(prices[q]), provider: 'coingecko' }] : [],
      );
    });
  }
}
