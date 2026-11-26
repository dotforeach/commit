import { createPublicKey, verify } from 'node:crypto';

/**
 * Mensaje que firma quien envuelve la clave de un hogar para un miembro.
 * DEBE coincidir byte a byte con frontend/src/app/core/crypto/member-key.ts.
 */
export function memberKeySignedMessage(
  householdId: string,
  version: number,
  userId: string,
  wrappedKey: Uint8Array,
): Buffer {
  const prefix = Buffer.from(`finanzas:member-key:v1:${householdId}:${version}:${userId}:`, 'utf8');
  return Buffer.concat([prefix, wrappedKey]);
}

/** Verifica una firma Ed25519 con una clave pública cruda de 32 bytes. */
export function verifyEd25519(rawPublicKey: Uint8Array, message: Uint8Array, signature: Uint8Array) {
  const key = createPublicKey({
    key: { kty: 'OKP', crv: 'Ed25519', x: Buffer.from(rawPublicKey).toString('base64url') },
    format: 'jwk',
  });
  return verify(null, message, key, signature);
}
