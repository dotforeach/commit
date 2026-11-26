import type { Account } from '../accounts/account.model';
import { buildLedger, computeBalances, totalsByCurrency } from './ledger';
import type { Transaction } from './transaction.model';

const account = (id: string, type: Account['type'], initialBalance: string, currency = 'ARS'): Account => ({
  id,
  type,
  currency,
  initialBalance,
  name: id,
  institution: null,
  color: null,
  icon: null,
  includeInNetWorth: true,
  ownerUserId: null,
  archived: false,
  revision: '1',
  creditCard: null,
});

let seq = 0;
const tx = (accountId: string, type: Transaction['type'], amount: string, extra: Partial<Transaction> = {}): Transaction => ({
  id: `t${String(++seq).padStart(3, '0')}`,
  accountId,
  type,
  amount,
  categoryId: null,
  status: 'CLEARED',
  date: '2026-11-10',
  transferGroupId: null,
  createdById: 'u',
  revision: '1',
  description: '',
  notes: null,
  ...extra,
});

describe('computeBalances', () => {
  it('saldo = inicial + entradas − salidas, con decimales exactos', () => {
    const balances = computeBalances(
      [account('banco', 'CHECKING', '1000.10')],
      [tx('banco', 'INCOME', '500.2'), tx('banco', 'EXPENSE', '0.3'), tx('banco', 'TRANSFER_OUT', '200'), tx('banco', 'ADJUSTMENT_IN', '0.0001')],
    );
    expect(balances.get('banco')).toEqual({ amount: '1300.0001', isDebt: false });
  });

  it('en tarjetas, los gastos suben la deuda y los pagos la bajan', () => {
    const balances = computeBalances(
      [account('visa', 'CREDIT_CARD', '320.75', 'USD')],
      [tx('visa', 'EXPENSE', '100'), tx('visa', 'TRANSFER_IN', '220.75')],
    );
    expect(balances.get('visa')).toEqual({ amount: '200', isDebt: true });
  });

  it('una cuenta sin movimientos muestra su saldo inicial', () => {
    expect(computeBalances([account('caja', 'CASH', '-50')], []).get('caja')).toEqual({ amount: '-50', isDebt: false });
  });
});

describe('buildLedger', () => {
  it('une las patas de cada transferencia y ordena por fecha descendente', () => {
    const ledger = buildLedger([
      tx('a', 'EXPENSE', '1', { date: '2026-11-01' }),
      tx('a', 'TRANSFER_OUT', '1000', { date: '2026-11-05', transferGroupId: 'g' }),
      tx('b', 'TRANSFER_IN', '1', { date: '2026-11-05', transferGroupId: 'g' }),
      tx('a', 'INCOME', '5', { date: '2026-11-07' }),
    ]);
    expect(ledger.map((e) => e.kind)).toEqual(['single', 'transfer', 'single']);
    expect(ledger.map((e) => e.date)).toEqual(['2026-11-07', '2026-11-05', '2026-11-01']);
  });
});

describe('totalsByCurrency', () => {
  it('suma ingresos y gastos por moneda, sin transferencias', () => {
    const currency = (id: string) => (id === 'usd' ? 'USD' : 'ARS');
    const totals = totalsByCurrency(
      [
        tx('ars', 'INCOME', '1000'),
        tx('ars', 'EXPENSE', '250.5'),
        tx('ars', 'TRANSFER_OUT', '9999', { transferGroupId: 'g' }),
        tx('usd', 'EXPENSE', '10'),
      ],
      currency,
    );
    expect(totals).toEqual([
      { currency: 'ARS', income: '1000', expense: '250.5', net: '749.5' },
      { currency: 'USD', income: '0', expense: '10', net: '-10' },
    ]);
  });
});
