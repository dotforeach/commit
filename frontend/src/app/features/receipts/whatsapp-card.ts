import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal, type OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { SessionService } from '../../core/session/session.service';
import { ReceiptsService } from './receipts.service';

/** Ajustes → WhatsApp: consentimiento explícito, código de vinculación y estado. */
@Component({
  selector: 'app-whatsapp-card',
  imports: [DatePipe, FormsModule, RouterLink, TranslocoDirective, MatButtonModule, MatCardModule, MatCheckboxModule, MatIconModule],
  styles: `
    .code { font: var(--mat-sys-headline-small); letter-spacing: 0.08em; margin: 8px 0; }
    .privacy { padding: 12px 16px; border-radius: 12px; background: var(--mat-sys-surface-container-low); }
    .privacy ul { margin: 8px 0 0; padding-left: 20px; }
    .meta { color: var(--mat-sys-on-surface-variant); font: var(--mat-sys-body-small); }
    .ok { color: var(--mat-sys-primary); display: flex; align-items: center; gap: 6px; }
    mat-card-actions { flex-wrap: wrap; }
  `,
  template: `
    <ng-container *transloco="let t; prefix: 'whatsapp'">
      <mat-card appearance="outlined" class="block" id="whatsapp" data-testid="whatsapp-card">
        <mat-card-header>
          <mat-icon mat-card-avatar fontSet="material-symbols-outlined" aria-hidden="true">chat</mat-icon>
          <mat-card-title>{{ t('title') }}</mat-card-title>
          <mat-card-subtitle>{{ t('subtitle') }}</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          @if (receipts.status(); as st) {
            @if (!st.whatsappConfigured) {
              <p class="meta" data-testid="wa-not-configured">{{ t('notConfigured') }}</p>
            }
            @if (st.linked) {
              <p class="ok" data-testid="wa-linked"><mat-icon fontSet="material-symbols-outlined" aria-hidden="true">check_circle</mat-icon>{{ t('linked', { date: (st.linkedAt | date: 'd/M/y') }) }}</p>
              <p class="meta">{{ t('usage', { used: st.usedThisMonth, limit: st.monthlyLimit }) }}</p>
            } @else if (code(); as c) {
              <p>{{ t('sendCode') }}</p>
              <p class="code" data-testid="wa-code">{{ c.code }}</p>
              @if (c.waLink) {
                <a mat-flat-button [href]="c.waLink" target="_blank" rel="noopener">{{ t('openWhatsapp') }}</a>
              }
              <p class="meta">{{ t('codeExpires') }}</p>
            } @else if (!verified()) {
              <p data-testid="wa-verify-first">{{ t('verifyFirst') }}</p>
            } @else {
              <div class="privacy" data-testid="wa-privacy">
                <strong>{{ t('privacyTitle') }}</strong>
                <ul>
                  <li>{{ t('privacy1') }}</li>
                  <li>{{ t('privacy2') }}</li>
                  <li>{{ t('privacy3') }}</li>
                  <li>{{ t('privacy4') }}</li>
                </ul>
              </div>
              <mat-checkbox [(ngModel)]="consent" data-testid="wa-consent">{{ t('consent') }}</mat-checkbox>
            }
            @if (st.subscriptionRequired && !st.subscription) {
              <p class="meta">{{ t('needsSubscription') }} <a routerLink="/suscripcion">{{ t('seePlans') }}</a></p>
            }
          }
        </mat-card-content>
        <mat-card-actions>
          @if (receipts.status()?.linked) {
            <button mat-button (click)="receipts.unlink()">{{ t('unlink') }}</button>
            <a mat-button routerLink="/por-revisar">{{ t('review') }}</a>
          } @else if (!code() && verified()) {
            <button mat-flat-button (click)="link()" [disabled]="!consent || busy()" data-testid="wa-link">{{ t('link') }}</button>
          }
          <a mat-button routerLink="/suscripcion">{{ t('plans') }}</a>
        </mat-card-actions>
      </mat-card>
    </ng-container>
  `,
})
export class WhatsappCard implements OnInit {
  readonly receipts = inject(ReceiptsService);
  private readonly session = inject(SessionService);
  readonly verified = computed(() => !!this.session.me()?.user.emailVerifiedAt);
  consent = false;
  readonly busy = signal(false);
  readonly code = signal<{ code: string; expiresAt: string; waLink: string | null } | null>(null);

  async ngOnInit() {
    await this.receipts.loadStatus().catch(() => null);
  }

  async link() {
    this.busy.set(true);
    try {
      this.code.set(await this.receipts.linkCode());
    } finally {
      this.busy.set(false);
    }
  }
}
