import { z } from 'zod';
import { base64Bytes } from '../common/base64.js';

const encryptedPayload = base64Bytes({ min: 1 + 24 + 16, max: 16 * 1024 });

export const accountTypeSchema = z.enum([
  'CASH',
  'CHECKING',
  'SAVINGS',
  'DIGITAL_WALLET',
  'CREDIT_CARD',
  'INVESTMENT',
  'LOAN',
  'OTHER',
]);

const day = z.int().min(1).max(31);

/** payload cifrado de la tarjeta: { network, lastFour, creditLimit } */
const creditCardSchema = z.object({
  closingDay: day,
  dueDay: day,
  payload: encryptedPayload,
  keyVersion: z.int().positive(),
});

/** payload cifrado de la cuenta: { name, initialBalance, institution, color, icon, includeInNetWorth } */
const accountFields = {
  ownerUserId: z.uuid().nullable(),
  type: accountTypeSchema,
  currency: z.string().trim().toUpperCase().min(3).max(10),
  payload: encryptedPayload,
  keyVersion: z.int().positive(),
  creditCard: creditCardSchema.nullable(),
};

const creditCardMatchesType = (v: { type: string; creditCard: unknown }) =>
  (v.type === 'CREDIT_CARD') === (v.creditCard !== null);
const creditCardMessage = { message: 'Las tarjetas de crédito llevan sus datos de tarjeta, y solo ellas', path: ['creditCard'] };

export const createAccountSchema = z
  .object({ id: z.uuid(), ...accountFields })
  .refine(creditCardMatchesType, creditCardMessage);
export type CreateAccountInput = z.infer<typeof createAccountSchema>;

export const updateAccountSchema = z
  .object({
    expectedRevision: z.coerce.bigint(),
    archived: z.boolean(),
    ...accountFields,
  })
  .refine(creditCardMatchesType, creditCardMessage);
export type UpdateAccountInput = z.infer<typeof updateAccountSchema>;

export const listQuerySchema = z.object({
  since: z.coerce.bigint().nonnegative().optional(),
});

export const deleteQuerySchema = z.object({
  expectedRevision: z.coerce.bigint(),
});
