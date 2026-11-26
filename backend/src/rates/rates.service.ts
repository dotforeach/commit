import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { RateSources } from './rate-sources.js';

/** Fecha "de hoy" en Argentina (las cotizaciones se guardan una por día). */
export function argentinaToday(now = new Date()): Date {
  const iso = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Argentina/Buenos_Aires' }).format(now);
  return new Date(`${iso}T00:00:00.000Z`);
}

@Injectable()
export class RatesService {
  private readonly logger = new Logger(RatesService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly sources: RateSources,
  ) {}

  /** Trae las cotizaciones públicas y guarda (o actualiza) el valor del día. Devuelve cuántas guardó. */
  async refresh(): Promise<number> {
    const rates = await this.sources.fetchAll();
    const known = new Set((await this.prisma.currency.findMany({ select: { code: true } })).map((c) => c.code));
    const date = argentinaToday();
    let saved = 0;
    for (const r of rates) {
      if (!known.has(r.base) || !known.has(r.quote)) continue;
      await this.prisma.exchangeRate.upsert({
        where: { base_quote_rateType_date_provider: { base: r.base, quote: r.quote, rateType: r.rateType, date, provider: r.provider } },
        create: { base: r.base, quote: r.quote, rateType: r.rateType, date, provider: r.provider, rate: r.rate },
        update: { rate: r.rate },
      });
      saved++;
    }
    this.logger.log(`Cotizaciones actualizadas: ${saved}`);
    return saved;
  }

  /** La cotización más reciente de cada par/tipo/proveedor (de los últimos 30 días). */
  async latest() {
    const since = argentinaToday();
    since.setUTCDate(since.getUTCDate() - 30);
    const rows = await this.prisma.exchangeRate.findMany({ where: { date: { gte: since } }, orderBy: { date: 'desc' } });
    const seen = new Set<string>();
    const items = [];
    for (const r of rows) {
      const key = `${r.base}/${r.quote}/${r.rateType}/${r.provider}`;
      if (seen.has(key)) continue;
      seen.add(key);
      items.push({ base: r.base, quote: r.quote, rateType: r.rateType, provider: r.provider, rate: r.rate.toString(), date: r.date.toISOString().slice(0, 10), updatedAt: r.createdAt });
    }
    return { items };
  }
}
