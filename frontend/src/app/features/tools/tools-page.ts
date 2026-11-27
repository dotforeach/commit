import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { CHECKED_AT } from './bank-rates';

export const TOOLS = [
  { slug: 'interes-compuesto', key: 'compound', icon: 'trending_up' },
  { slug: 'hipoteca', key: 'mortgage', icon: 'home' },
  { slug: 'tarjeta-de-credito', key: 'credit', icon: 'credit_card' },
  { slug: 'tarjeta-de-debito', key: 'debit', icon: 'account_balance_wallet' },
] as const;

@Component({
  selector: 'app-tools-page',
  imports: [RouterLink, TranslocoDirective, MatIconModule],
  styleUrl: './tools.scss',
  template: `
    <ng-container *transloco="let t; prefix: 'tools'">
      <section class="page">
        <h2>{{ t('title') }}</h2>
        <p class="subtitle">{{ t('subtitle') }}</p>
        <ul class="grid-cards">
          @for (tool of tools; track tool.slug) {
            <li>
              <a class="tool-card" [routerLink]="['/herramientas', tool.slug]" [attr.data-tool]="tool.slug">
                <mat-icon fontSet="material-symbols-outlined" aria-hidden="true">{{ tool.icon }}</mat-icon>
                <strong>{{ t(tool.key + '.title') }}</strong>
                <span>{{ t(tool.key + '.summary') }}</span>
              </a>
            </li>
          }
        </ul>
        <p class="note" style="margin-top: 24px">{{ t('disclaimer', { date: checkedAt }) }}</p>
      </section>
    </ng-container>
  `,
})
export class ToolsPage {
  readonly tools = TOOLS;
  readonly checkedAt = CHECKED_AT;
}
