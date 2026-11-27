import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, signal, type OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { todayIso } from '../../core/dates/dates';
import { HouseholdContextService } from '../../core/households/household-context.service';
import { parseDecimalInput } from '../../core/money/decimal';
import { AccountsService } from '../accounts/accounts.service';
import { CategoriesService } from '../categories/categories.service';
import { DebtsService } from '../debts/debts.service';
import { TransactionsService } from '../transactions/transactions.service';
import type { InboxReceipt } from './receipt.model';
import { ReceiptsService } from './receipts.service';
import { recommend, type Reason, type Recommendation } from './recommend';

/** Lo que la persona puede ajustar antes de confirmar. */
interface Draft {
  date: string;
  amount: string;
  description: string;
  accountId: string | null;
  categoryId: string | null;
  debtId: string | null;
}

@Component({
  selector: 'app-review-page',
  imports: [DatePipe, FormsModule, RouterLink, TranslocoDirective, MatButtonModule, MatCardModule, MatFormFieldModule, MatIconModule, MatInputModule, MatProgressBarModule, MatSelectModule],
  templateUrl: './review-page.html',
  styleUrl: './review-page.scss',
})
export class ReviewPage implements OnInit {
  readonly receipts = inject(ReceiptsService);
  readonly accounts = inject(AccountsService);
  readonly categories = inject(CategoriesService);
  private readonly transactions = inject(TransactionsService);
  private readonly debts = inject(DebtsService);
  readonly household = inject(HouseholdContextService);
  private readonly snack = inject(MatSnackBar);
  private readonly t = inject(TranslocoService);

  readonly loading = signal(true);
  readonly uploading = signal(false);
  readonly busy = signal<string | null>(null);
  readonly drafts = signal<Record<string, Draft>>({});

  /** Recomendación para cada comprobante, calculada en el navegador. */
  readonly recs = computed(() => {
    const data = {
      accounts: this.accounts.accounts().map((a) => ({ id: a.id, name: a.name, type: a.type, currency: a.currency, archived: a.archived, lastFour: a.creditCard?.lastFour ?? null })),
      categories: this.categories.categories().map((c) => ({ id: c.id, name: c.name, kind: c.kind, systemKey: c.systemKey, archived: c.archived })),
      transactions: this.transactions.transactions().map((t) => ({ accountId: t.accountId, categoryId: t.categoryId, description: t.description, type: t.type })),
      debts: this.debts.debts().filter((d) => d.status === 'ACTIVE').map((d) => ({ id: d.id, name: d.name, lender: d.lender })),
    };
    return new Map(this.receipts.items().map((r) => [r.id, recommend(r.extraction, data)]));
  });

  async ngOnInit() {
    try {
      await Promise.all([this.receipts.load(), this.receipts.loadStatus(), this.accounts.load(), this.categories.ensureLoaded(), this.transactions.ensureLoaded(), this.debts.ensureLoaded()]);
    } finally {
      this.loading.set(false);
    }
  }

  /** El borrador arranca con lo extraído + la recomendación; luego, lo que la persona cambie. */
  draft(r: InboxReceipt): Draft {
    const d = this.drafts()[r.id];
    if (d) return d;
    const rec = this.recs().get(r.id);
    return {
      date: r.extraction.date ?? todayIso(),
      amount: r.extraction.total ?? '',
      description: r.extraction.merchant ?? '',
      accountId: rec?.accountId ?? null,
      categoryId: rec?.categoryId ?? null,
      debtId: rec?.debtId ?? null,
    };
  }

  patch(r: InboxReceipt, change: Partial<Draft>) {
    this.drafts.update((all) => ({ ...all, [r.id]: { ...this.draft(r), ...change } }));
  }

  /** ¿La elección actual coincide con lo recomendado? */
  followsRecommendation(r: InboxReceipt): boolean {
    const rec = this.recs().get(r.id);
    const d = this.draft(r);
    return !!rec && d.accountId === rec.accountId && d.categoryId === rec.categoryId;
  }

  reasonText(reason: Reason): string {
    const p = 'review.reasons.';
    switch (reason.key) {
      case 'cardLast4':
        return this.t.translate(p + 'cardLast4', { last4: reason.last4 });
      case 'paymentMethod':
        return this.t.translate(p + 'paymentMethod', { method: this.t.translate('review.methods.' + reason.method) });
      case 'merchantHistory':
        return this.t.translate(p + 'merchantHistory', { merchant: reason.merchant, n: reason.count });
      case 'genericCategory':
        return this.t.translate(p + 'genericCategory', { category: this.t.translate('review.categories.' + reason.category) });
      case 'debtMatch':
        return this.t.translate(p + 'debtMatch', { debt: reason.debt });
      default:
        return this.t.translate(p + reason.key);
    }
  }

  confidenceLevel(rec: Recommendation | undefined): 'high' | 'medium' | 'low' {
    const c = rec?.confidence ?? 0;
    return c >= 0.45 ? 'high' : c >= 0.2 ? 'medium' : 'low';
  }

  async accept(r: InboxReceipt) {
    const d = this.draft(r);
    const amount = parseDecimalInput(d.amount);
    if (!amount || !d.accountId) return;
    this.busy.set(r.id);
    try {
      const debt = d.debtId ? this.debts.debts().find((x) => x.id === d.debtId) : null;
      if (debt) {
        await this.debts.addPayment(debt, { date: d.date, accountId: d.accountId, categoryId: d.categoryId, amount, principalPart: null, interestPart: null, description: d.description });
      } else {
        await this.transactions.createSingle({ type: 'EXPENSE', accountId: d.accountId, categoryId: d.categoryId, date: d.date, amount, description: d.description || this.t.translate('review.defaultDescription'), notes: null });
      }
      await this.receipts.remove(r.id);
      this.snack.open(this.t.translate('review.saved'), undefined, { duration: 3000 });
    } finally {
      this.busy.set(null);
    }
  }

  async discard(r: InboxReceipt) {
    this.busy.set(r.id);
    try {
      await this.receipts.remove(r.id);
    } finally {
      this.busy.set(null);
    }
  }

  async onFile(input: HTMLInputElement) {
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;
    this.uploading.set(true);
    try {
      await this.receipts.upload(file);
    } catch (e) {
      const msg = e instanceof HttpErrorResponse && typeof e.error?.message === 'string' ? e.error.message : this.t.translate('review.uploadError');
      this.snack.open(msg, undefined, { duration: 5000 });
    } finally {
      this.uploading.set(false);
    }
  }

  accountName(id: string | null) {
    return this.accounts.accounts().find((a) => a.id === id)?.name ?? '—';
  }
}
