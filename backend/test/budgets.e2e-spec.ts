import { randomBytes, randomUUID } from 'node:crypto';
import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import type { App } from 'supertest/types.js';
import { PrismaService } from '../src/prisma/prisma.service.js';
import { b64, buildRegistration, createTestApp } from './helpers.js';

const payload = () => b64(randomBytes(60));

describe('Presupuestos (e2e)', () => {
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
    const expense = reg.categories.filter((c) => c.kind === 'EXPENSE').map((c) => c.id);
    const income = reg.categories.find((c) => c.kind === 'INCOME')!.id;
    return {
      server,
      auth: { Authorization: `Bearer ${res.body.accessToken}` },
      base: `/api/households/${reg.household.id}/budgets`,
      expense,
      income,
    };
  }

  const item = (categoryId: string, over: Record<string, unknown> = {}) => ({
    id: randomUUID(),
    categoryId,
    rollover: false,
    alertThreshold: 80,
    payload: payload(),
    keyVersion: 1,
    ...over,
  });

  const budget = (items: unknown[], over: Record<string, unknown> = {}) => ({
    id: randomUUID(),
    year: 2026,
    month: 11,
    method: 'CATEGORY',
    currency: 'ARS',
    payload: payload(),
    keyVersion: 1,
    items,
    ...over,
  });

  it('crea un presupuesto con ítems y reemplaza la lista al editar', async () => {
    const { server, auth, base, expense } = await setup();
    const [a, b] = expense;
    const itemA = item(a);
    const created = await request(server).post(base).set(auth).send(budget([itemA, item(b)])).expect(201);
    expect(created.body).toMatchObject({ year: 2026, month: 11, method: 'CATEGORY' });
    expect(created.body.items).toHaveLength(2);

    // Edito: cambio A (mismo ID), saco B. Al volver a agregar B más tarde usa un ítem nuevo.
    const updated = await request(server)
      .put(`${base}/${created.body.id}`)
      .set(auth)
      .send({ expectedRevision: created.body.revision, method: 'ENVELOPE', currency: 'ARS', payload: payload(), keyVersion: 1, items: [{ ...itemA, rollover: true }] })
      .expect(200);
    expect(updated.body.method).toBe('ENVELOPE');
    expect(updated.body.items).toEqual([expect.objectContaining({ id: itemA.id, rollover: true })]);

    const readded = await request(server)
      .put(`${base}/${created.body.id}`)
      .set(auth)
      .send({ expectedRevision: updated.body.revision, method: 'ENVELOPE', currency: 'ARS', payload: payload(), keyVersion: 1, items: [itemA, item(b)] })
      .expect(200);
    expect(readded.body.items).toHaveLength(2);

    // Revisión vieja: 409
    await request(server)
      .put(`${base}/${created.body.id}`)
      .set(auth)
      .send({ expectedRevision: created.body.revision, method: 'CATEGORY', currency: 'ARS', payload: payload(), keyVersion: 1, items: [] })
      .expect(409);
  });

  it('un mes, un presupuesto; borrarlo libera el mes', async () => {
    const { server, auth, base } = await setup();
    const first = await request(server).post(base).set(auth).send(budget([])).expect(201);
    await request(server).post(base).set(auth).send(budget([])).expect(409);
    await request(server).delete(`${base}/${first.body.id}`).query({ expectedRevision: first.body.revision }).set(auth).expect(204);
    await request(server).post(base).set(auth).send(budget([])).expect(201);
    const list = await request(server).get(base).set(auth).expect(200);
    expect(list.body.items).toHaveLength(1);
  });

  it('valida categorías de gasto, duplicados y moneda', async () => {
    const { server, auth, base, expense, income } = await setup();
    await request(server).post(base).set(auth).send(budget([item(income)])).expect(400);
    await request(server).post(base).set(auth).send(budget([item(randomUUID())])).expect(400);
    await request(server).post(base).set(auth).send(budget([item(expense[0]), item(expense[0])])).expect(400);
    await request(server).post(base).set(auth).send(budget([], { currency: 'XYZ' })).expect(400);
    await request(server).post(base).set(auth).send(budget([], { month: 13 })).expect(400);
  });

  it('un ítem existente con otro ID (cliente desactualizado) es 409', async () => {
    const { server, auth, base, expense } = await setup();
    const created = await request(server).post(base).set(auth).send(budget([item(expense[0])])).expect(201);
    await request(server)
      .put(`${base}/${created.body.id}`)
      .set(auth)
      .send({ expectedRevision: created.body.revision, method: 'CATEGORY', currency: 'ARS', payload: payload(), keyVersion: 1, items: [item(expense[0])] })
      .expect(409);
  });
});
