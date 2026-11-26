import { z } from 'zod';
import { revision } from '../common/sync.js';
import { base64Bytes } from '../common/base64.js';

const encryptedPayload = base64Bytes({ min: 1 + 24 + 16, max: 16 * 1024 });

/** payload cifrado del ítem: { amount } */
const itemSchema = z.object({
  id: z.uuid(),
  categoryId: z.uuid(),
  rollover: z.boolean(),
  alertThreshold: z.int().min(1).max(100),
  payload: encryptedPayload,
  keyVersion: z.int().positive(),
});

const uniqueCategories = (items: { categoryId: string }[]) => new Set(items.map((i) => i.categoryId)).size === items.length;

/** payload cifrado del presupuesto: { expectedIncome } */
const budgetFields = {
  method: z.enum(['CATEGORY', 'FIFTY_THIRTY_TWENTY', 'ENVELOPE']),
  currency: z.string().trim().toUpperCase().min(3).max(10),
  payload: encryptedPayload,
  keyVersion: z.int().positive(),
  items: z.array(itemSchema).max(200).refine(uniqueCategories, { message: 'Una categoría aparece dos veces' }),
};

export const createBudgetSchema = z.object({
  id: z.uuid(),
  year: z.int().min(2000).max(2100),
  month: z.int().min(1).max(12),
  ...budgetFields,
});
export type CreateBudgetInput = z.infer<typeof createBudgetSchema>;

export const updateBudgetSchema = z.object({ expectedRevision: revision, ...budgetFields });
export type UpdateBudgetInput = z.infer<typeof updateBudgetSchema>;
