import { randomBytes, randomUUID } from 'node:crypto';
import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import type { App } from 'supertest/types.js';
import { PrismaService } from '../src/prisma/prisma.service.js';
import { RateSources, type PublicRate } from '../src/rates/rate-sources.js';
import { argentinaToday, RatesService } from '../src/rates/rates.service.js';
import { b64, buildRegistration, createTestApp } from './helpers.js';

/** Fuente falsa: los tests nunca llaman a internet. */
class FakeSources {
  rates: PublicRate[] = [];
  fetchAll() {
    return Promise.resolve(this.rates);
  }
}

describe('Cotizaciones (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  const fake = new FakeSources();
  const createdUsers: string[] = [];

  beforeAll(async () => {
    app = (await createTestApp((b) => b.overrideProvider(RateSources).useValue(fake))) as INestApplication<App>;
    prisma = app.get(PrismaService);
  });

  afterAll(async () => {
    await prisma.exchangeRate.deleteMany({ where: { provider: 'test' } });
    await prisma.household.deleteMany({ where: { members: { some: { userId: { in: createdUsers } } } } });
    await prisma.user.deleteMany({ where: { id: { in: createdUsers } } });
    await app.close();
  });

  async function user() {
    const reg = buildRegistration();
    createdUsers.push(reg.userId);
    const res = await request(app.getHttpServer()).post('/api/auth/register').send(reg).expect(201);
    return { reg, auth: { Authorization: `Bearer ${res.body.accessToken}` }, hh: `/api/households/${reg.household.id}` };
  }

  it('guarda un valor por día (actualiza en vez de duplicar) e ignora monedas desconocidas', async () => {
    const svc = app.get(RatesService);
    fake.rates = [
      { base: 'USD', quote: 'ARS', rateType: 'mep', rate: '1665', provider: 'test' },
      { base: 'XXX', quote: 'ARS', rateType: 'official', rate: '1', provider: 'test' },
    ];
    expect(await svc.refresh()).toBe(1);
    fake.rates = [{ base: 'USD', quote: 'ARS', rateType: 'mep', rate: '1670.5', provider: 'test' }];
    await svc.refresh();
    const rows = await prisma.exchangeRate.findMany({ where: { provider: 'test', date: argentinaToday() } });
    expect(rows).toHaveLength(1);
    expect(rows[0].rate.toString()).toBe('1670.5');

    const { auth } = await user();
    const latest = await request(app.getHttpServer()).get('/api/exchange-rates/latest').set(auth).expect(200);
    expect(latest.body.items).toContainEqual(expect.objectContaining({ base: 'USD', quote: 'ARS', rateType: 'mep', provider: 'test', rate: '1670.5' }));
  });

  it('cotizaciones manuales del hogar y preferencia de dólar', async () => {
    const { auth, hh } = await user();
    const server = app.getHttpServer();
    const id = randomUUID();
    await request(server).post(`${hh}/exchange-rates`).set(auth).send({ id, base: 'usd', quote: 'ARS', rateType: 'blue', date: '2026-11-26', payload: b64(randomBytes(60)), keyVersion: 1 }).expect(201);
    await request(server).post(`${hh}/exchange-rates`).set(auth).send({ id: randomUUID(), base: 'USD', quote: 'USD', rateType: 'x', date: '2026-11-26', payload: b64(randomBytes(60)), keyVersion: 1 }).expect(400);
    const list = await request(server).get(`${hh}/exchange-rates`).set(auth).expect(200);
    expect(list.body.items).toEqual([expect.objectContaining({ id, base: 'USD', rateType: 'blue' })]);
    await request(server).delete(`${hh}/exchange-rates/${id}`).set(auth).expect(204);

    await request(server).put(`${hh}/settings`).set(auth).send({ usdRateType: 'blue' }).expect(200);
    await request(server).put(`${hh}/settings`).set(auth).send({ usdRateType: 'cualquiera' }).expect(400);
    const me = await request(server).get('/api/me').set(auth).expect(200);
    expect(me.body.households[0].usdRateType).toBe('blue');
  });
});
