import { expect, test, type Page } from '@playwright/test';
import { createAccount, pick, registerViaUi } from './helpers';

async function expense(page: Page, amount: string, category: string, description: string) {
  await page.getByRole('button', { name: 'Nuevo movimiento' }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByLabel('Monto', { exact: true }).fill(amount);
  await pick(page, 'Cuenta', 'Banco · USD');
  await pick(page, 'Categoría', category);
  await dialog.getByLabel('Descripción').fill(description);
  await dialog.getByRole('button', { name: 'Guardar' }).click();
  await expect(page.locator(`li[data-tx="${description}"]`)).toBeVisible();
}

const item = (page: Page, name: string) => page.locator(`li[data-budget-item="${name}"]`);

test('presupuesto: por categoría, alertas, sin presupuesto, sobres y copia al mes siguiente', async ({ page }) => {
  await registerViaUi(page, {
    name: 'Fer Presupuesto',
    email: `e2e-budget-${Date.now()}@example.com`,
    password: 'contraseña-de-ingreso-1',
    passphrase: 'clave de descifrado de presupuesto',
  });
  await page.getByRole('link', { name: 'Cuentas' }).click();
  await createAccount(page, { name: 'Banco', type: 'Cuenta bancaria', initial: '0' });

  await page.getByRole('link', { name: 'Movimientos' }).click();
  await expense(page, '85,000', 'Supermercado', 'Súper');
  await expense(page, '25,000', 'Salidas y delivery', 'Pizza');
  await expense(page, '3,000', 'Transporte', 'SUBE');

  // Armar el presupuesto por categoría
  await page.getByRole('link', { name: 'Presupuesto', exact: true }).click();
  await expect(page.getByText('Este mes no tiene presupuesto')).toBeVisible();
  await page.getByRole('button', { name: 'Armar presupuesto' }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByLabel('Límite para Supermercado').fill('100,000');
  await dialog.getByLabel('Límite para Salidas y delivery').fill('20,000');
  await expect(dialog.getByText('Asignado: $120,000.00')).toBeVisible();
  await dialog.getByRole('button', { name: 'Guardar' }).click();
  await expect(dialog).toHaveCount(0);

  await expect(item(page, 'Supermercado')).toHaveAttribute('data-status', 'warning'); // 85% ≥ 80%
  await expect(item(page, 'Supermercado')).toContainText('$85,000.00 / $100,000.00 · 85%');
  await expect(item(page, 'Supermercado')).toContainText('Quedan $15,000.00');
  await expect(item(page, 'Salidas y delivery')).toHaveAttribute('data-status', 'over');
  await expect(item(page, 'Salidas y delivery')).toContainText('Te pasaste $5,000.00');
  await expect(page.getByText('Gastos sin presupuesto: $3,000.00')).toBeVisible();
  await expect(page.getByTestId('budget-summary')).toContainText('Gastaste $110,000.00 de $120,000.00');

  // Resumen en el inicio
  await page.getByRole('link', { name: 'Inicio' }).click();
  await expect(page.getByTestId('home-budget')).toContainText('Gastaste $110,000.00 de $120,000.00');
  await expect(page.getByTestId('home-budget')).toContainText('1 categorías se pasaron del presupuesto');

  // Cambiar a sobres con ingreso esperado
  await page.getByRole('link', { name: 'Presupuesto', exact: true }).click();
  await page.getByRole('button', { name: 'Editar' }).click();
  await pick(page, 'Método', 'Sobres');
  await dialog.getByLabel('Ingreso esperado del mes').fill('200,000');
  await dialog.getByRole('button', { name: 'Guardar' }).click();
  await expect(page.getByTestId('unassigned')).toHaveText('Te quedan $80,000.00 por asignar');

  // Mes siguiente: copiar el presupuesto
  await page.getByRole('button', { name: 'Mes siguiente' }).click();
  await expect(page.getByText('Este mes no tiene presupuesto')).toBeVisible();
  await page.getByRole('button', { name: /^Copiar el de/ }).click();
  await expect(item(page, 'Supermercado')).toContainText('$0.00 / $100,000.00');
  await expect(page.getByTestId('unassigned')).toHaveText('Te quedan $80,000.00 por asignar');

  // Eliminar el del mes siguiente
  await page.getByRole('button', { name: 'Eliminar presupuesto' }).click();
  await page.getByRole('alertdialog').getByRole('button', { name: 'Eliminar' }).click();
  await expect(page.getByText('Este mes no tiene presupuesto')).toBeVisible();
});
