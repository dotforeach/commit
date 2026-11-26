import { z } from 'zod';
import { kdfParamsSchema } from '../auth/auth.schemas.js';
import { base64Bytes } from '../common/base64.js';

/** Reemplazo de las claves privadas cifradas (cambio de clave de descifrado y/o nueva frase). */
export const updateKeysSchema = z
  .object({
    keyVersion: z.int().positive(),
    passphrase: z
      .object({
        encryptedPrivateKeys: base64Bytes({ min: 40, max: 1024 }),
        kdfSalt: base64Bytes({ exact: 16 }),
        kdfParams: kdfParamsSchema,
      })
      .optional(),
    recovery: z
      .object({
        recoveryEncryptedKeys: base64Bytes({ min: 40, max: 1024 }),
        recoveryKdfSalt: base64Bytes({ exact: 16 }),
      })
      .optional(),
    signature: base64Bytes({ exact: 64 }),
  })
  .refine((v) => v.passphrase || v.recovery, { message: 'Nada para actualizar' });
export type UpdateKeysInput = z.infer<typeof updateKeysSchema>;
