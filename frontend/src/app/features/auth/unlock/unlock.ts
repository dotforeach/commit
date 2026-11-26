import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterLink } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { AuthService } from '../../../core/auth/auth.service';
import { takeReturnUrl } from '../../../core/auth/guards';
import { AutoLockService } from '../../../core/crypto/auto-lock.service';
import { KeyVaultService, WrongPassphraseError } from '../../../core/crypto/key-vault.service';
import { SessionService } from '../../../core/session/session.service';

@Component({
  selector: 'app-unlock',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    TranslocoDirective,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './unlock.html',
  styleUrl: '../_auth-shared.scss',
})
export class Unlock {
  private readonly vault = inject(KeyVaultService);
  private readonly session = inject(SessionService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  readonly autoLock = inject(AutoLockService);

  readonly busy = signal(false);
  readonly error = signal<string | null>(null);
  readonly form = inject(FormBuilder).nonNullable.group({ passphrase: ['', Validators.required] });

  async submit() {
    if (this.form.invalid || this.busy()) return;
    this.busy.set(true);
    this.error.set(null);
    try {
      const me = this.session.me() ?? (await this.session.load());
      await this.vault.unlockWithPassphrase(me, this.form.controls.passphrase.value);
      this.form.reset();
      await this.router.navigateByUrl(takeReturnUrl() ?? '/inicio');
    } catch (e) {
      this.error.set(e instanceof WrongPassphraseError ? 'errors.wrongPassphrase' : 'errors.generic');
    } finally {
      this.busy.set(false);
    }
  }

  async logout() {
    await this.auth.logout();
    this.session.clear();
    await this.router.navigate(['/ingresar']);
  }
}
