import { randomBytes, randomUUID } from 'node:crypto';
import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import type { App } from 'supertest/types.js';
import { PrismaService } from '../src/prisma/prisma.service.js';
import { b64, buildRegistration, createTestApp } from './helpers.js';

const payload = () => b64(randomBytes(70));

describe('Deudas y cuotas (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  const createdUsers: string[] = [];

  beforeAll(async () => {
    app = (await createTestApp()) as INestApplication<App>;
    prisma = app.get(PrismaService);
  });

  afterAll(async () => {
    await prisma.household.deleteMany({ where: { members: { some: { userId: { in: createdUsers } } } } });
    await prisma.user.deleteMany({ where: { id: { in: createdUsers } } });
    await app.close();
  });

  async function setup() {
    const reg = buildRegistration();
    createdUsers.push(reg.userId);
    const server = app.getHttpServer();
    const res = await request(server).post('/api/auth/register').send(reg).expect(201);
    const auth = { Authorization: `Bearer ${res.body.accessToken}` };
    const hh = `/api/households/${reg.household.id}`;
    const bank = randomUUID();
    const card = randomUUID();
    await request(server)
      .post(`${hh}/accounts`)
      .set(auth)
      .send({ id: bank, ownerUserId: null, type: 'CHECKING', currency: 'ARS', payload: payload(), keyVersion: 1, creditCard: null })
      .expect(201);
    await request(server)
      .post(`${hh}/accounts`)
      .set(auth)
      .send({
        id: card,
        ownerUserId: null,
        type: 'CREDIT_CARD',
        currency: 'ARS',
        payload: payload(),
        keyVersion: 1,
        creditCard: { closingDay: 25, dueDay: 5, payload: payload(), keyVersion: 1 },
      })
      .expect(201);
    const expenseCat = reg.categories.find((c) => c.kind === 'EXPENSE')!.id;
    return { server, auth, hh, bank, card, expenseCat };
  }

  const debt = (over: Record<string, unknown> = {}) => ({
    id: randomUUID(),
    accountId: null,
    kind: 'PERSONAL_LOAN',
    currency: 'ARS',
    rateType: 'FIXED',
    amortization: 'FRENCH',
    termMonths: 12,
    startDate: '2026-09-01',
    paymentDay: 10,
    status: 'ACTIVE',
    payload: payload(),
    keyVersion: 1,
    ...over,
  });

  it('deuda: alta, pago atómico (gasto + pago), borrar el pago borra el gasto', async () => {
    const { server, auth, hh, bank, expenseCat } = await setup();
    const d = debt();
    const created = await request(server).post(`${hh}/debts`).set(auth).send(d).expect(201);
    expect(created.body).toMatchObject({ id: d.id, amortization: 'FRENCH', payments: [] });

    const payment = {
      id: randomUUID(),
      date: '2026-10-10',
      payload: payload(),
      keyVersion: 1,
      transaction: { id: randomUUID(), accountId: bank, categoryId: expenseCat, payload: payload(), keyVersion: 1 },
    };
    const paid = await request(server).post(`${hh}/debts/${d.id}/payments`).set(auth).send(payment).expect(201);
    expect(paid.body.payments).toEqual([expect.objectContaining({ id: payment.id, transactionId: payment.transaction.id, date: '2026-10-10' })]);

    const txs = await request(server).get(`${hh}/transactions`).set(auth).expect(200);
    expect(txs.body.items).toEqual([expect.objectContaining({ id: payment.transaction.id, type: 'EXPENSE', debtId: d.id })]);

    // El movimiento de un pago no se edita por el PUT genérico
    const t = txs.body.items[0];
    await request(server)
      .put(`${hh}/transactions`)
      .set(auth)
      .send({ items: [{ ...t, expectedRevision: t.revision, transferGroupId: null, status: 'CLEARED', payload: payload() }] })
      .expect(400);

    const after = await request(server).delete(`${hh}/debts/${d.id}/payments/${payment.id}`).set(auth).expect(200);
    expect(after.body.payments).toEqual([]);
    expect((await request(server).get(`${hh}/transactions`).set(auth)).body.items).toEqual([]);
  });

  it('pago: la cuenta tiene que estar en la moneda de la deuda', async () => {
    const { server, auth, hh, bank } = await setup();
    const d = debt({ currency: 'USD' });
    await request(server).post(`${hh}/debts`).set(auth).send(d).expect(201);
    await request(server)
      .post(`${hh}/debts/${d.id}/payments`)
      .set(auth)
      .send({ id: randomUUID(), date: '2026-10-10', payload: payload(), keyVersion: 1, transaction: { id: randomUUID(), accountId: bank, categoryId: null, payload: payload(), keyVersion: 1 } })
      .expect(400);
  });

  it('borrar el movimiento de un pago borra el pago', async () => {
    const { server, auth, hh, bank } = await setup();
    const d = debt();
    await request(server).post(`${hh}/debts`).set(auth).send(d).expect(201);
    const txId = randomUUID();
    await request(server)
      .post(`${hh}/debts/${d.id}/payments`)
      .set(auth)
      .send({ id: randomUUID(), date: '2026-10-10', payload: payload(), keyVersion: 1, transaction: { id: txId, accountId: bank, categoryId: null, payload: payload(), keyVersion: 1 } })
      .expect(201);
    const t = (await request(server).get(`${hh}/transactions`).set(auth)).body.items[0];
    await request(server).delete(`${hh}/transactions/${txId}`).query({ expectedRevision: t.revision }).set(auth).expect(204);
    expect((await request(server).get(`${hh}/debts`).set(auth)).body.items[0].payments).toEqual([]);
  });

  it('compra en cuotas: gasto + plan + cuotas atómicos; borrar el gasto borra el plan', async () => {
    const { server, auth, hh, card, bank, expenseCat } = await setup();
    const planId = randomUUID();
    const txId = randomUUID();
    const plan = {
      id: planId,
      creditCardId: card,
      installmentsCount: 3,
      interestFree: true,
      firstStatementOn: '2026-11-25',
      payload: payload(),
      keyVersion: 1,
      transaction: { id: txId, categoryId: expenseCat, date: '2026-11-20', payload: payload(), keyVersion: 1 },
      installments: ['2026-11-01', '2026-12-01', '2027-01-01'].map((dueMonth, i) => ({ id: randomUUID(), number: i + 1, dueMonth, payload: payload(), keyVersion: 1 })),
    };
    const created = await request(server).post(`${hh}/installment-plans`).set(auth).send(plan).expect(201);
    expect(created.body.installments.map((i: { dueMonth: string }) => i.dueMonth)).toEqual(['2026-11-01', '2026-12-01', '2027-01-01']);

    const t = (await request(server).get(`${hh}/transactions`).set(auth)).body.items[0];
    expect(t).toMatchObject({ id: txId, accountId: card, installmentPlanId: planId });

    // No en una cuenta que no es tarjeta; cuotas mal numeradas o fuera de orden: 400
    await request(server).post(`${hh}/installment-plans`).set(auth).send({ ...plan, id: randomUUID(), creditCardId: bank, transaction: { ...plan.transaction, id: randomUUID() } }).expect(400);
    await request(server)
      .post(`${hh}/installment-plans`)
      .set(auth)
      .send({ ...plan, id: randomUUID(), transaction: { ...plan.transaction, id: randomUUID() }, installments: [...plan.installments].reverse() })
      .expect(400);

    await request(server).delete(`${hh}/transactions/${txId}`).query({ expectedRevision: t.revision }).set(auth).expect(204);
    expect((await request(server).get(`${hh}/installment-plans`).set(auth)).body.items).toEqual([]);
  });
});
