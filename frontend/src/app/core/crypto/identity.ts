import { aeadDecrypt, aeadEncrypt } from './aead';
import { getSodium } from './sodium';

/** Par de claves del usuario: X25519 (recibir claves de hogar) + Ed25519 (firmar envoltorios). */
export interface Identity {
  boxPublicKey: Uint8Array;
  boxSecretKey: Uint8Array;
  signPublicKey: Uint8Array;
  signSecretKey: Uint8Array;
}

export type SealContext = 'passphrase' | 'recovery';
const sealAad = (context: SealContext) => `finanzas:user-keys:v1:${context}`;

export async function generateIdentity(): Promise<Identity> {
  const s = await getSodium();
  const box = s.crypto_box_keypair();
  const sign = s.crypto_sign_keypair();
  return {
    boxPublicKey: box.publicKey,
    boxSecretKey: box.privateKey,
    signPublicKey: sign.publicKey,
    signSecretKey: sign.privateKey,
  };
}

/** Cifra las dos claves privadas (32 + 64 bytes) con una clave derivada. */
export async function sealPrivateKeys(identity: Identity, key: Uint8Array, context: SealContext): Promise<Uint8Array> {
  const plain = new Uint8Array(32 + 64);
  plain.set(identity.boxSecretKey, 0);
  plain.set(identity.signSecretKey, 32);
  try {
    return await aeadEncrypt(plain, key, sealAad(context));
  } finally {
    (await getSodium()).memzero(plain);
  }
}

/**
 * Abre las claves privadas. Lanza si la clave derivada es incorrecta (clave de descifrado
 * o frase equivocada) o si no corresponden a las públicas registradas.
 */
export async function openPrivateKeys(
  blob: Uint8Array,
  key: Uint8Array,
  context: SealContext,
  expected: { boxPublicKey: Uint8Array; signPublicKey: Uint8Array },
): Promise<Identity> {
  const s = await getSodium();
  const plain = await aeadDecrypt(blob, key, sealAad(context));
  const boxSecretKey = plain.slice(0, 32);
  const signSecretKey = plain.slice(32, 96);
  s.memzero(plain);
  const boxPublicKey = s.crypto_scalarmult_base(boxSecretKey);
  const signPublicKey = s.crypto_sign_ed25519_sk_to_pk(signSecretKey);
  if (!s.memcmp(boxPublicKey, expected.boxPublicKey) || !s.memcmp(signPublicKey, expected.signPublicKey)) {
    throw new Error('Las claves privadas no corresponden a las públicas registradas');
  }
  return { boxPublicKey, boxSecretKey, signPublicKey, signSecretKey };
}

export async function wipeIdentity(identity: Identity): Promise<void> {
  const s = await getSodium();
  s.memzero(identity.boxSecretKey);
  s.memzero(identity.signSecretKey);
}
