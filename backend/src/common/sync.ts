import { z } from 'zod';

/**
 * Paginación por revisión (base de la sincronización). `since` = última revisión que el
 * cliente ya tiene; con `since` > 0 se incluyen lápidas (borrados) para que los aplique.
 */
export const syncQuerySchema = z.object({
  since: z.coerce.bigint().nonnegative().default(0n),
  limit: z.coerce.number().int().min(1).max(1000).default(500),
});
export type SyncQuery = z.infer<typeof syncQuerySchema>;

export function syncPage<T extends { revision: bigint }>(rows: T[], limit: number) {
  const hasMore = rows.length > limit;
  const page = hasMore ? rows.slice(0, limit) : rows;
  const last = page.at(-1);
  return { page, hasMore, nextSince: last ? last.revision.toString() : null };
}

/** "YYYY-MM-DD" ↔ columnas @db.Date (siempre en UTC, sin corrimientos por zona horaria). */
export const isoDate = z.iso.date().transform((d) => new Date(`${d}T00:00:00.000Z`));
export const toIsoDate = (d: Date) => d.toISOString().slice(0, 10);
