import { z } from 'zod';

/** Base64 estándar decodificado a Buffer, con largo en bytes validado. */
export const base64Bytes = (opts: { min?: number; max?: number; exact?: number } = {}) =>
  z
    .base64()
    .transform((value) => Buffer.from(value, 'base64'))
    .refine((buf) => opts.exact === undefined || buf.length === opts.exact, {
      message: `debe tener exactamente ${opts.exact} bytes`,
    })
    .refine((buf) => buf.length >= (opts.min ?? 1), { message: 'demasiado corto' })
    .refine((buf) => buf.length <= (opts.max ?? 64 * 1024), { message: 'demasiado largo' });

export const toBase64 = (bytes: Uint8Array) => Buffer.from(bytes).toString('base64');
