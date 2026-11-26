import { expect, test } from '@playwright/test';
import { registerViaUi } from './helpers';

const password = 'contraseña-de-ingreso-1';
const passphrase = 'mi clave de descifrado larga';

test('registro → datos cifrados → bloqueo → desbloqueo → recarga → login', async ({ page }) => {
  const email = `e2e-${Date.now()}@example.com`;
  const requests: string[] = [];
  page.on('request', (r) => {
    if (r.url().includes('/api/')) requests.push(r.postData() ?? '');
  });

  const phrase = await registerViaUi(page, { name: 'Ana Prueba', email, password, passphrase });

  // Inicio: el nombre del hogar se descifró en el navegador
  await expect(page.getByText('Hola, Ana Prueba')).toBeVisible();
  await expect(page.getByText('Finanzas de Ana Prueba')).toBeVisible();

  // Nada sensible viajó en claro al servidor
  const sent = requests.join('\n');
  expect(sent).not.toContain(passphrase);
  expect(sent).not.toContain(phrase.join(' '));
  expect(sent).not.toContain('Finanzas de Ana Prueba');
  expect(sent).not.toContain('Supermercado');

  // Bloquear y desbloquear (clave incorrecta primero)
  await page.getByRole('button', { name: 'Bloquear' }).click();
  await expect(page).toHaveURL(/\/desbloquear$/);
  await page.getByLabel('Clave de descifrado').fill('clave equivocada');
  await page.getByRole('button', { name: 'Desbloquear' }).click();
  await expect(page.getByRole('alert')).toHaveText('Clave de descifrado incorrecta.', { timeout: 15_000 });
  await page.getByLabel('Clave de descifrado').fill(passphrase);
  await page.getByRole('button', { name: 'Desbloquear' }).click();
  await expect(page.getByText('Finanzas de Ana Prueba')).toBeVisible({ timeout: 15_000 });

  // Recargar: la sesión sigue (cookie de refresh) pero las claves no (solo en memoria)
  await page.reload();
  await expect(page).toHaveURL(/\/desbloquear$/);
  await page.getByLabel('Clave de descifrado').fill(passphrase);
  await page.getByRole('button', { name: 'Desbloquear' }).click();
  await expect(page.getByText('Finanzas de Ana Prueba')).toBeVisible({ timeout: 15_000 });

  // Cerrar sesión y volver a entrar
  await page.getByRole('button', { name: 'Cerrar sesión' }).click();
  await expect(page).toHaveURL(/\/ingresar$/);
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Contraseña de ingreso').fill('incorrecta-123');
  await page.getByRole('button', { name: 'Ingresar' }).click();
  await expect(page.getByRole('alert')).toHaveText('Email o contraseña incorrectos.');
  await page.getByLabel('Contraseña de ingreso').fill(password);
  await page.getByRole('button', { name: 'Ingresar' }).click();
  await expect(page).toHaveURL(/\/desbloquear$/);
  await page.getByLabel('Clave de descifrado').fill(passphrase);
  await page.getByRole('button', { name: 'Desbloquear' }).click();
  await expect(page.getByText('Finanzas de Ana Prueba')).toBeVisible({ timeout: 15_000 });
});
