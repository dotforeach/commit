import { generateKeyPairSync, randomBytes, randomUUID, sign } from 'node:crypto';
import type { INestApplication } from '@nestjs/common';
import { StandardSchemaValidationPipe } from '@nestjs/common';
import { PasswordHasher } from '@nestjs/authentication';
import { Test } from '@nestjs/testing';
import cookieParser from 'cookie-parser';
import { AppModule } from '../src/app.module.js';
import { memberKeySignedMessage } from '../src/auth/member-key-signature.js';

export const b64 = (bytes: Uint8Array) => Buffer.from(bytes).toString('base64');

/** Arma un registro válido como lo haría el navegador (con bytes aleatorios en lugar de cifrado real). */
export function buildRegistration(email = `test-${randomUUID()}@example.com`) {
  const userId = randomUUID();
  const householdId = randomUUID();
  const { publicKey, privateKey } = generateKeyPairSync('ed25519');
  const rawSigningPublicKey = Buffer.from(publicKey.export({ format: 'jwk' }).x!, 'base64url');
  const wrappedKey = randomBytes(80);
  const signature = sign(null, memberKeySignedMessage(householdId, 1, userId, wrappedKey), privateKey);
  const parentId = randomUUID();

  return {
    signingPrivateKey: privateKey,
    userId,
    email,
    password: 'contraseña-de-login-larga',
    displayName: 'Persona de prueba',
    keys: {
      publicKey: b64(randomBytes(32)),
      signingPublicKey: b64(rawSigningPublicKey),
      encryptedPrivateKeys: b64(randomBytes(160)),
      kdfSalt: b64(randomBytes(16)),
      kdfParams: { alg: 'argon2id13', opsLimit: 3, memLimit: 128 * 1024 * 1024 },
      recoveryEncryptedKeys: b64(randomBytes(160)),
      recoveryKdfSalt: b64(randomBytes(16)),
    },
    household: {
      id: householdId,
      baseCurrency: 'ARS',
      payload: b64(randomBytes(80)),
      memberKey: { wrappedKey: b64(wrappedKey), signature: b64(signature) },
    },
    categories: [
      { id: parentId, parentId: null, kind: 'EXPENSE', budgetGroup: 'NEEDS', systemKey: 'housing', payload: b64(randomBytes(60)) },
      { id: randomUUID(), parentId, kind: 'EXPENSE', budgetGroup: 'NEEDS', systemKey: 'housing.rent', payload: b64(randomBytes(60)) },
      { id: randomUUID(), parentId: null, kind: 'INCOME', budgetGroup: null, systemKey: 'income.salary', payload: b64(randomBytes(60)) },
    ],
  };
}

/** App de test con la misma configuración que main.ts y un hash de contraseña rápido. */
export async function createTestApp(): Promise<INestApplication> {
  const moduleRef = await Test.createTestingModule({ imports: [AppModule] })
    .overrideProvider(PasswordHasher)
    .useValue(new PasswordHasher({ logN: 10 }))
    .compile();
  const app = moduleRef.createNestApplication();
  app.use(cookieParser());
  app.useGlobalPipes(new StandardSchemaValidationPipe());
  app.setGlobalPrefix('api', { exclude: ['health', 'ready'] });
  await app.init();
  return app;
}
