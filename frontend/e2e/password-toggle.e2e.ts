import { expect, test } from '@playwright/test';

test('ojito: muestra y oculta lo escrito en contraseñas y claves', async ({ page }) => {
  await page.goto('/ingresar');
  const password = page.getByLabel('Contraseña de ingreso');
  await password.fill('mi-contraseña-secreta');
  await expect(password).toHaveAttribute('type', 'password');

  const eye = page.getByRole('button', { name: 'Mostrar lo escrito' });
  await eye.click();
  await expect(password).toHaveAttribute('type', 'text');
  await expect(password).toHaveValue('mi-contraseña-secreta');
  await expect(page.getByRole('button', { name: 'Ocultar lo escrito' })).toHaveAttribute('aria-pressed', 'true');

  await page.getByRole('button', { name: 'Ocultar lo escrito' }).click();
  await expect(password).toHaveAttribute('type', 'password');

  // En el registro, cada campo tiene su propio ojito (independientes)
  await page.goto('/registro');
  await expect(page.getByRole('button', { name: 'Mostrar lo escrito' })).toHaveCount(2);
  await page.getByLabel('Contraseña de ingreso').fill('abc');
  await page.getByRole('button', { name: 'Mostrar lo escrito' }).first().click();
  await expect(page.getByLabel('Contraseña de ingreso')).toHaveAttribute('type', 'text');
  await expect(page.getByLabel('Repite la contraseña')).toHaveAttribute('type', 'password');
});
