import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';

const DB = 'finanzas-cache';
const STORE = 'responses';

/** Error de red (sin conexión o servidor inalcanzable), no un error de la API. */
export const isNetworkError = (e: unknown) => e instanceof HttpErrorResponse && e.status === 0;

/**
 * Caché local en IndexedDB de las respuestas de la API, tal como llegan: los datos financieros
 * viajan y se guardan CIFRADOS (payload); se descifran en memoria solo tras desbloquear.
 * Sirve para abrir y consultar la app sin conexión (solo lectura).
 */
@Injectable({ providedIn: 'root' })
export class OfflineCacheService {
  readonly offline = signal(typeof navigator !== 'undefined' && !navigator.onLine);
  private db: Promise<IDBDatabase | null> | null = null;
  /**
   * Sube con cada clear(). Una respuesta pedida antes de cerrar sesión que llega después
   * no debe volver a escribir en el dispositivo: se descarta si la época cambió.
   */
  epoch = 0;

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.offline.set(false));
      window.addEventListener('offline', () => this.offline.set(true));
    }
  }

  private open(): Promise<IDBDatabase | null> {
    if (typeof indexedDB === 'undefined') return Promise.resolve(null);
    this.db ??= new Promise((resolve) => {
      const req = indexedDB.open(DB, 1);
      req.onupgradeneeded = () => req.result.createObjectStore(STORE);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    });
    return this.db;
  }

  async read<T>(key: string): Promise<T | undefined> {
    const db = await this.open();
    if (!db) return undefined;
    return new Promise((resolve) => {
      const req = db.transaction(STORE, 'readonly').objectStore(STORE).get(key);
      req.onsuccess = () => resolve(req.result as T | undefined);
      req.onerror = () => resolve(undefined);
    });
  }

  async write(key: string, value: unknown, epoch = this.epoch): Promise<void> {
    if (epoch !== this.epoch) return;
    const db = await this.open();
    if (!db || epoch !== this.epoch) return;
    await new Promise<void>((resolve) => {
      const tx = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).put(value, key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    });
  }

  /** Borra todo (al cerrar sesión: nada del usuario queda en el dispositivo). */
  async clear(): Promise<void> {
    this.epoch++;
    const db = await this.open();
    if (!db) return;
    await new Promise<void>((resolve) => {
      const tx = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).clear();
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    });
  }

  /** Pide a la red y guarda; sin conexión devuelve lo último guardado (o el error si no hay nada). */
  async cached<T>(key: string, fetch: () => Promise<T>): Promise<T> {
    const epoch = this.epoch;
    try {
      const value = await fetch();
      this.offline.set(false);
      void this.write(key, value, epoch);
      return value;
    } catch (e) {
      if (!isNetworkError(e)) throw e;
      this.offline.set(true);
      const stored = await this.read<T>(key);
      if (stored === undefined) throw e;
      return stored;
    }
  }
}
