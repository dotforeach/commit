import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { moneyFormatter, num, pct } from './tool-base';
import { MAX_ROWS, PANAMA_TAX, type PayPeriod, salaryBreakdown, salaryTable, TAX_SOURCES, toPeriod } from './tax-math';

const STEPS = [50, 100, 250, 500, 1000];

@Component({
  selector: 'app-tax-page',
  imports: [FormsModule, RouterLink, TranslocoDirective, MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule],
  styleUrl: './tools.scss',
  styles: `
    .kpis { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .form { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 4px 12px; }
    .form mat-form-field { width: 100%; }
    .table-wrap { overflow-x: auto; margin-top: 8px; }
    th { font: var(--mat-sys-title-small); white-space: nowrap; }
    th.gross { color: var(--mat-sys-primary); }
    td { white-space: nowrap; }
    tbody tr:nth-child(odd) { background: var(--mat-sys-surface-container-lowest); }
    .chip { display: inline-block; padding: 2px 8px; border-radius: 8px; font: var(--mat-sys-label-large); }
    .chip.gross { background: var(--mat-sys-primary-container); color: var(--mat-sys-on-primary-container); }
    .chip.minus { background: var(--mat-sys-error-container); color: var(--mat-sys-on-error-container); }
    td.net { font-weight: 600; }
  `,
  template: `
    <ng-container *transloco="let t; prefix: 'tools'">
      <section class="page">
        <a mat-button routerLink="/herramientas" class="back"><mat-icon fontSet="material-symbols-outlined" aria-hidden="true">arrow_back</mat-icon>{{ t('back') }}</a>
        <h2>{{ t('tax.title') }}</h2>
        <p class="subtitle">{{ t('tax.subtitle') }}</p>

        <h3>{{ t('tax.mine') }}</h3>
        <div class="layout">
          <div class="inputs">
            <mat-form-field><mat-label>{{ t('tax.salary') }}</mat-label><span matTextPrefix>$&nbsp;</span><input matInput inputmode="decimal" [ngModel]="salary()" (ngModelChange)="salary.set($event)" data-testid="tax-salary" /></mat-form-field>
          </div>
          <div class="kpis">
            <div class="kpi main" data-testid="tax-net"><span>{{ t('tax.net') }}</span><strong>{{ money(mine().net) }}</strong><span>{{ t('tax.perMonth') }}</span></div>
            <div class="kpi bad" data-testid="tax-total"><span>{{ t('tax.total') }}</span><strong>-{{ money(mine().totalDeductions) }}</strong><span>{{ t('tax.ofSalary', { pct: share() }) }}</span></div>
            <div class="kpi"><span>{{ t('tax.isr') }}</span><strong>{{ mine().incomeTax ? '-' + money(mine().incomeTax) : '--' }}</strong></div>
            <div class="kpi"><span>{{ t('tax.ss') }} + {{ t('tax.se') }}</span><strong>-{{ money(mine().socialSecurity + mine().educationInsurance) }}</strong></div>
          </div>
        </div>

        <section class="block">
          <h3>{{ t('tax.rangeTitle') }}</h3>
          <div class="form">
            <mat-form-field><mat-label>{{ t('tax.from') }}</mat-label><span matTextPrefix>$&nbsp;</span><input matInput inputmode="decimal" [ngModel]="from()" (ngModelChange)="from.set($event)" data-testid="tax-from" /></mat-form-field>
            <mat-form-field><mat-label>{{ t('tax.to') }}</mat-label><span matTextPrefix>$&nbsp;</span><input matInput inputmode="decimal" [ngModel]="to()" (ngModelChange)="to.set($event)" data-testid="tax-to" /></mat-form-field>
            <mat-form-field>
              <mat-label>{{ t('tax.step') }}</mat-label>
              <select matNativeControl [ngModel]="step()" (ngModelChange)="step.set(+$event)" data-testid="tax-step">
                @for (s of steps; track s) { <option [value]="s">{{ money(s) }}</option> }
              </select>
            </mat-form-field>
            <mat-form-field>
              <mat-label>{{ t('tax.period') }}</mat-label>
              <select matNativeControl [ngModel]="period()" (ngModelChange)="period.set($event)" data-testid="tax-period">
                <option value="monthly">{{ t('tax.monthly') }}</option>
                <option value="biweekly">{{ t('tax.biweekly') }}</option>
              </select>
            </mat-form-field>
            <mat-form-field><mat-label>{{ t('tax.ss') }}</mat-label><input matInput inputmode="decimal" [ngModel]="ss()" (ngModelChange)="ss.set($event)" /><span matTextSuffix>%</span></mat-form-field>
            <mat-form-field><mat-label>{{ t('tax.se') }}</mat-label><input matInput inputmode="decimal" [ngModel]="se()" (ngModelChange)="se.set($event)" /><span matTextSuffix>%</span></mat-form-field>
          </div>

          @if (rows().length) {
            <div class="table-wrap">
              <table data-testid="tax-table">
                <thead>
                  <tr>
                    <th class="gross">{{ t('tax.colSalary', { period: t('tax.' + period()) }) }}</th>
                    <th>{{ t('tax.colNet') }}</th>
                    <th>{{ t('tax.colTotal') }}</th>
                    <th>{{ t('tax.isr') }}</th>
                    <th>{{ t('tax.ss') }}</th>
                    <th>{{ t('tax.se') }}</th>
                  </tr>
                </thead>
                <tbody>
                  @for (r of rows(); track r.gross) {
                    <tr>
                      <td><span class="chip gross">{{ money(r.gross) }}</span></td>
                      <td class="net">{{ money(r.net) }}</td>
                      <td><span class="chip minus">-{{ money(r.totalDeductions) }}</span></td>
                      <td>{{ r.incomeTax ? '-' + money(r.incomeTax) : '--' }}</td>
                      <td>-{{ money(r.socialSecurity) }}</td>
                      <td>-{{ money(r.educationInsurance) }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
            @if (truncated()) { <p class="note">{{ t('tax.truncated', { max: maxRows }) }}</p> }
          } @else {
            <p class="note" data-testid="tax-empty">{{ t('tax.invalidRange') }}</p>
          }
        </section>

        <section class="block">
          <h3>{{ t('tax.howTitle') }}</h3>
          <ul class="note">
            <li>{{ t('tax.how.ss') }}</li>
            <li>{{ t('tax.how.isr') }}</li>
            <li>{{ t('tax.how.deductions') }}</li>
            <li>{{ t('tax.how.public') }}</li>
          </ul>
          <p class="source">{{ t('source') }}:
            @for (s of sources; track s.url; let last = $last) {
              <a [href]="s.url" target="_blank" rel="noopener">{{ s.label }}</a>{{ last ? '' : ' · ' }}
            }
          </p>
        </section>
      </section>
    </ng-container>
  `,
})
export class TaxPage {
  readonly money = moneyFormatter();
  readonly steps = STEPS;
  readonly sources = TAX_SOURCES;
  readonly maxRows = MAX_ROWS;

  readonly salary = signal('1,000');
  readonly ss = signal(String(PANAMA_TAX.socialSecurity * 100));
  readonly se = signal(String(PANAMA_TAX.educationInsurance * 100));
  private readonly rates = computed(() => ({ socialSecurity: pct(this.ss()), educationInsurance: pct(this.se()) }));

  readonly mine = computed(() => salaryBreakdown(num(this.salary()), this.rates()));
  readonly share = computed(() => {
    const m = this.mine();
    return m.gross ? (Math.round((m.totalDeductions / m.gross) * 1000) / 10).toString() : '0';
  });

  readonly from = signal('600');
  readonly to = signal('2,000');
  readonly step = signal(100);
  readonly period = signal<PayPeriod>('monthly');
  private readonly monthlyRows = computed(() => salaryTable(num(this.from()), num(this.to()), this.step(), this.rates()));
  readonly rows = computed(() => this.monthlyRows().map((r) => toPeriod(r, this.period())));
  readonly truncated = computed(() => {
    const expected = Math.floor((num(this.to()) - num(this.from())) / this.step()) + 1;
    return expected > MAX_ROWS;
  });
}
