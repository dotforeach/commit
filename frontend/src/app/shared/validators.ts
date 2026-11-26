import type { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/** El grupo es válido si `a` y `b` coinciden. */
export const matchValidator =
  (a: string, b: string): ValidatorFn =>
  (group: AbstractControl): ValidationErrors | null =>
    group.get(a)?.value === group.get(b)?.value ? null : { mismatch: true };

/** La clave de descifrado no puede ser igual a la contraseña de login. */
export const differentFrom =
  (getOther: () => string): ValidatorFn =>
  (control: AbstractControl): ValidationErrors | null =>
    control.value && control.value === getOther() ? { sameAsPassword: true } : null;
