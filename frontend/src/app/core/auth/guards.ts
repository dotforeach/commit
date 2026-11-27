import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { KeyVaultService } from '../crypto/key-vault.service';
import { AuthService } from './auth.service';

const RETURN_KEY = 'finanzas.returnTo';

/** Recuerda a dónde quería ir (p. ej. un link de invitación) para volver después de ingresar. */
function remember(url: string) {
  if (url && url !== '/' && !url.startsWith('/inicio')) sessionStorage.setItem(RETURN_KEY, url);
}

/** La URL guardada (una sola vez). */
export function takeReturnUrl(): string | null {
  const url = sessionStorage.getItem(RETURN_KEY);
  sessionStorage.removeItem(RETURN_KEY);
  return url;
}

/** Requiere sesión iniciada (o recuperable con la cookie de refresh). */
export const authGuard: CanActivateFn = async (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (await auth.ensureSession()) return true;
  remember(state.url);
  return router.createUrlTree(['/ingresar']);
};

/** Requiere además las claves desbloqueadas. */
export const unlockedGuard: CanActivateFn = (_route, state) => {
  const vault = inject(KeyVaultService);
  if (vault.isUnlocked()) return true;
  remember(state.url);
  return inject(Router).createUrlTree(['/desbloquear']);
};

/** Para login/registro: si ya hay sesión, va directo a desbloquear o al inicio. */
export const guestGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const vault = inject(KeyVaultService);
  const router = inject(Router);
  if (!(await auth.ensureSession())) return true;
  return router.createUrlTree([vault.isUnlocked() ? '/inicio' : '/desbloquear']);
};

/** La landing es para visitantes: con sesión iniciada, "/" lleva a Inicio. */
export const landingGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return (await auth.ensureSession()) ? router.createUrlTree(['/inicio']) : true;
};
