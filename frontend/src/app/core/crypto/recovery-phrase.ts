import { generateMnemonic, mnemonicToEntropy, validateMnemonic } from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/spanish.js';
import { getSodium } from './sodium';

/** Sin tildes ni mayúsculas, para que el usuario pueda escribir "abaco" en vez de "ábaco". */
const fold = (word: string) => word.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
const byFolded = new Map(wordlist.map((w) => [fold(w), w]));

/** 24 palabras en español (BIP39, 256 bits de entropía). */
export function generateRecoveryPhrase(): string[] {
  return generateMnemonic(wordlist, 256).split(' ');
}

/** Normaliza lo que escribió el usuario a las palabras oficiales, o null si alguna no existe. */
export function normalizeRecoveryPhrase(input: string): string[] | null {
  const words = input.trim().split(/\s+/).map((w) => byFolded.get(fold(w)));
  if (words.some((w) => w === undefined)) return null;
  const phrase = words as string[];
  return validateMnemonic(phrase.join(' '), wordlist) ? phrase : null;
}

export function sameWord(a: string, b: string): boolean {
  return fold(a.trim()) === fold(b.trim());
}

/**
 * Clave de 32 bytes derivada de la frase. La frase ya tiene 256 bits de entropía,
 * así que basta un hash con clave (BLAKE2b) con la sal del usuario.
 */
export async function recoveryKeyFromPhrase(phrase: string[], salt: Uint8Array): Promise<Uint8Array> {
  const s = await getSodium();
  const entropy = mnemonicToEntropy(phrase.join(' '), wordlist);
  try {
    return s.crypto_generichash(32, entropy, salt);
  } finally {
    s.memzero(entropy);
  }
}
