import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal, type OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RouterLink } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { CurrenciesService } from '../../core/currencies/currencies.service';
import { HouseholdContextService } from '../../core/households/household-context.service';
import { formatMoney, parseDecimalInput } from '../../core/money/decimal';
import { toMoney } from '../debts/debt-math';
import type { PlanStep } from './plan-engine';
import { PlanService } from './plan.service';

const ICONS: Record<PlanStep['kind'], string> = {
  minimums: 'event_available',
  shortfall: 'warning',
  cards: 'credit_card',
  miniFund: 'shield',
  prepay: 'trending_down',
  dontPrepay: 'do_not_disturb_on',
  fullFund: 'health_and_safety',
  goal: 'flag',
  invest: 'show_chart',
};
const LINKS: Record<PlanStep['kind'], string> = {
  minimums: '/deudas',
  shortfall: '/presupuesto',
  cards: '/deudas',
  miniFund: '/ahorro',
  prepay: '/deudas',
  dontPrepay: '/deudas',
  fullFund: '/ahorro',
  goal: '/ahorro',
  invest: '/ahorro',
};

@Component({
  selector: 'app-plan-page',
  imports: [DatePipe, FormsModule, RouterLink, TranslocoDirective, MatButtonModule, MatCardModule, MatFormFieldModule, MatIconModule, MatInputModule, MatProgressBarModule],
  templateUrl: './plan-page.html',
  styleUrl: './plan-page.scss',
})
export class PlanPage implements OnInit {
  readonly service = inject(PlanService);
  private readonly currencies = inject(CurrenciesService);
  private readonly hh = inject(HouseholdContextService);

  readonly loading = signal(true);
  readonly loadError = signal(false);
  readonly inflationInput = signal('');
  readonly plan = this.service.plan;
  readonly input = this.service.input;
  readonly icons = ICONS;
  readonly links = LINKS;
  /** Número de paso visible (los informativos también cuentan). */
  readonly steps = computed(() => this.plan().steps.map((s, i) => ({ ...s, n: i + 1 })));

  async ngOnInit() {
    try {
      await this.service.ensureLoaded();
      const inf = this.service.monthlyInflation();
      this.inflationInput.set(inf === null ? '' : this.pct(inf).replace('%', '').trim());
    } catch {
      this.loadError.set(true);
    } finally {
      this.loading.set(false);
    }
  }

  async saveInflation() {
    const parsed = parseDecimalInput(this.inflationInput());
    await this.service.setInflation(parsed === null ? null : Number(parsed) / 100);
  }

  async clearInflation() {
    this.inflationInput.set('');
    await this.service.setInflation(null);
  }

  money(n: number) {
    return formatMoney(toMoney(n), this.currencies.get(this.hh.baseCurrency()));
  }

  pct(fraction: number) {
    return `${(Math.round(fraction * 1000) / 10).toString().replace('.', ',')} %`;
  }

  /** Parámetros de traducción de cada paso. */
  params(s: PlanStep): Record<string, string> {
    switch (s.kind) {
      case 'miniFund':
      case 'fullFund':
        return { amount: this.money(s.amount), saved: this.money(s.saved), target: this.money(s.target) };
      case 'prepay':
        return { amount: this.money(s.amount), name: s.name, rate: this.pct(s.effectiveRate) };
      case 'goal':
        return { amount: this.money(s.amount), name: s.name };
      case 'dontPrepay':
        return { inflation: this.pct(this.service.monthlyInflation() ?? 0) };
      default:
        return { amount: this.money(s.amount) };
    }
  }
}
