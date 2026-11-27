import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, isDevMode, signal, type OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { ReceiptsService, type Subscription } from './receipts.service';

@Component({
  selector: 'app-subscription-page',
  imports: [DatePipe, RouterLink, TranslocoDirective, MatButtonModule, MatIconModule],
  styles: `
    .page { max-width: 820px; margin: 0 auto; padding: 24px 16px 48px; }
    .subtitle, .meta { color: var(--mat-sys-on-surface-variant); }
    .meta { font: var(--mat-sys-body-small); }
    .plans { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; margin: 24px 0; }
    .plan {
      display: grid; gap: 8px; padding: 24px; border-radius: 24px; border: 1px solid var(--mat-sys-outline-variant);
      &.featured { border: 2px solid var(--mat-sys-primary); background: var(--mat-sys-surface-container-low); }
      .price { font: var(--mat-sys-display-small); }
      .per { font: var(--mat-sys-title-medium); color: var(--mat-sys-on-surface-variant); }
      .save { justify-self: start; padding: 2px 10px; border-radius: 999px; background: var(--mat-sys-primary-container); color: var(--mat-sys-on-primary-container); font: var(--mat-sys-label-medium); }
    }
    .features { padding-left: 20px; display: grid; gap: 6px; }
    .current { padding: 16px; border-radius: 16px; background: var(--mat-sys-primary-container); color: var(--mat-sys-on-primary-container); }
  `,
  template: `
    <ng-container *transloco="let t; prefix: 'subscription'">
      <section class="page">
        <h2>{{ t('title') }}</h2>
        <p class="subtitle">{{ t('subtitle') }}</p>
        @if (current(); as s) {
          <p class="current" data-testid="sub-current">{{ t('active', { plan: t('plans.' + s.plan + '.name'), date: (s.currentPeriodEnd | date: 'd/M/y') }) }}</p>
        }
        <ul class="features">
          <li>{{ t('feature1') }}</li>
          <li>{{ t('feature2') }}</li>
          <li>{{ t('feature3') }}</li>
          <li>{{ t('feature4') }}</li>
        </ul>
        <div class="plans">
          @for (p of plans; track p) {
            <div class="plan" [class.featured]="p === 'YEARLY'" [attr.data-plan]="p">
              <strong>{{ t('plans.' + p + '.name') }}</strong>
              <div><span class="price">{{ t('plans.' + p + '.price') }}</span> <span class="per">{{ t('plans.' + p + '.per') }}</span></div>
              @if (p === 'YEARLY') {
                <span class="save">{{ t('save') }}</span>
              }
              <button mat-flat-button (click)="checkout(p)">{{ t('choose') }}</button>
              @if (dev) {
                <button mat-button (click)="devActivate(p)" data-testid="dev-activate">{{ t('devActivate') }}</button>
              }
            </div>
          }
        </div>
        <p class="meta">{{ t('note') }}</p>
        <a mat-button routerLink="/ajustes" fragment="whatsapp">{{ t('back') }}</a>
      </section>
    </ng-container>
  `,
})
export class SubscriptionPage implements OnInit {
  private readonly receipts = inject(ReceiptsService);
  private readonly snack = inject(MatSnackBar);
  private readonly t = inject(TranslocoService);
  readonly plans = ['MONTHLY', 'YEARLY'] as const;
  readonly current = signal<Subscription | null>(null);
  readonly dev = isDevMode();

  async ngOnInit() {
    this.current.set((await this.receipts.subscription()).subscription);
  }

  async checkout(plan: 'MONTHLY' | 'YEARLY') {
    try {
      await this.receipts.checkout(plan);
    } catch (e) {
      const msg = e instanceof HttpErrorResponse && typeof e.error?.message === 'string' ? e.error.message : this.t.translate('subscription.error');
      this.snack.open(msg, undefined, { duration: 5000 });
    }
  }

  async devActivate(plan: 'MONTHLY' | 'YEARLY') {
    this.current.set(await this.receipts.devActivate(plan));
  }
}
