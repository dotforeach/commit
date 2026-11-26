import type { Amortization } from './debt-math';

export type DebtKind = 'PERSONAL_LOAN' | 'MORTGAGE' | 'CAR_LOAN' | 'CREDIT_CARD_BALANCE' | 'FAMILY_OR_FRIEND' | 'OTHER';
export type RateType = 'FIXED' | 'VARIABLE' | 'INDEXED' | 'NONE';
export type DebtStatus = 'ACTIVE' | 'PAID_OFF' | 'DEFAULTED' | 'CANCELLED';

export interface DebtPayload {
  name: string;
  lender: string | null;
  originalAmount: string;
  /** TNA como string decimal de fracción ("0.6" = 60%). */
  annualRate: string | null;
  indexName: string | null;
  minimumPayment: string | null;
}

export interface PaymentPayload {
  amount: string;
  principalPart: string | null;
  interestPart: string | null;
  feesPart: string | null;
}

export interface DebtPayment extends PaymentPayload {
  id: string;
  transactionId: string | null;
  date: string;
}

export interface Debt extends DebtPayload {
  id: string;
  accountId: string | null;
  kind: DebtKind;
  currency: string;
  rateType: RateType;
  amortization: Amortization;
  termMonths: number | null;
  startDate: string;
  paymentDay: number | null;
  status: DebtStatus;
  revision: string;
  payments: DebtPayment[];
}

export type DebtDraft = Omit<Debt, 'id' | 'revision' | 'payments'>;

export interface DebtDto extends Omit<Debt, keyof DebtPayload | 'payments'> {
  payload: string;
  keyVersion: number;
  payments: { id: string; transactionId: string | null; date: string; payload: string; keyVersion: number }[];
}

export interface PaymentDraft {
  date: string;
  accountId: string;
  categoryId: string | null;
  amount: string;
  principalPart: string | null;
  interestPart: string | null;
  description: string;
}
