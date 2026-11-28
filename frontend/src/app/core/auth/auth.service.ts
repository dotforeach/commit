import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import type { RegisterRequest, TokenResponse } from '../api/api.types';
import { OfflineCacheService, isNetworkError } from '../offline/offline-cache.service';

/**
 * Sesión de login. El access token vive solo en memoria; el refresh token está en una
 * cookie HttpOnly que el JS no puede leer (la envía el navegador a /api/auth).
 */
/**
 * Marca (sin datos personales) de que este navegador inició sesión alguna vez. Sirve para no
 * hacer esperar a un visitante nuevo: sin la marca, la landing no consulta al backend (que puede
 * estar despertando 20-30 s) antes de mostrarse.
 */
const HAD_SESSION_KEY = 'commit.hadSession';
const mark = (on: boolean) => {
  try {
    if (on) localStorage.setItem(HAD_SESSION_KEY, '1');
    else localStorage.removeItem(HAD_SESSION_KEY);
  } catch {
    // almacenamiento bloqueado: se comporta como siempre (consulta al backend)
  }
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly cache = inject(OfflineCacheService);
  private readonly token = signal<string | null>(null);
  private refreshing: Promise<boolean> | null = null;

  readonly isAuthenticated = computed(() => this.token() !== null);
  accessToken() {
    return this.token();
  }

  async register(body: RegisterRequest): Promise<void> {
    await this.cache.clear();
    this.setTokens(await firstValueFrom(this.http.post<TokenResponse>('/api/auth/register', body)));
  }

  async login(email: string, password: string): Promise<void> {
    await this.cache.clear(); // en un dispositivo compartido no se mezclan datos de dos personas
    this.setTokens(await firstValueFrom(this.http.post<TokenResponse>('/api/auth/login', { email, password })));
  }

  /** Renueva el access token con la cookie. Varias llamadas simultáneas comparten un solo pedido. */
  refresh(): Promise<boolean> {
    this.refreshing ??= firstValueFrom(this.http.post<TokenResponse>('/api/auth/refresh', {}))
      .then((tokens) => {
        this.setTokens(tokens);
        return true;
      })
      .catch(async (e: unknown) => {
        this.token.set(null);
        // La cookie ya no sirve (vencida o revocada): este navegador vuelve a ser "visitante".
        if (e instanceof HttpErrorResponse && e.status === 401) mark(false);
        // Sin conexión pero con datos guardados: se puede abrir la app en modo solo lectura.
        if (isNetworkError(e) && (await this.cache.read('/api/me'))) return true;
        return false;
      })
      .finally(() => {
        this.refreshing = null;
      });
    return this.refreshing;
  }

  /** Hay sesión en memoria, o se puede recuperar con la cookie (p. ej. tras recargar la página). */
  async ensureSession(): Promise<boolean> {
    return this.isAuthenticated() || this.refresh();
  }

  /** ¿Este navegador inició sesión alguna vez (y no la cerró)? Si no, es un visitante. */
  mightHaveSession(): boolean {
    try {
      return localStorage.getItem(HAD_SESSION_KEY) === '1';
    } catch {
      return true;
    }
  }

  async logout(): Promise<void> {
    try {
      await firstValueFrom(this.http.post('/api/auth/logout', {}));
    } finally {
      this.token.set(null);
      mark(false);
      await this.cache.clear(); // al cerrar sesión no queda nada del usuario en el dispositivo
    }
  }

  /** Tras cambiar la contraseña: el servidor abre una sesión nueva para este dispositivo. */
  adoptTokens(tokens: TokenResponse) {
    this.setTokens(tokens);
  }

  private setTokens({ accessToken }: TokenResponse) {
    this.token.set(accessToken);
    mark(true);
  }
}
