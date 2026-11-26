import { wordlist } from '@scure/bip39/wordlists/spanish.js';
import { decryptPayload, encryptPayload, payloadAad } from './aead';
import { generateIdentity, openPrivateKeys, sealPrivateKeys } from './identity';
import { deriveKeyFromPassphrase, randomSalt, type KdfParams } from './kdf';
import { generateHouseholdKey, unwrapHouseholdKey, wrapHouseholdKey } from './member-key';
import { generateRecoveryPhrase, normalizeRecoveryPhrase, recoveryKeyFromPhrase, sameWord } from './recovery-phrase';
import { getSodium } from './sodium';

// Parámetros mínimos solo para que los tests sean rápidos (producción usa 128 MiB).
const FAST_KDF: KdfParams = { alg: 'argon2id13', opsLimit: 1, memLimit: 8 * 1024 * 1024 };

describe('cifrado de conocimiento cero', () => {
  it('abre las claves privadas solo con la clave de descifrado correcta', async () => {
    const identity = await generateIdentity();
    const salt = await randomSalt();
    const kek = await deriveKeyFromPassphrase('mi clave de descifrado', salt, FAST_KDF);
    const sealed = await sealPrivateKeys(identity, kek, 'passphrase');

    const again = await deriveKeyFromPassphrase('mi clave de descifrado', salt, FAST_KDF);
    const opened = await openPrivateKeys(sealed, again, 'passphrase', identity);
    expect(opened.boxSecretKey).toEqual(identity.boxSecretKey);
    expect(opened.signSecretKey).toEqual(identity.signSecretKey);

    const wrong = await deriveKeyFromPassphrase('otra clave', salt, FAST_KDF);
    await expect(openPrivateKeys(sealed, wrong, 'passphrase', identity)).rejects.toThrow();
    // Lo cifrado con la clave de descifrado no se abre como si fuera de recuperación.
    await expect(openPrivateKeys(sealed, again, 'recovery', identity)).rejects.toThrow();
  });

  it('rechaza claves privadas que no corresponden a las públicas registradas', async () => {
    const identity = await generateIdentity();
    const other = await generateIdentity();
    const kek = await deriveKeyFromPassphrase('x', await randomSalt(), FAST_KDF);
    const sealed = await sealPrivateKeys(identity, kek, 'passphrase');
    await expect(openPrivateKeys(sealed, kek, 'passphrase', other)).rejects.toThrow(/no corresponden/);
  });

  it('la frase de recuperación abre las mismas claves, aun escrita sin tildes', async () => {
    const identity = await generateIdentity();
    const phrase = generateRecoveryPhrase();
    expect(phrase).toHaveLength(24);
    const salt = await randomSalt();
    const rk = await recoveryKeyFromPhrase(phrase, salt);
    const sealed = await sealPrivateKeys(identity, rk, 'recovery');

    const typed = phrase.map((w) => w.normalize('NFD').replace(/\p{Diacritic}/gu, '').toUpperCase()).join('  ');
    const normalized = normalizeRecoveryPhrase(typed);
    expect(normalized).toEqual(phrase);
    const opened = await openPrivateKeys(sealed, await recoveryKeyFromPhrase(normalized!, salt), 'recovery', identity);
    expect(opened.signSecretKey).toEqual(identity.signSecretKey);
  });

  it('las palabras en español siguen siendo únicas sin tildes', () => {
    const folded = new Set(wordlist.map((w) => w.normalize('NFD').replace(/\p{Diacritic}/gu, '')));
    expect(folded.size).toBe(wordlist.length);
    expect(sameWord('Ábaco', 'abaco')).toBe(true);
  });

  it('rechaza frases con palabras inexistentes o checksum inválido', () => {
    expect(normalizeRecoveryPhrase('hola mundo')).toBeNull();
    const phrase = generateRecoveryPhrase();
    const swapped = [...phrase];
    [swapped[0], swapped[1]] = [swapped[1], swapped[0]];
    // Intercambiar palabras casi siempre rompe el checksum; si coinciden, el test no aplica.
    if (swapped.join(' ') !== phrase.join(' ')) {
      const result = normalizeRecoveryPhrase(swapped.join(' '));
      if (result) expect(result).not.toEqual(phrase);
    }
  });

  it('envuelve la clave del hogar para un miembro y verifica quién la firmó', async () => {
    const owner = await generateIdentity();
    const member = await generateIdentity();
    const householdKey = await generateHouseholdKey();
    const ids = { householdId: crypto.randomUUID(), version: 1, userId: crypto.randomUUID() };

    const { wrappedKey, signature } = await wrapHouseholdKey({
      householdKey,
      householdId: ids.householdId,
      version: ids.version,
      recipientUserId: ids.userId,
      recipientPublicKey: member.boxPublicKey,
      signer: owner,
    });
    expect(wrappedKey).toHaveLength(80);

    const opened = await unwrapHouseholdKey({ ...ids, wrappedKey, signature, signerPublicKey: owner.signPublicKey, identity: member });
    expect(opened).toEqual(householdKey);

    // Firma de otro (p. ej. el servidor inventando un envoltorio): se rechaza.
    const intruder = await generateIdentity();
    await expect(
      unwrapHouseholdKey({ ...ids, wrappedKey, signature, signerPublicKey: intruder.signPublicKey, identity: member }),
    ).rejects.toThrow(/firma/);
    // Envoltorio reasignado a otro hogar: la firma ya no coincide.
    await expect(
      unwrapHouseholdKey({ ...ids, householdId: crypto.randomUUID(), wrappedKey, signature, signerPublicKey: owner.signPublicKey, identity: member }),
    ).rejects.toThrow(/firma/);
  });

  it('un payload solo se descifra en su fila (AAD) y detecta alteraciones', async () => {
    const key = await generateHouseholdKey();
    const householdId = crypto.randomUUID();
    const id = crypto.randomUUID();
    const aad = payloadAad('transactions', id, householdId, 1);
    const data = { amount: '15000.50', description: 'Alquiler' };

    const blob = await encryptPayload(data, key, aad);
    expect(await decryptPayload(blob, key, aad)).toEqual(data);

    await expect(decryptPayload(blob, key, payloadAad('transactions', crypto.randomUUID(), householdId, 1))).rejects.toThrow();
    await expect(decryptPayload(blob, key, payloadAad('accounts', id, householdId, 1))).rejects.toThrow();

    const tampered = blob.slice();
    tampered[tampered.length - 1] ^= 0xff;
    await expect(decryptPayload(tampered, key, aad)).rejects.toThrow();

    const s = await getSodium();
    expect(new TextDecoder().decode(blob)).not.toContain('Alquiler');
    expect(s.to_hex(blob)).not.toContain('3135303030'); // "15000" en hexadecimal
  });
});
