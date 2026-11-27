import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { moneyFormatter, num, pct, percentText } from './tool-base';
import { compoundGrowth } from './tools-math';

@Component({
  selector: 'app-compound-page',
  imports: [FormsModule, RouterLink, TranslocoDirective, MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule],
  styleUrl: './tools.scss',
  template: `
    <ng-container *transloco="let t; prefix: 'tools'">
      <section class="page">
        <a mat-button routerLink="/herramientas" class="back"><mat-icon fontSet="material-symbols-outlined" aria-hidden="true">arrow_back</mat-icon>{{ t('back') }}</a>
        <h2>{{ t('compound.title') }}</h2>
        <p class="subtitle">{{ t('compound.subtitle') }}</p>
        <div class="layout">
          <div class="inputs">
            <mat-form-field><mat-label>{{ t('compound.initial') }}</mat-label><span matTextPrefix>$&nbsp;</span><input matInput inputmode="decimal" [ngModel]="initial()" (ngModelChange)="initial.set($event)" data-testid="initial" /></mat-form-field>
            <mat-form-field><mat-label>{{ t('compound.monthly') }}</mat-label><span matTextPrefix>$&nbsp;</span><input matInput inputmode="decimal" [ngModel]="monthly()" (ngModelChange)="monthly.set($event)" data-testid="monthly" /></mat-form-field>
            <mat-form-field><mat-label>{{ t('compound.rate') }}</mat-label><input matInput inputmode="decimal" [ngModel]="rate()" (ngModelChange)="rate.set($event)" data-testid="rate" /><span matTextSuffix>%</span></mat-form-field>
            <mat-form-field><mat-label>{{ t('compound.years') }}</mat-label><input matInput inputmode="numeric" [ngModel]="years()" (ngModelChange)="years.set($event)" data-testid="years" /></mat-form-field>
            <p class="note">{{ t('compound.hint') }}</p>
          </div>
          <div class="results" data-testid="results">
            <div class="kpis">
              <div class="kpi main"><span>{{ t('compound.final', { years: result().final.year }) }}</span><strong data-testid="final">{{ money(result().final.balance) }}</strong></div>
              <div class="kpi"><span>{{ t('compound.contributed') }}</span><strong>{{ money(result().final.contributed) }}</strong></div>
              <div class="kpi"><span>{{ t('compound.interest') }}</span><strong data-testid="interest">{{ money(result().final.interest) }}</strong></div>
            </div>
            <p class="meta">{{ t('compound.effective', { rate: percent(result().effectiveRate) }) }}</p>
            <div class="legend"><span><i style="background: var(--mat-sys-outline)"></i>{{ t('compound.contributed') }}</span><span><i style="background: var(--mat-sys-primary)"></i>{{ t('compound.interest') }}</span></div>
            <div class="bars" aria-hidden="true">
              @for (r of result().rows; track r.year) {
                <div class="bar">
                  <span>{{ t('compound.yearN', { n: r.year }) }}</span>
                  <div class="track" [style.width.%]="(r.balance / maxBalance()) * 100">
                    <div class="a" [style.flex]="r.contributed"></div>
                    <div class="b" [style.flex]="r.interest > 0 ? r.interest : 0"></div>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      </section>
    </ng-container>
  `,
})
export class CompoundPage {
  readonly money = moneyFormatter();
  readonly percent = percentText;
  readonly initial = signal('1,000');
  readonly monthly = signal('100');
  readonly rate = signal('6');
  readonly years = signal('20');
  readonly result = computed(() => compoundGrowth({ initial: num(this.initial()), monthly: num(this.monthly()), annualRate: pct(this.rate()), years: Math.min(Math.max(num(this.years()), 1), 60) }));
  readonly maxBalance = computed(() => Math.max(...this.result().rows.map((r) => r.balance), 1));
}
