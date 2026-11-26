import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable, Logger, type OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Queue } from 'bullmq';
import type { Env } from '../config/env.schema.js';
import { RatesService } from './rates.service.js';

export const RATES_QUEUE = 'rates';
const HOURLY = 60 * 60 * 1000;

/** Worker: cada ejecución trae y guarda las cotizaciones públicas. */
@Processor(RATES_QUEUE)
export class RatesProcessor extends WorkerHost {
  constructor(private readonly rates: RatesService) {
    super();
  }

  async process() {
    return { saved: await this.rates.refresh() };
  }
}

/**
 * Programa la actualización cada hora (un único job repetible: con varias instancias no se
 * duplica); la primera corre al arrancar. Desactivable con RATES_REFRESH=false (tests, sin red).
 */
@Injectable()
export class RatesScheduler implements OnApplicationBootstrap {
  private readonly logger = new Logger(RatesScheduler.name);

  constructor(
    @InjectQueue(RATES_QUEUE) private readonly queue: Queue,
    private readonly config: ConfigService<Env, true>,
  ) {}

  async onApplicationBootstrap() {
    if (!this.config.get('RATES_REFRESH', { infer: true })) {
      this.logger.log('Actualización automática de cotizaciones desactivada');
      return;
    }
    const jobOptions = { attempts: 3, backoff: { type: 'exponential', delay: 30_000 }, removeOnComplete: 50, removeOnFail: 50 } as const;
    // Con `every`, la primera ejecución es inmediata: no hace falta un job aparte al arrancar.
    await this.queue.upsertJobScheduler('rates-hourly', { every: HOURLY }, { name: 'refresh', opts: jobOptions });
  }
}
