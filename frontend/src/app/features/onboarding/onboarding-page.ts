import { Component, computed, inject, signal, type OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators, type AbstractControl, type ValidationErrors } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { CurrenciesService } from '../../core/currencies/currencies.service';
import { todayIso } from '../../core/dates/dates';
import { HouseholdContextService } from '../../core/households/household-context.service';
import { addDecimals, compareDecimals, formatMoney, parseDecimalInput, percentOf, subDecimals, ZERO } from '../../core/money/decimal';
import { AccountsService } from '../accounts/accounts.service';
import { BudgetsService } from '../budget/budgets.service';
import { CategoriesService } from '../categories/categories.service';
import { DebtsService } from '../debts/debts.service';
import { ProgressService } from '../progress/progress.service';
import { RecurringService } from '../recurring/recurring.service';

const amountOrEmpty = (c: AbstractControl<string>): ValidationErrors | null => (!c.value?.trim() || parseDecimalInput(c.value) !== null ? null : { decimal: true });
const positive = (c: AbstractControl<string>): ValidationErrors | null => {
  const v = parseDecimalInput(c.value ?? '');
  return v === null || compareDecimals(v, '0') <= 0 ? { invalid: true } : null;
};

/** Gastos fijos típicos: categoría por defecto y si varían (piden confirmación cada mes). */
const FIXED = [
  { key: 'rent', systemKey: 'housing.rent', variable: false, day: 10 },
  { key: 'hoa', systemKey: 'housing.rent', variable: false, day: 10 },
  { key: 'power', systemKey: 'housing.utilities', variable: true, day: 15 },
  { key: 'gas', systemKey: 'housing.utilities', variable: true, day: 15 },
  { key: 'water', systemKey: 'housing.utilities', variable: true, day: 15 },
  { key: 'internet', systemKey: 'housing.utilities', variable: false, day: 10 },
  { key: 'phone', systemKey: 'housing.utilities', variable: false, day: 10 },
  { key: 'health', systemKey: 'health', variable: false, day: 5 },
  { key: 'subscriptions', systemKey: 'subscriptions', variable: false, day: 1 },
  { key: 'school', systemKey: 'education', variable: false, day: 10 },
];

@Component({
  selector: 'app-onboarding-page',
  imports: [
    ReactiveFormsModule,
    TranslocoDirective,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatStepperModule,
  ],
  templateUrl: './onboarding-page.html',
  styleUrl: './onboarding-page.scss',
})
export class OnboardingPage implements OnInit {
  private readonly accounts = inject(AccountsService);
  private readonly categories = inject(CategoriesService);
  private readonly recurring = inject(RecurringService);
  private readonly debts = inject(DebtsService);
  private readonly budgets = inject(BudgetsService);
  private readonly progress = inject(ProgressService);
  private readonly currencies = inject(CurrenciesService);
  private readonly hh = inject(HouseholdContextService);
  private readonly transloco = inject(TranslocoService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder).nonNullable;

  readonly fixedDefs = FIXED;
  readonly busy = signal(false);
  readonly error = signal<string | null>(null);
  readonly saved = signal({ salary: false, fixed: false, debts: false, budget: false });
  readonly existingAccounts = computed(() => this.accounts.active().filter((a) => a.type !== 'CREDIT_CARD' && a.type !== 'LOAN' && a.type !== 'INVESTMENT'));
  private readonly base = this.hh.baseCurrency();

  readonly salary = this.fb.group({
    accountId: [''],
    accountName: [''],
    initialBalance: ['', amountOrEmpty],
    amount: ['', positive],
    payday: [1, [Validators.required, Validators.min(1), Validators.max(31)]],
  });
  readonly fixed = this.fb.group({
    items: this.fb.array(FIXED.map((f) => this.fb.group({ amount: ['', amountOrEmpty], day: [f.day, [Validators.min(1), Validators.max(31)]] }))),
  });
  readonly debtsForm = this.fb.group({
    items: this.fb.array([0, 1, 2].map(() => this.fb.group({ name: [''], balance: ['', amountOrEmpty], payment: ['', amountOrEmpty] }))),
  });

  get fixedItems(): FormArray {
    return this.fixed.controls.items;
  }
  get debtItems(): FormArray {
    return this.debtsForm.controls.items;
  }

  private readonly salaryValue = toSignal(this.salary.controls.amount.valueChanges, { initialValue: this.salary.controls.amount.value });
  private readonly fixedValues = toSignal(this.fixed.valueChanges, { initialValue: this.fixed.getRawValue() });

  readonly fixedTotal = computed(() => addDecimals(ZERO, ...(this.fixedValues().items ?? []).map((i) => parseDecimalInput(i?.amount ?? '') ?? '0')));

  /** Presupuesto 50/30/20 sugerido sobre el sueldo. */
  readonly suggestion = computed(() => {
    const income = parseDecimalInput(this.salaryValue() ?? '');
    if (!income) return null;
    const needs = percentOf(income, 50);
    return {
      income,
      needs,
      wants: percentOf(income, 30),
      savings: percentOf(income, 20),
      fixed: this.fixedTotal(),
      needsLeft: subDecimals(needs, this.fixedTotal()),
    };
  });

  async ngOnInit() {
    await Promise.all([this.accounts.load(), this.categories.ensureLoaded(), this.recurring.ensureLoaded(), this.debts.ensureLoaded(), this.budgets.ensureLoaded()]);
    if (this.existingAccounts().length > 0) this.salary.controls.accountId.setValue(this.existingAccounts()[0].id);
    else this.salary.controls.accountName.setValue(this.transloco.translate('onboarding.salary.defaultAccount'));
  }

  money(a: string) {
    return formatMoney(a, this.currencies.get(this.base));
  }

  label(key: string) {
    return this.transloco.translate(`onboarding.fixed.items.${key}`);
  }

  private salaryAccountId: string | null = null;

  async saveSalary() {
    if (this.salary.invalid || this.saved().salary) return true;
    return this.run(async () => {
      const v = this.salary.getRawValue();
      let accountId = v.accountId;
      if (!accountId) {
        const created = await this.accounts.create({
          name: v.accountName.trim() || this.transloco.translate('onboarding.salary.defaultAccount'),
          type: 'CHECKING',
          currency: this.base,
          ownerUserId: null,
          initialBalance: parseDecimalInput(v.initialBalance || '0')!,
          institution: null,
          color: null,
          icon: null,
          includeInNetWorth: true,
          creditCard: null,
        });
        accountId = created.id;
      }
      this.salaryAccountId = accountId;
      const salaryCat = this.categories.categories().find((c) => c.systemKey === 'income.salary');
      await this.recurring.create({
        type: 'INCOME',
        description: this.transloco.translate('onboarding.salary.ruleName'),
        amount: parseDecimalInput(v.amount)!,
        accountId,
        categoryId: salaryCat?.id ?? null,
        frequency: 'MONTHLY',
        interval: 1,
        dayOfMonth: v.payday,
        startDate: todayIso(),
        endDate: null,
        autoPost: true,
        isSalary: true,
        active: true,
      });
      this.saved.update((s) => ({ ...s, salary: true }));
      await this.progress.setOnboarding(1, false);
    });
  }

  async saveFixed() {
    if (this.saved().fixed) return true;
    return this.run(async () => {
      const accountId = this.salaryAccountId ?? this.salary.controls.accountId.value ?? this.existingAccounts()[0]?.id;
      const rows = this.fixed.getRawValue().items;
      for (const [i, def] of FIXED.entries()) {
        const amount = parseDecimalInput(rows[i].amount);
        if (!amount || compareDecimals(amount, '0') <= 0 || !accountId) continue;
        await this.recurring.create({
          type: 'EXPENSE',
          description: this.label(def.key),
          amount,
          accountId,
          categoryId: this.categories.categories().find((c) => c.systemKey === def.systemKey)?.id ?? null,
          frequency: 'MONTHLY',
          interval: 1,
          dayOfMonth: rows[i].day,
          startDate: todayIso(),
          endDate: null,
          autoPost: !def.variable,
          isSalary: false,
          active: true,
        });
      }
      this.saved.update((s) => ({ ...s, fixed: true }));
      await this.progress.setOnboarding(2, false);
    });
  }

  async saveDebts() {
    if (this.saved().debts) return true;
    return this.run(async () => {
      for (const d of this.debtsForm.getRawValue().items) {
        const balance = parseDecimalInput(d.balance);
        if (!d.name.trim() || !balance || compareDecimals(balance, '0') <= 0) continue;
        await this.debts.create({
          name: d.name.trim(),
          kind: 'OTHER',
          lender: null,
          currency: this.base,
          originalAmount: balance,
          annualRate: null,
          indexName: null,
          minimumPayment: parseDecimalInput(d.payment || '') || null,
          rateType: 'NONE',
          amortization: 'CUSTOM',
          termMonths: null,
          startDate: todayIso(),
          paymentDay: null,
          status: 'ACTIVE',
          accountId: null,
        });
      }
      this.saved.update((s) => ({ ...s, debts: true }));
      await this.progress.setOnboarding(3, false);
    });
  }

  /** Crea el presupuesto 50/30/20 del mes con los gastos fijos como límites por categoría. */
  async finish() {
    await this.run(async () => {
      const s = this.suggestion();
      const now = new Date();
      if (s && !this.saved().budget && !this.budgets.find(now.getFullYear(), now.getMonth() + 1)) {
        const rows = this.fixed.getRawValue().items;
        const byCategory = new Map<string, string>();
        for (const [i, def] of FIXED.entries()) {
          const amount = parseDecimalInput(rows[i].amount);
          const cat = this.categories.categories().find((c) => c.systemKey === def.systemKey);
          if (!amount || !cat) continue;
          byCategory.set(cat.id, addDecimals(byCategory.get(cat.id) ?? ZERO, amount));
        }
        await this.budgets.create(now.getFullYear(), now.getMonth() + 1, {
          method: 'FIFTY_THIRTY_TWENTY',
          currency: this.base,
          expectedIncome: s.income,
          items: [...byCategory.entries()].map(([categoryId, amount]) => ({ categoryId, amount, rollover: false, alertThreshold: 90 })),
        });
        this.saved.update((x) => ({ ...x, budget: true }));
      }
      await this.progress.setOnboarding(4, true);
      await this.router.navigate(['/progreso']);
    });
  }

  async skip() {
    await this.router.navigate(['/inicio']);
  }

  private async run(fn: () => Promise<void>): Promise<boolean> {
    this.busy.set(true);
    this.error.set(null);
    try {
      await fn();
      return true;
    } catch {
      this.error.set('onboarding.error');
      return false;
    } finally {
      this.busy.set(false);
    }
  }
}
