import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RouterLink } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { AUTO_LOCK_OPTIONS, AutoLockService } from '../../core/crypto/auto-lock.service';
import { NotificationsService } from '../notifications/notifications.service';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-settings-page',
  imports: [RouterLink, TranslocoDirective, MatButtonModule, MatCardModule, MatFormFieldModule, MatIconModule, MatSelectModule, MatSlideToggleModule],
  template: `
    <ng-container *transloco="let t; prefix: 'settings'">
      <section class="page">
        <h2>{{ t('title') }}</h2>
        <mat-card appearance="outlined" class="block">
          <mat-card-header>
            <mat-icon mat-card-avatar fontSet="material-symbols-outlined" aria-hidden="true">notifications</mat-icon>
            <mat-card-title>{{ t('push.title') }}</mat-card-title>
            <mat-card-subtitle>{{ t('push.subtitle') }}</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            @if (notifications.pushSupported) {
              <mat-slide-toggle [checked]="notifications.pushEnabled()" (change)="toggle($event.checked)" [disabled]="busy()">{{ t('push.toggle') }}</mat-slide-toggle>
            } @else {
              <p class="meta">{{ t('push.unsupported') }}</p>
            }
            @if (message(); as key) {
              <p class="meta" role="status">{{ t('push.' + key) }}</p>
            }
            <p class="meta">{{ t('push.privacy') }}</p>
          </mat-card-content>
        </mat-card>
        <mat-card appearance="outlined" class="block">
          <mat-card-header>
            <mat-icon mat-card-avatar fontSet="material-symbols-outlined" aria-hidden="true">lock</mat-icon>
            <mat-card-title>{{ t('security.title') }}</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <mat-form-field>
              <mat-label>{{ t('security.autoLock') }}</mat-label>
              <mat-select [value]="autoLock.minutes()" (selectionChange)="autoLock.setMinutes($event.value)">
                @for (m of lockOptions; track m) {
                  <mat-option [value]="m">{{ m === 0 ? t('security.never') : t('security.minutes', { n: m }) }}</mat-option>
                }
              </mat-select>
              <mat-hint>{{ t('security.autoLockHint') }}</mat-hint>
            </mat-form-field>
          </mat-card-content>
          <mat-card-actions>
            <a mat-button routerLink="/ajustes/clave">{{ t('security.passphrase') }}</a>
            <a mat-button routerLink="/hogar">{{ t('security.household') }}</a>
            <a mat-button routerLink="/cotizaciones">{{ t('security.rates') }}</a>
          </mat-card-actions>
        </mat-card>
      </section>
    </ng-container>
  `,
  styles: `
    .page { max-width: 720px; margin: 0 auto; padding: 24px 16px; }
    .block { margin: 16px 0; }
    .meta { color: var(--mat-sys-on-surface-variant); }
  `,
})
export class SettingsPage {
  readonly notifications = inject(NotificationsService);
  readonly autoLock = inject(AutoLockService);
  readonly lockOptions = AUTO_LOCK_OPTIONS;
  readonly busy = signal(false);
  readonly message = signal<string | null>(null);

  async toggle(on: boolean) {
    this.busy.set(true);
    try {
      if (on) this.message.set(await this.notifications.enablePush());
      else {
        await this.notifications.disablePush();
        this.message.set('disabled');
      }
    } finally {
      this.busy.set(false);
    }
  }
}
