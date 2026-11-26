import { randomBytes, sign } from 'node:crypto';
import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import type { App } from 'supertest/types.js';
import { PrismaService } from '../src/prisma/prisma.service.js';
import { keyUpdateSignedMessage } from '../src/users/key-update-signature.js';
import { b64, buildRegistration, createTestApp } from './helpers.js';

describe('PUT /api/me/keys (e2e)', () => {
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

  async function registered() {
    const reg = buildRegistration();
    createdUsers.push(reg.userId);
    const res = await request(app.getHttpServer()).post('/api/auth/register').send(reg).expect(201);
    return { reg, token: res.body.accessToken as string };
  }

  function passphraseUpdate(reg: ReturnType<typeof buildRegistration>, keyVersion = 1) {
    const passphrase = {
      encryptedPrivateKeys: randomBytes(137),
      kdfSalt: randomBytes(16),
      kdfParams: { alg: 'argon2id13', opsLimit: 3, memLimit: 128 * 1024 * 1024 },
    };
    const signature = sign(null, keyUpdateSignedMessage(reg.userId, keyVersion, passphrase), reg.signingPrivateKey);
    return {
      keyVersion,
      passphrase: { ...passphrase, encryptedPrivateKeys: b64(passphrase.encryptedPrivateKeys), kdfSalt: b64(passphrase.kdfSalt) },
      signature: b64(signature),
    };
  }

  it('reemplaza las claves cifradas con una firma válida de la clave privada', async () => {
    const { reg, token } = await registered();
    const body = passphraseUpdate(reg);
    await request(app.getHttpServer()).put('/api/me/keys').set('Authorization', `Bearer ${token}`).send(body).expect(204);

    const me = await request(app.getHttpServer()).get('/api/me').set('Authorization', `Bearer ${token}`).expect(200);
    expect(me.body.keys.encryptedPrivateKeys).toBe(body.passphrase.encryptedPrivateKeys);
    expect(me.body.keys.kdfSalt).toBe(body.passphrase.kdfSalt);
    // La copia de recuperación no se tocó.
    expect(me.body.keys.recoveryEncryptedKeys).toBe(reg.keys.recoveryEncryptedKeys);
  });

  it('con solo la contraseña de ingreso (sin firma válida) no se pueden pisar las claves', async () => {
    const { reg, token } = await registered();
    const body = { ...passphraseUpdate(reg), signature: b64(randomBytes(64)) };
    await request(app.getHttpServer()).put('/api/me/keys').set('Authorization', `Bearer ${token}`).send(body).expect(403);

    // Firma válida de OTRO usuario: tampoco.
    const other = buildRegistration();
    const forged = passphraseUpdate({ ...other, userId: reg.userId });
    await request(app.getHttpServer()).put('/api/me/keys').set('Authorization', `Bearer ${token}`).send(forged).expect(403);

    const stored = await prisma.userKeys.findUniqueOrThrow({ where: { userId: reg.userId } });
    expect(Buffer.from(stored.encryptedPrivateKeys).toString('base64')).toBe(reg.keys.encryptedPrivateKeys);
  });

  it('rechaza una versión de claves desactualizada con 409', async () => {
    const { reg, token } = await registered();
    await request(app.getHttpServer())
      .put('/api/me/keys')
      .set('Authorization', `Bearer ${token}`)
      .send(passphraseUpdate(reg, 2))
      .expect(409);
  });

  it('exige sesión', async () => {
    await request(app.getHttpServer()).put('/api/me/keys').send({}).expect(401);
  });
});
