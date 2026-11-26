import { addDecimals, compareDecimals, subDecimals, ZERO } from '../../core/money/decimal';
import type { Transaction } from '../transactions/transaction.model';
import { cycleFor, shiftMonth, type Cycle } from './card-cycle';
import type { InstallmentPlan } from './installments.service';

export interface StatementEstimate {
  cycle: Cycle;
  /** Consumos en un pago del ciclo. */
  charges: string;
  /** Cuotas que caen en este resumen. */
  installments: string;
  total: string;
  /** Pagos a la tarjeta después del cierre. */
  paid: string;
  /** Lo que falta pagar (nunca negativo). */
  due: string;
}

/**
 * Resumen estimado de una tarjeta para el mes de cierre dado. Las compras en cuotas no suman
 * por su total sino por la cuota de cada mes.
 */
export function estimateStatement(
  card: { id: string; closingDay: number; dueDay: number },
  month: string,
  transactions: Transaction[],
  plans: InstallmentPlan[],
): StatementEstimate {
  const cycle = cycleFor(month, card.closingDay, card.dueDay);
  const next = cycleFor(shiftMonth(month, 1), card.closingDay, card.dueDay);
  const own = transactions.filter((t) => t.accountId === card.id);
  const charges = addDecimals(
    ZERO,
    ...own.filter((t) => t.type === 'EXPENSE' && !t.installmentPlanId && t.date >= cycle.start && t.date <= cycle.closing).map((t) => t.amount),
  );
  const installments = addDecimals(
    ZERO,
    ...plans
      .filter((p) => p.creditCardId === card.id)
      .flatMap((p) => p.installments)
      .filter((i) => i.dueMonth.slice(0, 7) === month)
      .map((i) => i.amount),
  );
  const total = addDecimals(charges, installments);
  // Pagos imputados a este resumen: los que entran después de su cierre y hasta el cierre siguiente.
  const paid = addDecimals(
    ZERO,
    ...own.filter((t) => (t.type === 'TRANSFER_IN' || t.type === 'INCOME') && t.date > cycle.closing && t.date <= next.closing).map((t) => t.amount),
  );
  const rest = subDecimals(total, paid);
  return { cycle, charges, installments, total, paid, due: compareDecimals(rest, ZERO) > 0 ? rest : ZERO };
}

/** Cuotas ya comprometidas en los próximos meses (después de `month`). */
export function upcomingInstallments(cardId: string, month: string, plans: InstallmentPlan[], months = 3) {
  return Array.from({ length: months }, (_, i) => {
    const m = shiftMonth(month, i + 1);
    const amount = addDecimals(
      ZERO,
      ...plans
        .filter((p) => p.creditCardId === cardId)
        .flatMap((p) => p.installments)
        .filter((x) => x.dueMonth.slice(0, 7) === m)
        .map((x) => x.amount),
    );
    return { month: m, amount };
  });
}
