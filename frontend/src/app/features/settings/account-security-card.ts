import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { AccountService } from '../../core/auth/account.service';
import { SessionService } from '../../core/session/session.service';
import { PasswordToggle } from '../../shared/password-toggle/password-toggle';

type Panel = 'password' | 'email' | 'delete' | null;

/** Ajustes → Cuenta y seguridad. */
@Component({
  selector: 'app-account-security-card',
  imports: [FormsModule, RouterLink, TranslocoDirective, PasswordToggle, MatButtonModule, MatCardModule, MatFormFieldModule, MatIconModule, MatInputModule],
  styles: `
    .row { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; padding: 10px 0; border-bottom: 1px solid var(--mat-sys-outline-variant); }
    .row:last-child { border-bottom: 0; }
    .row strong { display: block; }
    .meta { color: var(--mat-sys-on-surface-variant); font: var(--mat-sys-body-small); }
    .verified { color: var(--mat-sys-primary); }
    .pending { color: var(--mat-sys-error); }
    form { display: grid; gap: 4px; width: 100%; padding: 8px 0 12px; }
    .actions { display: flex; justify-content: flex-end; gap: 8px; }
    .danger { color: var(--mat-sys-error); }
    .danger-box { padding: 12px 16px; border-radius: 12px; background: var(--mat-sys-error-container); color: var(--mat-sys-on-error-container); }
  `,
  template: `
    <ng-container *transloco="let t; prefix: 'accountSecurity'">
      <mat-card appearance="outlined" class="block" id="cuenta" data-testid="account-security">
        <mat-card-header>
          <mat-icon mat-card-avatar fontSet="material-symbols-outlined" aria-hidden="true">manage_accounts</mat-icon>
          <mat-card-title>{{ t('title') }}</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <!-- Correo -->
          <div class="row">
            <div>
              <strong>{{ email() }}</strong>
              @if (verified()) {
                <span class="meta verified" data-testid="email-verified">{{ t('verified') }}</span>
              } @else {
                <span class="meta pending" data-testid="email-unverified">{{ t('unverified') }}</span>
              }
            </div>
            <div>
              @if (!verified()) {
                <button mat-button (click)="resend()" [disabled]="busy()">{{ t('resend') }}</button>
              }
              <button mat-button (click)="toggle('email')">{{ t('changeEmail') }}</button>
            </div>
          </div>
          @if (panel() === 'email') {
            <form (ngSubmit)="changeEmail()">
              <mat-form-field subscriptSizing="dynamic"><mat-label>{{ t('newEmail') }}</mat-label><input matInput type="email" name="newEmail" [(ngModel)]="newEmail" required /></mat-form-field>
              <mat-form-field subscriptSizing="dynamic"><mat-label>{{ t('password') }}</mat-label><input matInput type="password" name="pw1" [(ngModel)]="password" required #p1 /><app-password-toggle matSuffix [for]="p1" /></mat-form-field>
              <p class="meta">{{ t('emailNote') }}</p>
              <div class="actions"><button mat-flat-button type="submit" [disabled]="busy() || !newEmail || !password">{{ t('sendConfirmation') }}</button></div>
            </form>
          }

          <!-- Contraseña de ingreso -->
          <div class="row">
            <div><strong>{{ t('passwordTitle') }}</strong><span class="meta">{{ t('passwordNote') }}</span></div>
            <button mat-button (click)="toggle('password')" data-testid="change-password">{{ t('changePassword') }}</button>
          </div>
          @if (panel() === 'password') {
            <form (ngSubmit)="changePassword()">
              <mat-form-field subscriptSizing="dynamic"><mat-label>{{ t('currentPassword') }}</mat-label><input matInput type="password" name="cur" [(ngModel)]="password" required #p2 /><app-password-toggle matSuffix [for]="p2" /></mat-form-field>
              <mat-form-field subscriptSizing="dynamic"><mat-label>{{ t('newPassword') }}</mat-label><input matInput type="password" name="new" [(ngModel)]="newPassword" required minlength="10" #p3 /><app-password-toggle matSuffix [for]="p3" /></mat-form-field>
              <p class="meta">{{ t('passwordHint') }}</p>
              <div class="actions"><button mat-flat-button type="submit" [disabled]="busy() || !password || newPassword.length < 10">{{ t('save') }}</button></div>
            </form>
          }

          <!-- Clave de descifrado -->
          <div class="row">
            <div><strong>{{ t('passphraseTitle') }}</strong><span class="meta">{{ t('passphraseNote') }}</span></div>
            <a mat-button routerLink="/ajustes/clave">{{ t('changePassphrase') }}</a>
          </div>

          <!-- Sesiones -->
          <div class="row">
            <div><strong>{{ t('sessionsTitle') }}</strong><span class="meta">{{ t('sessionsNote') }}</span></div>
            <button mat-button (click)="revokeAll()" [disabled]="busy()" data-testid="revoke-all">{{ t('revokeAll') }}</button>
          </div>

          <!-- Eliminar -->
          <div class="row">
            <div><strong class="danger">{{ t('deleteTitle') }}</strong><span class="meta">{{ t('deleteNote') }}</span></div>
            <button mat-button class="danger" (click)="toggle('delete')" data-testid="delete-account">{{ t('delete') }}</button>
          </div>
          @if (panel() === 'delete') {
            <form (ngSubmit)="deleteAccount()">
              <p class="danger-box">{{ t('deleteWarning') }}</p>
              <mat-form-field subscriptSizing="dynamic"><mat-label>{{ t('password') }}</mat-label><input matInput type="password" name="pw4" [(ngModel)]="password" required #p4 /><app-password-toggle matSuffix [for]="p4" /></mat-form-field>
              <mat-form-field subscriptSizing="dynamic"><mat-label>{{ t('typeDelete') }}</mat-label><input matInput name="confirm" [(ngModel)]="confirmWord" autocomplete="off" data-testid="delete-confirm" /></mat-form-field>
              <div class="actions"><button mat-flat-button type="submit" [disabled]="busy() || !password || confirmWord !== 'ELIMINAR'" data-testid="delete-submit">{{ t('deleteForever') }}</button></div>
            </form>
          }
        </mat-card-content>
      </mat-card>
    </ng-container>
  `,
})
export class AccountSecurityCard {
  private readonly account = inject(AccountService);
  private readonly session = inject(SessionService);
  private readonly snack = inject(MatSnackBar);
  private readonly t = inject(TranslocoService);

  readonly email = computed(() => this.session.me()?.user.email ?? '');
  readonly verified = computed(() => !!this.session.me()?.user.emailVerifiedAt);
  readonly panel = signal<Panel>(null);
  readonly busy = signal(false);
  password = '';
  newPassword = '';
  newEmail = '';
  confirmWord = '';

  toggle(p: Exclude<Panel, null>) {
    this.panel.set(this.panel() === p ? null : p);
    this.password = this.newPassword = this.newEmail = this.confirmWord = '';
  }

  private async run(action: () => Promise<unknown>, ok: string) {
    this.busy.set(true);
    try {
      await action();
      this.snack.open(this.t.translate('accountSecurity.' + ok), undefined, { duration: 4000 });
      this.panel.set(null);
    } catch (e) {
      const key = e instanceof HttpErrorResponse && e.status === 401 ? 'wrongPassword' : e instanceof HttpErrorResponse && e.status === 409 ? 'emailTaken' : e instanceof HttpErrorResponse && e.status === 429 ? 'tooMany' : 'error';
      this.snack.open(this.t.translate('accountSecurity.errors.' + key), undefined, { duration: 5000 });
    } finally {
      this.busy.set(false);
    }
  }

  resend() {
    return this.run(() => this.account.resendVerification(), 'resent');
  }
  changePassword() {
    return this.run(() => this.account.changePassword(this.password, this.newPassword), 'passwordChanged');
  }
  changeEmail() {
    return this.run(() => this.account.changeEmail(this.password, this.newEmail.trim()), 'emailSent');
  }
  revokeAll() {
    return this.run(() => this.account.revokeAllSessions(), 'revoked');
  }
  deleteAccount() {
    return this.run(() => this.account.deleteAccount(this.password), 'deleted');
  }
}
