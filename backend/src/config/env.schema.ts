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
  /** Prefijo de las colas de BullMQ en Redis. */
  QUEUE_PREFIX: z.string().default('bull'),
  RATES_REFRESH: z.stringbool().default(true),
  /** Intentos de login/registro por minuto y por IP (protege contra fuerza bruta). Subirlo solo en desarrollo. */
  AUTH_RATE_LIMIT: z.coerce.number().int().positive().default(10),
  // ── Facturas por WhatsApp (todo opcional: sin estas variables la función queda desactivada) ──
  /** Token que se configura en Meta para verificar el webhook. */
  WHATSAPP_VERIFY_TOKEN: z.string().default(''),
  /** App secret de Meta: valida la firma X-Hub-Signature-256 de cada webhook. */
  WHATSAPP_APP_SECRET: z.string().default(''),
  /** Token de acceso de la WhatsApp Cloud API. */
  WHATSAPP_TOKEN: z.string().default(''),
  WHATSAPP_PHONE_NUMBER_ID: z.string().default(''),
  /** Número público de Commit en WhatsApp (solo dígitos, con código de país), para el link wa.me. */
  WHATSAPP_DISPLAY_NUMBER: z.string().default(''),
  WHATSAPP_GRAPH_VERSION: z.string().default('v23.0'),
  /** Clave para el HMAC del número (si falta, se deriva de JWT_SECRET). */
  PHONE_HASH_KEY: z.string().default(''),
  /** Servicio de OCR propio (PaddleOCR). Sin él, la imagen se envía al modelo de IA. */
  OCR_URL: z.string().default(''),
  /** Clave de la API de Claude para extraer y clasificar. */
  ANTHROPIC_API_KEY: z.string().default(''),
  EXTRACTION_MODEL: z.string().default('claude-opus-5-5'),
  RECEIPTS_MONTHLY_LIMIT: z.coerce.number().int().positive().default(100),
  /** Exigir suscripción activa para procesar facturas (en desarrollo, false). */
  SUBSCRIPTIONS_ENFORCED: z.stringbool().default(false),
  /** Token de operador para ver /estado en producción (vacío = no accesible en producción). */
  STATUS_TOKEN: z.string().default(''),
  // ── Correo (verificación, contraseña olvidada, avisos) ──
  /** SMTP como URL: smtps://resend:<API_KEY>@smtp.resend.com:465 · smtp://<usuario>:<secreto>@smtp.azurecomm.net:587 */
  SMTP_URL: z.string().default(''),
  /** STARTTLS: required (por defecto), opportunistic o never (solo para Mailpit en desarrollo). */
  SMTP_STARTTLS: z.enum(['required', 'opportunistic', 'never']).default('required'),
  MAIL_FROM: z.string().default('Commit <no-reply@commit.local>'),
  /** URL pública de la app, para los enlaces de los correos. */
  APP_URL: z.string().default('http://localhost:4200'),
  /** Proxies delante del backend (para leer la IP real). Compose: 1 (nginx). Azure: 2 (balanceador + nginx). */
  TRUST_PROXY: z.coerce.number().int().min(0).max(5).default(1),
  CORS_ORIGINS: z
    .string()
    .default('http://localhost:4200')
    .transform((value) => value.split(',').map((origin) => origin.trim())),
});

export type Env = z.infer<typeof envSchema>;
