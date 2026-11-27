import { expect, test, type Page } from '@playwright/test';
import { createAccount, pick, registerViaUi, unlock } from './helpers';

/** Todo lo guardado en la caché local (IndexedDB), como texto. */
const cacheDump = (page: Page) =>
  page.evaluate(
    () =>
      new Promise<string>((resolve) => {
        const req = indexedDB.open('finanzas-cache', 1);
        req.onupgradeneeded = () => req.result.createObjectStore('responses');
        req.onsuccess = () => {
          const all = req.result.transaction('responses').objectStore('responses').getAll();
          all.onsuccess = () => resolve(JSON.stringify(all.result));
        };
      }),
  );

async function expense(page: Page, amount: string, description: string) {
  await page.getByRole('button', { name: 'Nuevo movimiento' }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByLabel('Monto', { exact: true }).fill(amount);
  await pick(page, 'Cuenta', 'Banco · USD');
  await dialog.getByLabel('Descripción').fill(description);
  await dialog.getByRole('button', { name: 'Guardar' }).click();
  await expect(page.locator(`li[data-tx="${description}"]`)).toBeVisible();
}

test('offline: datos cifrados en el dispositivo, lectura sin conexión, sync incremental y borrado al salir', async ({ page, context }) => {
  const passphrase = 'clave de descifrado offline';
  await registerViaUi(page, { name: 'Oli Offline', email: `e2e-offline-${Date.now()}@example.com`, password: 'contraseña-de-ingreso-1', passphrase });
  await page.getByRole('link', { name: 'Cuentas' }).click();
  await createAccount(page, { name: 'Banco', type: 'Cuenta bancaria', initial: '50,000' });
  await page.getByRole('link', { name: 'Movimientos' }).click();
  await expense(page, '1,500', 'Panadería secreta');
  await page.getByRole('link', { name: 'Cuentas' }).click();
  await expect(page.locator('li[data-account="Banco"] .value')).toHaveText('$48,500.00');

  // Lo guardado en el dispositivo está cifrado
  const dump = await cacheDump(page);
  expect(dump).toContain('"payload"');
  for (const secret of ['Panadería secreta', 'Banco', '50000', '1500']) expect(dump).not.toContain(secret);

  // Sin conexión: bloquear y desbloquear; los datos salen de la caché
  await context.setOffline(true);
  await page.getByRole('button', { name: 'Bloquear' }).click();
  await unlock(page, passphrase);
  await expect(page).toHaveURL(/\/inicio$/, { timeout: 15_000 });
  await expect(page.getByTestId('offline-banner')).toBeVisible();
  await page.getByRole('link', { name: 'Cuentas' }).click();
  await expect(page.locator('li[data-account="Banco"] .value')).toHaveText('$48,500.00');

  // Con conexión otra vez: un movimiento nuevo llega por la sincronización incremental
  await context.setOffline(false);
  await page.getByRole('link', { name: 'Movimientos' }).click();
  await expense(page, '500', 'Kiosco');
  await page.getByRole('button', { name: 'Bloquear' }).click();
  await unlock(page, passphrase);
  await page.getByRole('link', { name: 'Cuentas' }).click();
  await expect(page.locator('li[data-account="Banco"] .value')).toHaveText('$48,000.00');
  await expect(page.getByTestId('offline-banner')).toHaveCount(0);

  // Cerrar sesión borra la caché del dispositivo
  await page.getByRole('link', { name: 'Inicio' }).click();
  await page.getByRole('button', { name: 'Cerrar sesión' }).click();
  await expect(page).toHaveURL(/\/ingresar$/);
  expect(await cacheDump(page)).toBe('[]');
});
