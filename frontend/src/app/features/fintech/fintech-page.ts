import { Component, computed, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoDirective } from '@jsverse/transloco';
import { FINTECH_CATEGORIES, FINTECH_CHECKED_AT, FINTECHS, type FintechCategory, REGULATORS } from './fintech-data';

const ICONS: Record<FintechCategory, string> = { payments: 'account_balance_wallet', investing: 'trending_up', crypto: 'currency_bitcoin' };

@Component({
  selector: 'app-fintech-page',
  imports: [TranslocoDirective, MatIconModule],
  styleUrl: './fintech-page.scss',
  template: `
    <ng-container *transloco="let t; prefix: 'fintech'">
      <section class="page">
        <h2>{{ t('title') }}</h2>
        <p class="subtitle">{{ t('subtitle') }}</p>

        <div class="filters" role="group" [attr.aria-label]="t('filter')">
          <button type="button" [class.on]="category() === null" [attr.aria-pressed]="category() === null" (click)="category.set(null)" data-filter="all">{{ t('all') }} ({{ items.length }})</button>
          @for (c of categories; track c) {
            <button type="button" [class.on]="category() === c" [attr.aria-pressed]="category() === c" (click)="category.set(c)" [attr.data-filter]="c">
              <mat-icon fontSet="material-symbols-outlined" aria-hidden="true">{{ icons[c] }}</mat-icon>{{ t('categories.' + c) }} ({{ count(c) }})
            </button>
          }
        </div>

        <ul class="cards">
          @for (f of visible(); track f.slug) {
            <li class="card" [class.featured]="f.featured" [attr.data-fintech]="f.slug">
              <header>
                <mat-icon fontSet="material-symbols-outlined" aria-hidden="true">{{ icons[f.category] }}</mat-icon>
                <div>
                  <h3>{{ f.name }}</h3>
                  <span class="kind">{{ t('categories.' + f.category) }}</span>
                </div>
              </header>
              <p>{{ f.summary }}</p>
              <ul class="features">
                @for (x of f.features; track x) { <li>{{ x }}</li> }
              </ul>
              @if (f.costs) { <p class="meta"><strong>{{ t('costs') }}:</strong> {{ f.costs }}</p> }
              <p class="meta regulation" [class.claimed]="f.regulation.claimed">
                <mat-icon fontSet="material-symbols-outlined" aria-hidden="true">{{ f.regulation.claimed ? 'info' : 'verified_user' }}</mat-icon>
                <span><strong>{{ t('regulation') }}:</strong> {{ f.regulation.text }}@if (f.regulation.claimed) { <em> {{ t('claimed') }}</em> }</span>
              </p>
              @if (f.caveats.length) {
                <details>
                  <summary>{{ t('caveats') }}</summary>
                  <ul>
                    @for (c of f.caveats; track c) { <li>{{ c }}</li> }
                  </ul>
                </details>
              }
              <footer>
                <a [href]="f.url" target="_blank" rel="noopener nofollow">{{ t('visit') }} <mat-icon fontSet="material-symbols-outlined" aria-hidden="true">open_in_new</mat-icon></a>
                <span class="sources">{{ t('sources') }}:
                  @for (s of f.sources; track s.url; let last = $last) {
                    <a [href]="s.url" target="_blank" rel="noopener nofollow">{{ s.label }}</a>{{ last ? '' : ' · ' }}
                  }
                </span>
              </footer>
            </li>
          }
        </ul>

        <section class="verify" aria-labelledby="verify-title">
          <h3 id="verify-title">{{ t('verify.title') }}</h3>
          <ol>
            <li>{{ t('verify.license') }}</li>
            <li>{{ t('verify.deposit') }}</li>
            <li>{{ t('verify.returns') }}</li>
            <li>{{ t('verify.start') }}</li>
          </ol>
          <p class="meta">
            @for (r of regulators; track r.url; let last = $last) {
              <a [href]="r.url" target="_blank" rel="noopener">{{ r.label }}</a>{{ last ? '' : ' · ' }}
            }
          </p>
        </section>

        <p class="meta disclaimer">{{ t('disclaimer', { date: checkedAt }) }}</p>
      </section>
    </ng-container>
  `,
})
export class FintechPage {
  readonly items = FINTECHS;
  readonly categories = FINTECH_CATEGORIES;
  readonly regulators = REGULATORS;
  readonly checkedAt = FINTECH_CHECKED_AT;
  readonly icons = ICONS;
  readonly category = signal<FintechCategory | null>(null);
  /** Destacadas primero; dentro de cada grupo, el orden del archivo. */
  readonly visible = computed(() => {
    const c = this.category();
    const list = c ? this.items.filter((f) => f.category === c) : this.items;
    return [...list].sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
  });

  count(c: FintechCategory) {
    return this.items.filter((f) => f.category === c).length;
  }
}
