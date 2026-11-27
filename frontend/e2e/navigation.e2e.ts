import { expect, test } from '@playwright/test';
import { registerViaUi } from './helpers';

test('navegación: chanchito y nombre a la principal; landing ↔ registro ↔ login', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Ingresar' }).click();
  await expect(page).toHaveURL(/\/ingresar$/);
  await page.locator('mat-card-footer').getByRole('link', { name: 'Crear una' }).click();
  await expect(page).toHaveURL(/\/registro$/);
  await page.locator('mat-card-footer').getByRole('link', { name: 'Ingresar' }).click();
  await expect(page).toHaveURL(/\/ingresar$/);
  await page.getByTestId('back-home').click();
  await expect(page).toHaveURL(/\/$/);
  await page.getByTestId('brand').click();
  await expect(page.getByTestId('landing-title')).toBeVisible();

  // Con sesión, el chanchito lleva a Inicio
  await registerViaUi(page, { name: 'Navi Gación', email: `e2e-nav-${Date.now()}@example.com`, password: 'contraseña-de-ingreso-1', passphrase: 'clave de descifrado navegación' });
  await page.getByRole('link', { name: 'Cuentas' }).click();
  await page.getByTestId('brand').click();
  await expect(page).toHaveURL(/\/inicio$/);
});
