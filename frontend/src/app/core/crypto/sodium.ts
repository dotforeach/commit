export type Sodium = typeof import('libsodium-wrappers-sumo').default;

let sodiumPromise: Promise<Sodium> | null = null;

/**
 * libsodium inicializado (WASM). Se carga de forma diferida (~700 kB): no entra en el
 * bundle inicial, solo cuando hace falta cifrar o descifrar.
 */
export function getSodium(): Promise<Sodium> {
  sodiumPromise ??= import('libsodium-wrappers-sumo').then(async ({ default: sodium }) => {
    await sodium.ready;
    return sodium;
  });
  return sodiumPromise;
}

export async function toBase64(bytes: Uint8Array): Promise<string> {
  const s = await getSodium();
  return s.to_base64(bytes, s.base64_variants.ORIGINAL);
}

export async function fromBase64(value: string): Promise<Uint8Array> {
  const s = await getSodium();
  return s.from_base64(value, s.base64_variants.ORIGINAL);
}
