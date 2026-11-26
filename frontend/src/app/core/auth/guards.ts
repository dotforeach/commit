import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { KeyVaultService } from '../crypto/key-vault.service';
import { AuthService } from './auth.service';

/** Requiere sesión iniciada (o recuperable con la cookie de refresh). */
export const authGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return (await auth.ensureSession()) || router.createUrlTree(['/ingresar']);
};

/** Requiere además las claves desbloqueadas. */
export const unlockedGuard: CanActivateFn = () => {
  const vault = inject(KeyVaultService);
  return vault.isUnlocked() || inject(Router).createUrlTree(['/desbloquear']);
};

/** Para login/registro: si ya hay sesión, va directo a desbloquear o al inicio. */
export const guestGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const vault = inject(KeyVaultService);
  const router = inject(Router);
  if (!(await auth.ensureSession())) return true;
  return router.createUrlTree([vault.isUnlocked() ? '/inicio' : '/desbloquear']);
};
