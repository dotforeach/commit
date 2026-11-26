import { Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { TranslocoDirective } from '@jsverse/transloco';
import { CurrenciesService } from '../../../core/currencies/currencies.service';
import { formatMoney } from '../../../core/money/decimal';
import { amortizationSchedule, toMoney } from '../debt-math';
import type { Debt } from '../debt.model';

/** Cronograma proyectado desde el monto original (las filas ya pagadas se marcan). */
@Component({
  selector: 'app-schedule-dialog',
  imports: [TranslocoDirective, MatButtonModule, MatDialogModule],
  template: `
    <ng-container *transloco="let t; prefix: 'debts.schedule'">
      <h2 mat-dialog-title>{{ t('title', { name: debt.name }) }}</h2>
      <mat-dialog-content>
        <p class="note">{{ t('note') }}</p>
        <table class="schedule">
          <thead>
            <tr><th>#</th><th>{{ t('payment') }}</th><th>{{ t('interest') }}</th><th>{{ t('principal') }}</th><th>{{ t('balance') }}</th></tr>
          </thead>
          <tbody>
            @for (r of rows(); track r.n) {
              <tr [class.paid]="r.n <= paidCount">
                <td>{{ r.n }}</td><td>{{ m(r.payment) }}</td><td>{{ m(r.interest) }}</td><td>{{ m(r.principal) }}</td><td>{{ m(r.balance) }}</td>
              </tr>
            }
          </tbody>
        </table>
        @if (totalInterest(); as ti) {
          <p class="total">{{ t('totalInterest', { amount: ti }) }}</p>
        }
      </mat-dialog-content>
      <mat-dialog-actions align="end"><button mat-button mat-dialog-close>{{ t('close') }}</button></mat-dialog-actions>
    </ng-container>
  `,
  styles: `
    .note { font: var(--mat-sys-body-small); color: var(--mat-sys-on-surface-variant); }
    .schedule { width: 100%; border-collapse: collapse; font-variant-numeric: tabular-nums; }
    th, td { padding: 4px 8px; text-align: right; border-bottom: 1px solid var(--mat-sys-outline-variant); }
    th:first-child, td:first-child { text-align: left; }
    tr.paid { opacity: 0.5; }
    .total { text-align: right; font: var(--mat-sys-title-small); }
  `,
})
export class ScheduleDialog {
  readonly debt = inject<Debt>(MAT_DIALOG_DATA);
  private readonly currencies = inject(CurrenciesService);
  readonly paidCount = this.debt.payments.length;
  readonly rows = computed(() =>
    this.debt.termMonths ? amortizationSchedule(Number(this.debt.originalAmount), Number(this.debt.annualRate ?? 0), this.debt.termMonths, this.debt.amortization) : [],
  );
  readonly totalInterest = computed(() => {
    const total = this.rows().reduce((s, r) => s + r.interest, 0);
    return total > 0 ? this.m(total) : null;
  });

  m(n: number) {
    return formatMoney(toMoney(n), this.currencies.get(this.debt.currency));
  }
}
