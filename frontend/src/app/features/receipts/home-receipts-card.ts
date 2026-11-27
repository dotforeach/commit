import { Component, computed, inject, signal, type OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { ReceiptsService, type Subscription } from './receipts.service';

/** Inicio: facturas por WhatsApp (la única función de pago) y lo pendiente de revisar. */
@Component({
  selector: 'app-home-receipts-card',
  imports: [RouterLink, TranslocoDirective, MatButtonModule, MatCardModule, MatIconModule],
  styles: `
    .prices { display: flex; flex-wrap: wrap; gap: 8px; margin: 8px 0 0; }
    .price { padding: 4px 12px; border-radius: 999px; background: var(--mat-sys-secondary-container); color: var(--mat-sys-on-secondary-container); font: var(--mat-sys-label-large); }
    .price.best { background: var(--mat-sys-primary-container); color: var(--mat-sys-on-primary-container); }
    .free { margin: 8px 0 0; color: var(--mat-sys-on-surface-variant); font: var(--mat-sys-body-small); }
    .count { font: var(--mat-sys-headline-small); }
  `,
  template: `
    <ng-container *transloco="let t; prefix: 'homeReceipts'">
      <mat-card appearance="outlined" data-testid="home-receipts">
        <mat-card-header>
          <mat-icon mat-card-avatar fontSet="material-symbols-outlined" aria-hidden="true">receipt_long</mat-icon>
          <mat-card-title>{{ t('title') }}</mat-card-title>
          <mat-card-subtitle>
            @if (active(); as s) {
              {{ t('active', { plan: t('plans.' + s.plan) }) }}
            } @else {
              {{ t('pitch') }}
            }
          </mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          @if (active()) {
            <p><span class="count" data-testid="home-receipts-count">{{ receipts.count() }}</span> {{ t('pending') }}</p>
          } @else {
            <div class="prices" data-testid="home-prices">
              <span class="price">{{ t('monthly') }}</span>
              <span class="price best">{{ t('yearly') }}</span>
            </div>
            <p class="free">{{ t('free') }}</p>
          }
        </mat-card-content>
        <mat-card-actions align="end">
          @if (active()) {
            <a mat-flat-button routerLink="/por-revisar">{{ t('review') }}</a>
          } @else {
            <a mat-button routerLink="/ajustes" fragment="whatsapp">{{ t('how') }}</a>
            <a mat-flat-button routerLink="/suscripcion" data-testid="home-subscribe">{{ t('subscribe') }}</a>
          }
        </mat-card-actions>
      </mat-card>
    </ng-container>
  `,
})
export class HomeReceiptsCard implements OnInit {
  readonly receipts = inject(ReceiptsService);
  private readonly subscription = signal<Subscription | null>(null);
  readonly active = computed(() => {
    const s = this.subscription();
    return s && s.status === 'ACTIVE' && new Date(s.currentPeriodEnd) > new Date() ? s : null;
  });

  async ngOnInit() {
    try {
      this.subscription.set((await this.receipts.subscription()).subscription);
      if (this.active()) await this.receipts.load();
    } catch {
      // sin conexión o sin backend: la tarjeta muestra la oferta
    }
  }
}
