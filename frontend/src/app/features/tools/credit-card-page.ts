import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { CARD_RATES } from './bank-rates';
import { moneyFormatter, num, pct, percentText } from './tool-base';
import { cardPayoff } from './tools-math';

@Component({
  selector: 'app-credit-card-page',
  imports: [FormsModule, RouterLink, TranslocoDirective, MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule],
  styleUrl: './tools.scss',
  template: `
    <ng-container *transloco="let t; prefix: 'tools'">
      <section class="page">
        <a mat-button routerLink="/herramientas" class="back"><mat-icon fontSet="material-symbols-outlined" aria-hidden="true">arrow_back</mat-icon>{{ t('back') }}</a>
        <h2>{{ t('credit.title') }}</h2>
        <p class="subtitle">{{ t('credit.subtitle') }}</p>
        <div class="layout">
          <div class="inputs">
            <mat-form-field><mat-label>{{ t('credit.balance') }}</mat-label><span matTextPrefix>$&nbsp;</span><input matInput inputmode="decimal" [ngModel]="balance()" (ngModelChange)="balance.set($event)" data-testid="balance" /></mat-form-field>
            <mat-form-field><mat-label>{{ t('credit.rate') }}</mat-label><input matInput inputmode="decimal" [ngModel]="rate()" (ngModelChange)="rate.set($event)" data-testid="rate" /><span matTextSuffix>%</span></mat-form-field>
            <div class="presets">
              @for (c of cards; track c.bank + c.product) {
                <button type="button" [class.on]="rate() === pctInput(c.rate)" (click)="rate.set(pctInput(c.rate))">{{ c.bank }} {{ c.product }} · {{ percent(c.rate) }}</button>
              }
            </div>
            <p class="source">{{ t('source') }}: <a [href]="cards[0].source.url" target="_blank" rel="noopener">{{ cards[0].source.label }}</a></p>
            <mat-form-field><mat-label>{{ t('credit.minimumPct') }}</mat-label><input matInput inputmode="decimal" [ngModel]="minPct()" (ngModelChange)="minPct.set($event)" /><span matTextSuffix>%</span></mat-form-field>
            <mat-form-field><mat-label>{{ t('credit.minimumFloor') }}</mat-label><span matTextPrefix>$&nbsp;</span><input matInput inputmode="decimal" [ngModel]="minFloor()" (ngModelChange)="minFloor.set($event)" /></mat-form-field>
            <p class="note">{{ t('credit.minimumHint') }}</p>
            <mat-form-field><mat-label>{{ t('credit.fixed') }}</mat-label><span matTextPrefix>$&nbsp;</span><input matInput inputmode="decimal" [ngModel]="fixed()" (ngModelChange)="fixed.set($event)" data-testid="fixed" /></mat-form-field>
          </div>
          <div class="results">
            <div class="kpis">
              <div class="kpi" [class.bad]="minimum().never" data-testid="minimum">
                <span>{{ t('credit.onlyMinimum') }}</span>
                @if (minimum().never) {
                  <strong>{{ t('credit.never') }}</strong>
                } @else {
                  <strong>{{ t('credit.months', { n: minimum().months }) }}</strong>
                  <span>{{ t('credit.interestPaid', { amount: money(minimum().totalInterest) }) }}</span>
                }
              </div>
              <div class="kpi main" data-testid="fixed-result">
                <span>{{ t('credit.withFixed', { amount: money(num(fixed())) }) }}</span>
                @if (withFixed().never) {
                  <strong>{{ t('credit.never') }}</strong>
                } @else {
                  <strong>{{ t('credit.months', { n: withFixed().months }) }}</strong>
                  <span>{{ t('credit.interestPaid', { amount: money(withFixed().totalInterest) }) }}</span>
                }
              </div>
              <div class="kpi"><span>{{ t('credit.payFull') }}</span><strong>{{ money(0) }}</strong><span>{{ t('credit.payFullHint') }}</span></div>
            </div>
            @if (!minimum().never && !withFixed().never) {
              <p data-testid="saving">{{ t('credit.saving', { amount: money(minimum().totalInterest - withFixed().totalInterest), months: minimum().months - withFixed().months }) }}</p>
            }
            <p class="meta">{{ t('credit.monthlyInterest', { amount: money(num(balance()) * pct(rate()) / 12) }) }}</p>
          </div>
        </div>
      </section>
    </ng-container>
  `,
})
export class CreditCardPage {
  readonly money = moneyFormatter();
  readonly percent = percentText;
  readonly num = num;
  readonly pct = pct;
  readonly cards = CARD_RATES;
  readonly balance = signal('2,000');
  readonly rate = signal('18.99');
  readonly minPct = signal('3');
  readonly minFloor = signal('25');
  readonly fixed = signal('200');
  private readonly base = computed(() => ({ balance: num(this.balance()), annualRate: pct(this.rate()), minimumPct: pct(this.minPct()), minimumFloor: num(this.minFloor()) }));
  readonly minimum = computed(() => cardPayoff({ ...this.base(), fixedPayment: null }));
  readonly withFixed = computed(() => cardPayoff({ ...this.base(), fixedPayment: num(this.fixed()) }));

  pctInput(fraction: number) {
    return (Math.round(fraction * 10000) / 100).toString();
  }
}
