import { Component, DestroyRef, inject, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoDirective } from '@jsverse/transloco';

/**
 * El "ojito" para ver lo que escribiste en un campo de contraseña o clave.
 * Uso: <input #pw type="password" ...> <app-password-toggle matSuffix [for]="pw" />
 */
@Component({
  selector: 'app-password-toggle',
  imports: [MatButtonModule, MatIconModule, TranslocoDirective],
  template: `
    <ng-container *transloco="let t">
      <button
        mat-icon-button
        type="button"
        (click)="toggle()"
        [attr.aria-label]="t(visible() ? 'passwordToggle.hide' : 'passwordToggle.show')"
        [attr.title]="t(visible() ? 'passwordToggle.hide' : 'passwordToggle.show')"
        [attr.aria-pressed]="visible()"
        data-testid="password-toggle"
      >
        <mat-icon fontSet="material-symbols-outlined">{{ visible() ? 'visibility_off' : 'visibility' }}</mat-icon>
      </button>
    </ng-container>
  `,
})
export class PasswordToggle {
  readonly for = input.required<HTMLInputElement>();
  readonly visible = signal(false);

  constructor() {
    // Al salir de la pantalla vuelve a ocultarse (no queda texto visible por accidente).
    inject(DestroyRef).onDestroy(() => {
      if (this.visible()) this.for().type = 'password';
    });
  }

  toggle() {
    const next = !this.visible();
    this.visible.set(next);
    this.for().type = next ? 'text' : 'password';
    this.for().focus();
  }
}
