import { z } from 'zod';
import { base64Bytes } from '../common/base64.js';
import { isoDate } from '../common/sync.js';

const encryptedPayload = base64Bytes({ min: 1 + 24 + 16, max: 16 * 1024 });

/** payload cifrado: { amount, description } */
const ruleFields = {
  accountId: z.uuid(),
  categoryId: z.uuid().nullable(),
  type: z.enum(['INCOME', 'EXPENSE']),
  frequency: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY']),
  interval: z.int().min(1).max(365),
  dayOfMonth: z.int().min(1).max(31).nullable(),
  startDate: isoDate,
  endDate: isoDate.nullable(),
  nextRunOn: isoDate,
  autoPost: z.boolean(),
  isSalary: z.boolean(),
  active: z.boolean(),
  payload: encryptedPayload,
  keyVersion: z.int().positive(),
};

const coherent = (r: { frequency: string; dayOfMonth: number | null; startDate: Date; endDate: Date | null; nextRunOn: Date }) =>
  (r.frequency === 'MONTHLY') === (r.dayOfMonth !== null) &&
  r.nextRunOn >= r.startDate &&
  (r.endDate === null || r.endDate >= r.startDate);
const coherentMessage = { message: 'Solo las reglas mensuales llevan día del mes; las fechas deben ser coherentes' };

export const createRuleSchema = z.object({ id: z.uuid(), ...ruleFields }).refine(coherent, coherentMessage);
export type CreateRuleInput = z.infer<typeof createRuleSchema>;

export const updateRuleSchema = z
  .object({ expectedRevision: z.coerce.bigint(), ...ruleFields })
  .refine(coherent, coherentMessage);
export type UpdateRuleInput = z.infer<typeof updateRuleSchema>;

/**
 * Registrar (u omitir) las ocurrencias vencidas de una regla, de forma atómica:
 * se crean los movimientos y se avanza nextRunOn en la misma transacción, condicionado
 * a la revisión de la regla. Dos dispositivos a la vez: uno gana, el otro recibe 409.
 * `transactions` vacío = omitir esas ocurrencias.
 */
export const postOccurrencesSchema = z.object({
  expectedRevision: z.coerce.bigint(),
  nextRunOn: isoDate,
  active: z.boolean(),
  transactions: z
    .array(
      z.object({
        id: z.uuid(),
        date: isoDate,
        payload: encryptedPayload,
        keyVersion: z.int().positive(),
      }),
    )
    .max(60),
});
export type PostOccurrencesInput = z.infer<typeof postOccurrencesSchema>;
