export type BudgetMethod = 'CATEGORY' | 'FIFTY_THIRTY_TWENTY' | 'ENVELOPE';

export interface BudgetItem {
  id: string;
  categoryId: string;
  rollover: boolean;
  alertThreshold: number;
  amount: string;
  revision?: string;
}

export interface Budget {
  id: string;
  year: number;
  month: number;
  method: BudgetMethod;
  currency: string;
  expectedIncome: string | null;
  revision: string;
  items: BudgetItem[];
}

export interface BudgetItemDto {
  id: string;
  categoryId: string;
  rollover: boolean;
  alertThreshold: number;
  payload: string;
  keyVersion: number;
  revision: string;
}

export interface BudgetDto {
  id: string;
  year: number;
  month: number;
  method: BudgetMethod;
  currency: string;
  payload: string;
  keyVersion: number;
  revision: string;
  items: BudgetItemDto[];
}

/** Datos del editor. Los ítems existentes conservan su ID (su payload está atado a él). */
export interface BudgetDraft {
  method: BudgetMethod;
  currency: string;
  expectedIncome: string | null;
  items: { id?: string; categoryId: string; amount: string; rollover: boolean; alertThreshold: number }[];
}
