export type AccountType =
  | 'CASH'
  | 'CHECKING'
  | 'SAVINGS'
  | 'DIGITAL_WALLET'
  | 'CREDIT_CARD'
  | 'INVESTMENT'
  | 'LOAN'
  | 'OTHER';

export const ACCOUNT_TYPES: { type: AccountType; icon: string }[] = [
  { type: 'CASH', icon: 'payments' },
  { type: 'CHECKING', icon: 'account_balance' },
  { type: 'SAVINGS', icon: 'savings' },
  { type: 'DIGITAL_WALLET', icon: 'account_balance_wallet' },
  { type: 'CREDIT_CARD', icon: 'credit_card' },
  { type: 'INVESTMENT', icon: 'trending_up' },
  { type: 'LOAN', icon: 'request_quote' },
  { type: 'OTHER', icon: 'category' },
];

export const accountIcon = (type: AccountType) => ACCOUNT_TYPES.find((t) => t.type === type)?.icon ?? 'category';

/** Contenido cifrado de una cuenta. Montos como string decimal. */
export interface AccountPayload {
  name: string;
  initialBalance: string;
  institution: string | null;
  color: string | null;
  icon: string | null;
  includeInNetWorth: boolean;
}

/** Contenido cifrado de una tarjeta de crédito. */
export interface CreditCardPayload {
  network: string | null;
  lastFour: string | null;
  creditLimit: string | null;
}

/** Lo que devuelve la API (payloads cifrados). */
export interface AccountDto {
  id: string;
  householdId: string;
  ownerUserId: string | null;
  type: AccountType;
  currency: string;
  archivedAt: string | null;
  payload: string;
  keyVersion: number;
  revision: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  creditCard: { closingDay: number; dueDay: number; payload: string; keyVersion: number } | null;
}

/** Cuenta descifrada, lista para mostrar. */
export interface Account extends AccountPayload {
  id: string;
  ownerUserId: string | null;
  type: AccountType;
  currency: string;
  archived: boolean;
  revision: string;
  creditCard: (CreditCardPayload & { closingDay: number; dueDay: number }) | null;
}

/** Datos del formulario (sin id/revisión). */
export type AccountDraft = Omit<Account, 'id' | 'revision' | 'archived'>;
