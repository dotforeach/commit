import type { Identity } from './identity';

/**
 * Mantiene la bóveda desbloqueada al recargar la pestaña (F5), sin pedir de nuevo la clave.
 *
 * - Se guarda SOLO el par de claves (Identity), cifrado con AES-GCM usando una llave del
 *   navegador NO exportable (WebCrypto), que vive en IndexedDB.
 * - El texto cifrado vive en sessionStorage: es de esta pestaña y se borra al cerrarla.
 *   Otra pestaña, o el navegador reabierto, piden la clave de nuevo.
 * - Se borra al bloquear, al cerrar sesión y por inactividad. Si pasó el tiempo de bloqueo
 *   automático desde la última actividad, no se restaura.
 * - Las claves de los hogares no se guardan: al restaurar se vuelven a abrir y verificar.
 */
const SS_BLOB = 'commit.session.keys';
const SS_ACTIVE = 'commit.session.lastActive';
const DB = 'commit-session';
const STORE = 'wrapping-keys';
const KEY_ID = 'commit.session.keyId';
const AUTO_LOCK_MINUTES = 'finanzas.autoLockMinutes';

const supported = () => typeof indexedDB !== 'undefined' && typeof crypto !== 'undefined' && !!crypto.subtle && typeof sessionStorage !== 'undefined';

function db(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function idb<T>(mode: IDBTransactionMode, run: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  return db().then(
    (d) =>
      new Promise<T>((resolve, reject) => {
        const req = run(d.transaction(STORE, mode).objectStore(STORE));
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      }),
  );
}

/** Serializa las 4 claves con su largo (2 bytes) delante de cada una. */
export function packIdentity(i: Identity): Uint8Array<ArrayBuffer> {
  const parts = [i.boxPublicKey, i.boxSecretKey, i.signPublicKey, i.signSecretKey];
  const out = new Uint8Array(parts.reduce((n, p) => n + 2 + p.length, 0));
  let o = 0;
  for (const p of parts) {
    out[o] = p.length >> 8;
    out[o + 1] = p.length & 0xff;
    out.set(p, o + 2);
    o += 2 + p.length;
  }
  return out;
}

export function unpackIdentity(bytes: Uint8Array): Identity {
  const parts: Uint8Array[] = [];
  let o = 0;
  while (o < bytes.length) {
    const len = (bytes[o] << 8) | bytes[o + 1];
    parts.push(bytes.slice(o + 2, o + 2 + len));
    o += 2 + len;
  }
  if (parts.length !== 4) throw new Error('Formato de sesión inválido');
  const [boxPublicKey, boxSecretKey, signPublicKey, signSecretKey] = parts;
  return { boxPublicKey, boxSecretKey, signPublicKey, signSecretKey };
}

const b64 = (u: Uint8Array) => btoa(String.fromCharCode(...u));
const unb64 = (s: string) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

/** Registra actividad (para no restaurar una sesión que debería haberse bloqueado). */
export function touchSessionActivity(now = Date.now()) {
  if (supported() && sessionStorage.getItem(SS_BLOB)) sessionStorage.setItem(SS_ACTIVE, String(now));
}

export async function persistIdentity(identity: Identity): Promise<void> {
  if (!supported()) return;
  try {
    await forgetIdentity();
    const key = await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
    const id = crypto.randomUUID();
    await idb('readwrite', (s) => s.put({ key, createdAt: Date.now() }, id));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const plain = packIdentity(identity);
    const ct = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, plain));
    plain.fill(0);
    sessionStorage.setItem(KEY_ID, id);
    sessionStorage.setItem(SS_BLOB, `${b64(iv)}.${b64(ct)}`);
    sessionStorage.setItem(SS_ACTIVE, String(Date.now()));
    void cleanupOrphans(id);
  } catch {
    await forgetIdentity(); // si algo falla, simplemente se pedirá la clave al recargar
  }
}

export async function restoreIdentity(now = Date.now()): Promise<Identity | null> {
  if (!supported()) return null;
  const id = sessionStorage.getItem(KEY_ID);
  const blob = sessionStorage.getItem(SS_BLOB);
  if (!id || !blob) return null;
  const minutes = Number(localStorage.getItem(AUTO_LOCK_MINUTES) ?? 15);
  const lastActive = Number(sessionStorage.getItem(SS_ACTIVE) ?? 0);
  if (minutes > 0 && now - lastActive >= minutes * 60_000) {
    await forgetIdentity();
    return null;
  }
  try {
    const entry = await idb<{ key: CryptoKey } | undefined>('readonly', (s) => s.get(id));
    if (!entry) throw new Error('sin llave');
    const [iv, ct] = blob.split('.').map(unb64);
    const plain = new Uint8Array(await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, entry.key, ct));
    const identity = unpackIdentity(plain);
    plain.fill(0);
    return identity;
  } catch {
    await forgetIdentity();
    return null;
  }
}

export async function forgetIdentity(): Promise<void> {
  if (!supported()) return;
  const id = sessionStorage.getItem(KEY_ID);
  sessionStorage.removeItem(SS_BLOB);
  sessionStorage.removeItem(SS_ACTIVE);
  sessionStorage.removeItem(KEY_ID);
  if (id) await idb('readwrite', (s) => s.delete(id)).catch(() => undefined);
}

/** Llaves de pestañas ya cerradas (más de 1 día): no sirven sin su texto cifrado, se borran. */
async function cleanupOrphans(keep: string) {
  const keys = await idb<IDBValidKey[]>('readonly', (s) => s.getAllKeys());
  for (const k of keys) {
    if (k === keep) continue;
    const e = await idb<{ createdAt: number } | undefined>('readonly', (s) => s.get(k));
    if (!e || Date.now() - e.createdAt > 86_400_000) await idb('readwrite', (s) => s.delete(k));
  }
}
