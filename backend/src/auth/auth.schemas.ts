import { z } from 'zod';
import { base64Bytes } from '../common/base64.js';

const MiB = 1024 * 1024;

export const credentialsSchema = z.object({
  email: z.email().trim().toLowerCase().max(254),
  password: z.string().min(1).max(1024),
});
export type Credentials = z.infer<typeof credentialsSchema>;

/** Material criptográfico generado en el navegador (las privadas llegan cifradas). */
export const kdfParamsSchema = z.object({
  alg: z.literal('argon2id13'),
  opsLimit: z.int().min(2).max(10),
  memLimit: z.int().min(64 * MiB).max(1024 * MiB),
});

const userKeysSchema = z.object({
  publicKey: base64Bytes({ exact: 32 }), // X25519
  signingPublicKey: base64Bytes({ exact: 32 }), // Ed25519
  encryptedPrivateKeys: base64Bytes({ min: 40, max: 1024 }),
  kdfSalt: base64Bytes({ exact: 16 }),
  kdfParams: kdfParamsSchema,
  recoveryEncryptedKeys: base64Bytes({ min: 40, max: 1024 }),
  recoveryKdfSalt: base64Bytes({ exact: 16 }),
});

const encryptedPayload = base64Bytes({ min: 1 + 24 + 16, max: 16 * 1024 });

const categorySchema = z.object({
  id: z.uuid(),
  parentId: z.uuid().nullable(),
  kind: z.enum(['INCOME', 'EXPENSE']),
  budgetGroup: z.enum(['NEEDS', 'WANTS', 'SAVINGS']).nullable(),
  systemKey: z.string().max(64).nullable(),
  payload: encryptedPayload,
});

export const registerSchema = z.object({
  // Los IDs los genera el navegador: forman parte del AAD de cada payload cifrado.
  userId: z.uuid(),
  email: z.email().trim().toLowerCase().max(254),
  password: z.string().min(10, 'La contraseña debe tener al menos 10 caracteres').max(1024),
  displayName: z.string().trim().min(1).max(80),
  locale: z.string().max(10).default('es-AR'),
  timezone: z.string().max(64).default('America/Argentina/Buenos_Aires'),
  keys: userKeysSchema,
  household: z.object({
    id: z.uuid(),
    baseCurrency: z.string().trim().toUpperCase().min(3).max(10),
    payload: encryptedPayload,
    memberKey: z.object({
      wrappedKey: base64Bytes({ exact: 32 + 48 }), // sealed box de una clave de 32 bytes
      signature: base64Bytes({ exact: 64 }),
    }),
  }),
  categories: z.array(categorySchema).max(200),
});
export type RegisterInput = z.infer<typeof registerSchema>;
