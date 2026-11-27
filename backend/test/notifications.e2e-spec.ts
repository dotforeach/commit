import { randomBytes, randomUUID } from 'node:crypto';
import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import type { App } from 'supertest/types.js';
import { PushService } from '../src/notifications/push.service.js';
import { RemindersService } from '../src/notifications/reminders.service.js';
import { PrismaService } from '../src/prisma/prisma.service.js';
import { b64, buildRegistration, createTestApp } from './helpers.js';

/** Push falso: registra lo que se habría enviado. */
class FakePush {
  sent: { userId: string; body: string }[] = [];
  publicKey() {
    return 'BFAKE';
  }
  notify(userId: string, body: string) {
    this.sent.push({ userId, body });
    return Promise.resolve(1);
  }
}

describe('Recordatorios y notificaciones (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  const push = new FakePush();
  const createdUsers: string[] = [];

  beforeAll(async () => {
    app = (await createTestApp((b) => b.overrideProvider(PushService).useValue(push))) as INestApplication<App>;
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
    return { reg, auth: { Authorization: `Bearer ${res.body.accessToken}` }, hh: `/api/households/${reg.household.id}` };
  }

  it('un recordatorio vencido se dispara una sola vez: notificación cifrada + push genérico', async () => {
    const { reg, auth, hh } = await user();
    const s = app.getHttpServer();
    const payload = b64(randomBytes(80));
    const past = randomUUID();
    const future = randomUUID();
    await request(s).post(`${hh}/reminders`).set(auth).send({ id: past, sourceId: null, remindAt: new Date(Date.now() - 60_000).toISOString(), payload, keyVersion: 1 }).expect(201);
    await request(s).post(`${hh}/reminders`).set(auth).send({ id: future, sourceId: randomUUID(), remindAt: new Date(Date.now() + 86_400_000).toISOString(), payload, keyVersion: 1 }).expect(201);

    const reminders = app.get(RemindersService);
    const [a, b] = await Promise.all([reminders.fireDue(), reminders.fireDue()]); // dos workers a la vez
    expect(a + b).toBeGreaterThanOrEqual(1);
    expect(await prisma.notification.count({ where: { reminderId: past } })).toBe(1);
    expect(await prisma.notification.count({ where: { reminderId: future } })).toBe(0);
    expect(push.sent.filter((p) => p.userId === reg.userId)).toEqual([{ userId: reg.userId, body: 'Tienes un recordatorio' }]);

    const list = await request(s).get('/api/me/notifications').set(auth).expect(200);
    expect(list.body.items).toEqual([expect.objectContaining({ type: 'REMINDER', payload, readAt: null, title: null, body: null })]);
    await request(s).post('/api/me/notifications/read').set(auth).send({}).expect(204);
    expect((await request(s).get('/api/me/notifications').set(auth)).body.items[0].readAt).not.toBeNull();

    const pending = await request(s).get(`${hh}/reminders`).set(auth).expect(200);
    expect(pending.body.items.map((r: { id: string }) => r.id)).toEqual([future]);
  });

  it('suscripciones push por dispositivo', async () => {
    const { reg, auth } = await user();
    const s = app.getHttpServer();
    const endpoint = `https://push.example.com/${randomUUID()}`;
    const sub = { endpoint, keys: { p256dh: 'B'.repeat(80), auth: 'a'.repeat(16) } };
    await request(s).post('/api/me/push-subscriptions').set(auth).send(sub).expect(204);
    await request(s).post('/api/me/push-subscriptions').set(auth).send(sub).expect(204); // idempotente
    expect(await prisma.pushSubscription.count({ where: { userId: reg.userId } })).toBe(1);
    expect((await request(s).get('/api/push/public-key').set(auth).expect(200)).body.publicKey).toBe('BFAKE');
    await request(s).post('/api/me/push-subscriptions/remove').set(auth).send({ endpoint }).expect(204);
    expect(await prisma.pushSubscription.count({ where: { userId: reg.userId } })).toBe(0);
  });
});
