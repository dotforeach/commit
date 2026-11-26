import type { RequestBody } from './api-contract';

type CreateAccount = RequestBody<'/api/households/{householdId}/accounts', 'post'>;
type CreateTransactions = RequestBody<'/api/households/{householdId}/transactions', 'post'>;

describe('contrato con la API (tipos generados del OpenAPI)', () => {
  it('los tipos restringen de verdad (si no, estos @ts-expect-error romperían la compilación)', () => {
    const ok: CreateAccount = { id: 'a', ownerUserId: null, type: 'CASH', currency: 'ARS', payload: 'x', keyVersion: 1, creditCard: null };
    // @ts-expect-error falta un campo obligatorio (payload, keyVersion…)
    const missing: CreateAccount = { id: 'a', type: 'CASH', currency: 'ARS' };
    // @ts-expect-error tipo de cuenta inexistente
    const wrongEnum: CreateAccount = { ...ok, type: 'CRYPTO_WALLET' };
    // @ts-expect-error las transferencias van como lista de ítems
    const notArray: CreateTransactions = { items: { id: 'x' } };
    expect([ok, missing, wrongEnum, notArray]).toHaveLength(4);
  });
});
