import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import type { RegisterRequest, TokenResponse } from '../api/api.types';

/**
 * Sesión de login. El access token vive solo en memoria; el refresh token está en una
 * cookie HttpOnly que el JS no puede leer (la envía el navegador a /api/auth).
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly token = signal<string | null>(null);
  private refreshing: Promise<boolean> | null = null;

  readonly isAuthenticated = computed(() => this.token() !== null);
  accessToken() {
    return this.token();
  }

  async register(body: RegisterRequest): Promise<void> {
    this.setTokens(await firstValueFrom(this.http.post<TokenResponse>('/api/auth/register', body)));
  }

  async login(email: string, password: string): Promise<void> {
    this.setTokens(await firstValueFrom(this.http.post<TokenResponse>('/api/auth/login', { email, password })));
  }

  /** Renueva el access token con la cookie. Varias llamadas simultáneas comparten un solo pedido. */
  refresh(): Promise<boolean> {
    this.refreshing ??= firstValueFrom(this.http.post<TokenResponse>('/api/auth/refresh', {}))
      .then((tokens) => {
        this.setTokens(tokens);
        return true;
      })
      .catch(() => {
        this.token.set(null);
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

  async logout(): Promise<void> {
    try {
      await firstValueFrom(this.http.post('/api/auth/logout', {}));
    } finally {
      this.token.set(null);
    }
  }

  private setTokens({ accessToken }: TokenResponse) {
    this.token.set(accessToken);
  }
}
