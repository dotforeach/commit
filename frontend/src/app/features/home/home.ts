import { Component, computed, inject, resource, type OnInit } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import type { HouseholdPayload } from '../../core/api/api.types';
import { AuthService } from '../../core/auth/auth.service';
import { decryptPayload, payloadAad } from '../../core/crypto/aead';
import { KeyVaultService } from '../../core/crypto/key-vault.service';
import { fromBase64 } from '../../core/crypto/sodium';
import { SessionService } from '../../core/session/session.service';
import { AccountsService } from '../accounts/accounts.service';
import { CategoriesService } from '../categories/categories.service';
import { PendingList } from '../recurring/pending-list/pending-list';
import { RecurringService } from '../recurring/recurring.service';
import { computeBudget } from '../budget/budget-math';
import { BudgetsService } from '../budget/budgets.service';
import { CurrenciesService } from '../../core/currencies/currencies.service';
import { formatMoney, ratioOf } from '../../core/money/decimal';
import { TransactionsService } from '../transactions/transactions.service';

@Component({
  selector: 'app-home',
  imports: [MatProgressBarModule, PendingList, RouterLink, TranslocoDirective, MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  private readonly session = inject(SessionService);
  private readonly vault = inject(KeyVaultService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly accounts = inject(AccountsService);
  private readonly categories = inject(CategoriesService);
  private readonly transactions = inject(TransactionsService);
  private readonly recurring = inject(RecurringService);
  private readonly snack = inject(MatSnackBar);
  private readonly budgets = inject(BudgetsService);
  private readonly currencies = inject(CurrenciesService);
  private readonly transloco = inject(TranslocoService);

  readonly me = this.session.me;
  readonly displayName = computed(() => this.me()?.user.displayName ?? '');

  /** Nombres de los hogares, descifrados en el navegador con la clave de cada hogar. */
  readonly households = resource({
    params: () => this.me() ?? undefined, // undefined: el resource espera hasta tener sesión
    loader: async ({ params: me }) =>
      Promise.all(
        me.households
          .filter((h) => h.status === 'ACTIVE')
          .map(async (h) => {
            const payload = await decryptPayload<HouseholdPayload>(
              await fromBase64(h.payload),
              this.vault.householdKey(h.id, h.keyVersion),
              payloadAad('households', h.id, h.id, h.keyVersion),
            );
            return { id: h.id, name: payload.name, baseCurrency: h.baseCurrency, role: h.role };
          }),
      ),
  });

  /** Presupuesto del mes en curso: cuánto se gastó y cuántas categorías se pasaron. */
  readonly budgetSummary = computed(() => {
    const now = new Date();
    const b = this.budgets.budgets().find((x) => x.year === now.getFullYear() && x.month === now.getMonth() + 1);
    if (!b || b.items.length === 0) return null;
    const accounts = this.accounts.accounts();
    const p = computeBudget(b, {
      transactions: this.transactions.transactions(),
      currencyOfAccount: (id) => accounts.find((a) => a.id === id)?.currency,
      categoriesById: this.categories.byId(),
      budgets: this.budgets.budgets(),
    });
    const currency = this.currencies.get(b.currency);
    return {
      spent: formatMoney(p.totalSpent, currency),
      total: formatMoney(p.totalAvailable, currency),
      value: Math.min(100, Math.round(ratioOf(p.totalSpent, p.totalAvailable) * 100)),
      over: p.items.filter((i) => i.status === 'over').length,
      warning: p.items.filter((i) => i.status === 'warning').length,
    };
  });

  /** Al entrar: registra los recurrentes automáticos vencidos y deja visibles los pendientes. */
  async ngOnInit() {
    try {
      await Promise.all([this.accounts.load(), this.categories.ensureLoaded(), this.transactions.ensureLoaded(), this.budgets.ensureLoaded()]);
      const created = await this.recurring.processDue();
      if (created > 0) this.snack.open(this.transloco.translate('recurring.autoPosted', { n: created }), undefined, { duration: 4000 });
    } catch {
      // El inicio sigue funcionando aunque falle; las otras pantallas muestran su error.
    }
  }

  async logout() {
    await this.vault.lock();
    await this.auth.logout();
    this.session.clear();
    await this.router.navigate(['/ingresar']);
  }
}
