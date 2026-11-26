import { Injectable, computed, signal } from '@angular/core';
import type { MeResponse } from '../api/api.types';
import { openPrivateKeys, sealPrivateKeys, wipeIdentity, type Identity } from './identity';
import { DEFAULT_KDF_PARAMS, deriveKeyFromPassphrase, randomSalt } from './kdf';
import { signKeyUpdate } from './key-update';
import { recoveryKeyFromPhrase } from './recovery-phrase';
import { unwrapHouseholdKey } from './member-key';
import { fromBase64, getSodium, toBase64 } from './sodium';

export class WrongPassphraseError extends Error {
  constructor() {
    super('Clave de descifrado incorrecta');
  }
}

export class WrongRecoveryPhraseError extends Error {
  constructor() {
    super('Frase de recuperación incorrecta');
  }
}

/** Cuerpo de PUT /api/me/keys. */
export interface UpdateKeysRequest {
  keyVersion: number;
  passphrase: { encryptedPrivateKeys: string; kdfSalt: string; kdfParams: typeof DEFAULT_KDF_PARAMS };
  signature: string;
}

/**
 * Bóveda de claves en memoria. Nada de esto se guarda en localStorage, IndexedDB ni cookies:
 * al recargar, bloquear o cerrar sesión, hay que volver a ingresar la clave de descifrado.
 */
@Injectable({ providedIn: 'root' })
export class KeyVaultService {
  private readonly identity = signal<Identity | null>(null);
  /** householdId → versión → clave */
  private householdKeys = new Map<string, Map<number, Uint8Array>>();

  readonly isUnlocked = computed(() => this.identity() !== null);

  async unlockWithPassphrase(me: MeResponse, passphrase: string): Promise<void> {
    const identity = await this.openWithPassphrase(me, passphrase);
    await this.unlockWithIdentity(me, identity);
  }

  /** Abre las claves privadas con la clave de descifrado, sin desbloquear la bóveda. */
  async openWithPassphrase(me: MeResponse, passphrase: string): Promise<Identity> {
    const kek = await deriveKeyFromPassphrase(passphrase, await fromBase64(me.keys.kdfSalt), me.keys.kdfParams);
    try {
      return await openPrivateKeys(await fromBase64(me.keys.encryptedPrivateKeys), kek, 'passphrase', await this.expectedPublicKeys(me));
    } catch {
      throw new WrongPassphraseError();
    } finally {
      (await getSodium()).memzero(kek);
    }
  }

  /** Abre las claves privadas con la frase de recuperación (24 palabras ya normalizadas). */
  async openWithRecoveryPhrase(me: MeResponse, phrase: string[]): Promise<Identity> {
    const rk = await recoveryKeyFromPhrase(phrase, await fromBase64(me.keys.recoveryKdfSalt));
    try {
      return await openPrivateKeys(await fromBase64(me.keys.recoveryEncryptedKeys), rk, 'recovery', await this.expectedPublicKeys(me));
    } catch {
      throw new WrongRecoveryPhraseError();
    } finally {
      (await getSodium()).memzero(rk);
    }
  }

  async unlockWithIdentity(me: MeResponse, identity: Identity): Promise<void> {
    await this.loadHouseholdKeys(me, identity);
    this.identity.set(identity);
  }

  /**
   * Arma el pedido para cifrar las claves privadas con una clave de descifrado nueva,
   * firmado con la clave privada (el servidor exige esa firma).
   */
  async buildPassphraseChange(me: MeResponse, identity: Identity, newPassphrase: string): Promise<UpdateKeysRequest> {
    const s = await getSodium();
    const kdfSalt = await randomSalt();
    const kek = await deriveKeyFromPassphrase(newPassphrase, kdfSalt, DEFAULT_KDF_PARAMS);
    const encryptedPrivateKeys = await sealPrivateKeys(identity, kek, 'passphrase');
    s.memzero(kek);
    const signature = await signKeyUpdate(identity, me.user.id, me.keys.keyVersion, {
      encryptedPrivateKeys,
      kdfSalt,
      kdfParams: DEFAULT_KDF_PARAMS,
    });
    return {
      keyVersion: me.keys.keyVersion,
      passphrase: {
        encryptedPrivateKeys: await toBase64(encryptedPrivateKeys),
        kdfSalt: await toBase64(kdfSalt),
        kdfParams: DEFAULT_KDF_PARAMS,
      },
      signature: await toBase64(signature),
    };
  }

  private async expectedPublicKeys(me: MeResponse) {
    return {
      boxPublicKey: await fromBase64(me.keys.publicKey),
      signPublicKey: await fromBase64(me.keys.signingPublicKey),
    };
  }

  /** Tras el registro: las claves ya están en memoria, no hace falta derivarlas de nuevo. */
  setUnlocked(identity: Identity, householdKeys: Map<string, Map<number, Uint8Array>>) {
    this.householdKeys = householdKeys;
    this.identity.set(identity);
  }

  householdKey(householdId: string, version: number): Uint8Array {
    const key = this.householdKeys.get(householdId)?.get(version);
    if (!key) throw new Error('No tenés acceso a la clave de este hogar');
    return key;
  }

  async lock(): Promise<void> {
    const s = await getSodium();
    const identity = this.identity();
    if (identity) await wipeIdentity(identity);
    for (const versions of this.householdKeys.values()) for (const key of versions.values()) s.memzero(key);
    this.householdKeys = new Map();
    this.identity.set(null);
  }

  private async loadHouseholdKeys(me: MeResponse, identity: Identity) {
    const keys = new Map<string, Map<number, Uint8Array>>();
    for (const household of me.households) {
      if (household.status !== 'ACTIVE') continue;
      const versions = new Map<number, Uint8Array>();
      for (const mk of household.memberKeys) {
        // Si la envolví yo, confío en MI clave pública (ya verificada al abrir mis privadas),
        // no en la que informa el servidor.
        const signerPublicKey =
          mk.wrappedById === me.user.id
            ? identity.signPublicKey
            : mk.wrappedBySigningPublicKey && (await fromBase64(mk.wrappedBySigningPublicKey));
        if (!signerPublicKey) continue;
        versions.set(
          mk.version,
          await unwrapHouseholdKey({
            wrappedKey: await fromBase64(mk.wrappedKey),
            signature: await fromBase64(mk.signature),
            householdId: household.id,
            version: mk.version,
            userId: me.user.id,
            signerPublicKey,
            identity,
          }),
        );
      }
      keys.set(household.id, versions);
    }
    this.householdKeys = keys;
  }
}
