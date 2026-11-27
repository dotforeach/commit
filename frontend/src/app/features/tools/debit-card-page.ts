import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { SAVINGS_RULE } from './bank-rates';
import { moneyFormatter, num, pct } from './tool-base';
import { debitAnnualCost, debitVsCredit } from './tools-math';

interface AccountRow {
  name: string;
  annualFees: string;
  otherAtmPerMonth: string;
  otherAtmFee: string;
  extraTellerPerMonth: string;
  tellerFee: string;
  rate: string;
}
const row = (name: string): AccountRow => ({ name, annualFees: '0', otherAtmPerMonth: '2', otherAtmFee: '1.50', extraTellerPerMonth: '0', tellerFee: '2', rate: '0.5' });

@Component({
  selector: 'app-debit-card-page',
  imports: [FormsModule, RouterLink, TranslocoDirective, MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule],
  styleUrl: './tools.scss',
  styles: `
    .accounts { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px; }
    .account { padding: 12px; border: 1px solid var(--mat-sys-outline-variant); border-radius: 16px; }
    .account mat-form-field { width: 100%; }
    .best { border-color: var(--mat-sys-primary); }
  `,
  template: `
    <ng-container *transloco="let t; prefix: 'tools'">
      <section class="page">
        <a mat-button routerLink="/herramientas" class="back"><mat-icon fontSet="material-symbols-outlined" aria-hidden="true">arrow_back</mat-icon>{{ t('back') }}</a>
        <h2>{{ t('debit.title') }}</h2>
        <p class="subtitle">{{ t('debit.subtitle') }}</p>

        <h3>{{ t('debit.costsTitle') }}</h3>
        <p class="note">{{ t('debit.rule') }} <a [href]="rule.url" target="_blank" rel="noopener">{{ rule.label }}</a></p>
        <mat-form-field><mat-label>{{ t('debit.averageBalance') }}</mat-label><span matTextPrefix>$&nbsp;</span><input matInput inputmode="decimal" [ngModel]="averageBalance()" (ngModelChange)="averageBalance.set($event)" /></mat-form-field>
        <div class="accounts">
          @for (a of accounts(); track $index; let i = $index) {
            <div class="account" [class.best]="bestIndex() === i" [attr.data-account-cost]="i">
              <mat-form-field><mat-label>{{ t('debit.name') }}</mat-label><input matInput [ngModel]="a.name" (ngModelChange)="patch(i, 'name', $event)" /></mat-form-field>
              <mat-form-field><mat-label>{{ t('debit.annualFees') }}</mat-label><span matTextPrefix>$&nbsp;</span><input matInput inputmode="decimal" [ngModel]="a.annualFees" (ngModelChange)="patch(i, 'annualFees', $event)" /></mat-form-field>
              <mat-form-field><mat-label>{{ t('debit.otherAtm') }}</mat-label><input matInput inputmode="numeric" [ngModel]="a.otherAtmPerMonth" (ngModelChange)="patch(i, 'otherAtmPerMonth', $event)" /></mat-form-field>
              <mat-form-field><mat-label>{{ t('debit.otherAtmFee') }}</mat-label><span matTextPrefix>$&nbsp;</span><input matInput inputmode="decimal" [ngModel]="a.otherAtmFee" (ngModelChange)="patch(i, 'otherAtmFee', $event)" /></mat-form-field>
              <mat-form-field><mat-label>{{ t('debit.extraTeller') }}</mat-label><input matInput inputmode="numeric" [ngModel]="a.extraTellerPerMonth" (ngModelChange)="patch(i, 'extraTellerPerMonth', $event)" /></mat-form-field>
              <mat-form-field><mat-label>{{ t('debit.tellerFee') }}</mat-label><span matTextPrefix>$&nbsp;</span><input matInput inputmode="decimal" [ngModel]="a.tellerFee" (ngModelChange)="patch(i, 'tellerFee', $event)" /></mat-form-field>
              <mat-form-field><mat-label>{{ t('debit.rate') }}</mat-label><input matInput inputmode="decimal" [ngModel]="a.rate" (ngModelChange)="patch(i, 'rate', $event)" /><span matTextSuffix>%</span></mat-form-field>
              <p><strong data-testid="net">{{ money(costs()[i].net) }}</strong> {{ t('debit.perYear') }}</p>
              <p class="meta">{{ t('debit.breakdown', { fees: money(costs()[i].fees), interest: money(costs()[i].interestEarned) }) }}</p>
            </div>
          }
        </div>
        <p class="note">{{ t('debit.costsHint') }}</p>

        <section class="block">
          <h3>{{ t('debit.vsTitle') }}</h3>
          <div class="layout">
            <div class="inputs">
              <mat-form-field><mat-label>{{ t('debit.amount') }}</mat-label><span matTextPrefix>$&nbsp;</span><input matInput inputmode="decimal" [ngModel]="amount()" (ngModelChange)="amount.set($event)" data-testid="amount" /></mat-form-field>
              <mat-form-field><mat-label>{{ t('debit.cashback') }}</mat-label><input matInput inputmode="decimal" [ngModel]="cashback()" (ngModelChange)="cashback.set($event)" /><span matTextSuffix>%</span></mat-form-field>
              <mat-form-field><mat-label>{{ t('debit.cardRate') }}</mat-label><input matInput inputmode="decimal" [ngModel]="cardRate()" (ngModelChange)="cardRate.set($event)" /><span matTextSuffix>%</span></mat-form-field>
              <mat-form-field><mat-label>{{ t('debit.months') }}</mat-label><input matInput inputmode="numeric" [ngModel]="months()" (ngModelChange)="months.set($event)" data-testid="months" /></mat-form-field>
            </div>
            <div class="results">
              <div class="kpis">
                @for (o of purchase(); track o.key) {
                  <div class="kpi" [class.main]="o.key === 'creditFull'" [class.bad]="o.netCost > 0" [attr.data-option]="o.key">
                    <span>{{ t('debit.options.' + o.key) }}</span>
                    <strong>{{ o.netCost > 0 ? '+' : '' }}{{ money(o.netCost) }}</strong>
                    <span>{{ t('debit.optionHint.' + o.key, { interest: money(o.interest), cashback: money(o.cashback) }) }}</span>
                  </div>
                }
              </div>
              <p class="meta">{{ t('debit.vsHint') }}</p>
            </div>
          </div>
        </section>
      </section>
    </ng-container>
  `,
})
export class DebitCardPage {
  readonly money = moneyFormatter();
  readonly rule = SAVINGS_RULE;
  readonly averageBalance = signal('1,000');
  readonly accounts = signal<AccountRow[]>([row('Banco A'), { ...row('Banco B'), otherAtmPerMonth: '0', rate: '0.75' }]);
  readonly costs = computed(() =>
    this.accounts().map((a) =>
      debitAnnualCost({
        name: a.name,
        annualFees: num(a.annualFees),
        otherAtmPerMonth: num(a.otherAtmPerMonth),
        otherAtmFee: num(a.otherAtmFee),
        extraTellerPerMonth: num(a.extraTellerPerMonth),
        tellerFee: num(a.tellerFee),
        annualRate: pct(a.rate),
        averageBalance: num(this.averageBalance()),
      }),
    ),
  );
  readonly bestIndex = computed(() => {
    const c = this.costs();
    return c.reduce((best, x, i) => (x.net < c[best].net ? i : best), 0);
  });

  readonly amount = signal('600');
  readonly cashback = signal('1');
  readonly cardRate = signal('18.99');
  readonly months = signal('6');
  readonly purchase = computed(() => debitVsCredit({ amount: num(this.amount()), cashbackPct: pct(this.cashback()), annualRate: pct(this.cardRate()), months: Math.max(num(this.months()), 2) }));

  patch(i: number, field: keyof AccountRow, value: string) {
    this.accounts.update((list) => list.map((a, j) => (j === i ? { ...a, [field]: value } : a)));
  }
}
