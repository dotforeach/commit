import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z.url(),
  REDIS_URL: z.url(),
  /** Firma de los access tokens (HS256): al menos 32 bytes. `openssl rand -base64 48` */
  JWT_SECRET: z.string().min(32),
  /** Actualización automática de cotizaciones (BullMQ). false en tests o sin red. */
  /** Web Push (opcional: sin claves no se envían pushes, solo notificaciones en la app). */
  VAPID_PUBLIC_KEY: z.string().default(''),
  VAPID_PRIVATE_KEY: z.string().default(''),
  VAPID_SUBJECT: z.string().default('mailto:admin@example.com'),
  /** Job de recordatorios (cada minuto). */
  REMINDERS_JOB: z.stringbool().default(true),
  RATES_REFRESH: z.stringbool().default(true),
  /** Intentos de login/registro por minuto y por IP (protege contra fuerza bruta). Subirlo solo en desarrollo. */
  AUTH_RATE_LIMIT: z.coerce.number().int().positive().default(10),
  CORS_ORIGINS: z
    .string()
    .default('http://localhost:4200')
    .transform((value) => value.split(',').map((origin) => origin.trim())),
});

export type Env = z.infer<typeof envSchema>;
