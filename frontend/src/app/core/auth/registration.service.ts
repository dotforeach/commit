import { Injectable, inject } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { v7 as uuidv7 } from 'uuid';
import type { HouseholdPayload, RegisterRequest } from '../api/api.types';
import { encryptPayload, payloadAad } from '../crypto/aead';
import { generateIdentity, sealPrivateKeys } from '../crypto/identity';
import { DEFAULT_KDF_PARAMS, deriveKeyFromPassphrase, randomSalt } from '../crypto/kdf';
import { KeyVaultService } from '../crypto/key-vault.service';
import { generateHouseholdKey, wrapHouseholdKey } from '../crypto/member-key';
import { recoveryKeyFromPhrase } from '../crypto/recovery-phrase';
import { getSodium, toBase64 } from '../crypto/sodium';
import { DEFAULT_CATEGORIES } from '../households/default-categories';
import { SessionService } from '../session/session.service';
import { AuthService } from './auth.service';

export interface RegistrationForm {
  displayName: string;
  email: string;
  password: string;
  passphrase: string;
  recoveryPhrase: string[];
  baseCurrency: string;
}

/**
 * Registro de conocimiento cero: todas las claves se generan acá, en el navegador.
 * Al servidor solo llegan claves públicas, claves privadas CIFRADAS y payloads cifrados.
 */
@Injectable({ providedIn: 'root' })
export class RegistrationService {
  private readonly auth = inject(AuthService);
  private readonly session = inject(SessionService);
  private readonly vault = inject(KeyVaultService);
  private readonly transloco = inject(TranslocoService);

  async register(form: RegistrationForm): Promise<void> {
    const s = await getSodium();
    const userId = uuidv7();
    const householdId = uuidv7();

    const identity = await generateIdentity();
    const kdfSalt = await randomSalt();
    const kek = await deriveKeyFromPassphrase(form.passphrase, kdfSalt, DEFAULT_KDF_PARAMS);
    const recoveryKdfSalt = await randomSalt();
    const rk = await recoveryKeyFromPhrase(form.recoveryPhrase, recoveryKdfSalt);
    const encryptedPrivateKeys = await sealPrivateKeys(identity, kek, 'passphrase');
    const recoveryEncryptedKeys = await sealPrivateKeys(identity, rk, 'recovery');
    s.memzero(kek);
    s.memzero(rk);

    const householdKey = await generateHouseholdKey();
    const memberKey = await wrapHouseholdKey({
      householdKey,
      householdId,
      version: 1,
      recipientUserId: userId,
      recipientPublicKey: identity.boxPublicKey,
      signer: identity,
    });

    const householdPayload: HouseholdPayload = {
      name: this.transloco.translate('household.personalName', { name: form.displayName }),
      financialLevel: 'LEVEL_0_START',
    };

    const categories = await Promise.all(
      DEFAULT_CATEGORIES.map(async (c) => {
        const id = uuidv7();
        const payload = await encryptPayload(
          { name: this.transloco.translate(`categories.${c.systemKey}`), icon: c.icon, color: c.color },
          householdKey,
          payloadAad('categories', id, householdId, 1),
        );
        return {
          id,
          parentId: null,
          kind: c.kind,
          budgetGroup: c.budgetGroup,
          systemKey: c.systemKey,
          payload: await toBase64(payload),
        };
      }),
    );

    const body: RegisterRequest = {
      userId,
      email: form.email,
      password: form.password,
      displayName: form.displayName,
      locale: 'es-AR',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      keys: {
        publicKey: await toBase64(identity.boxPublicKey),
        signingPublicKey: await toBase64(identity.signPublicKey),
        encryptedPrivateKeys: await toBase64(encryptedPrivateKeys),
        kdfSalt: await toBase64(kdfSalt),
        kdfParams: DEFAULT_KDF_PARAMS,
        recoveryEncryptedKeys: await toBase64(recoveryEncryptedKeys),
        recoveryKdfSalt: await toBase64(recoveryKdfSalt),
      },
      household: {
        id: householdId,
        baseCurrency: form.baseCurrency,
        payload: await toBase64(
          await encryptPayload(householdPayload, householdKey, payloadAad('households', householdId, householdId, 1)),
        ),
        memberKey: {
          wrappedKey: await toBase64(memberKey.wrappedKey),
          signature: await toBase64(memberKey.signature),
        },
      },
      categories,
    };

    await this.auth.register(body);
    this.vault.setUnlocked(identity, new Map([[householdId, new Map([[1, householdKey]])]]));
    await this.session.load();
  }
}
