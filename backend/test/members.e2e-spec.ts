import { randomBytes, sign } from 'node:crypto';
import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import type { App } from 'supertest/types.js';
import { memberKeySignedMessage } from '../src/auth/member-key-signature.js';
import { PrismaService } from '../src/prisma/prisma.service.js';
import { b64, buildRegistration, createTestApp } from './helpers.js';

describe('Hogares compartidos (e2e)', () => {
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
    return { reg, auth: { Authorization: `Bearer ${res.body.accessToken}` }, hh: `/api/households/${reg.household.id}` };
  }

  /** Envoltorio firmado por `signer` de la versión `version` para `userId` (bytes aleatorios como clave envuelta). */
  const wrapFor = (signer: Awaited<ReturnType<typeof user>>, householdId: string, version: number, userId: string) => {
    const wrappedKey = randomBytes(80);
    const signature = sign(null, memberKeySignedMessage(householdId, version, userId, wrappedKey), signer.reg.signingPrivateKey);
    return { version, wrappedKey: b64(wrappedKey), signature: b64(signature) };
  };

  it('invitar → aceptar (pendiente, sin acceso) → dar acceso firmado → quitar y rotar la clave', async () => {
    const owner = await user();
    const guest = await user();
    const s = app.getHttpServer();
    const hid = owner.reg.household.id;

    const inv = await request(s).post(`${owner.hh}/invitations`).set(owner.auth).send({ email: guest.reg.email, role: 'MEMBER' }).expect(201);
    expect(inv.body.token).toEqual(expect.any(String));
    expect((await request(s).get(`${owner.hh}/invitations`).set(owner.auth).expect(200)).body.items).toHaveLength(1);

    // Otra persona no puede usar la invitación
    const stranger = await user();
    await request(s).post('/api/invitations/accept').set(stranger.auth).send({ token: inv.body.token }).expect(403);

    const accepted = await request(s).post('/api/invitations/accept').set(guest.auth).send({ token: inv.body.token }).expect(200);
    expect(accepted.body).toEqual({ householdId: hid, status: 'PENDING_KEY' });
    await request(s).post('/api/invitations/accept').set(guest.auth).send({ token: inv.body.token }).expect(404); // un solo uso

    // Pendiente: todavía no ve nada del hogar
    await request(s).get(`${owner.hh}/accounts`).set(guest.auth).expect(404);
    const members = await request(s).get(`${owner.hh}/members`).set(owner.auth).expect(200);
    expect(members.body.items.find((m: { userId: string }) => m.userId === guest.reg.userId)).toMatchObject({ status: 'PENDING_KEY', publicKey: guest.reg.keys.publicKey });
    // El dueño tiene un aviso (sin datos financieros)
    expect(await prisma.notification.count({ where: { userId: owner.reg.userId, type: 'MEMBER_PENDING_KEY' } })).toBe(1);

    // Firma de otra persona: rechazada; faltan versiones: rechazado
    await request(s).post(`${owner.hh}/members/${guest.reg.userId}/key`).set(owner.auth).send({ keys: [wrapFor(stranger, hid, 1, guest.reg.userId)] }).expect(400);
    await request(s).post(`${owner.hh}/members/${guest.reg.userId}/key`).set(owner.auth).send({ keys: [wrapFor(owner, hid, 2, guest.reg.userId)] }).expect(400);

    await request(s).post(`${owner.hh}/members/${guest.reg.userId}/key`).set(owner.auth).send({ keys: [wrapFor(owner, hid, 1, guest.reg.userId)] }).expect(204);
    await request(s).get(`${owner.hh}/accounts`).set(guest.auth).expect(200);
    const me = await request(s).get('/api/me').set(guest.auth).expect(200);
    const shared = me.body.households.find((h: { id: string }) => h.id === hid);
    expect(shared).toMatchObject({ status: 'ACTIVE', role: 'MEMBER' });
    expect(shared.memberKeys).toEqual([expect.objectContaining({ version: 1, wrappedById: owner.reg.userId, wrappedBySigningPublicKey: owner.reg.keys.signingPublicKey })]);

    // Un MEMBER no puede invitar ni quitar
    await request(s).post(`${owner.hh}/invitations`).set(guest.auth).send({ email: 'x@example.com', role: 'MEMBER' }).expect(403);
    await request(s).delete(`${owner.hh}/members/${owner.reg.userId}`).set(owner.auth).expect(400); // el dueño no sale

    // Quitar y rotar: la versión 2 va solo para quienes quedan
    await request(s).delete(`${owner.hh}/members/${guest.reg.userId}`).set(owner.auth).expect(204);
    await request(s).get(`${owner.hh}/accounts`).set(guest.auth).expect(404);
    await request(s).post(`${owner.hh}/keys/rotate`).set(owner.auth).send({ version: 2, memberKeys: [{ userId: guest.reg.userId, ...wrapFor(owner, hid, 2, guest.reg.userId) }] }).expect(400);
    const v2 = wrapFor(owner, hid, 2, owner.reg.userId);
    await request(s).post(`${owner.hh}/keys/rotate`).set(owner.auth).send({ version: 2, memberKeys: [{ userId: owner.reg.userId, wrappedKey: v2.wrappedKey, signature: v2.signature }] }).expect(201);
    await request(s).post(`${owner.hh}/keys/rotate`).set(owner.auth).send({ version: 2, memberKeys: [{ userId: owner.reg.userId, wrappedKey: v2.wrappedKey, signature: v2.signature }] }).expect(409);
    const ownerMe = await request(s).get('/api/me').set(owner.auth).expect(200);
    expect(ownerMe.body.households[0]).toMatchObject({ currentKeyVersion: 2 });
    expect(ownerMe.body.households[0].memberKeys.map((k: { version: number }) => k.version).sort()).toEqual([1, 2]);
  });

  it('cambiar de hogar activo solo a uno donde se es miembro activo', async () => {
    const a = await user();
    const b = await user();
    await request(app.getHttpServer()).put('/api/me/default-household').set(a.auth).send({ householdId: b.reg.household.id }).expect(404);
    await request(app.getHttpServer()).put('/api/me/default-household').set(a.auth).send({ householdId: a.reg.household.id }).expect(204);
  });
});
