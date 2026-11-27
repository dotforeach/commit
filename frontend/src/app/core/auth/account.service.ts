import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import type { TokenResponse } from '../api/api.types';
import { KeyVaultService } from '../crypto/key-vault.service';
import { SessionService } from '../session/session.service';
import { AuthService } from './auth.service';

/** Ciclo de la cuenta: correo, contraseña, sesiones y eliminación. */
@Injectable({ providedIn: 'root' })
export class AccountService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  private readonly session = inject(SessionService);
  private readonly vault = inject(KeyVaultService);
  private readonly router = inject(Router);

  // Enlaces de los correos (públicos)
  verifyEmail(token: string) {
    return firstValueFrom(this.http.post('/api/auth/verify-email', { token }));
  }
  forgotPassword(email: string) {
    return firstValueFrom(this.http.post('/api/auth/forgot-password', { email }));
  }
  resetPassword(token: string, password: string) {
    return firstValueFrom(this.http.post('/api/auth/reset-password', { token, password }));
  }
  confirmEmailChange(token: string) {
    return firstValueFrom(this.http.post('/api/auth/confirm-email', { token }));
  }

  // Con sesión
  resendVerification() {
    return firstValueFrom(this.http.post<{ alreadyVerified: boolean }>('/api/me/email/verification', {}));
  }

  async changePassword(currentPassword: string, newPassword: string) {
    this.auth.adoptTokens(await firstValueFrom(this.http.put<TokenResponse>('/api/me/password', { currentPassword, newPassword })));
  }

  changeEmail(password: string, newEmail: string) {
    return firstValueFrom(this.http.post('/api/me/email', { password, newEmail }));
  }

  async revokeAllSessions() {
    await firstValueFrom(this.http.post('/api/me/sessions/revoke-all', {}));
    await this.signOutLocally();
  }

  async deleteAccount(password: string) {
    await firstValueFrom(this.http.request('DELETE', '/api/me', { body: { password, confirm: 'ELIMINAR' } }));
    await this.signOutLocally('/');
  }

  /** Borra claves, caché y sesión de este dispositivo. */
  private async signOutLocally(to = '/ingresar') {
    await this.vault.lock();
    await this.auth.logout().catch(() => undefined);
    this.session.clear();
    await this.router.navigate([to]);
  }
}
