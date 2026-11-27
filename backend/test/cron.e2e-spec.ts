import { randomBytes, randomUUID } from 'node:crypto';
import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import type { App } from 'supertest/types.js';
import { runCron } from '../src/cron.js';
import { PrismaService } from '../src/prisma/prisma.service.js';
import { b64, buildRegistration, createTestApp } from './helpers.js';

// Tareas programadas de una pasada (Azure Container Apps Jobs): solo PostgreSQL, sin Redis.
describe('Tareas programadas (cron.ts)', () => {
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

  it('reminders dispara los vencidos sin necesitar Redis', async () => {
    const reg = buildRegistration();
    createdUsers.push(reg.userId);
    const s = app.getHttpServer();
    const res = await request(s).post('/api/auth/register').send(reg).expect(201);
    const auth = { Authorization: `Bearer ${res.body.accessToken}` };
    const id = randomUUID();
    await request(s)
      .post(`/api/households/${reg.household.id}/reminders`)
      .set(auth)
      .send({ id, sourceId: null, remindAt: new Date(Date.now() - 60_000).toISOString(), payload: b64(randomBytes(64)), keyVersion: 1 })
      .expect(201);

    const prevRedis = process.env.REDIS_URL;
    process.env.REDIS_URL = 'redis://127.0.0.1:1'; // inaccesible: la tarea no debe tocar Redis
    try {
      // Otro archivo de tests en paralelo puede reclamarlo primero (SKIP LOCKED): se verifica el efecto
      const result = await runCron('reminders');
      expect(result.fired).toEqual(expect.any(Number));
    } finally {
      process.env.REDIS_URL = prevRedis;
    }
    expect(await prisma.reminder.findUnique({ where: { id } })).toMatchObject({ firedAt: expect.any(Date) });
    expect(await prisma.notification.count({ where: { reminderId: id, userId: reg.userId } })).toBe(1);
  });

  it('una tarea desconocida falla con un mensaje claro', async () => {
    await expect(runCron('nada')).rejects.toThrow(/Tarea desconocida.*reminders, rates/);
  });
});
