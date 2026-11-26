/// <reference lib="webworker" />
import sodium from 'libsodium-wrappers-sumo';

/**
 * Argon2id fuera del hilo principal: derivar 128 MiB tarda ~1 s y congelaba la pantalla.
 * Recibe { id, passphrase, salt, opsLimit, memLimit } y responde { id, key } (o { id, error }).
 */
addEventListener('message', async ({ data }) => {
  try {
    await sodium.ready;
    const key = sodium.crypto_pwhash(32, data.passphrase, data.salt, data.opsLimit, data.memLimit, sodium.crypto_pwhash_ALG_ARGON2ID13);
    postMessage({ id: data.id, key }, [key.buffer]);
  } catch (e) {
    postMessage({ id: data.id, error: (e as Error).message });
  }
});
