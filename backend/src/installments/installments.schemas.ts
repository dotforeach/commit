import { z } from 'zod';
import { base64Bytes } from '../common/base64.js';
import { isoDate } from '../common/sync.js';

const encryptedPayload = base64Bytes({ min: 1 + 24 + 16, max: 16 * 1024 });

/**
 * Compra en cuotas con tarjeta: el gasto (monto total), el plan y cada cuota, juntos.
 * payload del plan: { totalAmount, installmentAmount }; de cada cuota: { amount }.
 * `dueMonth` = primer día del mes del resumen en el que cae la cuota.
 */
export const createPlanSchema = z
  .object({
    id: z.uuid(),
    creditCardId: z.uuid(),
    installmentsCount: z.int().min(2).max(72),
    interestFree: z.boolean(),
    firstStatementOn: isoDate,
    payload: encryptedPayload,
    keyVersion: z.int().positive(),
    transaction: z.object({
      id: z.uuid(),
      categoryId: z.uuid().nullable(),
      date: isoDate,
      payload: encryptedPayload,
      keyVersion: z.int().positive(),
    }),
    installments: z
      .array(
        z.object({
          id: z.uuid(),
          number: z.int().min(1),
          dueMonth: isoDate,
          payload: encryptedPayload,
          keyVersion: z.int().positive(),
        }),
      )
      .min(2)
      .max(72),
  })
  .refine(
    (p) =>
      p.installments.length === p.installmentsCount &&
      p.installments.every((i, idx) => i.number === idx + 1 && i.dueMonth.getUTCDate() === 1) &&
      p.installments.every((i, idx) => idx === 0 || i.dueMonth > p.installments[idx - 1].dueMonth),
    { message: 'Las cuotas deben ser 1..N, en meses crecientes y con fecha al primer día del mes' },
  );
export type CreatePlanInput = z.infer<typeof createPlanSchema>;
