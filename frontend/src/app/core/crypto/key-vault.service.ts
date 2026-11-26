import { Injectable, computed, signal } from '@angular/core';
import type { MeResponse } from '../api/api.types';
import { openPrivateKeys, sealPrivateKeys, wipeIdentity, type Identity } from './identity';
import { DEFAULT_KDF_PARAMS, deriveKeyFromPassphrase, randomSalt } from './kdf';
import { signKeyUpdate } from './key-update';
import { keyFingerprint } from './fingerprint';
import { recoveryKeyFromPhrase } from './recovery-phrase';
import { generateHouseholdKey, unwrapHouseholdKey, wrapHouseholdKey } from './member-key';
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
  /** Sube al bloquear o al cambiar de hogar: los servicios descartan los datos descifrados. */
  private readonly gen = signal(0);
  readonly generation = this.gen.asReadonly();

  /** Descarta los datos descifrados en memoria (p. ej. al cambiar de hogar), sin bloquear. */
  resetData() {
    this.gen.update((g) => g + 1);
  }

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

  /** Vuelve a abrir las claves de los hogares (p. ej. tras una rotación o al recibir acceso a uno nuevo). */
  async reloadHouseholdKeys(me: MeResponse): Promise<void> {
    const identity = this.identity();
    if (identity) await this.loadHouseholdKeys(me, identity);
  }

  /** Mi huella (para que otro miembro la verifique antes de darme acceso). */
  async myFingerprint(): Promise<string | null> {
    const identity = this.identity();
    return identity ? keyFingerprint(identity.boxPublicKey, identity.signPublicKey) : null;
  }

  /** Envuelve TODAS las versiones de la clave de un hogar para otro miembro, firmadas por mí. */
  async wrapAllVersionsFor(householdId: string, recipientUserId: string, recipientPublicKey: Uint8Array) {
    const identity = this.requireIdentity();
    const versions = this.householdKeys.get(householdId);
    if (!versions || versions.size === 0) throw new Error('No tengo las claves de este hogar');
    return Promise.all(
      [...versions.entries()].map(async ([version, householdKey]) => {
        const w = await wrapHouseholdKey({ householdKey, householdId, version, recipientUserId, recipientPublicKey, signer: identity });
        return { version, wrappedKey: await toBase64(w.wrappedKey), signature: await toBase64(w.signature) };
      }),
    );
  }

  /** Genera la versión nueva de la clave del hogar y la envuelve para cada miembro activo. */
  async rotationFor(householdId: string, version: number, members: { userId: string; publicKey: Uint8Array }[]) {
    const identity = this.requireIdentity();
    const householdKey = await generateHouseholdKey();
    const memberKeys = await Promise.all(
      members.map(async (m) => {
        const w = await wrapHouseholdKey({ householdKey, householdId, version, recipientUserId: m.userId, recipientPublicKey: m.publicKey, signer: identity });
        return { userId: m.userId, wrappedKey: await toBase64(w.wrappedKey), signature: await toBase64(w.signature) };
      }),
    );
    return { version, memberKeys };
  }

  private requireIdentity(): Identity {
    const identity = this.identity();
    if (!identity) throw new Error('La bóveda está bloqueada');
    return identity;
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
    this.gen.update((g) => g + 1);
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
