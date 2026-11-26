import { z } from 'zod';

/**
 * Paginación por revisión (base de la sincronización). `since` = última revisión que el
 * cliente ya tiene; con `since` > 0 se incluyen lápidas (borrados) para que los aplique.
 */
/** Revisión: viaja como string de dígitos (JSON no tiene enteros de 64 bits) y se usa como BigInt. */
export const revision = z.string().regex(/^\d{1,19}$/, 'Revisión inválida').transform((s) => BigInt(s));

export const syncQuerySchema = z.object({
  since: z.string().regex(/^\d{1,19}$/).default('0').transform((s) => BigInt(s)),
  limit: z.coerce.number().int().min(1).max(1000).default(500),
});
export type SyncQuery = z.infer<typeof syncQuerySchema>;

/**
 * Las revisiones salen de una secuencia, pero una transacción que empezó antes puede hacerse
 * visible después que otra más nueva. Para no saltearla, el cursor que el cliente GUARDA no avanza
 * más allá de filas modificadas en los últimos SAFE_LAG_MS: esas se vuelven a pedir la próxima vez.
 */
export const SAFE_LAG_MS = 10_000;

export function syncPage<T extends { revision: bigint; updatedAt: Date }>(rows: T[], limit: number, now = Date.now()) {
  const hasMore = rows.length > limit;
  const page = hasMore ? rows.slice(0, limit) : rows;
  const last = page.at(-1);
  const firstYoung = page.find((r) => now - r.updatedAt.getTime() < SAFE_LAG_MS);
  return {
    page,
    hasMore,
    /** Para pedir la página siguiente. */
    nextSince: last ? last.revision.toString() : null,
    /** Revisión más baja de esta página que todavía es "reciente" (null si no hay). */
    firstYoungRevision: firstYoung ? firstYoung.revision.toString() : null,
  };
}

/** "YYYY-MM-DD" ↔ columnas @db.Date (siempre en UTC, sin corrimientos por zona horaria). */
export const isoDate = z.iso.date().transform((d) => new Date(`${d}T00:00:00.000Z`));
export const toIsoDate = (d: Date) => d.toISOString().slice(0, 10);
