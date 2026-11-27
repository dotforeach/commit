import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { MORTGAGE_RATES, MORTGAGE_SYSTEM_AVERAGE } from './bank-rates';
import { moneyFormatter, num, pct, percentText } from './tool-base';
import { mortgage } from './tools-math';

@Component({
  selector: 'app-mortgage-page',
  imports: [FormsModule, RouterLink, TranslocoDirective, MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule],
  styleUrl: './tools.scss',
  template: `
    <ng-container *transloco="let t; prefix: 'tools'">
      <section class="page">
        <a mat-button routerLink="/herramientas" class="back"><mat-icon fontSet="material-symbols-outlined" aria-hidden="true">arrow_back</mat-icon>{{ t('back') }}</a>
        <h2>{{ t('mortgage.title') }}</h2>
        <p class="subtitle">{{ t('mortgage.subtitle') }}</p>
        <div class="layout">
          <div class="inputs">
            <mat-form-field><mat-label>{{ t('mortgage.price') }}</mat-label><span matTextPrefix>$&nbsp;</span><input matInput inputmode="decimal" [ngModel]="price()" (ngModelChange)="price.set($event)" data-testid="price" /></mat-form-field>
            <mat-form-field><mat-label>{{ t('mortgage.down') }}</mat-label><span matTextPrefix>$&nbsp;</span><input matInput inputmode="decimal" [ngModel]="down()" (ngModelChange)="down.set($event)" data-testid="down" /></mat-form-field>
            <mat-form-field><mat-label>{{ t('mortgage.rate') }}</mat-label><input matInput inputmode="decimal" [ngModel]="rate()" (ngModelChange)="rate.set($event)" data-testid="rate" /><span matTextSuffix>%</span></mat-form-field>
            <div class="presets" [attr.aria-label]="t('mortgage.presets')">
              @for (b of banks; track b.bank) {
                <button type="button" [class.on]="rate() === pctInput(b.rate)" (click)="rate.set(pctInput(b.rate))" [attr.data-bank]="b.bank">{{ b.bank }} · {{ percent(b.rate) }}</button>
              }
              <button type="button" [class.on]="rate() === pctInput(avg.rate)" (click)="rate.set(pctInput(avg.rate))">{{ t('mortgage.average') }} · {{ percent(avg.rate) }}</button>
            </div>
            <p class="source">{{ t('source') }}: <a [href]="avg.source.url" target="_blank" rel="noopener">{{ avg.source.label }}</a></p>
            <mat-form-field><mat-label>{{ t('mortgage.years') }}</mat-label><input matInput inputmode="numeric" [ngModel]="years()" (ngModelChange)="years.set($event)" data-testid="years" /></mat-form-field>
            <mat-form-field><mat-label>{{ t('mortgage.subsidy') }}</mat-label><input matInput inputmode="decimal" [ngModel]="subsidy()" (ngModelChange)="subsidy.set($event)" data-testid="subsidy" /><span matTextSuffix>{{ t('mortgage.points') }}</span></mat-form-field>
            <mat-form-field><mat-label>{{ t('mortgage.subsidyYears') }}</mat-label><input matInput inputmode="numeric" [ngModel]="subsidyYears()" (ngModelChange)="subsidyYears.set($event)" /></mat-form-field>
            <p class="note">{{ t('mortgage.subsidyHint') }}</p>
          </div>
          <div class="results">
            <div class="kpis">
              <div class="kpi main"><span>{{ result().laterPayment === null ? t('mortgage.payment') : t('mortgage.paymentFirst') }}</span><strong data-testid="payment">{{ money(result().firstPayment) }}</strong></div>
              @if (result().laterPayment !== null) {
                <div class="kpi"><span>{{ t('mortgage.paymentLater') }}</span><strong>{{ money(result().laterPayment!) }}</strong></div>
              }
              <div class="kpi"><span>{{ t('mortgage.loan') }}</span><strong>{{ money(result().loan) }}</strong></div>
              <div class="kpi"><span>{{ t('mortgage.totalInterest') }}</span><strong data-testid="total-interest">{{ money(result().totalInterest) }}</strong></div>
            </div>
            <p class="meta">{{ t('mortgage.affordability', { income: money(result().firstPayment / 0.3) }) }}</p>
            <table>
              <thead><tr><th>{{ t('mortgage.year') }}</th><th>{{ t('mortgage.interestCol') }}</th><th>{{ t('mortgage.principalCol') }}</th><th>{{ t('mortgage.balanceCol') }}</th></tr></thead>
              <tbody>
                @for (y of milestones(); track y.year) {
                  <tr><td>{{ y.year }}</td><td>{{ money(y.interest) }}</td><td>{{ money(y.principal) }}</td><td>{{ money(y.balance) }}</td></tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </ng-container>
  `,
})
export class MortgagePage {
  readonly money = moneyFormatter();
  readonly percent = percentText;
  readonly banks = MORTGAGE_RATES;
  readonly avg = MORTGAGE_SYSTEM_AVERAGE;
  readonly price = signal('150,000');
  readonly down = signal('15,000');
  readonly rate = signal(this.pctInput(MORTGAGE_SYSTEM_AVERAGE.rate));
  readonly years = signal('30');
  readonly subsidy = signal('0');
  readonly subsidyYears = signal('7');
  readonly result = computed(() =>
    mortgage({
      price: num(this.price()),
      downPayment: num(this.down()),
      annualRate: pct(this.rate()),
      years: Math.min(Math.max(num(this.years()), 1), 40),
      subsidyPoints: pct(this.subsidy()),
      subsidyYears: num(this.subsidyYears()),
    }),
  );
  /** Años 1, 5, 10, 15… y el último. */
  readonly milestones = computed(() => this.result().yearly.filter((y, i, all) => y.year === 1 || y.year % 5 === 0 || i === all.length - 1));

  pctInput(fraction: number) {
    return (Math.round(fraction * 10000) / 100).toString();
  }
}
