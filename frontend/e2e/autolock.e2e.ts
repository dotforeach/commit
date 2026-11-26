import { expect, test } from '@playwright/test';
import { registerViaUi, unlock } from './helpers';

test('bloqueo por inactividad y Argon2 en un Web Worker', async ({ page }) => {
  test.setTimeout(120_000);
  // Bloqueo a los 3 segundos (0,05 min) para no esperar 15 minutos en el test.
  await page.addInitScript(() => localStorage.setItem('finanzas.autoLockMinutes', '0.05'));
  const workers: string[] = [];
  page.on('worker', (w) => workers.push(w.url()));

  const passphrase = 'clave de descifrado de bloqueo';
  await registerViaUi(page, { name: 'Nico Bloqueo', email: `e2e-lock-${Date.now()}@example.com`, password: 'contraseña-de-ingreso-1', passphrase });
  expect(workers.some((u) => /worker/.test(u))).toBe(true); // la derivación corrió en un Web Worker

  // Sin tocar nada: se bloquea solo y explica por qué
  await expect(page).toHaveURL(/\/desbloquear$/, { timeout: 40_000 });
  await expect(page.getByTestId('auto-locked')).toContainText('sin actividad');
  await expect(page.getByRole('link', { name: 'Cuentas' })).toHaveCount(0);

  // Desbloquear vuelve a funcionar (y el próximo bloqueo se reprograma)
  await unlock(page, passphrase);
  await expect(page).toHaveURL(/\/inicio$/, { timeout: 15_000 });
  await expect(page).toHaveURL(/\/desbloquear$/, { timeout: 40_000 });
});
