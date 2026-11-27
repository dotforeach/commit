import { expect, test, type Page } from '@playwright/test';
import { createAccount, pick, registerViaUi } from './helpers';

const balanceOf = (page: Page, name: string) => page.locator(`li[data-account="${name}"] .value`);

/** Día 1 del mes anterior, como lo escribe el usuario (d/M/aaaa). */
function firstOfPreviousMonth() {
  const n = new Date();
  const d = new Date(n.getFullYear(), n.getMonth() - 1, 1);
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}

test('ahorro: fondo de emergencia sugerido, metas, plazo fijo e inversiones', async ({ page }) => {
  const sent: string[] = [];
  page.on('request', (r) => {
    if (/\/(goals|deposits|investments)/.test(r.url())) sent.push(r.postData() ?? '');
  });

  await registerViaUi(page, {
    name: 'Hugo Ahorro',
    email: `e2e-savings-${Date.now()}@example.com`,
    password: 'contraseña-de-ingreso-1',
    passphrase: 'clave de descifrado de ahorro',
  });
  await page.getByRole('link', { name: 'Cuentas' }).click();
  await createAccount(page, { name: 'Banco', type: 'Cuenta bancaria', initial: '1,000,000' });
  await createAccount(page, { name: 'Fondo', type: 'Caja de ahorro', initial: '0' });
  await createAccount(page, { name: 'Broker', type: 'Inversiones', initial: '500,000' });

  // Gasto del mes pasado (base del fondo de emergencia) y transferencia al fondo
  await page.getByRole('link', { name: 'Movimientos' }).click();
  const dialog = page.getByRole('dialog');
  await page.getByRole('button', { name: 'Nuevo movimiento' }).click();
  await dialog.getByLabel('Monto', { exact: true }).fill('200,000');
  await pick(page, 'Cuenta', 'Banco · USD');
  await dialog.getByLabel('Fecha').fill(firstOfPreviousMonth());
  await dialog.getByLabel('Descripción').fill('Gastos del mes');
  await dialog.getByRole('button', { name: 'Guardar' }).click();
  await expect(dialog).toHaveCount(0);
  await page.getByRole('button', { name: 'Nuevo movimiento' }).click();
  await dialog.getByRole('radio', { name: 'Transferencia' }).click();
  await dialog.getByLabel('Monto que sale').fill('150,000');
  await pick(page, 'Desde', 'Banco · USD');
  await pick(page, 'Hacia', 'Fondo · USD');
  await dialog.getByLabel('Descripción').fill('Al fondo');
  await dialog.getByRole('button', { name: 'Guardar' }).click();
  await expect(dialog).toHaveCount(0);

  // Fondo de emergencia: 3 meses de gasto promedio, vinculado a la caja de ahorro
  await page.getByRole('link', { name: 'Ahorro' }).click();
  await page.getByRole('button', { name: 'Nueva meta' }).click();
  await pick(page, 'Tipo', 'Fondo de emergencia');
  await dialog.getByLabel('Nombre').fill('Fondo de emergencia');
  await dialog.getByRole('button', { name: /Usar \$600,000\.00/ }).click();
  await expect(dialog.getByLabel('Monto objetivo')).toHaveValue('600000');
  await pick(page, 'Cuenta donde está la plata (opcional)', 'Fondo');
  await dialog.getByRole('button', { name: 'Guardar' }).click();
  const fund = page.locator('mat-card[data-goal="Fondo de emergencia"]');
  await expect(fund.getByTestId('goal-current')).toHaveText('$150,000.00 / $600,000.00');
  await expect(fund).toContainText('25%');

  // Meta con aportes manuales
  await page.getByRole('button', { name: 'Nueva meta' }).click();
  await dialog.getByLabel('Nombre').fill('Vacaciones');
  await dialog.getByLabel('Monto objetivo').fill('300,000');
  await dialog.getByRole('button', { name: 'Guardar' }).click();
  const trip = page.locator('mat-card[data-goal="Vacaciones"]');
  await trip.getByRole('button', { name: 'Aportar' }).click();
  await dialog.getByLabel('Monto (negativo para retirar)').fill('100,000');
  await dialog.getByRole('button', { name: 'Guardar' }).click();
  await expect(trip.getByTestId('goal-current')).toHaveText('$100,000.00 / $300,000.00');
  await expect(trip.getByTestId('goal-plan')).toHaveText('Te faltan $200,000.00');

  // Plazo fijo: 500.000 al 36,5% por 30 días → 15.000 de interés
  await page.getByRole('tab', { name: 'Plazos fijos' }).click();
  await page.getByRole('button', { name: 'Nuevo plazo fijo' }).click();
  await dialog.getByLabel('Banco').fill('Banco Provincia');
  await dialog.getByLabel('Capital').fill('500,000');
  await dialog.getByLabel('Tasa anual').fill('36.5');
  await pick(page, 'Sale de la cuenta', 'Banco · USD');
  await expect(dialog.getByTestId('deposit-projection')).toHaveText('En 30 días ganas $15,000.00: cobras $515,000.00');
  await dialog.getByRole('button', { name: 'Constituir' }).click();
  const deposit = page.locator('mat-card[data-deposit="Banco Provincia"]');
  await expect(deposit.getByTestId('deposit-line')).toContainText('faltan 30 días');
  await deposit.getByRole('button', { name: 'Cobrar' }).click();
  await expect(dialog.getByLabel('Interés acreditado')).toHaveValue('15000');
  await dialog.getByRole('button', { name: 'Cobrar' }).click();
  await expect(deposit).toContainText('Cobrado');

  // Inversiones: compra, precio, venta parcial
  await page.getByRole('tab', { name: 'Inversiones' }).click();
  await page.getByRole('button', { name: 'Nueva operación' }).click();
  await dialog.getByLabel('Símbolo').fill('aapl');
  await dialog.getByLabel('Nombre').fill('Apple CEDEAR');
  await dialog.getByLabel('Cantidad').fill('10');
  await dialog.getByLabel('Precio unitario').fill('15,000');
  await dialog.getByLabel('Comisiones').fill('500');
  await expect(dialog.getByTestId('trade-cash')).toHaveText('Sale $150,500.00 de la cuenta');
  await dialog.getByRole('button', { name: 'Guardar' }).click();
  await expect(dialog).toHaveCount(0);
  const aapl = page.locator('tr[data-holding="AAPL"]');
  await expect(aapl.getByTestId('holding-value')).toHaveText('sin precio');

  await aapl.getByRole('button', { name: 'Actualizar precio' }).click();
  await dialog.getByLabel('Precio (USD)').fill('18,000');
  await dialog.getByRole('button', { name: 'Guardar' }).click();
  await expect(aapl.getByTestId('holding-value')).toHaveText('$180,000.00');
  await expect(aapl.getByTestId('holding-unrealized')).toHaveText('$29,500.00');

  await page.getByRole('button', { name: 'Nueva operación' }).click();
  await pick(page, 'Operación', 'Venta');
  await pick(page, 'Activo', 'AAPL · Apple CEDEAR');
  await dialog.getByLabel('Cantidad').fill('4');
  await dialog.getByLabel('Precio unitario').fill('20,000');
  await dialog.getByRole('button', { name: 'Guardar' }).click();
  await expect(dialog).toHaveCount(0);
  // costo promedio 15.050 → realizada 4 × (20.000 − 15.050) = 19.800; quedan 6 a 18.000
  await expect(aapl.getByTestId('holding-realized')).toHaveText('$19,800.00');
  await expect(aapl.getByTestId('holding-value')).toHaveText('$108,000.00');
  await expect(aapl.getByTestId('holding-unrealized')).toHaveText('$17,700.00');

  // Saldos: el plazo fijo y las operaciones movieron el efectivo
  await page.getByRole('link', { name: 'Cuentas' }).click();
  await expect(balanceOf(page, 'Banco')).toHaveText('$665,000.00'); // 1M − 200k − 150k − 500k + 500k + 15k
  await expect(balanceOf(page, 'Fondo')).toHaveText('$150,000.00');
  await expect(balanceOf(page, 'Broker')).toHaveText('$429,500.00'); // 500k − 150,5k + 80k

  const all = sent.join('\n');
  for (const secret of ['Vacaciones', 'Banco Provincia', 'AAPL', 'Apple', '600000', '500000', '18000']) expect(all).not.toContain(secret);
});
