import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { RegistrationService } from '../../../core/auth/registration.service';
import { generateRecoveryPhrase, sameWord } from '../../../core/crypto/recovery-phrase';
import { differentFrom, matchValidator } from '../../../shared/validators';

const CURRENCIES = ['ARS', 'USD', 'UYU', 'CLP', 'BRL', 'PYG', 'BOB', 'PEN', 'COP', 'MXN', 'EUR'];

/** Tres posiciones distintas al azar (1..24) para confirmar que la frase fue anotada. */
function pickPositions(): number[] {
  const all = Array.from({ length: 24 }, (_, i) => i);
  const picked: number[] = [];
  const random = new Uint32Array(3);
  crypto.getRandomValues(random);
  for (const r of random) picked.push(all.splice(r % all.length, 1)[0]);
  return picked.sort((a, b) => a - b);
}

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    TranslocoDirective,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatStepperModule,
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly registration = inject(RegistrationService);
  private readonly router = inject(Router);

  readonly currencies = CURRENCIES;
  readonly phrase = signal(generateRecoveryPhrase());
  readonly positions = signal(pickPositions());
  readonly busy = signal(false);
  readonly error = signal<string | null>(null);
  readonly phraseText = computed(() => this.phrase().join(' '));

  readonly account = this.fb.group(
    {
      displayName: ['', [Validators.required, Validators.maxLength(80)]],
      email: ['', [Validators.required, Validators.email]],
      baseCurrency: ['ARS', Validators.required],
      password: ['', [Validators.required, Validators.minLength(10)]],
      passwordConfirm: ['', Validators.required],
    },
    { validators: matchValidator('password', 'passwordConfirm') },
  );

  readonly decryption = this.fb.group(
    {
      passphrase: [
        '',
        [Validators.required, Validators.minLength(12), differentFrom(() => this.account.controls.password.value)],
      ],
      passphraseConfirm: ['', Validators.required],
    },
    { validators: matchValidator('passphrase', 'passphraseConfirm') },
  );

  readonly saved = this.fb.group({ confirmed: [false, Validators.requiredTrue] });

  readonly check = this.fb.group({ w0: ['', Validators.required], w1: ['', Validators.required], w2: ['', Validators.required] });

  checkMatches(): boolean {
    const [a, b, c] = this.positions();
    const { w0, w1, w2 } = this.check.getRawValue();
    const words = this.phrase();
    return sameWord(w0, words[a]) && sameWord(w1, words[b]) && sameWord(w2, words[c]);
  }

  async copyPhrase() {
    await navigator.clipboard.writeText(this.phraseText());
  }

  downloadPhrase() {
    const numbered = this.phrase().map((w, i) => `${String(i + 1).padStart(2, ' ')}. ${w}`).join('\n');
    const blob = new Blob([`Finanzas 0→100 — frase de recuperación\n\n${numbered}\n`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement('a'), { href: url, download: 'frase-de-recuperacion.txt' });
    a.click();
    URL.revokeObjectURL(url);
  }

  async submit() {
    if (!this.checkMatches() || this.busy()) return;
    this.busy.set(true);
    this.error.set(null);
    try {
      const { displayName, email, password, baseCurrency } = this.account.getRawValue();
      await this.registration.register({
        displayName: displayName.trim(),
        email: email.trim(),
        password,
        baseCurrency,
        passphrase: this.decryption.controls.passphrase.value,
        recoveryPhrase: this.phrase(),
      });
      await this.router.navigate(['/inicio']);
    } catch (e) {
      this.error.set(e instanceof HttpErrorResponse && e.status === 409 ? 'errors.emailTaken' : 'errors.generic');
    } finally {
      this.busy.set(false);
    }
  }
}
