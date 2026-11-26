import { createHash } from 'node:crypto';

/** Campo con prefijo de largo (4 bytes big-endian): evita ambigüedades al concatenar. */
function lengthPrefixed(bytes: Uint8Array): Buffer {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(bytes.length);
  return Buffer.concat([len, bytes]);
}

export interface KeyUpdateFields {
  encryptedPrivateKeys?: Uint8Array;
  kdfSalt?: Uint8Array;
  kdfParams?: { alg: string; opsLimit: number; memLimit: number };
  recoveryEncryptedKeys?: Uint8Array;
  recoveryKdfSalt?: Uint8Array;
}

/**
 * Mensaje que el usuario firma (Ed25519) para reemplazar sus claves privadas cifradas.
 * DEBE coincidir byte a byte con frontend/src/app/core/crypto/key-update.ts.
 *   "finanzas:update-keys:v1:<userId>:<keyVersion>:" ‖ SHA-256(campos con prefijo de largo)
 * Un campo ausente cuenta como vacío (largo 0).
 */
export function keyUpdateSignedMessage(userId: string, keyVersion: number, fields: KeyUpdateFields): Buffer {
  const empty = new Uint8Array(0);
  const params = fields.kdfParams
    ? Buffer.from(`${fields.kdfParams.alg}:${fields.kdfParams.opsLimit}:${fields.kdfParams.memLimit}`, 'utf8')
    : empty;
  const digest = createHash('sha256')
    .update(lengthPrefixed(fields.encryptedPrivateKeys ?? empty))
    .update(lengthPrefixed(fields.kdfSalt ?? empty))
    .update(lengthPrefixed(params))
    .update(lengthPrefixed(fields.recoveryEncryptedKeys ?? empty))
    .update(lengthPrefixed(fields.recoveryKdfSalt ?? empty))
    .digest();
  return Buffer.concat([Buffer.from(`finanzas:update-keys:v1:${userId}:${keyVersion}:`, 'utf8'), digest]);
}
