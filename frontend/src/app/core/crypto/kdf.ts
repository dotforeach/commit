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

/** Deriva una clave de 32 bytes a partir de la clave de descifrado del usuario. */
export async function deriveKeyFromPassphrase(
  passphrase: string,
  salt: Uint8Array,
  params: KdfParams,
): Promise<Uint8Array> {
  const s = await getSodium();
  if (params.alg !== 'argon2id13') throw new Error(`KDF no soportado: ${params.alg}`);
  return s.crypto_pwhash(32, passphrase.normalize('NFKC'), salt, params.opsLimit, params.memLimit, s.crypto_pwhash_ALG_ARGON2ID13);
}

export async function randomSalt(): Promise<Uint8Array> {
  const s = await getSodium();
  return s.randombytes_buf(s.crypto_pwhash_SALTBYTES);
}
