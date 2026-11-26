import { expect, test, type Page } from '@playwright/test';
import { createAccount, pick, registerViaUi } from './helpers';

async function newDebt(page: Page, d: { name: string; amount: string; rate?: string; term?: string; kind?: string; minimum?: string }) {
  await page.getByRole('button', { name: 'Nueva deuda' }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByLabel('Nombre').fill(d.name);
  if (d.kind) await pick(page, 'Tipo', d.kind);
  await dialog.getByLabel('Monto original').fill(d.amount);
  if (d.rate) await dialog.getByLabel('Tasa nominal anual (TNA)').fill(d.rate);
  if (d.term) await dialog.getByLabel('Plazo (meses)').fill(d.term);
  if (d.minimum) await dialog.getByLabel('Cuota o pago mínimo').fill(d.minimum);
  await dialog.getByRole('button', { name: 'Guardar' }).click();
  await expect(dialog).toHaveCount(0);
}

/** Resumen cerrado más reciente de una tarjeta con cierre el 25 (como lo calcula la app). */
function lastClosingDate(): string {
  const now = new Date();
  const openMonth = now.getDate() <= 25 ? now.getMonth() : now.getMonth() + 1;
  const d = new Date(now.getFullYear(), openMonth - 1, 25);
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}

test('deudas: préstamo, pago con capital/interés, estrategia, cuotas y resumen de tarjeta', async ({ page }) => {
  await registerViaUi(page, {
    name: 'Gabi Deudas',
    email: `e2e-debts-${Date.now()}@example.com`,
    password: 'contraseña-de-ingreso-1',
    passphrase: 'clave de descifrado de deudas',
  });
  await page.getByRole('link', { name: 'Cuentas' }).click();
  await createAccount(page, { name: 'Banco', type: 'Cuenta bancaria', initial: '2.000.000' });
  await createAccount(page, { name: 'Visa', type: 'Tarjeta de crédito', initial: '0', label: 'Deuda actual' });

  // Préstamo francés: $1.000.000, TNA 60%, 12 meses
  await page.getByRole('link', { name: 'Deudas' }).click();
  await newDebt(page, { name: 'Préstamo BNA', amount: '1.000.000', rate: '60', term: '12' });
  const loan = page.locator('li[data-debt="Préstamo BNA"]');
  await expect(loan.getByTestId('debt-balance')).toHaveText('$ 1.000.000,00');
  await expect(loan).toContainText('TNA 60%');

  // Pago: la cuota sugerida es la del cronograma y el interés del mes, el 5% del saldo
  await loan.getByRole('button', { name: 'Registrar pago' }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByLabel('Monto pagado')).toHaveValue('112825,41');
  await expect(dialog.getByLabel('Interés incluido')).toHaveValue('50000');
  await expect(dialog.getByTestId('principal')).toHaveText('Capital: 62825.41');
  await dialog.getByRole('button', { name: 'Registrar pago' }).click();
  await expect(dialog).toHaveCount(0);
  await expect(loan.getByTestId('debt-balance')).toHaveText('$ 937.174,59');
  await expect(loan).toContainText('1 de 12 cuotas');

  // Cronograma
  await loan.getByRole('button', { name: 'Acciones de Préstamo BNA' }).click();
  await page.getByRole('menuitem', { name: 'Ver cronograma' }).click();
  await expect(page.getByRole('dialog')).toContainText('$ 112.825,41');
  await page.getByRole('dialog').getByRole('button', { name: 'Cerrar' }).click();

  // Segunda deuda sin interés: aparece la estrategia
  await newDebt(page, { name: 'Tío', amount: '100.000', kind: 'Familia o amigos', minimum: '10.000' });
  const strategy = page.getByTestId('strategy');
  // Con un extra por mes, cada estrategia dirige ese extra a una deuda distinta
  await strategy.getByLabel('Extra por mes').fill('300.000');
  await expect(strategy.locator('[data-strategy="snowball"]')).toContainText('Orden: Tío → Préstamo BNA');
  await expect(strategy.locator('[data-strategy="avalanche"]')).toContainText('Orden: Préstamo BNA → Tío');

  // El pago quedó como movimiento marcado, sin opción de editar
  await page.getByRole('link', { name: 'Movimientos' }).click();
  const paymentTx = page.locator('li[data-tx="Cuota Préstamo BNA"]');
  await expect(paymentTx).toContainText('pago de deuda');
  await paymentTx.getByRole('button', { name: /^Acciones de/ }).click();
  await expect(page.getByRole('menuitem', { name: 'Editar' })).toHaveCount(0);
  await page.keyboard.press('Escape');

  // Compra en 3 cuotas con la tarjeta (hoy) y un consumo en el resumen ya cerrado
  await page.getByRole('button', { name: 'Nuevo movimiento' }).click();
  await dialog.getByLabel('Monto', { exact: true }).fill('90.000');
  await pick(page, 'Cuenta', 'Visa · ARS');
  await dialog.getByLabel('Cuotas').fill('3');
  await dialog.getByLabel('Descripción').fill('Heladera');
  await dialog.getByRole('button', { name: 'Guardar' }).click();
  await expect(page.locator('li[data-tx="Heladera"]')).toContainText('en 3 cuotas');

  await page.getByRole('button', { name: 'Nuevo movimiento' }).click();
  await dialog.getByLabel('Monto', { exact: true }).fill('12.000');
  await pick(page, 'Cuenta', 'Visa · ARS');
  await dialog.getByLabel('Fecha').fill(lastClosingDate());
  await dialog.getByLabel('Descripción').fill('Nafta');
  await dialog.getByRole('button', { name: 'Guardar' }).click();
  await expect(dialog).toHaveCount(0);

  // Resumen de la tarjeta: lo cerrado a pagar, la cuota en curso y las comprometidas
  await page.getByRole('link', { name: 'Deudas' }).click();
  const visa = page.locator('mat-card[data-card="Visa"]');
  await expect(visa.getByTestId('card-due')).toHaveText('$ 12.000,00');
  await expect(visa).toContainText('$ 30.000,00');
  await expect(visa.getByTestId('card-upcoming')).toContainText('$ 30.000,00');

  // Pagar resumen: transferencia ya armada hacia la tarjeta
  await visa.getByRole('button', { name: 'Pagar resumen' }).click();
  await expect(dialog.getByLabel('Monto que sale')).toHaveValue('12000');
  await pick(page, 'Desde', 'Banco · ARS');
  await dialog.getByRole('button', { name: 'Guardar' }).click();
  await expect(dialog).toHaveCount(0);
  await expect(visa.getByTestId('card-due')).toHaveText('$ 0,00');

  // Borrar la compra en cuotas borra el plan
  await page.getByRole('link', { name: 'Movimientos' }).click();
  await page.locator('li[data-tx="Heladera"]').getByRole('button', { name: /^Acciones de/ }).click();
  await page.getByRole('menuitem', { name: 'Eliminar' }).click();
  await page.getByRole('alertdialog').getByRole('button', { name: 'Eliminar' }).click();
  await page.getByRole('link', { name: 'Deudas' }).click();
  await expect(visa.getByTestId('card-upcoming')).not.toContainText('$ 30.000,00');

  // Deshacer el pago del préstamo: vuelve el saldo y desaparece el movimiento
  await loan.getByRole('button', { name: 'Acciones de Préstamo BNA' }).click();
  await page.getByRole('menuitem', { name: 'Deshacer el último pago' }).click();
  await expect(loan.getByTestId('debt-balance')).toHaveText('$ 1.000.000,00');
  await page.getByRole('link', { name: 'Movimientos' }).click();
  await expect(page.locator('li[data-tx="Cuota Préstamo BNA"]')).toHaveCount(0);
});
