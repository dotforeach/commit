import type { Category } from '../categories/categories.service';
import type { Transaction } from '../transactions/transaction.model';
import { computeBudget, type BudgetContext } from './budget-math';
import type { Budget } from './budget.model';

const cat = (id: string, budgetGroup: Category['budgetGroup']): Category => ({
  id,
  parentId: null,
  kind: 'EXPENSE',
  budgetGroup,
  systemKey: id,
  archived: false,
  name: id,
  icon: null,
  color: null,
});

let seq = 0;
const expense = (categoryId: string | null, amount: string, date: string, accountId = 'ars'): Transaction => ({
  id: `t${++seq}`,
  accountId,
  categoryId,
  type: 'EXPENSE',
  amount,
  date,
  status: 'CLEARED',
  transferGroupId: null,
  createdById: 'u',
  revision: '1',
  description: '',
  notes: null,
});

const budget = (month: number, items: Budget['items'], over: Partial<Budget> = {}): Budget => ({
  id: `b${month}`,
  year: 2026,
  month,
  method: 'CATEGORY',
  currency: 'ARS',
  expectedIncome: null,
  revision: '1',
  items,
  ...over,
});
const item = (categoryId: string, amount: string, rollover = false, alertThreshold = 80) => ({
  id: `i-${categoryId}-${amount}`,
  categoryId,
  amount,
  rollover,
  alertThreshold,
});

const ctx = (transactions: Transaction[], budgets: Budget[]): BudgetContext => ({
  transactions,
  currencyOfAccount: (id) => (id === 'usd' ? 'USD' : 'ARS'),
  categoriesById: new Map([cat('super', 'NEEDS'), cat('salidas', 'WANTS'), cat('ahorro', 'SAVINGS')].map((c) => [c.id, c])),
  budgets,
});

describe('computeBudget', () => {
  it('gastado, restante y estado por categoría (ok, alerta, excedido)', () => {
    const b = budget(11, [item('super', '100000'), item('salidas', '20000'), item('ahorro', '50000')]);
    const p = computeBudget(
      b,
      ctx(
        [
          expense('super', '85000', '2026-11-05'),
          expense('salidas', '25000.5', '2026-11-10'),
          expense('ahorro', '1000', '2026-11-11'),
          expense('super', '99999', '2026-10-30'), // otro mes
          expense('super', '50', '2026-11-12', 'usd'), // otra moneda
        ],
        [b],
      ),
    );
    expect(p.items.map((i) => [i.categoryId, i.spent, i.remaining, i.status])).toEqual([
      ['super', '85000', '15000', 'warning'],
      ['salidas', '25000.5', '-5000.5', 'over'],
      ['ahorro', '1000', '49000', 'ok'],
    ]);
    expect(p.totalSpent).toBe('111000.5');
    expect(p.otherCurrencyCount).toBe(1);
  });

  it('separa lo gastado sin presupuesto (y sin categoría)', () => {
    const b = budget(11, [item('super', '1000')]);
    const p = computeBudget(b, ctx([expense('salidas', '300', '2026-11-02'), expense(null, '50', '2026-11-03')], [b]));
    expect(p.unbudgeted).toEqual([
      { categoryId: 'salidas', spent: '300' },
      { categoryId: null, spent: '50' },
    ]);
    expect(p.unbudgetedSpent).toBe('350');
  });

  it('arrastra sobrantes y excesos de meses anteriores (encadenados)', () => {
    const sep = budget(9, [item('super', '1000', true)]);
    const oct = budget(10, [item('super', '1000', true)]);
    const nov = budget(11, [item('super', '1000')]);
    const p = computeBudget(
      nov,
      ctx([expense('super', '700', '2026-09-10'), expense('super', '1500', '2026-10-10')], [sep, oct, nov]),
    );
    // sep: sobran 300 → oct dispone 1300, gasta 1500 → arrastra −200 → nov dispone 800
    expect(p.items[0]).toMatchObject({ carried: '-200', available: '800' });
  });

  it('50/30/20 sobre el ingreso esperado', () => {
    const b = budget(11, [], { method: 'FIFTY_THIRTY_TWENTY', expectedIncome: '1000000' });
    const p = computeBudget(
      b,
      ctx([expense('super', '520000', '2026-11-01'), expense('salidas', '100000', '2026-11-01'), expense('ahorro', '150000', '2026-11-01')], [b]),
    );
    expect(p.groups!.map((g) => [g.group, g.target, g.spent, g.status])).toEqual([
      ['NEEDS', '500000', '520000', 'over'],
      ['WANTS', '300000', '100000', 'ok'],
      ['SAVINGS', '200000', '150000', 'ok'],
    ]);
  });

  it('sobres: ingreso esperado menos lo asignado', () => {
    const b = budget(11, [item('super', '600000'), item('salidas', '150000')], { method: 'ENVELOPE', expectedIncome: '800000' });
    expect(computeBudget(b, ctx([], [b])).unassigned).toBe('50000');
  });
});
