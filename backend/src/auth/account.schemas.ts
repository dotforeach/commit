import { z } from 'zod';

const token = z.string().min(20).max(200);
const password = z.string().min(10, 'La contraseña debe tener al menos 10 caracteres').max(1024);

export const tokenSchema = z.object({ token });
export const forgotSchema = z.object({ email: z.email().max(254) });
export const resetSchema = z.object({ token, password });
export const changePasswordSchema = z.object({ currentPassword: z.string().min(1).max(200), newPassword: password });
export const changeEmailSchema = z.object({ password: z.string().min(1).max(200), newEmail: z.email().max(254) });
export const deleteAccountSchema = z.object({ password: z.string().min(1).max(200), confirm: z.literal('ELIMINAR') });

export type TokenInput = z.infer<typeof tokenSchema>;
export type ForgotInput = z.infer<typeof forgotSchema>;
export type ResetInput = z.infer<typeof resetSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type ChangeEmailInput = z.infer<typeof changeEmailSchema>;
export type DeleteAccountInput = z.infer<typeof deleteAccountSchema>;
