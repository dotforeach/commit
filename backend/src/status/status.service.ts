import { InjectQueue } from '@nestjs/bullmq';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Queue } from 'bullmq';
import type { Redis } from 'ioredis';
import type { Env } from '../config/env.schema.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { REDIS } from '../redis/redis.constants.js';

export type NodeState = 'up' | 'down' | 'disabled' | 'configured';
export interface StatusNode {
  id: string;
  state: NodeState;
  latencyMs: number | null;
  details: Record<string, string | number | boolean | null>;
}

/** Mide cuánto tarda una verificación y la marca caída si falla o tarda más que el límite. */
async function probe(fn: () => Promise<StatusNode['details']>, timeoutMs = 3000): Promise<Omit<StatusNode, 'id'>> {
  const start = performance.now();
  try {
    const details = await Promise.race([fn(), new Promise<never>((_, reject) => setTimeout(() => reject(new Error('timeout')), timeoutMs))]);
    return { state: 'up', latencyMs: Math.round(performance.now() - start), details };
  } catch (e) {
    return { state: 'down', latencyMs: null, details: { error: (e as Error).message.slice(0, 120) } };
  }
}

/**
 * Estado en vivo de la infraestructura (para la página /estado). Sin datos de usuarios: solo
 * versiones, latencias, colas y conteos agregados.
 */
@Injectable()
export class StatusService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService<Env, true>,
    @Inject(REDIS) private readonly redis: Redis,
    @InjectQueue('reminders') private readonly reminders: Queue,
    @InjectQueue('rates') private readonly rates: Queue,
    @InjectQueue('receipts') private readonly receipts: Queue,
  ) {}

  async snapshot() {
    const get = <K extends keyof Env>(k: K) => this.config.get(k, { infer: true }) as Env[K];
    const ocrUrl = get('OCR_URL').replace(/\/$/, '');
    const whatsapp = !!(get('WHATSAPP_TOKEN') && get('WHATSAPP_PHONE_NUMBER_ID') && get('WHATSAPP_APP_SECRET'));

    const [postgres, redis, queues, ocr, rates] = await Promise.all([
      probe(async () => {
        const [{ version }] = await this.prisma.$queryRaw<{ version: string }[]>`SELECT current_setting('server_version') AS version`;
        const [mig] = await this.prisma.$queryRaw<{ count: bigint; last: string | null }[]>`
          SELECT count(*)::bigint AS count, max(migration_name) AS last FROM _prisma_migrations WHERE finished_at IS NOT NULL`;
        const [{ size }] = await this.prisma.$queryRaw<{ size: string }[]>`SELECT pg_size_pretty(pg_database_size(current_database())) AS size`;
        return { version, migrations: Number(mig.count), lastMigration: mig.last, size };
      }),
      probe(async () => {
        await this.redis.ping();
        const info = await this.redis.info('server');
        const mem = await this.redis.info('memory');
        const field = (text: string, key: string) => new RegExp(`^${key}:(.*)$`, 'm').exec(text)?.[1]?.trim() ?? null;
        return { version: field(info, 'redis_version'), memory: field(mem, 'used_memory_human') };
      }),
      probe(async () => {
        const out: Record<string, string> = {};
        for (const [name, q] of [['reminders', this.reminders], ['rates', this.rates], ['receipts', this.receipts]] as const) {
          const c = await q.getJobCounts('waiting', 'active', 'delayed', 'failed');
          out[name] = `${c['waiting'] ?? 0} en espera · ${c['active'] ?? 0} activos · ${c['failed'] ?? 0} fallidos`;
        }
        out['prefix'] = get('QUEUE_PREFIX');
        return out;
      }),
      ocrUrl
        ? probe(async () => {
            const res = await fetch(`${ocrUrl}/health`, { signal: AbortSignal.timeout(2500) });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return { url: ocrUrl, engine: 'RapidOCR (ONNX)' };
          })
        : Promise.resolve({ state: 'disabled' as const, latencyMs: null, details: { hint: 'Define OCR_URL para activarlo' } }),
      probe(async () => {
        const rows = await this.prisma.$queryRaw<{ provider: string; last: Date; count: bigint }[]>`
          SELECT provider, max("createdAt") AS last, count(*)::bigint AS count FROM exchange_rates
          WHERE date >= current_date - 7 GROUP BY provider ORDER BY provider`;
        return Object.fromEntries(rows.map((r) => [r.provider, `${Number(r.count)} · ${r.last.toISOString().slice(0, 16).replace('T', ' ')} UTC`]));
      }),
    ]);

    const nodes: StatusNode[] = [
      {
        id: 'backend',
        state: 'up',
        latencyMs: 0,
        details: {
          version: '0.1.0',
          node: process.version,
          uptime: `${Math.round(process.uptime() / 60)} min`,
          memory: `${Math.round(process.memoryUsage().rss / 1048576)} MB`,
          env: get('NODE_ENV'),
        },
      },
      { id: 'postgres', ...postgres },
      { id: 'redis', ...redis },
      { id: 'queues', ...queues },
      { id: 'ocr', ...ocr },
      { id: 'whatsapp', state: whatsapp ? 'configured' : 'disabled', latencyMs: null, details: { number: get('WHATSAPP_DISPLAY_NUMBER') || null } },
      { id: 'ai', state: get('ANTHROPIC_API_KEY') ? 'configured' : 'disabled', latencyMs: null, details: { model: get('EXTRACTION_MODEL') } },
      { id: 'rates', ...rates, state: rates.state === 'up' && Object.keys(rates.details).length === 0 ? 'disabled' : rates.state },
      { id: 'push', state: get('VAPID_PUBLIC_KEY') ? 'configured' : 'disabled', latencyMs: null, details: {} },
    ];
    return { generatedAt: new Date().toISOString(), nodes };
  }
}
