import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import type { MeResponse } from '../api/api.types';
import type { UpdateKeysRequest } from '../crypto/key-vault.service';

/** Perfil y material criptográfico (cifrado) del usuario autenticado. */
@Injectable({ providedIn: 'root' })
export class SessionService {
  private readonly http = inject(HttpClient);
  readonly me = signal<MeResponse | null>(null);

  async load(): Promise<MeResponse> {
    const me = await firstValueFrom(this.http.get<MeResponse>('/api/me'));
    this.me.set(me);
    return me;
  }

  /** Reemplaza las claves privadas cifradas y recarga el perfil. */
  async updateKeys(body: UpdateKeysRequest): Promise<MeResponse> {
    await firstValueFrom(this.http.put('/api/me/keys', body));
    return this.load();
  }

  clear() {
    this.me.set(null);
  }
}
