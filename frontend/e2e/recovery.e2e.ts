import { expect, test } from '@playwright/test';
import { registerViaUi, strip, unlock } from './helpers';

const password = 'contraseña-de-ingreso-1';
const original = 'clave original de descifrado';
const recovered = 'clave nueva tras recuperar';
const changed = 'clave cambiada desde ajustes';

test('olvidé la clave: recupero con la frase y después la cambio desde ajustes', async ({ page }) => {
  const email = `e2e-rec-${Date.now()}@example.com`;
  const phrase = await registerViaUi(page, { name: 'Beto Prueba', email, password, passphrase: original });
  const household = page.getByText('Finanzas de Beto Prueba');
  await expect(household).toBeVisible();

  // Bloqueo y "olvido" la clave
  await page.getByRole('button', { name: 'Bloquear' }).click();
  await page.getByRole('link', { name: '¿Olvidaste tu clave de descifrado?' }).click();
  await expect(page).toHaveURL(/\/recuperar$/);

  // Frase inválida (palabra inexistente)
  await page.getByLabel('Frase de recuperación').fill(['noexiste', ...phrase.slice(1)].join(' '));
  await page.getByRole('button', { name: 'Verificar frase' }).click();
  await expect(page.getByRole('alert')).toContainText('La frase no es válida');

  // Frase correcta, sin tildes y con espacios de más
  await page.getByLabel('Frase de recuperación').fill(phrase.map(strip).join('   '));
  await page.getByRole('button', { name: 'Verificar frase' }).click();
  await page.getByLabel('Nueva clave de descifrado').fill(recovered);
  await page.getByLabel('Repetí la nueva clave').fill(recovered);
  await page.getByRole('button', { name: 'Guardar y desbloquear' }).click();
  await expect(page).toHaveURL(/\/inicio$/, { timeout: 30_000 });
  await expect(household).toBeVisible();

  // La clave vieja ya no sirve, la nueva sí
  await page.getByRole('button', { name: 'Bloquear' }).click();
  await unlock(page, original);
  await expect(page.getByRole('alert')).toHaveText('Clave de descifrado incorrecta.', { timeout: 15_000 });
  await unlock(page, recovered);
  await expect(household).toBeVisible({ timeout: 15_000 });

  // Cambiar la clave desde ajustes (primero con la actual equivocada)
  await page.getByRole('link', { name: 'Cambiar clave de descifrado' }).click();
  await page.getByLabel('Clave de descifrado actual').fill('no es esta clave');
  await page.getByLabel('Nueva clave de descifrado').fill(changed);
  await page.getByLabel('Repetí la nueva clave').fill(changed);
  await page.getByRole('button', { name: 'Cambiar clave' }).click();
  await expect(page.getByRole('alert')).toHaveText('La clave actual es incorrecta.', { timeout: 15_000 });
  await page.getByLabel('Clave de descifrado actual').fill(recovered);
  await page.getByRole('button', { name: 'Cambiar clave' }).click();
  await expect(page).toHaveURL(/\/inicio$/, { timeout: 30_000 });

  // Tras recargar, solo la última clave desbloquea; la frase sigue funcionando
  await page.reload();
  await unlock(page, recovered);
  await expect(page.getByRole('alert')).toHaveText('Clave de descifrado incorrecta.', { timeout: 15_000 });
  await unlock(page, changed);
  await expect(household).toBeVisible({ timeout: 15_000 });
});
