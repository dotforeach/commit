import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z.url(),
  REDIS_URL: z.url(),
  /** Firma de los access tokens (HS256): al menos 32 bytes. `openssl rand -base64 48` */
  JWT_SECRET: z.string().min(32),
  /** Actualización automática de cotizaciones (BullMQ). false en tests o sin red. */
  RATES_REFRESH: z.stringbool().default(true),
  CORS_ORIGINS: z
    .string()
    .default('http://localhost:4200')
    .transform((value) => value.split(',').map((origin) => origin.trim())),
});

export type Env = z.infer<typeof envSchema>;
