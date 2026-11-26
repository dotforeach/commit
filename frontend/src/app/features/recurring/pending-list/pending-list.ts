import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { CurrenciesService } from '../../../core/currencies/currencies.service';
import { HouseholdContextService } from '../../../core/households/household-context.service';
import { compareDecimals, formatMoney, parseDecimalInput, toInputValue } from '../../../core/money/decimal';
import { AccountsService } from '../../accounts/accounts.service';
import type { PendingOccurrence } from '../recurring.model';
import { RecurringService } from '../recurring.service';

/** Ocurrencias de recurrentes que esperan confirmación (con monto editable, p. ej. la factura de luz). */
@Component({
  selector: 'app-pending-list',
  imports: [DatePipe, FormsModule, TranslocoDirective, MatButtonModule, MatCardModule, MatFormFieldModule, MatIconModule, MatInputModule],
  templateUrl: './pending-list.html',
  styleUrl: './pending-list.scss',
})
export class PendingList {
  readonly recurring = inject(RecurringService);
  readonly household = inject(HouseholdContextService);
  private readonly accounts = inject(AccountsService);
  private readonly currencies = inject(CurrenciesService);
  private readonly snack = inject(MatSnackBar);
  private readonly transloco = inject(TranslocoService);

  /** Monto editado por regla (si el usuario lo cambia antes de confirmar). */
  readonly amounts = signal<Record<string, string>>({});
  readonly busy = signal<string | null>(null);

  amountFor(p: PendingOccurrence) {
    return this.amounts()[p.rule.id] ?? toInputValue(p.rule.amount);
  }

  setAmount(p: PendingOccurrence, value: string) {
    this.amounts.update((a) => ({ ...a, [p.rule.id]: value }));
  }

  valid(p: PendingOccurrence) {
    const v = parseDecimalInput(this.amountFor(p));
    return v !== null && compareDecimals(v, '0') > 0;
  }

  currencySymbol(p: PendingOccurrence) {
    const code = this.accounts.accounts().find((a) => a.id === p.rule.accountId)?.currency ?? 'ARS';
    return this.currencies.get(code).symbol;
  }

  money(p: PendingOccurrence) {
    const code = this.accounts.accounts().find((a) => a.id === p.rule.accountId)?.currency ?? 'ARS';
    return formatMoney(p.rule.amount, this.currencies.get(code));
  }

  async confirm(p: PendingOccurrence) {
    const amount = parseDecimalInput(this.amountFor(p));
    if (!amount) return;
    await this.run(p, () => this.recurring.confirm(p, amount), 'recurring.pending.confirmed');
    this.amounts.update(({ [p.rule.id]: _removed, ...rest }) => rest);
  }

  skip(p: PendingOccurrence) {
    return this.run(p, () => this.recurring.skip(p), 'recurring.pending.skipped');
  }

  private async run(p: PendingOccurrence, fn: () => Promise<void>, key: string) {
    this.busy.set(p.rule.id);
    try {
      await fn();
      this.snack.open(this.transloco.translate(key), undefined, { duration: 3000 });
    } catch {
      this.snack.open(this.transloco.translate('recurring.errors.generic'), undefined, { duration: 5000 });
    } finally {
      this.busy.set(null);
    }
  }
}
