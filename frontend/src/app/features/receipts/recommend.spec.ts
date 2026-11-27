import type { ReceiptExtraction } from './receipt.model';
import { recommend, sameMerchant, type RecAccount, type RecCategory } from './recommend';

const base: ReceiptExtraction = {
  documentType: 'purchase',
  merchant: 'Súper 99 Vía España',
  date: '2026-11-20',
  total: '23.40',
  currency: 'USD',
  tax: null,
  paymentMethod: null,
  cardLast4: null,
  category: 'groceries',
  items: [],
  statement: null,
  confidence: 0.9,
  notes: null,
};
const acc = (id: string, type: string, lastFour: string | null = null): RecAccount => ({ id, name: id, type, currency: 'USD', archived: false, lastFour });
const cat = (id: string, systemKey: string): RecCategory => ({ id, name: id, kind: 'EXPENSE', systemKey, archived: false });
const accounts = [acc('banco', 'SAVINGS'), acc('visa', 'CREDIT_CARD', '4321'), acc('yappy', 'DIGITAL_WALLET'), acc('efectivo', 'CASH')];
const categories = [cat('super', 'food.groceries'), cat('comida', 'food.restaurants'), cat('deudas', 'debt.payments'), cat('otros', 'other')];

describe('recomendación de cuenta y categoría', () => {
  it('compara comercios sin importar tildes ni sucursal', () => {
    expect(sameMerchant('Compra en super 99', 'Súper 99 Vía España')).toBe(true);
    expect(sameMerchant('Farmacia Arrocha', 'Súper 99')).toBe(false);
  });

  it('la tarjeta por sus últimos 4 dígitos', () => {
    const r = recommend({ ...base, cardLast4: '4321' }, { accounts, categories, transactions: [], debts: [] });
    expect(r.accountId).toBe('visa');
    expect(r.reasons).toContainEqual({ key: 'cardLast4', last4: '4321' });
  });

  it('el historial con ese comercio manda sobre la categoría genérica', () => {
    const transactions = [
      { accountId: 'yappy', categoryId: 'comida', description: 'super 99', type: 'EXPENSE' },
      { accountId: 'yappy', categoryId: 'comida', description: 'Súper 99 Obarrio', type: 'EXPENSE' },
    ];
    const r = recommend(base, { accounts, categories, transactions, debts: [] });
    expect(r).toMatchObject({ accountId: 'yappy', categoryId: 'comida' });
    expect(r.reasons).toContainEqual({ key: 'merchantHistory', merchant: 'Súper 99 Vía España', count: 2 });
  });

  it('sin historial: medio de pago y categoría genérica', () => {
    const r = recommend({ ...base, paymentMethod: 'cash' }, { accounts, categories, transactions: [], debts: [] });
    expect(r).toMatchObject({ accountId: 'efectivo', categoryId: 'super' });
  });

  it('pago de préstamo: lo asocia a la deuda cargada', () => {
    const r = recommend(
      { ...base, documentType: 'loan_payment', category: 'debt_payment', merchant: 'Banco General' },
      { accounts, categories, transactions: [], debts: [{ id: 'd1', name: 'Préstamo personal', lender: 'Banco General' }] },
    );
    expect(r).toMatchObject({ debtId: 'd1', categoryId: 'deudas' });
  });

  it('sin datos útiles, igual propone algo (y con poca confianza)', () => {
    const r = recommend({ ...base, merchant: null, category: 'other', confidence: 0.4 }, { accounts, categories, transactions: [], debts: [] });
    expect(r.accountId).toBe('banco');
    expect(r.confidence).toBeLessThan(0.3);
  });
});
