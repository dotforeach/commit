/**
 * Tareas programadas de una sola pasada, para correr fuera del servidor HTTP
 * (Azure Container Apps Jobs con cron, cuando el backend escala a cero).
 *   node dist/cron.js reminders   → dispara los recordatorios vencidos
 *   node dist/cron.js rates       → actualiza las cotizaciones públicas
 * Solo usa PostgreSQL (no Redis ni colas). Termina con código 0 si todo salió bien.
 */
import { ConsoleLogger, Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { envSchema } from './config/env.schema.js';
import { PushService } from './notifications/push.service.js';
import { RemindersService } from './notifications/reminders.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { RateSources } from './rates/rate-sources.js';
import { RatesService } from './rates/rates.service.js';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, validationSchema: envSchema }), PrismaModule],
  providers: [PushService, RemindersService, RateSources, RatesService],
})
export class CronModule {}

export const CRON_TASKS = {
  reminders: async (app: { get: <T>(t: new (...a: never[]) => T) => T }) => ({ fired: await app.get(RemindersService).fireDue() }),
  rates: async (app: { get: <T>(t: new (...a: never[]) => T) => T }) => ({ saved: await app.get(RatesService).refresh() }),
} as const;

export async function runCron(task: string): Promise<Record<string, number>> {
  const run = CRON_TASKS[task as keyof typeof CRON_TASKS];
  if (!run) throw new Error(`Tarea desconocida: "${task}" (usa: ${Object.keys(CRON_TASKS).join(', ')})`);
  const app = await NestFactory.createApplicationContext(CronModule, {
    logger: new ConsoleLogger({ json: process.env.NODE_ENV === 'production', logLevels: ['log', 'warn', 'error', 'fatal'] }),
  });
  try {
    return await run(app);
  } finally {
    await app.close();
  }
}

// Ejecutado como script (no al importarlo desde los tests)
if (import.meta.url === `file://${process.argv[1]}`) {
  const task = process.argv[2] ?? '';
  try {
    const result = await runCron(task);
    new Logger('Cron').log(`${task}: ${JSON.stringify(result)}`);
    process.exit(0);
  } catch (err) {
    new Logger('Cron').error(`${task}: ${(err as Error).message}`);
    process.exit(1);
  }
}
