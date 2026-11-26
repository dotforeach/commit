import { addDecimals, negateDecimal, subDecimals, ZERO } from '../../core/money/decimal';
import type { Account } from '../accounts/account.model';
import { INFLOW_TYPES, type LedgerEntry, type Transaction } from './transaction.model';

/** Cuentas que representan deuda: el saldo se muestra como "lo que debés". */
export const isLiability = (a: Pick<Account, 'type'>) => a.type === 'CREDIT_CARD' || a.type === 'LOAN';

/** Movimiento con signo desde el punto de vista de la cuenta (+ entra, − sale). */
export const signedAmount = (t: Pick<Transaction, 'type' | 'amount'>) =>
  INFLOW_TYPES.has(t.type) ? t.amount : negateDecimal(t.amount);

export interface AccountBalance {
  /** Saldo (cuentas comunes) o deuda (tarjetas y préstamos). */
  amount: string;
  isDebt: boolean;
}

/**
 * Saldo actual de cada cuenta = saldo inicial + entradas − salidas.
 * En tarjetas y préstamos el "saldo inicial" es la deuda: deuda = inicial − (entradas − salidas).
 */
export function computeBalances(accounts: Account[], transactions: Transaction[]): Map<string, AccountBalance> {
  const flows = new Map<string, string[]>();
  for (const t of transactions) {
    const list = flows.get(t.accountId) ?? [];
    list.push(signedAmount(t));
    flows.set(t.accountId, list);
  }
  const out = new Map<string, AccountBalance>();
  for (const a of accounts) {
    const net = addDecimals(...(flows.get(a.id) ?? [ZERO]));
    out.set(
      a.id,
      isLiability(a)
        ? { amount: subDecimals(a.initialBalance, net), isDebt: true }
        : { amount: addDecimals(a.initialBalance, net), isDebt: false },
    );
  }
  return out;
}

/** Agrupa las patas de cada transferencia en una sola entrada y ordena por fecha (más reciente primero). */
export function buildLedger(transactions: Transaction[]): LedgerEntry[] {
  const entries: LedgerEntry[] = [];
  const legs = new Map<string, Transaction[]>();
  for (const t of transactions) {
    if (!t.transferGroupId) {
      entries.push({ kind: 'single', date: t.date, tx: t });
      continue;
    }
    const group = legs.get(t.transferGroupId) ?? [];
    group.push(t);
    legs.set(t.transferGroupId, group);
  }
  for (const group of legs.values()) {
    const out = group.find((t) => t.type === 'TRANSFER_OUT');
    const inn = group.find((t) => t.type === 'TRANSFER_IN');
    if (out && inn) entries.push({ kind: 'transfer', date: out.date, out, in: inn });
  }
  return entries.sort((a, b) => (a.date === b.date ? idOf(b).localeCompare(idOf(a)) : b.date.localeCompare(a.date)));
}

const idOf = (e: LedgerEntry) => (e.kind === 'single' ? e.tx.id : e.out.id);

export interface CurrencyTotals {
  currency: string;
  income: string;
  expense: string;
  net: string;
}

/** Ingresos y gastos del período por moneda (las transferencias y ajustes no cuentan). */
export function totalsByCurrency(transactions: Transaction[], currencyOf: (accountId: string) => string): CurrencyTotals[] {
  const acc = new Map<string, { income: string[]; expense: string[] }>();
  for (const t of transactions) {
    if (t.type !== 'INCOME' && t.type !== 'EXPENSE') continue;
    const currency = currencyOf(t.accountId);
    const bucket = acc.get(currency) ?? { income: [], expense: [] };
    (t.type === 'INCOME' ? bucket.income : bucket.expense).push(t.amount);
    acc.set(currency, bucket);
  }
  return [...acc.entries()]
    .map(([currency, b]) => {
      const income = addDecimals(...b.income);
      const expense = addDecimals(...b.expense);
      return { currency, income, expense, net: subDecimals(income, expense) };
    })
    .sort((a, b) => a.currency.localeCompare(b.currency));
}
