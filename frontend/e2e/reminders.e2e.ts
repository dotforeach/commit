import { expect, test } from '@playwright/test';
import { createAccount, pick, registerViaUi } from './helpers';

test('recordatorios: se programan cifrados, el servidor los dispara y aparecen en la campana', async ({ page }) => {
  test.setTimeout(150_000);
  await registerViaUi(page, {
    name: 'Kai Avisos',
    email: `e2e-reminders-${Date.now()}@example.com`,
    password: 'contraseña-de-ingreso-1',
    passphrase: 'clave de descifrado de avisos',
  });
  await page.getByRole('link', { name: 'Cuentas' }).click();
  await createAccount(page, { name: 'Banco', type: 'Cuenta bancaria', initial: '0' });

  // Recurrente con confirmación que vence hoy
  const today = new Date();
  await page.getByRole('link', { name: 'Recurrentes' }).click();
  await page.getByRole('button', { name: 'Nuevo recurrente' }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByLabel('Descripción').fill('Internet');
  await dialog.getByLabel('Monto', { exact: true }).fill('20.000');
  await pick(page, 'Cuenta', 'Banco · ARS');
  await dialog.getByLabel('Día del mes').fill(String(today.getDate()));
  await dialog.getByLabel('Desde').fill(`${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`);
  await dialog.getByRole('radio', { name: /Pedirme confirmación/ }).click();
  await dialog.getByRole('button', { name: 'Guardar' }).click();
  await expect(dialog).toHaveCount(0);

  // En desarrollo no hay service worker: Ajustes lo explica
  await page.getByRole('link', { name: 'Ajustes' }).click();
  await expect(page.getByText(/no soporta notificaciones push/)).toBeVisible();

  // Inicio programa los recordatorios (hoy a las 9)
  await page.getByRole('link', { name: 'Inicio' }).click();
  await expect(page.locator('li[data-pending="Internet"]')).toBeVisible();

  test.skip(today.getHours() < 9, 'Antes de las 9 el recordatorio de hoy queda programado para más tarde');

  // El job del servidor (cada minuto) lo dispara: aparece en la campana, descifrado
  await expect(async () => {
    await page.keyboard.press('Escape'); // cerrar el menú si quedó abierto del intento anterior
    await page.getByTestId('bell').click();
    await expect(page.locator('[data-notification="Confirmá «Internet»"]')).toBeVisible({ timeout: 4_000 });
  }).toPass({ timeout: 120_000, intervals: [5_000] });
  await expect(page.locator('[data-notification="Confirmá «Internet»"]')).toContainText('Revisá el monto de este mes');
  await page.getByRole('menuitem', { name: 'Marcar todas como leídas' }).click();
});
