import { expect, test } from '@playwright/test';
import { mailLink, registerViaUi } from './helpers';

test('cuenta: verificar correo, olvidé mi contraseña y restablecerla', async ({ page }) => {
  const email = `e2e-account-${Date.now()}@example.com`;
  await registerViaUi(page, { name: 'Cuen Ta', email, password: 'contraseña-de-ingreso-1', passphrase: 'clave de descifrado cuenta' });

  // Aviso hasta confirmar el correo; el enlace llega por correo
  await expect(page.getByTestId('verify-banner')).toContainText(email);
  await page.goto(await mailLink(page, email, /Confirma tu correo/));
  await expect(page.getByTestId('link-ok')).toBeVisible();
  await page.goto('/inicio');
  await expect(page.getByTestId('verify-banner')).toHaveCount(0);

  // Olvidé mi contraseña (desde el login)
  await page.goto('/ajustes');
  await page.getByTestId('revoke-all').click();
  await expect(page).toHaveURL(/\/ingresar$/);
  await page.getByTestId('forgot-link').click();
  await page.getByLabel('Correo').fill(email);
  await page.getByRole('button', { name: 'Enviar enlace' }).click();
  await expect(page.getByTestId('forgot-sent')).toBeVisible();
  await page.goto(await mailLink(page, email, /Restablece tu contraseña/));
  await page.getByLabel('Contraseña nueva', { exact: true }).fill('otra-contraseña-segura');
  await page.getByLabel('Repite la contraseña nueva').fill('otra-contraseña-segura');
  await page.getByRole('button', { name: 'Guardar contraseña' }).click();
  await expect(page.getByTestId('reset-done')).toBeVisible();

  // Ingresa con la contraseña nueva
  await page.goto('/ingresar');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Contraseña de ingreso').fill('otra-contraseña-segura');
  await page.getByRole('button', { name: 'Ingresar' }).click();
  await expect(page).toHaveURL(/\/desbloquear$/);
});

test('cuenta: cambiar contraseña y eliminar la cuenta desde Ajustes', async ({ page }) => {
  const email = `e2e-account2-${Date.now()}@example.com`;
  await registerViaUi(page, { name: 'Bo Rrar', email, password: 'contraseña-de-ingreso-1', passphrase: 'clave de descifrado borrar' });
  await page.goto('/ajustes');
  const card = page.getByTestId('account-security');
  await expect(card.getByTestId('email-unverified')).toBeVisible();

  await card.getByTestId('change-password').click();
  await card.getByLabel('Contraseña actual').fill('contraseña-de-ingreso-1');
  await card.getByLabel('Contraseña nueva').fill('contraseña-cambiada-1');
  await card.getByRole('button', { name: 'Guardar' }).click();
  await expect(page.getByText('Contraseña cambiada')).toBeVisible();

  // Sigue con sesión en este dispositivo tras el cambio
  await page.reload();
  await expect(page).toHaveURL(/\/ajustes$/);

  await card.getByTestId('delete-account').click();
  await card.getByLabel('Contraseña de ingreso').fill('contraseña-cambiada-1');
  await expect(card.getByTestId('delete-submit')).toBeDisabled();
  await card.getByTestId('delete-confirm').fill('ELIMINAR');
  await card.getByTestId('delete-submit').click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByTestId('landing-title')).toBeVisible();

  // Ya no puede ingresar
  await page.goto('/ingresar');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Contraseña de ingreso').fill('contraseña-cambiada-1');
  await page.getByRole('button', { name: 'Ingresar' }).click();
  await expect(page.getByRole('alert')).toHaveText('Email o contraseña incorrectos.');
});

test('inicio y landing: facturas por WhatsApp como opción de pago, todo lo demás gratis', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('pricing')).toContainText('$0');
  await expect(page.getByTestId('pricing')).toContainText('$2/mes o $20/año');
  await registerViaUi(page, { name: 'Pre Cios', email: `e2e-pricing-${Date.now()}@example.com`, password: 'contraseña-de-ingreso-1', passphrase: 'clave de descifrado precios' });
  await expect(page.getByTestId('home-prices')).toContainText('$2 al mes');
  await expect(page.getByTestId('home-prices')).toContainText('$20 al año');
  await page.getByTestId('home-subscribe').click();
  await expect(page).toHaveURL(/\/suscripcion$/);
});
