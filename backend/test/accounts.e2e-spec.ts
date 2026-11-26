import { randomBytes, randomUUID } from 'node:crypto';
import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import type { App } from 'supertest/types.js';
import { PrismaService } from '../src/prisma/prisma.service.js';
import { b64, buildRegistration, createTestApp } from './helpers.js';

const payload = () => b64(randomBytes(90));

describe('Cuentas (e2e)', () => {
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

  async function newUser() {
    const reg = buildRegistration();
    createdUsers.push(reg.userId);
    const res = await request(app.getHttpServer()).post('/api/auth/register').send(reg).expect(201);
    const auth = { Authorization: `Bearer ${res.body.accessToken}` };
    return { reg, auth, base: `/api/households/${reg.household.id}/accounts` };
  }

  it('crea, lista, edita y borra cuentas con control de revisión', async () => {
    const { auth, base } = await newUser();
    const server = app.getHttpServer();
    const id = randomUUID();
    const accountPayload = payload();

    const created = await request(server)
      .post(base)
      .set(auth)
      .send({ id, ownerUserId: null, type: 'CASH', currency: 'ars', payload: accountPayload, keyVersion: 1, creditCard: null })
      .expect(201);
    expect(created.body).toMatchObject({ id, type: 'CASH', currency: 'ARS', payload: accountPayload, creditCard: null });
    expect(BigInt(created.body.revision)).toBeGreaterThan(0n);

    const list = await request(server).get(base).set(auth).expect(200);
    expect(list.body.items.map((a: { id: string }) => a.id)).toEqual([id]);

    // Editar con la revisión correcta
    const newPayload = payload();
    const updated = await request(server)
      .put(`${base}/${id}`)
      .set(auth)
      .send({
        expectedRevision: created.body.revision,
        archived: false,
        ownerUserId: null,
        type: 'SAVINGS',
        currency: 'USD',
        payload: newPayload,
        keyVersion: 1,
        creditCard: null,
      })
      .expect(200);
    expect(updated.body).toMatchObject({ type: 'SAVINGS', currency: 'USD', payload: newPayload });
    expect(BigInt(updated.body.revision)).toBeGreaterThan(BigInt(created.body.revision));

    // Editar con una revisión vieja: 409, no se pisa
    await request(server)
      .put(`${base}/${id}`)
      .set(auth)
      .send({
        expectedRevision: created.body.revision,
        archived: true,
        ownerUserId: null,
        type: 'CASH',
        currency: 'ARS',
        payload: payload(),
        keyVersion: 1,
        creditCard: null,
      })
      .expect(409);

    // Borrar: desaparece del listado pero queda la lápida para sincronizar
    await request(server).delete(`${base}/${id}`).query({ expectedRevision: created.body.revision }).set(auth).expect(409);
    await request(server).delete(`${base}/${id}`).query({ expectedRevision: updated.body.revision }).set(auth).expect(204);
    expect((await request(server).get(base).set(auth).expect(200)).body.items).toEqual([]);
    const since = await request(server).get(base).query({ since: updated.body.revision }).set(auth).expect(200);
    expect(since.body.items).toHaveLength(1);
    expect(since.body.items[0].deletedAt).not.toBeNull();
  });

  it('las tarjetas de crédito llevan sus datos; al cambiar de tipo se eliminan', async () => {
    const { auth, base } = await newUser();
    const server = app.getHttpServer();
    const id = randomUUID();
    const card = { closingDay: 25, dueDay: 5, payload: payload(), keyVersion: 1 };

    // Tarjeta sin datos de tarjeta: 400
    await request(server)
      .post(base)
      .set(auth)
      .send({ id, ownerUserId: null, type: 'CREDIT_CARD', currency: 'ARS', payload: payload(), keyVersion: 1, creditCard: null })
      .expect(400);

    const created = await request(server)
      .post(base)
      .set(auth)
      .send({ id, ownerUserId: null, type: 'CREDIT_CARD', currency: 'ARS', payload: payload(), keyVersion: 1, creditCard: card })
      .expect(201);
    expect(created.body.creditCard).toEqual(card);

    const changed = await request(server)
      .put(`${base}/${id}`)
      .set(auth)
      .send({
        expectedRevision: created.body.revision,
        archived: true,
        ownerUserId: null,
        type: 'CHECKING',
        currency: 'ARS',
        payload: payload(),
        keyVersion: 1,
        creditCard: null,
      })
      .expect(200);
    expect(changed.body.creditCard).toBeNull();
    expect(changed.body.archivedAt).not.toBeNull();
  });

  it('valida moneda, versión de clave y titular', async () => {
    const { auth, base } = await newUser();
    const server = app.getHttpServer();
    const body = { id: randomUUID(), ownerUserId: null, type: 'CASH', currency: 'ARS', payload: payload(), keyVersion: 1, creditCard: null };
    await request(server).post(base).set(auth).send({ ...body, currency: 'XYZ' }).expect(400);
    await request(server).post(base).set(auth).send({ ...body, keyVersion: 2 }).expect(409);
    await request(server).post(base).set(auth).send({ ...body, ownerUserId: randomUUID() }).expect(400);
  });

  it('otro usuario no ve ni toca las cuentas de un hogar ajeno (404)', async () => {
    const owner = await newUser();
    const intruder = await newUser();
    const server = app.getHttpServer();
    const id = randomUUID();
    const created = await request(server)
      .post(owner.base)
      .set(owner.auth)
      .send({ id, ownerUserId: null, type: 'CASH', currency: 'ARS', payload: payload(), keyVersion: 1, creditCard: null })
      .expect(201);

    await request(server).get(owner.base).set(intruder.auth).expect(404);
    await request(server)
      .post(owner.base)
      .set(intruder.auth)
      .send({ id: randomUUID(), ownerUserId: null, type: 'CASH', currency: 'ARS', payload: payload(), keyVersion: 1, creditCard: null })
      .expect(404);
    await request(server)
      .delete(`${owner.base}/${id}`)
      .query({ expectedRevision: created.body.revision })
      .set(intruder.auth)
      .expect(404);
    // Ni moviendo la cuenta a su propio hogar
    await request(server)
      .delete(`${intruder.base}/${id}`)
      .query({ expectedRevision: created.body.revision })
      .set(intruder.auth)
      .expect(404);
  });

  it('un miembro de solo lectura puede leer pero no escribir (403)', async () => {
    const owner = await newUser();
    const viewer = await newUser();
    await prisma.householdMember.create({
      data: { householdId: owner.reg.household.id, userId: viewer.reg.userId, role: 'VIEWER', status: 'ACTIVE' },
    });
    const server = app.getHttpServer();
    await request(server).get(owner.base).set(viewer.auth).expect(200);
    await request(server)
      .post(owner.base)
      .set(viewer.auth)
      .send({ id: randomUUID(), ownerUserId: null, type: 'CASH', currency: 'ARS', payload: payload(), keyVersion: 1, creditCard: null })
      .expect(403);
  });

  it('GET /api/currencies lista el catálogo', async () => {
    const { auth } = await newUser();
    const res = await request(app.getHttpServer()).get('/api/currencies').set(auth).expect(200);
    expect(res.body.map((c: { code: string }) => c.code)).toEqual(expect.arrayContaining(['ARS', 'USD', 'USDT', 'BTC']));
  });
});
