import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import type { HouseholdPayload } from '../../core/api/api.types';
import { decryptPayload, payloadAad } from '../../core/crypto/aead';
import { keyFingerprint } from '../../core/crypto/fingerprint';
import { KeyVaultService } from '../../core/crypto/key-vault.service';
import { fromBase64 } from '../../core/crypto/sodium';
import { HouseholdContextService } from '../../core/households/household-context.service';
import { SessionService } from '../../core/session/session.service';

export interface Member {
  userId: string;
  email: string;
  displayName: string;
  role: 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER';
  status: 'PENDING_KEY' | 'ACTIVE';
  publicKey: string | null;
  signingPublicKey: string | null;
  fingerprint: string | null;
}

export interface Invitation {
  id: string;
  email: string;
  role: string;
  expiresAt: string;
}

/** Miembros, invitaciones y claves del hogar activo. */
@Injectable({ providedIn: 'root' })
export class HouseholdService {
  private readonly http = inject(HttpClient);
  private readonly hh = inject(HouseholdContextService);
  private readonly vault = inject(KeyVaultService);
  private readonly session = inject(SessionService);

  private url(path: string) {
    return `/api/households/${this.hh.requireHousehold().id}/${path}`;
  }

  async members(): Promise<Member[]> {
    const { items } = await firstValueFrom(this.http.get<{ items: Omit<Member, 'fingerprint'>[] }>(this.url('members')));
    return Promise.all(
      items.map(async (m) => ({
        ...m,
        fingerprint: m.publicKey && m.signingPublicKey ? await keyFingerprint(await fromBase64(m.publicKey), await fromBase64(m.signingPublicKey)) : null,
      })),
    );
  }

  async invitations(): Promise<Invitation[]> {
    return (await firstValueFrom(this.http.get<{ items: Invitation[] }>(this.url('invitations')))).items;
  }

  /** Devuelve el link de invitación (el token solo existe en esta respuesta). */
  async invite(email: string, role: string): Promise<string> {
    const { token } = await firstValueFrom(this.http.post<{ token: string }>(this.url('invitations'), { email, role }));
    return `${location.origin}/unirme?token=${encodeURIComponent(token)}`;
  }

  async revoke(id: string) {
    await firstValueFrom(this.http.delete(this.url(`invitations/${id}`)));
  }

  /** Da acceso: envuelve todas las versiones de la clave del hogar para el miembro. */
  async grant(member: Member) {
    if (!member.publicKey) throw new Error('El miembro no tiene claves');
    const keys = await this.vault.wrapAllVersionsFor(this.hh.requireHousehold().id, member.userId, await fromBase64(member.publicKey));
    await firstValueFrom(this.http.post(this.url(`members/${member.userId}/key`), { keys }));
  }

  async setRole(member: Member, role: string) {
    await firstValueFrom(this.http.put(this.url(`members/${member.userId}`), { role }));
  }

  /** Quita al miembro y rota la clave: lo nuevo ya no lo puede leer. */
  async remove(member: Member) {
    await firstValueFrom(this.http.delete(this.url(`members/${member.userId}`)));
    await this.rotate();
  }

  async rotate() {
    const h = this.hh.requireHousehold();
    const active = (await this.members()).filter((m) => m.status === 'ACTIVE' && m.publicKey);
    const body = await this.vault.rotationFor(
      h.id,
      h.currentKeyVersion + 1,
      await Promise.all(active.map(async (m) => ({ userId: m.userId, publicKey: await fromBase64(m.publicKey!) }))),
    );
    await firstValueFrom(this.http.post(this.url('keys/rotate'), body));
    const me = await this.session.load();
    await this.vault.reloadHouseholdKeys(me);
    this.vault.resetData();
  }

  async leave() {
    const me = this.session.me()!;
    await firstValueFrom(this.http.delete(this.url(`members/${me.user.id}`)));
    await this.reloadSession();
  }

  async accept(token: string): Promise<{ householdId: string }> {
    const res = await firstValueFrom(this.http.post<{ householdId: string }>('/api/invitations/accept', { token }));
    await this.reloadSession();
    return res;
  }

  /** Cambia el hogar activo: se descartan los datos descifrados del anterior. */
  async switchTo(householdId: string) {
    await firstValueFrom(this.http.put('/api/me/default-household', { householdId }));
    await this.reloadSession();
  }

  /** Nombres de los hogares a los que tengo acceso (descifrados con su clave). */
  async householdNames(): Promise<Map<string, string>> {
    const names = new Map<string, string>();
    for (const h of this.hh.households()) {
      if (h.status !== 'ACTIVE') continue;
      try {
        const p = await decryptPayload<HouseholdPayload>(await fromBase64(h.payload), this.vault.householdKey(h.id, h.keyVersion), payloadAad('households', h.id, h.id, h.keyVersion));
        names.set(h.id, p.name);
      } catch {
        // sin clave todavía
      }
    }
    return names;
  }

  private async reloadSession() {
    const me = await this.session.load();
    await this.vault.reloadHouseholdKeys(me);
    this.vault.resetData();
  }
}
