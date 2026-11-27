import { PasswordToggle } from '../../../shared/password-toggle/password-toggle';
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
import { wipeIdentity } from '../../../core/crypto/identity';
import { KeyVaultService, WrongPassphraseError } from '../../../core/crypto/key-vault.service';
import { SessionService } from '../../../core/session/session.service';
import { matchValidator } from '../../../shared/validators';

/** Cambiar la clave de descifrado. Pide la actual aunque la bóveda esté abierta (equipo desatendido). */
@Component({
  selector: 'app-change-passphrase',
  imports: [PasswordToggle, 
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
  templateUrl: './change-passphrase.html',
  styleUrl: '../_auth-shared.scss',
})
export class ChangePassphrase {
  private readonly vault = inject(KeyVaultService);
  private readonly session = inject(SessionService);
  private readonly router = inject(Router);

  readonly busy = signal(false);
  readonly error = signal<string | null>(null);
  readonly form = inject(FormBuilder).nonNullable.group(
    {
      current: ['', Validators.required],
      passphrase: ['', [Validators.required, Validators.minLength(12)]],
      passphraseConfirm: ['', Validators.required],
    },
    { validators: matchValidator('passphrase', 'passphraseConfirm') },
  );

  async submit() {
    if (this.form.invalid || this.busy()) return;
    this.busy.set(true);
    this.error.set(null);
    try {
      const { current, passphrase } = this.form.getRawValue();
      if (current === passphrase) {
        this.error.set('errors.same');
        return;
      }
      const me = this.session.me() ?? (await this.session.load());
      const identity = await this.vault.openWithPassphrase(me, current);
      try {
        await this.session.updateKeys(await this.vault.buildPassphraseChange(me, identity, passphrase));
      } finally {
        await wipeIdentity(identity);
      }
      this.form.reset();
      await this.router.navigate(['/inicio'], { state: { passphraseChanged: true } });
    } catch (e) {
      this.error.set(e instanceof WrongPassphraseError ? 'errors.wrongCurrent' : 'errors.generic');
    } finally {
      this.busy.set(false);
    }
  }
}
