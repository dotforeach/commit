/** Lo que extrajo la IA (ver backend/src/receipts/receipt.schema.ts). Llega sellado y se abre acá. */
export type GenericCategory =
  | 'groceries'
  | 'restaurants'
  | 'transport'
  | 'fuel'
  | 'utilities'
  | 'rent'
  | 'health'
  | 'education'
  | 'entertainment'
  | 'subscriptions'
  | 'shopping'
  | 'travel'
  | 'insurance'
  | 'taxes'
  | 'debt_payment'
  | 'other';

export interface ReceiptExtraction {
  documentType: 'purchase' | 'loan_payment' | 'card_statement' | 'bill' | 'other';
  merchant: string | null;
  date: string | null;
  total: string | null;
  currency: string | null;
  tax: string | null;
  paymentMethod: 'cash' | 'debit_card' | 'credit_card' | 'transfer' | 'digital_wallet' | 'other' | null;
  cardLast4: string | null;
  category: GenericCategory;
  items: { description: string; amount: string | null }[];
  statement: { totalDue: string | null; minimumPayment: string | null; dueDate: string | null } | null;
  confidence: number;
  notes: string | null;
}

export interface InboxReceipt {
  id: string;
  createdAt: string;
  source: 'whatsapp' | 'upload';
  extraction: ReceiptExtraction;
}
