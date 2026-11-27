import type { GenericCategory, ReceiptExtraction } from './receipt.model';

/**
 * Recomendación de cuenta, categoría y tipo de movimiento para un comprobante. Corre en el
 * navegador con los datos ya descifrados: los nombres de tus cuentas y categorías no salen del
 * dispositivo. Cada sugerencia trae sus razones para que puedas aceptarla o cambiarla.
 */
export interface RecAccount {
  id: string;
  name: string;
  type: string;
  currency: string;
  archived: boolean;
  lastFour: string | null;
}
export interface RecCategory {
  id: string;
  name: string;
  kind: 'INCOME' | 'EXPENSE';
  systemKey: string | null;
  archived: boolean;
}
export interface RecTransaction {
  accountId: string;
  categoryId: string | null;
  description: string;
  type: string;
}
export interface RecDebt {
  id: string;
  name: string;
  lender: string | null;
}

export type Reason =
  | { key: 'cardLast4'; last4: string }
  | { key: 'paymentMethod'; method: string }
  | { key: 'merchantHistory'; merchant: string; count: number }
  | { key: 'mostUsed' }
  | { key: 'genericCategory'; category: GenericCategory }
  | { key: 'debtMatch'; debt: string }
  | { key: 'cardStatement' };

export interface Recommendation {
  accountId: string | null;
  categoryId: string | null;
  /** Si es el pago de una deuda que tienes cargada. */
  debtId: string | null;
  /** 0..1: qué tan segura es la sugerencia (para mostrarla destacada o no). */
  confidence: number;
  reasons: Reason[];
}

/** Categoría genérica de la IA → categoría del sistema (las predeterminadas de Commit). */
const SYSTEM_KEY: Record<GenericCategory, string> = {
  groceries: 'food.groceries',
  restaurants: 'food.restaurants',
  transport: 'transport',
  fuel: 'transport',
  utilities: 'housing.utilities',
  rent: 'housing.rent',
  health: 'health',
  education: 'education',
  entertainment: 'entertainment',
  subscriptions: 'subscriptions',
  shopping: 'shopping',
  travel: 'travel',
  insurance: 'insurance',
  taxes: 'taxes',
  debt_payment: 'debt.payments',
  other: 'other',
};

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

/** "Súper 99 Vía España" y "super 99" se consideran el mismo comercio. */
export function sameMerchant(description: string, merchant: string): boolean {
  const d = norm(description);
  const m = norm(merchant);
  if (!d || !m) return false;
  const key = m.split(' ').slice(0, 2).join(' ');
  return d.includes(key) || m.includes(d);
}

function mostCommon<T>(values: T[]): { value: T; count: number } | null {
  const counts = new Map<T, number>();
  for (const v of values) counts.set(v, (counts.get(v) ?? 0) + 1);
  let best: { value: T; count: number } | null = null;
  for (const [value, count] of counts) if (!best || count > best.count) best = { value, count };
  return best;
}

export function recommend(
  x: ReceiptExtraction,
  data: { accounts: RecAccount[]; categories: RecCategory[]; transactions: RecTransaction[]; debts: RecDebt[] },
): Recommendation {
  const accounts = data.accounts.filter((a) => !a.archived);
  const categories = data.categories.filter((c) => !c.archived && c.kind === 'EXPENSE');
  const reasons: Reason[] = [];
  let confidence = 0;

  // ── Deuda: pago de préstamo que coincide con una deuda cargada ──
  let debtId: string | null = null;
  if ((x.documentType === 'loan_payment' || x.category === 'debt_payment') && x.merchant) {
    const debt = data.debts.find((d) => sameMerchant(`${d.name} ${d.lender ?? ''}`, x.merchant!) || (d.lender && sameMerchant(d.lender, x.merchant!)));
    if (debt) {
      debtId = debt.id;
      reasons.push({ key: 'debtMatch', debt: debt.name });
      confidence += 0.4;
    }
  }

  // ── Cuenta ──
  const history = x.merchant ? data.transactions.filter((t) => t.type === 'EXPENSE' && sameMerchant(t.description, x.merchant!)) : [];
  let accountId: string | null = null;
  if (x.documentType === 'card_statement' && x.cardLast4) {
    const card = accounts.find((a) => a.type === 'CREDIT_CARD' && a.lastFour === x.cardLast4);
    if (card) {
      accountId = card.id;
      reasons.push({ key: 'cardStatement' }, { key: 'cardLast4', last4: x.cardLast4 });
      confidence += 0.5;
    }
  }
  if (!accountId && x.cardLast4) {
    const card = accounts.find((a) => a.lastFour === x.cardLast4);
    if (card) {
      accountId = card.id;
      reasons.push({ key: 'cardLast4', last4: x.cardLast4 });
      confidence += 0.5;
    }
  }
  if (!accountId && history.length > 0) {
    const top = mostCommon(history.map((t) => t.accountId).filter((id) => accounts.some((a) => a.id === id)));
    if (top) {
      accountId = top.value;
      reasons.push({ key: 'merchantHistory', merchant: x.merchant!, count: top.count });
      confidence += 0.35;
    }
  }
  if (!accountId && x.paymentMethod) {
    const byMethod: Record<string, string[]> = {
      cash: ['CASH'],
      credit_card: ['CREDIT_CARD'],
      debit_card: ['CHECKING', 'SAVINGS'],
      digital_wallet: ['DIGITAL_WALLET'],
      transfer: ['CHECKING', 'SAVINGS'],
    };
    const candidates = accounts.filter((a) => (byMethod[x.paymentMethod!] ?? []).includes(a.type));
    if (candidates.length > 0) {
      // Entre varias del mismo tipo, la más usada
      const used = mostCommon(data.transactions.map((t) => t.accountId).filter((id) => candidates.some((c) => c.id === id)));
      accountId = used?.value ?? candidates[0].id;
      reasons.push({ key: 'paymentMethod', method: x.paymentMethod });
      confidence += candidates.length === 1 ? 0.3 : 0.15;
    }
  }
  if (!accountId && accounts.length > 0) {
    const used = mostCommon(data.transactions.map((t) => t.accountId).filter((id) => accounts.some((a) => a.id === id)));
    accountId = used?.value ?? accounts[0].id;
    reasons.push({ key: 'mostUsed' });
  }

  // ── Categoría ──
  let categoryId: string | null = null;
  if (history.length > 0) {
    const top = mostCommon(history.map((t) => t.categoryId).filter((id): id is string => !!id && categories.some((c) => c.id === id)));
    if (top) {
      categoryId = top.value;
      if (!reasons.some((r) => r.key === 'merchantHistory')) reasons.push({ key: 'merchantHistory', merchant: x.merchant!, count: top.count });
      confidence += 0.35;
    }
  }
  if (!categoryId) {
    const wanted = debtId ? 'debt.payments' : SYSTEM_KEY[x.category];
    const match = categories.find((c) => c.systemKey === wanted);
    if (match) {
      categoryId = match.id;
      reasons.push({ key: 'genericCategory', category: x.category });
      confidence += 0.2;
    }
  }

  return { accountId, categoryId, debtId, confidence: Math.min(1, confidence * Math.max(x.confidence, 0.3)), reasons };
}
