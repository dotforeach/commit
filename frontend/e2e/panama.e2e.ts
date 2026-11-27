import { expect, test } from '@playwright/test';
import { createAccount, registerViaUi } from './helpers';

test('Panamá: dólar por defecto, montos 1,234.56, fechas dd/mm/aaaa y cotizaciones sin lo argentino', async ({ page }) => {
  await registerViaUi(page, { name: 'Pana Má', email: `e2e-panama-${Date.now()}@example.com`, password: 'contraseña-de-ingreso-1', passphrase: 'clave de descifrado panamá' });

  // Montos en formato de Panamá (y tolerante con la coma decimal)
  await page.getByRole('link', { name: 'Cuentas' }).click();
  await createAccount(page, { name: 'Banco General', type: 'Cuenta bancaria', initial: '1,500.5' });
  await expect(page.locator('li[data-account="Banco General"] .value')).toHaveText('$1,500.50');
  await createAccount(page, { name: 'Yappy', type: 'Billetera virtual', initial: '20,25' });
  await expect(page.locator('li[data-account="Yappy"] .value')).toHaveText('$20.25');

  // La fecha del movimiento se muestra dd/mm/aaaa
  await page.getByRole('link', { name: 'Movimientos' }).click();
  await page.getByRole('button', { name: 'Nuevo movimiento' }).click();
  const now = new Date();
  const today = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
  await expect(page.getByRole('dialog').getByLabel('Fecha')).toHaveValue(today);
  await page.keyboard.press('Escape');

  // Inicio: patrimonio en dólares, sin mencionar tipos de dólar argentinos
  await page.getByRole('link', { name: 'Inicio' }).click();
  await expect(page.getByTestId('net-worth-total')).toHaveText('$1,520.75');
  await expect(page.getByTestId('net-worth')).not.toContainText('MEP');

  // Cotizaciones: el balboa a la par y nada del dólar argentino
  await page.getByRole('link', { name: 'Cotizaciones' }).click();
  await expect(page.getByTestId('my-rates')).toContainText('Tus monedas en USD');
  await expect(page.locator('li[data-rate="PAB"]')).toContainText('$1.00');
  await expect(page.getByTestId('ars-rates')).toHaveCount(0);
});
