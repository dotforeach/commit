import type { Identity } from './identity';
import type { KdfParams } from './kdf';
import { getSodium } from './sodium';

export interface KeyUpdateFields {
  encryptedPrivateKeys?: Uint8Array;
  kdfSalt?: Uint8Array;
  kdfParams?: KdfParams;
  recoveryEncryptedKeys?: Uint8Array;
  recoveryKdfSalt?: Uint8Array;
}

function lengthPrefixed(bytes: Uint8Array): Uint8Array {
  const out = new Uint8Array(4 + bytes.length);
  new DataView(out.buffer).setUint32(0, bytes.length, false);
  out.set(bytes, 4);
  return out;
}

function concat(parts: Uint8Array[]): Uint8Array {
  const out = new Uint8Array(parts.reduce((n, p) => n + p.length, 0));
  let offset = 0;
  for (const p of parts) {
    out.set(p, offset);
    offset += p.length;
  }
  return out;
}

/** Copia a un Uint8Array propio (en jsdom, TextEncoder devuelve uno de otro realm). */
const utf8 = (text: string) => Uint8Array.from(new TextEncoder().encode(text));

/**
 * Mensaje firmado para reemplazar las claves privadas cifradas.
 * DEBE coincidir byte a byte con backend/src/users/key-update-signature.ts.
 */
export async function keyUpdateSignedMessage(userId: string, keyVersion: number, f: KeyUpdateFields): Promise<Uint8Array> {
  const s = await getSodium();
  const empty = new Uint8Array(0);
  const params = f.kdfParams ? utf8(`${f.kdfParams.alg}:${f.kdfParams.opsLimit}:${f.kdfParams.memLimit}`) : empty;
  const digest = s.crypto_hash_sha256(
    concat([
      lengthPrefixed(f.encryptedPrivateKeys ?? empty),
      lengthPrefixed(f.kdfSalt ?? empty),
      lengthPrefixed(params),
      lengthPrefixed(f.recoveryEncryptedKeys ?? empty),
      lengthPrefixed(f.recoveryKdfSalt ?? empty),
    ]),
  );
  return concat([utf8(`finanzas:update-keys:v1:${userId}:${keyVersion}:`), digest]);
}

export async function signKeyUpdate(identity: Identity, userId: string, keyVersion: number, f: KeyUpdateFields) {
  const s = await getSodium();
  return s.crypto_sign_detached(await keyUpdateSignedMessage(userId, keyVersion, f), identity.signSecretKey);
}
