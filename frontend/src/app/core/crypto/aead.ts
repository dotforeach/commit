import { getSodium } from './sodium';

/** Formato: versión(1) ‖ nonce(24) ‖ ciphertext+tag. Ver docs/arquitectura-cifrado.md. */
const FORMAT_VERSION = 1;

export async function aeadEncrypt(plaintext: Uint8Array | string, key: Uint8Array, aad: string): Promise<Uint8Array> {
  const s = await getSodium();
  const nonce = s.randombytes_buf(s.crypto_aead_xchacha20poly1305_ietf_NPUBBYTES);
  const ciphertext = s.crypto_aead_xchacha20poly1305_ietf_encrypt(plaintext, aad, null, nonce, key);
  const out = new Uint8Array(1 + nonce.length + ciphertext.length);
  out[0] = FORMAT_VERSION;
  out.set(nonce, 1);
  out.set(ciphertext, 1 + nonce.length);
  return out;
}

/** Lanza si la clave es incorrecta, el dato fue alterado o el AAD no coincide. */
export async function aeadDecrypt(blob: Uint8Array, key: Uint8Array, aad: string): Promise<Uint8Array> {
  const s = await getSodium();
  if (blob[0] !== FORMAT_VERSION) throw new Error('Formato de cifrado desconocido');
  const nonceEnd = 1 + s.crypto_aead_xchacha20poly1305_ietf_NPUBBYTES;
  return s.crypto_aead_xchacha20poly1305_ietf_decrypt(null, blob.subarray(nonceEnd), aad, blob.subarray(1, nonceEnd), key);
}

/** AAD que ata un payload a su fila: si el servidor lo mueve de fila u hogar, no descifra. */
export function payloadAad(table: string, id: string, householdId: string, keyVersion: number): string {
  return `${table}:${id}:${householdId}:${keyVersion}`;
}

/** El JSON se pasa como string: libsodium lo codifica en UTF-8. */
export async function encryptPayload<T>(data: T, key: Uint8Array, aad: string): Promise<Uint8Array> {
  return aeadEncrypt(JSON.stringify(data), key, aad);
}

export async function decryptPayload<T>(blob: Uint8Array, key: Uint8Array, aad: string): Promise<T> {
  const s = await getSodium();
  return JSON.parse(s.to_string(await aeadDecrypt(blob, key, aad))) as T;
}
