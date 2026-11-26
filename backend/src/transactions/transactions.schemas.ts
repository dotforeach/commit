import { z } from 'zod';
import { base64Bytes } from '../common/base64.js';
import { isoDate } from '../common/sync.js';

export const transactionTypeSchema = z.enum([
  'INCOME',
  'EXPENSE',
  'TRANSFER_OUT',
  'TRANSFER_IN',
  'ADJUSTMENT_IN',
  'ADJUSTMENT_OUT',
]);

/** payload cifrado: { amount, description, notes } */
const fields = {
  accountId: z.uuid(),
  categoryId: z.uuid().nullable(),
  type: transactionTypeSchema,
  status: z.enum(['PENDING', 'CLEARED']).default('CLEARED'),
  date: isoDate,
  transferGroupId: z.uuid().nullable(),
  payload: base64Bytes({ min: 1 + 24 + 16, max: 16 * 1024 }),
  keyVersion: z.int().positive(),
};

const isTransfer = (t: string) => t === 'TRANSFER_OUT' || t === 'TRANSFER_IN';

/**
 * 1 fila = ingreso/gasto/ajuste. 2 filas = transferencia (OUT + IN, mismo grupo, cuentas distintas).
 * Las transferencias se crean, editan y borran siempre juntas.
 */
function validLegs(items: { accountId: string; type: string; transferGroupId: string | null; categoryId: string | null }[]) {
  if (items.length === 1) {
    const [t] = items;
    return !isTransfer(t.type) && t.transferGroupId === null;
  }
  const [a, b] = items;
  const types = new Set([a.type, b.type]);
  return (
    types.has('TRANSFER_OUT') &&
    types.has('TRANSFER_IN') &&
    a.transferGroupId !== null &&
    a.transferGroupId === b.transferGroupId &&
    a.accountId !== b.accountId &&
    a.categoryId === null &&
    b.categoryId === null
  );
}
const legsMessage = {
  message: 'Un movimiento simple no es transferencia; una transferencia son 2 filas (salida y entrada) del mismo grupo, en cuentas distintas y sin categoría',
};

export const createTransactionsSchema = z.object({
  items: z
    .array(z.object({ id: z.uuid(), ...fields }))
    .min(1)
    .max(2)
    .refine(validLegs, legsMessage),
});
export type CreateTransactionsInput = z.infer<typeof createTransactionsSchema>;

export const updateTransactionsSchema = z.object({
  items: z
    .array(z.object({ id: z.uuid(), expectedRevision: z.coerce.bigint(), ...fields }))
    .min(1)
    .max(2)
    .refine(validLegs, legsMessage),
});
export type UpdateTransactionsInput = z.infer<typeof updateTransactionsSchema>;
