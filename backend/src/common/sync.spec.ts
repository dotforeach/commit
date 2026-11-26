import { SAFE_LAG_MS, syncPage } from './sync.js';

const row = (revision: number, ageMs: number, now: number) => ({ revision: BigInt(revision), updatedAt: new Date(now - ageMs) });

describe('syncPage', () => {
  const now = Date.parse('2026-11-26T12:00:00Z');

  it('pagina y marca la primera fila reciente (para no avanzar el cursor guardado sobre ella)', () => {
    const rows = [row(1, 60_000, now), row(2, SAFE_LAG_MS - 1, now), row(3, 5, now)];
    expect(syncPage(rows, 10, now)).toMatchObject({ hasMore: false, nextSince: '3', firstYoungRevision: '2' });
  });

  it('sin filas recientes no hay marca', () => {
    expect(syncPage([row(5, 60_000, now)], 10, now).firstYoungRevision).toBeNull();
  });

  it('hasMore cuando hay más filas que el límite', () => {
    const p = syncPage([row(1, 60_000, now), row(2, 60_000, now), row(3, 60_000, now)], 2, now);
    expect(p).toMatchObject({ hasMore: true, nextSince: '2' });
    expect(p.page).toHaveLength(2);
  });
});
