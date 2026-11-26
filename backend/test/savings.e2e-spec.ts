import { randomBytes, randomUUID } from 'node:crypto';
import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import type { App } from 'supertest/types.js';
import { PrismaService } from '../src/prisma/prisma.service.js';
import { b64, buildRegistration, createTestApp } from './helpers.js';

const payload = () => b64(randomBytes(70));
const linked = (categoryId: string | null = null) => ({ id: randomUUID(), categoryId, payload: payload(), keyVersion: 1 });

describe('Ahorro e inversiones (e2e)', () => {
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
    const account = async (type: string, currency = 'ARS') => {
      const id = randomUUID();
      await request(server).post(`${hh}/accounts`).set(auth).send({ id, ownerUserId: null, type, currency, payload: payload(), keyVersion: 1, creditCard: null }).expect(201);
      return id;
    };
    const income = reg.categories.find((c) => c.kind === 'INCOME')!.id;
    return { server, auth, hh, account, income };
  }

  const txList = async (s: Awaited<ReturnType<typeof setup>>) => (await request(s.server).get(`${s.hh}/transactions`).set(s.auth).expect(200)).body.items as { id: string; type: string; accountId: string }[];

  it('metas: alta con cuenta vinculada, aportes y validación de moneda', async () => {
    const s = await setup();
    const bank = await s.account('SAVINGS');
    const goal = { id: randomUUID(), accountId: bank, kind: 'EMERGENCY_FUND', currency: 'ARS', targetDate: '2027-06-30', priority: 0, status: 'ACTIVE', payload: payload(), keyVersion: 1 };
    const created = await request(s.server).post(`${s.hh}/goals`).set(s.auth).send(goal).expect(201);
    expect(created.body).toMatchObject({ kind: 'EMERGENCY_FUND', targetDate: '2027-06-30', contributions: [] });

    const c = { id: randomUUID(), date: '2026-11-20', payload: payload(), keyVersion: 1 };
    const withC = await request(s.server).post(`${s.hh}/goals/${goal.id}/contributions`).set(s.auth).send(c).expect(201);
    expect(withC.body.contributions).toHaveLength(1);
    const without = await request(s.server).delete(`${s.hh}/goals/${goal.id}/contributions/${c.id}`).set(s.auth).expect(200);
    expect(without.body.contributions).toHaveLength(0);

    await request(s.server).post(`${s.hh}/goals`).set(s.auth).send({ ...goal, id: randomUUID(), currency: 'USD' }).expect(400);
  });

  it('plazo fijo: constituir saca el capital (ajuste) y cobrar lo devuelve con el interés como ingreso, una sola vez', async () => {
    const s = await setup();
    const bank = await s.account('CHECKING');
    const d = {
      id: randomUUID(),
      accountId: bank,
      currency: 'ARS',
      rateType: 'FIXED',
      startDate: '2026-10-01',
      maturityDate: '2026-10-31',
      autoRenew: false,
      payload: payload(),
      keyVersion: 1,
      transaction: linked(),
    };
    const created = await request(s.server).post(`${s.hh}/deposits`).set(s.auth).send(d).expect(201);
    expect(created.body).toMatchObject({ status: 'ACTIVE', maturityDate: '2026-10-31' });
    expect((await txList(s)).map((t) => t.type)).toEqual(['ADJUSTMENT_OUT']);

    const collect = { expectedRevision: created.body.revision, date: '2026-10-31', principal: linked(), interest: linked(s.income) };
    const collected = await request(s.server).post(`${s.hh}/deposits/${d.id}/collect`).set(s.auth).send(collect).expect(200);
    expect(collected.body.status).toBe('MATURED');
    expect((await txList(s)).map((t) => t.type).sort()).toEqual(['ADJUSTMENT_IN', 'ADJUSTMENT_OUT', 'INCOME']);

    // Cobrar dos veces: 409
    await request(s.server).post(`${s.hh}/deposits/${d.id}/collect`).set(s.auth).send({ ...collect, principal: linked(), interest: null }).expect(409);
    // Vencimiento anterior a la constitución: 400
    await request(s.server).post(`${s.hh}/deposits`).set(s.auth).send({ ...d, id: randomUUID(), transaction: null, maturityDate: '2026-09-01' }).expect(400);
  });

  it('inversiones: activo propio, precio manual, compra/venta mueven el efectivo y borrar la operación borra su movimiento', async () => {
    const s = await setup();
    const broker = await s.account('INVESTMENT');
    const bank = await s.account('CHECKING');
    const assetId = randomUUID();
    await request(s.server).post(`${s.hh}/investments/assets`).set(s.auth).send({ id: assetId, assetClass: 'CEDEAR', currency: 'ARS', payload: payload(), keyVersion: 1 }).expect(201);
    await request(s.server).post(`${s.hh}/investments/prices`).set(s.auth).send({ id: randomUUID(), assetId, date: '2026-11-25', payload: payload(), keyVersion: 1 }).expect(201);

    const buy = { id: randomUUID(), accountId: broker, assetId, type: 'BUY', date: '2026-11-01', payload: payload(), keyVersion: 1, cash: linked() };
    await request(s.server).post(`${s.hh}/investments/trades`).set(s.auth).send(buy).expect(201);
    await request(s.server).post(`${s.hh}/investments/trades`).set(s.auth).send({ ...buy, id: randomUUID(), type: 'SELL', cash: linked() }).expect(201);
    await request(s.server).post(`${s.hh}/investments/trades`).set(s.auth).send({ ...buy, id: randomUUID(), type: 'DIVIDEND', cash: linked(s.income) }).expect(201);
    expect((await txList(s)).map((t) => t.type).sort()).toEqual(['ADJUSTMENT_IN', 'ADJUSTMENT_OUT', 'INCOME']);

    const overview = await request(s.server).get(`${s.hh}/investments`).set(s.auth).expect(200);
    expect(overview.body.assets).toHaveLength(1);
    expect(overview.body.prices).toHaveLength(1);
    expect(overview.body.trades.map((t: { type: string }) => t.type)).toEqual(['BUY', 'SELL', 'DIVIDEND']);

    // Solo en cuentas de inversión
    await request(s.server).post(`${s.hh}/investments/trades`).set(s.auth).send({ ...buy, id: randomUUID(), accountId: bank, cash: linked() }).expect(400);

    await request(s.server).delete(`${s.hh}/investments/trades/${buy.id}`).set(s.auth).expect(204);
    expect((await txList(s)).find((t) => t.id === buy.cash.id)).toBeUndefined();
  });
});
