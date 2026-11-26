import { randomBytes, randomUUID } from 'node:crypto';
import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import type { App } from 'supertest/types.js';
import { PrismaService } from '../src/prisma/prisma.service.js';
import { b64, buildRegistration, createTestApp } from './helpers.js';

const payload = () => b64(randomBytes(70));

describe('Movimientos (e2e)', () => {
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

  /** Usuario con dos cuentas (ARS y USD) y sus categorías por defecto. */
  async function setup() {
    const reg = buildRegistration();
    createdUsers.push(reg.userId);
    const server = app.getHttpServer();
    const res = await request(server).post('/api/auth/register').send(reg).expect(201);
    const auth = { Authorization: `Bearer ${res.body.accessToken}` };
    const hh = `/api/households/${reg.household.id}`;
    const ars = randomUUID();
    const usd = randomUUID();
    for (const [id, currency] of [[ars, 'ARS'], [usd, 'USD']]) {
      await request(server)
        .post(`${hh}/accounts`)
        .set(auth)
        .send({ id, ownerUserId: null, type: 'CHECKING', currency, payload: payload(), keyVersion: 1, creditCard: null })
        .expect(201);
    }
    const expenseCat = reg.categories.find((c) => c.kind === 'EXPENSE' && c.parentId === null)!.id;
    const incomeCat = reg.categories.find((c) => c.kind === 'INCOME')!.id;
    return { server, auth, hh, ars, usd, expenseCat, incomeCat };
  }

  const tx = (over: Record<string, unknown>) => ({
    id: randomUUID(),
    categoryId: null,
    type: 'EXPENSE',
    status: 'CLEARED',
    date: '2026-11-20',
    transferGroupId: null,
    payload: payload(),
    keyVersion: 1,
    ...over,
  });

  it('crea, lista, edita y borra un gasto', async () => {
    const { server, auth, hh, ars, expenseCat } = await setup();
    const item = tx({ accountId: ars, categoryId: expenseCat });

    const created = await request(server).post(`${hh}/transactions`).set(auth).send({ items: [item] }).expect(201);
    expect(created.body.items[0]).toMatchObject({ id: item.id, date: '2026-11-20', type: 'EXPENSE', payload: item.payload });

    const list = await request(server).get(`${hh}/transactions`).set(auth).expect(200);
    expect(list.body).toMatchObject({ hasMore: false });
    expect(list.body.items.map((t: { id: string }) => t.id)).toEqual([item.id]);

    const rev = created.body.items[0].revision;
    const edited = await request(server)
      .put(`${hh}/transactions`)
      .set(auth)
      .send({ items: [{ ...item, expectedRevision: rev, date: '2026-11-21' }] })
      .expect(200);
    expect(edited.body.items[0].date).toBe('2026-11-21');

    await request(server)
      .put(`${hh}/transactions`)
      .set(auth)
      .send({ items: [{ ...item, expectedRevision: rev }] })
      .expect(409);

    await request(server).delete(`${hh}/transactions/${item.id}`).query({ expectedRevision: edited.body.items[0].revision }).set(auth).expect(204);
    expect((await request(server).get(`${hh}/transactions`).set(auth)).body.items).toEqual([]);
    const since = await request(server).get(`${hh}/transactions`).query({ since: rev }).set(auth).expect(200);
    expect(since.body.items[0].deletedAt).not.toBeNull();
  });

  it('transferencia entre monedas: dos patas atómicas; borrar una borra las dos', async () => {
    const { server, auth, hh, ars, usd } = await setup();
    const group = randomUUID();
    const out = tx({ accountId: ars, type: 'TRANSFER_OUT', transferGroupId: group });
    const inn = tx({ accountId: usd, type: 'TRANSFER_IN', transferGroupId: group });

    const created = await request(server).post(`${hh}/transactions`).set(auth).send({ items: [out, inn] }).expect(201);
    expect(created.body.items).toHaveLength(2);

    // Editar una sola pata de una transferencia: no se permite
    const outRev = created.body.items.find((t: { id: string }) => t.id === out.id).revision;
    await request(server)
      .put(`${hh}/transactions`)
      .set(auth)
      .send({ items: [{ ...out, expectedRevision: outRev }] })
      .expect(400);

    await request(server).delete(`${hh}/transactions/${out.id}`).query({ expectedRevision: outRev }).set(auth).expect(204);
    const live = await prisma.transaction.count({ where: { transferGroupId: group, deletedAt: null } });
    expect(live).toBe(0);
  });

  it('valida la forma de la transferencia, la categoría y la cuenta', async () => {
    const { server, auth, hh, ars, usd, expenseCat, incomeCat } = await setup();
    const g = randomUUID();
    const post = (items: unknown[]) => request(server).post(`${hh}/transactions`).set(auth).send({ items });

    await post([tx({ accountId: ars, type: 'TRANSFER_OUT', transferGroupId: g })]).expect(400); // pata suelta
    await post([
      tx({ accountId: ars, type: 'TRANSFER_OUT', transferGroupId: g }),
      tx({ accountId: ars, type: 'TRANSFER_IN', transferGroupId: g }),
    ]).expect(400); // misma cuenta
    await post([
      tx({ accountId: ars, type: 'TRANSFER_OUT', transferGroupId: g }),
      tx({ accountId: usd, type: 'TRANSFER_IN', transferGroupId: randomUUID() }),
    ]).expect(400); // grupos distintos
    await post([tx({ accountId: ars, type: 'INCOME', categoryId: expenseCat })]).expect(400); // categoría de gasto en ingreso
    await post([tx({ accountId: ars, type: 'EXPENSE', categoryId: incomeCat })]).expect(400);
    await post([tx({ accountId: randomUUID() })]).expect(400); // cuenta inexistente
    await post([tx({ accountId: ars, date: '2026-02-30' })]).expect(400); // fecha inválida
    await post([tx({ accountId: ars, keyVersion: 2 })]).expect(409);
  });

  it('pagina por revisión', async () => {
    const { server, auth, hh, ars } = await setup();
    for (let i = 0; i < 5; i++) {
      await request(server).post(`${hh}/transactions`).set(auth).send({ items: [tx({ accountId: ars })] }).expect(201);
    }
    const first = await request(server).get(`${hh}/transactions`).query({ limit: 3 }).set(auth).expect(200);
    expect(first.body.items).toHaveLength(3);
    expect(first.body.hasMore).toBe(true);
    const second = await request(server)
      .get(`${hh}/transactions`)
      .query({ limit: 3, since: first.body.nextSince })
      .set(auth)
      .expect(200);
    expect(second.body.items).toHaveLength(2);
    expect(second.body.hasMore).toBe(false);
  });

  it('no deja borrar una cuenta con movimientos', async () => {
    const { server, auth, hh, ars } = await setup();
    await request(server).post(`${hh}/transactions`).set(auth).send({ items: [tx({ accountId: ars })] }).expect(201);
    const account = await prisma.account.findUniqueOrThrow({ where: { id: ars } });
    const res = await request(server)
      .delete(`${hh}/accounts/${ars}`)
      .query({ expectedRevision: account.revision.toString() })
      .set(auth)
      .expect(409);
    expect(res.body.errorCode).toBe('account_has_transactions');
  });

  it('las categorías del hogar se listan cifradas', async () => {
    const { server, auth, hh } = await setup();
    const res = await request(server).get(`${hh}/categories`).set(auth).expect(200);
    expect(res.body.items.length).toBeGreaterThan(0);
    expect(res.body.items[0]).toHaveProperty('payload');
  });
});
