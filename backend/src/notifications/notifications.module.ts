import { BullModule, InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable, Logger, Module, type OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Queue } from 'bullmq';
import type { Env } from '../config/env.schema.js';
import { HouseholdsModule } from '../households/households.module.js';
import { NotificationsController } from './notifications.controller.js';
import { PushService } from './push.service.js';
import { RemindersService } from './reminders.service.js';

const QUEUE = 'reminders';

@Processor(QUEUE)
export class RemindersProcessor extends WorkerHost {
  constructor(private readonly reminders: RemindersService) {
    super();
  }

  async process() {
    return { fired: await this.reminders.fireDue() };
  }
}

/** Revisa recordatorios vencidos cada minuto (un único job repetible). REMINDERS_JOB=false lo apaga. */
@Injectable()
export class RemindersScheduler implements OnApplicationBootstrap {
  private readonly logger = new Logger(RemindersScheduler.name);

  constructor(
    @InjectQueue(QUEUE) private readonly queue: Queue,
    private readonly config: ConfigService<Env, true>,
  ) {}

  async onApplicationBootstrap() {
    if (!this.config.get('REMINDERS_JOB', { infer: true })) {
      // Sin el job interno (p. ej. Azure: lo dispara una tarea programada): limpiar el programado previo
      await this.queue.removeJobScheduler('reminders-every-minute');
      this.logger.log('Job de recordatorios desactivado');
      return;
    }
    await this.queue.upsertJobScheduler('reminders-every-minute', { every: 60_000 }, { name: 'fire', opts: { removeOnComplete: 20, removeOnFail: 50 } });
  }
}

@Module({
  imports: [HouseholdsModule, BullModule.registerQueue({ name: QUEUE })],
  controllers: [NotificationsController],
  providers: [PushService, RemindersService, RemindersProcessor, RemindersScheduler],
  exports: [PushService],
})
export class NotificationsModule {}
