export type TransactionType = 'INCOME' | 'EXPENSE' | 'TRANSFER_OUT' | 'TRANSFER_IN' | 'ADJUSTMENT_IN' | 'ADJUSTMENT_OUT';

/** Contenido cifrado. `amount` siempre positivo (el signo lo da el tipo). */
export interface TransactionPayload {
  amount: string;
  description: string;
  notes: string | null;
}

export interface TransactionDto {
  id: string;
  householdId: string;
  accountId: string;
  categoryId: string | null;
  type: TransactionType;
  status: 'PENDING' | 'CLEARED';
  date: string; // YYYY-MM-DD
  transferGroupId: string | null;
  createdById: string;
  payload: string;
  keyVersion: number;
  revision: string;
  deletedAt: string | null;
}

export interface Transaction extends TransactionPayload {
  id: string;
  accountId: string;
  categoryId: string | null;
  type: TransactionType;
  status: 'PENDING' | 'CLEARED';
  date: string;
  transferGroupId: string | null;
  createdById: string;
  revision: string;
}

/** Lo que se muestra en la lista: un movimiento, o una transferencia con sus dos patas. */
export type LedgerEntry =
  | { kind: 'single'; date: string; tx: Transaction }
  | { kind: 'transfer'; date: string; out: Transaction; in: Transaction };

export const INFLOW_TYPES: ReadonlySet<TransactionType> = new Set(['INCOME', 'TRANSFER_IN', 'ADJUSTMENT_IN']);
