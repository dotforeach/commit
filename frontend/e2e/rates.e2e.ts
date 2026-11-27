import { expect, test } from '@playwright/test';
import { createAccount, pick, registerViaUi, unlock } from './helpers';

test('cotizaciones: manual con prioridad, patrimonio neto consolidado y presupuesto convertido', async ({ page }) => {
  await registerViaUi(page, {
    name: 'Iris Cotizaciones',
    email: `e2e-rates-${Date.now()}@example.com`,
    password: 'contraseña-de-ingreso-1',
    passphrase: 'clave de descifrado de cotizaciones',
    currency: 'ARS', // referente: hogar en pesos argentinos (aparece lo del dólar MEP/blue)
  });
  await page.getByRole('link', { name: 'Cuentas' }).click();
  await createAccount(page, { name: 'Banco', type: 'Cuenta bancaria', initial: '1,000,000' });
  await createAccount(page, { name: 'Dólares', type: 'Caja de ahorro', currency: 'USD · Dólar estadounidense', initial: '1,000' });
  await createAccount(page, { name: 'Visa', type: 'Tarjeta de crédito', initial: '200,000', label: 'Deuda actual' });

  // Cotización propia: 1 USD = $1.500 (MEP)
  await page.getByRole('link', { name: 'Inicio' }).click();
  await page.getByRole('link', { name: 'Cotizaciones' }).click();
  await page.getByRole('combobox', { name: 'De', exact: true }).click();
  await page.getByRole('option', { name: 'USD', exact: true }).click();
  await page.getByLabel('Valor').fill('1,500');
  await page.getByRole('button', { name: 'Agregar' }).click();
  await expect(page.locator('li[data-manual="USD/ARS"]')).toContainText('AR$ 1,500.00');

  // Patrimonio: 1.000.000 + 1.000 × 1.500 − 200.000
  await page.getByRole('link', { name: 'Inicio' }).click();
  await expect(page.getByTestId('net-worth-total')).toHaveText('AR$ 2,300,000.00');
  await expect(page.getByTestId('net-worth')).toContainText('Debes AR$ 200,000.00');

  // Cambiar el tipo de dólar se guarda (la cotización propia sigue mandando)
  await page.getByRole('link', { name: 'Cotizaciones' }).click();
  const blue = page.locator('mat-radio-button[data-usd="blue"]');
  if (await blue.count()) {
    await blue.click();
    await expect(page.getByText('Tipo de dólar actualizado')).toBeVisible();
    await page.reload();
    await unlock(page, 'clave de descifrado de cotizaciones');
    await page.getByRole('link', { name: 'Cotizaciones' }).click();
    await expect(page.locator('mat-radio-button[data-usd="blue"] input')).toBeChecked();
  }

  // Presupuesto en pesos con un gasto en dólares: se convierte
  await page.getByRole('link', { name: 'Movimientos' }).click();
  const dialog = page.getByRole('dialog');
  await page.getByRole('button', { name: 'Nuevo movimiento' }).click();
  await dialog.getByLabel('Monto', { exact: true }).fill('50');
  await pick(page, 'Cuenta', 'Dólares · USD');
  await pick(page, 'Categoría', 'Supermercado');
  await dialog.getByLabel('Descripción').fill('Compra en dólares');
  await dialog.getByRole('button', { name: 'Guardar' }).click();
  await expect(dialog).toHaveCount(0);

  await page.getByRole('link', { name: 'Presupuesto', exact: true }).click();
  await page.getByRole('button', { name: 'Armar presupuesto' }).click();
  await dialog.getByLabel('Límite para Supermercado').fill('200,000');
  await dialog.getByRole('button', { name: 'Guardar' }).click();
  await expect(page.locator('li[data-budget-item="Supermercado"]')).toContainText('AR$ 75,000.00 / AR$ 200,000.00');
});
