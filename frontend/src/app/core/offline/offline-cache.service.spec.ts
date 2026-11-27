import { TestBed } from '@angular/core/testing';
import { OfflineCacheService } from './offline-cache.service';

describe('OfflineCacheService', () => {
  it('una respuesta que llega después de clear() (cerrar sesión) no se guarda', async () => {
    const cache = TestBed.inject(OfflineCacheService);
    const puts: string[] = [];
    // IndexedDB de mentira: registra cada escritura
    const store = { put: (_v: unknown, k: string) => puts.push(k), clear: () => undefined };
    const tx = { objectStore: () => store, oncomplete: null as null | (() => void), onerror: null };
    const db = { transaction: () => { queueMicrotask(() => tx.oncomplete?.()); return tx; } };
    (cache as unknown as { open: () => Promise<unknown> }).open = async () => db;

    let resolve!: (v: string) => void;
    const pending = cache.cached('/api/me', () => new Promise<string>((r) => (resolve = r)));
    await cache.clear(); // se cierra sesión mientras el pedido está en vuelo
    resolve('datos');
    await pending;
    await new Promise((r) => setTimeout(r, 0));
    expect(puts).toEqual([]);

    // Un pedido nuevo (después del clear) sí se guarda
    await cache.cached('/api/me', async () => 'nuevo');
    await new Promise((r) => setTimeout(r, 0));
    expect(puts).toEqual(['/api/me']);
  });
});
