import { getSodium } from './sodium';

/**
 * Huella de las claves públicas de una persona: BLAKE2b-128 de (X25519 ‖ Ed25519) en 8 grupos de 4.
 * Se compara por otro medio (en persona, por teléfono) antes de darle acceso a un hogar:
 * así el servidor no puede hacerse pasar por ella con una clave propia.
 */
export async function keyFingerprint(publicKey: Uint8Array, signingPublicKey: Uint8Array): Promise<string> {
  const s = await getSodium();
  const both = new Uint8Array(publicKey.length + signingPublicKey.length);
  both.set(publicKey, 0);
  both.set(signingPublicKey, publicKey.length);
  const hex = s.to_hex(s.crypto_generichash(16, both, null));
  return hex.match(/.{4}/g)!.join(' ').toUpperCase();
}
