import { addDecimals, compareDecimals, percentOf, ratioOf, subDecimals, ZERO } from '../../core/money/decimal';
import type { Category } from '../categories/categories.service';
import type { Transaction } from '../transactions/transaction.model';
import type { Budget } from './budget.model';

export type ItemStatus = 'ok' | 'warning' | 'over';

export interface ItemProgress {
  itemId: string;
  categoryId: string;
  budgeted: string;
  /** Lo que se arrastra del mes anterior (positivo: sobró; negativo: se excedió). */
  carried: string;
  available: string;
  spent: string;
  remaining: string;
  /** Gastado / disponible (0..∞), para la barra. */
  ratio: number;
  status: ItemStatus;
}

export interface GroupProgress {
  group: 'NEEDS' | 'WANTS' | 'SAVINGS';
  pct: number;
  target: string;
  spent: string;
  ratio: number;
  status: ItemStatus;
}

export interface BudgetProgress {
  items: ItemProgress[];
  totalBudgeted: string;
  totalAvailable: string;
  totalSpent: string;
  /** Gastos del mes (en la moneda del presupuesto) en categorías sin presupuesto o sin categoría. */
  unbudgetedSpent: string;
  unbudgeted: { categoryId: string | null; spent: string }[];
  /** Cuántos gastos del mes quedaron afuera por estar en otra moneda. */
  otherCurrencyCount: number;
  /** Solo 50/30/20. */
  groups: GroupProgress[] | null;
  /** Solo sobres: ingreso esperado − asignado. */
  unassigned: string | null;
}

export interface BudgetContext {
  transactions: Transaction[];
  currencyOfAccount: (accountId: string) => string | undefined;
  categoriesById: Map<string, Category>;
  /** Todos los presupuestos (para calcular arrastres). */
  budgets: Budget[];
}

const ym = (year: number, month: number) => `${year}-${String(month).padStart(2, '0')}`;

function previousMonth(year: number, month: number) {
  return month === 1 ? { year: year - 1, month: 12 } : { year, month: month - 1 };
}

/** Gasto del mes por categoría, solo en cuentas de la moneda del presupuesto. */
function monthlySpending(ctx: BudgetContext, year: number, month: number, currency: string) {
  const key = ym(year, month);
  const byCategory = new Map<string | null, string[]>();
  let otherCurrencyCount = 0;
  for (const t of ctx.transactions) {
    if (t.type !== 'EXPENSE' || !t.date.startsWith(key)) continue;
    if (ctx.currencyOfAccount(t.accountId) !== currency) {
      otherCurrencyCount++;
      continue;
    }
    const list = byCategory.get(t.categoryId) ?? [];
    list.push(t.amount);
    byCategory.set(t.categoryId, list);
  }
  const totals = new Map<string | null, string>();
  for (const [cat, amounts] of byCategory) totals.set(cat, addDecimals(...amounts));
  return { totals, otherCurrencyCount };
}

function statusOf(spent: string, available: string, threshold: number): { ratio: number; status: ItemStatus } {
  if (compareDecimals(available, ZERO) <= 0) {
    return { ratio: compareDecimals(spent, ZERO) > 0 ? Infinity : 0, status: compareDecimals(spent, ZERO) > 0 ? 'over' : 'ok' };
  }
  const ratio = ratioOf(spent, available);
  if (compareDecimals(spent, available) > 0) return { ratio, status: 'over' };
  return { ratio, status: ratio * 100 >= threshold ? 'warning' : 'ok' };
}

/**
 * Lo que una categoría arrastra hacia el mes (year, month): el sobrante (o exceso) del mes anterior,
 * si ese mes tenía presupuesto en la misma moneda y el ítem tenía "arrastrar" activado. Recursivo.
 */
function carriedInto(ctx: BudgetContext, categoryId: string, year: number, month: number, currency: string, depth = 0): string {
  if (depth > 36) return ZERO;
  const prev = previousMonth(year, month);
  const prevBudget = ctx.budgets.find((b) => b.year === prev.year && b.month === prev.month && b.currency === currency);
  const prevItem = prevBudget?.items.find((i) => i.categoryId === categoryId);
  if (!prevBudget || !prevItem?.rollover) return ZERO;
  const available = addDecimals(prevItem.amount, carriedInto(ctx, categoryId, prev.year, prev.month, currency, depth + 1));
  const spent = monthlySpending(ctx, prev.year, prev.month, currency).totals.get(categoryId) ?? ZERO;
  return subDecimals(available, spent);
}

export const GROUP_SPLIT: { group: GroupProgress['group']; pct: number }[] = [
  { group: 'NEEDS', pct: 50 },
  { group: 'WANTS', pct: 30 },
  { group: 'SAVINGS', pct: 20 },
];

export function computeBudget(budget: Budget, ctx: BudgetContext): BudgetProgress {
  const { totals, otherCurrencyCount } = monthlySpending(ctx, budget.year, budget.month, budget.currency);

  const items = budget.items.map((item): ItemProgress => {
    const carried = carriedInto(ctx, item.categoryId, budget.year, budget.month, budget.currency);
    const available = addDecimals(item.amount, carried);
    const spent = totals.get(item.categoryId) ?? ZERO;
    return {
      itemId: item.id,
      categoryId: item.categoryId,
      budgeted: item.amount,
      carried,
      available,
      spent,
      remaining: subDecimals(available, spent),
      ...statusOf(spent, available, item.alertThreshold),
    };
  });

  const budgetedCategories = new Set(budget.items.map((i) => i.categoryId));
  const unbudgeted = [...totals.entries()]
    .filter(([cat]) => cat === null || !budgetedCategories.has(cat))
    .map(([categoryId, spent]) => ({ categoryId, spent }))
    .sort((a, b) => compareDecimals(b.spent, a.spent));

  let groups: GroupProgress[] | null = null;
  if (budget.method === 'FIFTY_THIRTY_TWENTY' && budget.expectedIncome) {
    const income = budget.expectedIncome;
    groups = GROUP_SPLIT.map(({ group, pct }) => {
      const spent = addDecimals(
        ...[...totals.entries()]
          .filter(([cat]) => cat !== null && ctx.categoriesById.get(cat)?.budgetGroup === group)
          .map(([, amount]) => amount),
      );
      const target = percentOf(income, pct);
      return { group, pct, target, spent, ...statusOf(spent, target, group === 'SAVINGS' ? 101 : 90) };
    });
  }

  const totalBudgeted = addDecimals(...items.map((i) => i.budgeted));
  return {
    items,
    totalBudgeted,
    totalAvailable: addDecimals(...items.map((i) => i.available)),
    totalSpent: addDecimals(...items.map((i) => i.spent)),
    unbudgetedSpent: addDecimals(...unbudgeted.map((u) => u.spent)),
    unbudgeted,
    otherCurrencyCount,
    groups,
    unassigned: budget.method === 'ENVELOPE' && budget.expectedIncome ? subDecimals(budget.expectedIncome, totalBudgeted) : null,
  };
}
