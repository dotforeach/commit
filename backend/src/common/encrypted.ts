import { z } from 'zod';
import { base64Bytes } from './base64.js';

/** Payload cifrado en el navegador: versión(1) ‖ nonce(24) ‖ ciphertext+tag(≥16). */
export const encryptedPayload = base64Bytes({ min: 1 + 24 + 16, max: 16 * 1024 });

export const keyVersion = z.int().positive();

/** Un movimiento de efectivo que acompaña una operación (su tipo y cuenta los fija el servidor). */
export const linkedTransaction = z.object({
  id: z.uuid(),
  categoryId: z.uuid().nullable().default(null),
  payload: encryptedPayload,
  keyVersion,
});
export type LinkedTransaction = z.infer<typeof linkedTransaction>;
