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
import type { Identity } from '../../../core/crypto/identity';
import { KeyVaultService, WrongRecoveryPhraseError } from '../../../core/crypto/key-vault.service';
import { normalizeRecoveryPhrase } from '../../../core/crypto/recovery-phrase';
import { SessionService } from '../../../core/session/session.service';
import { matchValidator } from '../../../shared/validators';

/** "Olvidé mi clave de descifrado": la frase abre las claves y se define una clave nueva. */
@Component({
  selector: 'app-recover',
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
  templateUrl: './recover.html',
  styleUrl: '../_auth-shared.scss',
})
export class Recover {
  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly vault = inject(KeyVaultService);
  private readonly session = inject(SessionService);
  private readonly router = inject(Router);

  readonly busy = signal(false);
  readonly error = signal<string | null>(null);
  /** Claves abiertas con la frase, a la espera de la clave nueva (solo en memoria). */
  readonly identity = signal<Identity | null>(null);

  readonly phraseForm = this.fb.group({ phrase: ['', Validators.required] });
  readonly newPassphrase = this.fb.group(
    {
      passphrase: ['', [Validators.required, Validators.minLength(12)]],
      passphraseConfirm: ['', Validators.required],
    },
    { validators: matchValidator('passphrase', 'passphraseConfirm') },
  );

  async openWithPhrase() {
    if (this.phraseForm.invalid || this.busy()) return;
    const phrase = normalizeRecoveryPhrase(this.phraseForm.controls.phrase.value);
    if (!phrase) {
      this.error.set('errors.invalidPhrase');
      return;
    }
    await this.run(async () => {
      const me = this.session.me() ?? (await this.session.load());
      this.identity.set(await this.vault.openWithRecoveryPhrase(me, phrase));
      this.phraseForm.reset();
    });
  }

  async setNewPassphrase() {
    const identity = this.identity();
    if (!identity || this.newPassphrase.invalid || this.busy()) return;
    await this.run(async () => {
      const me = this.session.me() ?? (await this.session.load());
      const request = await this.vault.buildPassphraseChange(me, identity, this.newPassphrase.controls.passphrase.value);
      const updated = await this.session.updateKeys(request);
      await this.vault.unlockWithIdentity(updated, identity);
      this.newPassphrase.reset();
      await this.router.navigate(['/inicio']);
    });
  }

  private async run(fn: () => Promise<void>) {
    this.busy.set(true);
    this.error.set(null);
    try {
      await fn();
    } catch (e) {
      this.error.set(e instanceof WrongRecoveryPhraseError ? 'errors.wrongPhrase' : 'errors.generic');
    } finally {
      this.busy.set(false);
    }
  }
}
