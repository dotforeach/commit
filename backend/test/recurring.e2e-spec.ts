import { randomBytes, randomUUID } from 'node:crypto';
import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import type { App } from 'supertest/types.js';
import { PrismaService } from '../src/prisma/prisma.service.js';
import { b64, buildRegistration, createTestApp } from './helpers.js';

const payload = () => b64(randomBytes(70));

describe('Recurrentes (e2e)', () => {
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
    const accountId = randomUUID();
    await request(server)
      .post(`${hh}/accounts`)
      .set(auth)
      .send({ id: accountId, ownerUserId: null, type: 'CHECKING', currency: 'ARS', payload: payload(), keyVersion: 1, creditCard: null })
      .expect(201);
    const salaryCat = reg.categories.find((c) => c.kind === 'INCOME')!.id;
    const expenseCat = reg.categories.find((c) => c.kind === 'EXPENSE')!.id;
    return { server, auth, base: `${hh}/recurring-rules`, hh, accountId, salaryCat, expenseCat };
  }

  const rule = (over: Record<string, unknown>) => ({
    id: randomUUID(),
    categoryId: null,
    type: 'INCOME',
    frequency: 'MONTHLY',
    interval: 1,
    dayOfMonth: 5,
    startDate: '2026-09-05',
    endDate: null,
    nextRunOn: '2026-09-05',
    autoPost: true,
    isSalary: true,
    active: true,
    payload: payload(),
    keyVersion: 1,
    ...over,
  });

  it('crea una regla y registra sus ocurrencias de forma atómica y una sola vez', async () => {
    const { server, auth, base, hh, accountId, salaryCat } = await setup();
    const r = rule({ accountId, categoryId: salaryCat });
    const created = await request(server).post(base).set(auth).send(r).expect(201);
    expect(created.body).toMatchObject({ id: r.id, nextRunOn: '2026-09-05', dayOfMonth: 5 });

    const occurrences = {
      expectedRevision: created.body.revision,
      nextRunOn: '2026-11-05',
      active: true,
      transactions: [
        { id: randomUUID(), date: '2026-09-05', payload: payload(), keyVersion: 1 },
        { id: randomUUID(), date: '2026-10-05', payload: payload(), keyVersion: 1 },
      ],
    };
    // Dos dispositivos a la vez con la misma revisión: exactamente uno gana.
    const results = await Promise.all([
      request(server).post(`${base}/${r.id}/occurrences`).set(auth).send(occurrences),
      request(server)
        .post(`${base}/${r.id}/occurrences`)
        .set(auth)
        .send({ ...occurrences, transactions: occurrences.transactions.map((t) => ({ ...t, id: randomUUID() })) }),
    ]);
    expect(results.map((x) => x.status).sort((a, b) => a - b)).toEqual([200, 409]);
    const ok = results.find((x) => x.status === 200)!;
    expect(ok.body.rule.nextRunOn).toBe('2026-11-05');
    expect(ok.body.transactions).toHaveLength(2);
    expect(ok.body.transactions[0]).toMatchObject({ type: 'INCOME', accountId, categoryId: salaryCat, recurringRuleId: r.id });

    const list = await request(server).get(`${hh}/transactions`).set(auth).expect(200);
    expect(list.body.items).toHaveLength(2);
  });

  it('omitir ocurrencias avanza la regla sin crear movimientos', async () => {
    const { server, auth, base, hh, accountId } = await setup();
    const r = rule({ accountId, autoPost: false });
    const created = await request(server).post(base).set(auth).send(r).expect(201);
    await request(server)
      .post(`${base}/${r.id}/occurrences`)
      .set(auth)
      .send({ expectedRevision: created.body.revision, nextRunOn: '2026-10-05', active: true, transactions: [] })
      .expect(200);
    expect((await request(server).get(`${hh}/transactions`).set(auth)).body.items).toHaveLength(0);
  });

  it('valida fechas de las ocurrencias, avance, regla pausada y coherencia', async () => {
    const { server, auth, base, accountId, expenseCat } = await setup();
    const r = rule({ accountId });
    const created = await request(server).post(base).set(auth).send(r).expect(201);
    const post = (body: object) => request(server).post(`${base}/${r.id}/occurrences`).set(auth).send(body);
    const rev = created.body.revision;
    const occ = (date: string) => [{ id: randomUUID(), date, payload: payload(), keyVersion: 1 }];

    await post({ expectedRevision: rev, nextRunOn: '2026-09-05', active: true, transactions: [] }).expect(400); // no avanza
    await post({ expectedRevision: rev, nextRunOn: '2026-10-05', active: true, transactions: occ('2026-08-01') }).expect(400); // antes de lo pendiente
    await post({ expectedRevision: rev, nextRunOn: '2026-10-05', active: true, transactions: occ('2026-10-05') }).expect(400); // no antes de la próxima

    await request(server).post(base).set(auth).send(rule({ accountId, dayOfMonth: null })).expect(400); // mensual sin día
    await request(server).post(base).set(auth).send(rule({ accountId, frequency: 'WEEKLY' })).expect(400); // semanal con día
    await request(server).post(base).set(auth).send(rule({ accountId, categoryId: expenseCat })).expect(400); // categoría de gasto en ingreso

    // Pausada: no registra ocurrencias
    const paused = await request(server)
      .put(`${base}/${r.id}`)
      .set(auth)
      .send({ ...rule({ accountId, active: false }), id: undefined, expectedRevision: rev })
      .expect(200);
    await post({ expectedRevision: paused.body.revision, nextRunOn: '2026-10-05', active: false, transactions: occ('2026-09-05') }).expect(400);
  });

  it('lista y borra reglas', async () => {
    const { server, auth, base, accountId } = await setup();
    const r = rule({ accountId });
    const created = await request(server).post(base).set(auth).send(r).expect(201);
    expect((await request(server).get(base).set(auth).expect(200)).body.items).toHaveLength(1);
    await request(server).delete(`${base}/${r.id}`).query({ expectedRevision: created.body.revision }).set(auth).expect(204);
    expect((await request(server).get(base).set(auth).expect(200)).body.items).toHaveLength(0);
  });
});
