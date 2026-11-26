import type { Identity } from './identity';
import { getSodium } from './sodium';

/**
 * Mensaje firmado al envolver la clave de un hogar para un miembro.
 * DEBE coincidir byte a byte con backend/src/auth/member-key-signature.ts.
 */
export function memberKeySignedMessage(householdId: string, version: number, userId: string, wrappedKey: Uint8Array) {
  const prefix = new TextEncoder().encode(`finanzas:member-key:v1:${householdId}:${version}:${userId}:`);
  const out = new Uint8Array(prefix.length + wrappedKey.length);
  out.set(prefix, 0);
  out.set(wrappedKey, prefix.length);
  return out;
}

export async function generateHouseholdKey(): Promise<Uint8Array> {
  return (await getSodium()).crypto_aead_xchacha20poly1305_ietf_keygen();
}

/** Envuelve (sealed box) la clave del hogar para un miembro y firma el resultado. */
export async function wrapHouseholdKey(args: {
  householdKey: Uint8Array;
  householdId: string;
  version: number;
  recipientUserId: string;
  recipientPublicKey: Uint8Array;
  signer: Identity;
}): Promise<{ wrappedKey: Uint8Array; signature: Uint8Array }> {
  const s = await getSodium();
  const wrappedKey = s.crypto_box_seal(args.householdKey, args.recipientPublicKey);
  const message = memberKeySignedMessage(args.householdId, args.version, args.recipientUserId, wrappedKey);
  return { wrappedKey, signature: s.crypto_sign_detached(message, args.signer.signSecretKey) };
}

/** Verifica quién envolvió la clave y la abre con la identidad del usuario. */
export async function unwrapHouseholdKey(args: {
  wrappedKey: Uint8Array;
  signature: Uint8Array;
  householdId: string;
  version: number;
  userId: string;
  signerPublicKey: Uint8Array;
  identity: Identity;
}): Promise<Uint8Array> {
  const s = await getSodium();
  const message = memberKeySignedMessage(args.householdId, args.version, args.userId, args.wrappedKey);
  if (!s.crypto_sign_verify_detached(args.signature, message, args.signerPublicKey)) {
    throw new Error('La firma de la clave del hogar no es válida');
  }
  return s.crypto_box_seal_open(args.wrappedKey, args.identity.boxPublicKey, args.identity.boxSecretKey);
}
