import { Injectable, computed, inject } from '@angular/core';
import { decryptPayload, encryptPayload, payloadAad } from '../crypto/aead';
import { KeyVaultService } from '../crypto/key-vault.service';
import { fromBase64, toBase64 } from '../crypto/sodium';
import { SessionService } from '../session/session.service';

/**
 * Hogar activo y cifrado de sus registros. Toda escritura usa la versión vigente de la clave;
 * la lectura usa la versión con la que se cifró cada fila.
 */
@Injectable({ providedIn: 'root' })
export class HouseholdContextService {
  private readonly session = inject(SessionService);
  private readonly vault = inject(KeyVaultService);

  readonly household = computed(() => {
    const me = this.session.me();
    if (!me) return null;
    return me.households.find((h) => h.id === me.user.defaultHouseholdId && h.status === 'ACTIVE') ?? null;
  });

  readonly householdId = computed(() => this.household()?.id ?? null);
  readonly baseCurrency = computed(() => this.household()?.baseCurrency ?? 'ARS');
  readonly canWrite = computed(() => {
    const role = this.household()?.role;
    return role !== undefined && role !== 'VIEWER';
  });

  requireHousehold() {
    const h = this.household();
    if (!h) throw new Error('No hay un hogar activo');
    return h;
  }

  /** Cifra el payload de una fila de `table` y lo devuelve en base64 junto con la versión de clave. */
  async seal<T>(table: string, id: string, data: T): Promise<{ payload: string; keyVersion: number }> {
    const h = this.requireHousehold();
    const keyVersion = h.currentKeyVersion;
    const key = this.vault.householdKey(h.id, keyVersion);
    const blob = await encryptPayload(data, key, payloadAad(table, id, h.id, keyVersion));
    return { payload: await toBase64(blob), keyVersion };
  }

  async open<T>(table: string, id: string, payload: string, keyVersion: number): Promise<T> {
    const h = this.requireHousehold();
    const key = this.vault.householdKey(h.id, keyVersion);
    return decryptPayload<T>(await fromBase64(payload), key, payloadAad(table, id, h.id, keyVersion));
  }
}
