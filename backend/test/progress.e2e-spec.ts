import { randomBytes, randomUUID } from 'node:crypto';
import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import type { App } from 'supertest/types.js';
import { PrismaService } from '../src/prisma/prisma.service.js';
import { b64, buildRegistration, createTestApp } from './helpers.js';

describe('Progreso "de 0 a 100" (e2e)', () => {
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

  async function user() {
    const reg = buildRegistration();
    createdUsers.push(reg.userId);
    const res = await request(app.getHttpServer()).post('/api/auth/register').send(reg).expect(201);
    return { auth: { Authorization: `Bearer ${res.body.accessToken}` }, hh: `/api/households/${reg.household.id}` };
  }

  it('onboarding: guarda el paso y la finalización', async () => {
    const { auth } = await user();
    const s = app.getHttpServer();
    await request(s).put('/api/me/onboarding').set(auth).send({ step: 2, completed: false }).expect(200);
    let me = await request(s).get('/api/me').set(auth).expect(200);
    expect(me.body.user).toMatchObject({ onboardingStep: 2, onboardingCompletedAt: null });
    await request(s).put('/api/me/onboarding').set(auth).send({ step: 4, completed: true }).expect(200);
    me = await request(s).get('/api/me').set(auth).expect(200);
    expect(me.body.user.onboardingCompletedAt).not.toBeNull();
  });

  it('puntaje: uno por día (se reemplaza) y logros', async () => {
    const { auth, hh } = await user();
    const s = app.getHttpServer();
    const id = randomUUID();
    await request(s).put(`${hh}/health-scores/2026-11-26/${id}`).set(auth).send({ payload: b64(randomBytes(60)), keyVersion: 1 }).expect(200);
    await request(s).put(`${hh}/health-scores/2026-11-26/${id}`).set(auth).send({ payload: b64(randomBytes(60)), keyVersion: 1 }).expect(200);
    // otro ID para el mismo día: 409 (el payload está atado a su ID)
    await request(s).put(`${hh}/health-scores/2026-11-26/${randomUUID()}`).set(auth).send({ payload: b64(randomBytes(60)), keyVersion: 1 }).expect(409);
    expect((await request(s).get(`${hh}/health-scores`).set(auth).expect(200)).body.items).toHaveLength(1);

    await request(s).post(`${hh}/milestones`).set(auth).send({ id: randomUUID(), payload: b64(randomBytes(60)), keyVersion: 1 }).expect(201);
    expect((await request(s).get(`${hh}/milestones`).set(auth).expect(200)).body.items).toHaveLength(1);
  });

  it('tips descartados por usuario', async () => {
    const { auth } = await user();
    const s = app.getHttpServer();
    await request(s).post('/api/me/tips/emergency.start/dismiss').set(auth).expect(204);
    await request(s).post('/api/me/tips/emergency.start/dismiss').set(auth).expect(204); // idempotente
    expect((await request(s).get('/api/me/tips').set(auth).expect(200)).body.dismissed).toEqual(['emergency.start']);
    await request(s).delete('/api/me/tips/emergency.start/dismiss').set(auth).expect(204);
    expect((await request(s).get('/api/me/tips').set(auth).expect(200)).body.dismissed).toEqual([]);
    await request(s).post('/api/me/tips/MAL KEY/dismiss').set(auth).expect(400);
  });
});
