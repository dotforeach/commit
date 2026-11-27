import { expect, test, type Page } from '@playwright/test';
import { createAccount, pick, registerViaUi } from './helpers';

async function newTransaction(
  page: Page,
  t: { mode?: 'Gasto' | 'Ingreso' | 'Transferencia'; amount: string; account: string; to?: string; amountIn?: string; category?: string; description: string },
) {
  await page.getByRole('button', { name: 'Nuevo movimiento' }).click();
  const dialog = page.getByRole('dialog');
  if (t.mode) await dialog.getByRole('radio', { name: t.mode }).click();
  await dialog.getByLabel(t.mode === 'Transferencia' ? 'Monto que sale' : 'Monto', { exact: true }).fill(t.amount);
  await pick(page, t.mode === 'Transferencia' ? 'Desde' : 'Cuenta', t.account);
  if (t.to) await pick(page, 'Hacia', t.to);
  if (t.amountIn) await dialog.getByLabel(/Monto que entra/).fill(t.amountIn);
  if (t.category) await pick(page, 'Categoría', t.category);
  await dialog.getByLabel('Descripción').fill(t.description);
  await dialog.getByRole('button', { name: 'Guardar' }).click();
  await expect(dialog).toHaveCount(0);
  await expect(page.locator(`li[data-tx="${t.description}"]`)).toBeVisible();
}

const balanceOf = (page: Page, name: string) => page.locator(`li[data-account="${name}"] .value`);

test('movimientos: saldos, totales, transferencia entre monedas, edición y borrado', async ({ page }) => {
  const sent: string[] = [];
  page.on('request', (r) => {
    if (r.url().includes('/transactions')) sent.push(r.postData() ?? '');
  });

  await registerViaUi(page, {
    name: 'Dani Movimientos',
    email: `e2e-tx-${Date.now()}@example.com`,
    password: 'contraseña-de-ingreso-1',
    passphrase: 'clave de descifrado de movimientos',
  });

  await page.getByRole('link', { name: 'Cuentas' }).click();
  await createAccount(page, { name: 'Banco', type: 'Cuenta bancaria', initial: '100,000' });
  await createAccount(page, { name: 'Euros', type: 'Caja de ahorro', currency: 'EUR · Euro', initial: '0' });
  await createAccount(page, { name: 'Visa', type: 'Tarjeta de crédito', initial: '0', label: 'Deuda actual' });

  await page.getByRole('link', { name: 'Movimientos' }).click();
  await expect(page.getByText('No hay movimientos en este mes.')).toBeVisible();

  await newTransaction(page, { amount: '12,345.67', account: 'Banco · USD', category: 'Supermercado', description: 'Súper del sábado' });
  await newTransaction(page, { mode: 'Ingreso', amount: '500,000', account: 'Banco · USD', category: 'Sueldo', description: 'Sueldo noviembre' });
  await newTransaction(page, {
    mode: 'Transferencia',
    amount: '120,000',
    account: 'Banco · USD',
    to: 'Euros · EUR',
    amountIn: '100',
    description: 'Compra de euros',
  });
  await newTransaction(page, { amount: '5,000', account: 'Visa · USD', category: 'Salidas y delivery', description: 'Cena' });

  // Totales del mes en dólares (la transferencia no cuenta como gasto)
  const usd = page.locator('mat-card[data-currency="USD"]');
  await expect(usd).toContainText('$500,000.00');
  await expect(usd).toContainText('$17,345.67');
  await expect(usd).toContainText('$482,654.33');
  const transfer = page.locator('li[data-tx="Compra de euros"]');
  await expect(transfer).toContainText('Banco → Euros');
  await expect(transfer).toContainText('-$120,000.00');
  await expect(transfer).toContainText('+€ 100.00');

  // Saldos calculados en el navegador
  await page.getByRole('link', { name: 'Cuentas' }).click();
  await expect(balanceOf(page, 'Banco')).toHaveText('$467,654.33'); // 100.000 − 12.345,67 + 500.000 − 120.000
  await expect(balanceOf(page, 'Euros')).toHaveText('€ 100.00');
  await expect(balanceOf(page, 'Visa')).toHaveText('$5,000.00');
  await expect(page.locator('li[data-account="Visa"]')).toContainText('deuda actual');

  // No se puede borrar una cuenta con movimientos
  await page.getByRole('button', { name: 'Acciones de Banco' }).click();
  await page.getByRole('menuitem', { name: 'Eliminar' }).click();
  await page.getByRole('alertdialog').getByRole('button', { name: 'Eliminar' }).click();
  await expect(page.getByText('Esta cuenta tiene movimientos')).toBeVisible();
  await expect(page.locator('li[data-account="Banco"]')).toBeVisible();

  // Editar el gasto
  await page.getByRole('link', { name: 'Movimientos' }).click();
  await page.getByRole('button', { name: 'Acciones de Súper del sábado' }).click();
  await page.getByRole('menuitem', { name: 'Editar' }).click();
  await page.getByRole('dialog').getByLabel('Monto', { exact: true }).fill('10,000');
  await page.getByRole('dialog').getByRole('button', { name: 'Guardar' }).click();
  await expect(page.locator('li[data-tx="Súper del sábado"]')).toContainText('-$10,000.00');

  // Borrar la transferencia: desaparecen las dos patas
  await page.getByRole('button', { name: 'Acciones de Compra de euros' }).click();
  await page.getByRole('menuitem', { name: 'Eliminar' }).click();
  await page.getByRole('alertdialog').getByRole('button', { name: 'Eliminar' }).click();
  await expect(transfer).toHaveCount(0);

  await page.getByRole('link', { name: 'Cuentas' }).click();
  await expect(balanceOf(page, 'Banco')).toHaveText('$590,000.00'); // 100.000 − 10.000 + 500.000
  await expect(balanceOf(page, 'Euros')).toHaveText('€ 0.00');

  // El mes anterior está vacío; recargar y desbloquear recalcula todo igual
  await page.getByRole('link', { name: 'Movimientos' }).click();
  await page.getByRole('button', { name: 'Mes anterior' }).click();
  await expect(page.getByText('No hay movimientos en este mes.')).toBeVisible();
  await page.reload();
  await page.getByRole('link', { name: 'Cuentas' }).click();
  await expect(balanceOf(page, 'Banco')).toHaveText('$590,000.00', { timeout: 15_000 });

  // Nada sensible viajó en claro
  const all = sent.join('\n');
  for (const secret of ['Súper del sábado', 'Sueldo noviembre', 'Compra de euros', '12345.67', '500000', '120000']) {
    expect(all).not.toContain(secret);
  }
});
