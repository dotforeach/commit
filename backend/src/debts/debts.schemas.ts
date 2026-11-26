import { z } from 'zod';
import { base64Bytes } from '../common/base64.js';
import { isoDate, revision } from '../common/sync.js';

const encryptedPayload = base64Bytes({ min: 1 + 24 + 16, max: 16 * 1024 });

/** payload cifrado: { name, lender, originalAmount, annualRate, indexName, minimumPayment } */
const debtFields = {
  accountId: z.uuid().nullable(),
  kind: z.enum(['PERSONAL_LOAN', 'MORTGAGE', 'CAR_LOAN', 'CREDIT_CARD_BALANCE', 'FAMILY_OR_FRIEND', 'OTHER']),
  currency: z.string().trim().toUpperCase().min(3).max(10),
  rateType: z.enum(['FIXED', 'VARIABLE', 'INDEXED', 'NONE']),
  amortization: z.enum(['FRENCH', 'GERMAN', 'BULLET', 'CUSTOM']),
  termMonths: z.int().min(1).max(600).nullable(),
  startDate: isoDate,
  paymentDay: z.int().min(1).max(31).nullable(),
  status: z.enum(['ACTIVE', 'PAID_OFF', 'DEFAULTED', 'CANCELLED']),
  payload: encryptedPayload,
  keyVersion: z.int().positive(),
};

export const createDebtSchema = z.object({ id: z.uuid(), ...debtFields });
export type CreateDebtInput = z.infer<typeof createDebtSchema>;

export const updateDebtSchema = z.object({ expectedRevision: revision, ...debtFields });
export type UpdateDebtInput = z.infer<typeof updateDebtSchema>;

/**
 * Pago de una deuda: el gasto en la cuenta de origen y el registro del pago, juntos.
 * payload del pago: { amount, principalPart, interestPart, feesPart }
 * payload del movimiento: { amount, description, notes }
 */
export const createPaymentSchema = z.object({
  id: z.uuid(),
  date: isoDate,
  payload: encryptedPayload,
  keyVersion: z.int().positive(),
  transaction: z.object({
    id: z.uuid(),
    accountId: z.uuid(),
    categoryId: z.uuid().nullable(),
    payload: encryptedPayload,
    keyVersion: z.int().positive(),
  }),
});
export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
