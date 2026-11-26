import { randomBytes } from 'node:crypto';
import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import type { App } from 'supertest/types.js';
import { PrismaService } from '../src/prisma/prisma.service.js';
import { b64, buildRegistration, createTestApp } from './helpers.js';

const refreshCookie = (res: request.Response) =>
  ([] as string[]).concat(res.headers['set-cookie'] ?? []).find((c) => c.startsWith('rt='));

describe('Auth (e2e)', () => {
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

  it('registra, entrega tokens y /me devuelve solo material cifrado', async () => {
    const body = buildRegistration();
    createdUsers.push(body.userId);

    const res = await request(app.getHttpServer()).post('/api/auth/register').send(body).expect(201);
    expect(res.body.accessToken).toEqual(expect.any(String));
    expect(res.body).not.toHaveProperty('refreshToken'); // solo en la cookie
    const cookie = refreshCookie(res);
    expect(cookie).toMatch(/HttpOnly/i);
    expect(cookie).toMatch(/SameSite=Strict/i);
    expect(cookie).toMatch(/Path=\/api\/auth/);

    const me = await request(app.getHttpServer())
      .get('/api/me')
      .set('Authorization', `Bearer ${res.body.accessToken}`)
      .expect(200);
    expect(me.body.user.email).toBe(body.email);
    expect(me.body.user.defaultHouseholdId).toBe(body.household.id);
    expect(me.body.keys.encryptedPrivateKeys).toBe(body.keys.encryptedPrivateKeys);
    expect(me.body.households).toHaveLength(1);
    expect(me.body.households[0]).toMatchObject({ id: body.household.id, role: 'OWNER', status: 'ACTIVE' });
    expect(me.body.households[0].memberKeys[0]).toMatchObject({
      version: 1,
      wrappedKey: body.household.memberKey.wrappedKey,
      wrappedBySigningPublicKey: body.keys.signingPublicKey,
    });
    expect(JSON.stringify(me.body)).not.toContain('passwordHash');

    const categories = await prisma.category.findMany({ where: { householdId: body.household.id } });
    expect(categories).toHaveLength(3);
    expect(categories.every((c) => c.revision > 0n)).toBe(true);
  });

  it('login, refresh rotativo y logout', async () => {
    const body = buildRegistration();
    createdUsers.push(body.userId);
    await request(app.getHttpServer()).post('/api/auth/register').send(body).expect(201);

    await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: body.email, password: 'otra-contraseña' })
      .expect(401);

    const login = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: body.email.toUpperCase(), password: body.password })
      .expect(200);
    const firstCookie = refreshCookie(login)!.split(';')[0];

    const refreshed = await request(app.getHttpServer()).post('/api/auth/refresh').set('Cookie', firstCookie).expect(200);
    expect(refreshed.body.accessToken).toEqual(expect.any(String));
    const secondCookie = refreshCookie(refreshed)!.split(';')[0];
    expect(secondCookie).not.toBe(firstCookie);

    // Reusar un refresh token ya gastado revoca toda la familia.
    await request(app.getHttpServer()).post('/api/auth/refresh').set('Cookie', firstCookie).expect(401);
    await request(app.getHttpServer()).post('/api/auth/refresh').set('Cookie', secondCookie).expect(401);

    const again = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: body.email, password: body.password })
      .expect(200);
    const cookie = refreshCookie(again)!.split(';')[0];
    await request(app.getHttpServer()).post('/api/auth/logout').set('Cookie', cookie).expect(204);
    await request(app.getHttpServer()).post('/api/auth/refresh').set('Cookie', cookie).expect(401);
  });

  it('rechaza una firma de clave de hogar inválida', async () => {
    const body = buildRegistration();
    body.household.memberKey.signature = b64(randomBytes(64));
    await request(app.getHttpServer()).post('/api/auth/register').send(body).expect(400);
  });

  it('rechaza un email repetido con 409', async () => {
    const first = buildRegistration();
    createdUsers.push(first.userId);
    await request(app.getHttpServer()).post('/api/auth/register').send(first).expect(201);
    const second = buildRegistration(first.email);
    await request(app.getHttpServer()).post('/api/auth/register').send(second).expect(409);
  });

  it('refresh no comparte el límite estricto de login (recargar varias veces no bloquea la sesión)', async () => {
    for (let i = 0; i < 15; i++) {
      await request(app.getHttpServer()).post('/api/auth/refresh').expect(401); // sin cookie: 401, nunca 429
    }
  });

  it('/me sin token es 401 y /health sigue siendo público', async () => {
    await request(app.getHttpServer()).get('/api/me').expect(401);
    await request(app.getHttpServer()).get('/health').expect(200);
  });
});
