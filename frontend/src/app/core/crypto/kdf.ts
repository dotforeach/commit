import { getSodium } from './sodium';

export interface KdfParams {
  alg: 'argon2id13';
  opsLimit: number;
  memLimit: number;
}

/** Argon2id, 3 pasadas, 128 MiB: lento a propósito para frenar ataques de fuerza bruta. */
export const DEFAULT_KDF_PARAMS: KdfParams = {
  alg: 'argon2id13',
  opsLimit: 3,
  memLimit: 128 * 1024 * 1024,
};

let worker: Worker | null = null;
let seq = 0;
const pending = new Map<number, { resolve: (k: Uint8Array) => void; reject: (e: Error) => void }>();

function kdfWorker(): Worker | null {
  if (typeof Worker === 'undefined') return null;
  if (!worker) {
    worker = new Worker(new URL('./kdf.worker', import.meta.url), { type: 'module' });
    worker.onmessage = ({ data }) => {
      const p = pending.get(data.id);
      if (!p) return;
      pending.delete(data.id);
      if (data.error) p.reject(new Error(data.error));
      else p.resolve(new Uint8Array(data.key));
    };
    worker.onerror = () => {
      // Si el worker no arranca (navegador viejo, CSP), se vuelve al hilo principal.
      for (const p of pending.values()) p.reject(new Error('worker'));
      pending.clear();
      worker = null;
      disabled = true;
    };
  }
  return worker;
}
let disabled = false;

async function deriveOnMainThread(passphrase: string, salt: Uint8Array, params: KdfParams) {
  const s = await getSodium();
  return s.crypto_pwhash(32, passphrase, salt, params.opsLimit, params.memLimit, s.crypto_pwhash_ALG_ARGON2ID13);
}

/** Deriva una clave de 32 bytes a partir de la clave de descifrado (en un Web Worker si se puede). */
export async function deriveKeyFromPassphrase(passphrase: string, salt: Uint8Array, params: KdfParams): Promise<Uint8Array> {
  if (params.alg !== 'argon2id13') throw new Error(`KDF no soportado: ${params.alg}`);
  const normalized = passphrase.normalize('NFKC');
  const w = disabled ? null : kdfWorker();
  if (!w) return deriveOnMainThread(normalized, salt, params);
  const id = ++seq;
  try {
    return await new Promise<Uint8Array>((resolve, reject) => {
      pending.set(id, { resolve, reject });
      w.postMessage({ id, passphrase: normalized, salt, opsLimit: params.opsLimit, memLimit: params.memLimit });
    });
  } catch (e) {
    if ((e as Error).message === 'worker') return deriveOnMainThread(normalized, salt, params);
    throw e;
  }
}

export async function randomSalt(): Promise<Uint8Array> {
  const s = await getSodium();
  return s.randombytes_buf(s.crypto_pwhash_SALTBYTES);
}
