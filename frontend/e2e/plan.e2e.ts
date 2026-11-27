import { expect, test, type Page } from '@playwright/test';
import { createAccount, pick, registerViaUi } from './helpers';

function midPreviousMonth() {
  const n = new Date();
  const d = new Date(n.getFullYear(), n.getMonth() - 1, 15);
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}

async function pastTransaction(page: Page, t: { mode: 'Gasto' | 'Ingreso'; amount: string; description: string }) {
  await page.getByRole('button', { name: 'Nuevo movimiento' }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('radio', { name: t.mode }).click();
  await dialog.getByLabel('Monto', { exact: true }).fill(t.amount);
  await pick(page, 'Cuenta', 'Banco · USD');
  await dialog.getByLabel('Fecha').fill(midPreviousMonth());
  await dialog.getByLabel('Descripción').fill(t.description);
  await dialog.getByRole('button', { name: 'Guardar' }).click();
  await expect(dialog).toHaveCount(0);
}

async function newDebt(page: Page, d: { name: string; amount: string; rate: string; minimum: string }) {
  await page.getByRole('button', { name: 'Nueva deuda' }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByLabel('Nombre').fill(d.name);
  await dialog.getByLabel('Monto original').fill(d.amount);
  await dialog.getByLabel('Tasa de interés anual').fill(d.rate);
  await dialog.getByLabel('Cuota o pago mínimo').fill(d.minimum);
  await dialog.getByRole('button', { name: 'Guardar' }).click();
  await expect(dialog).toHaveCount(0);
}

const steps = (page: Page) => page.locator('li[data-step]');

test('plan mágico: prioridades, inflación (cifrada) que cambia la recomendación e impacto', async ({ page }) => {
  await registerViaUi(page, { name: 'Maga Plan', email: `e2e-plan-${Date.now()}@example.com`, password: 'contraseña-de-ingreso-1', passphrase: 'clave de descifrado del plan' });
  await page.getByRole('link', { name: 'Cuentas' }).click();
  await createAccount(page, { name: 'Banco', type: 'Cuenta bancaria', initial: '0' });
  await page.getByRole('link', { name: 'Movimientos' }).click();
  await pastTransaction(page, { mode: 'Ingreso', amount: '1,000,000', description: 'Sueldo' });
  await pastTransaction(page, { mode: 'Gasto', amount: '200,000', description: 'Gastos del mes' });

  await page.getByRole('link', { name: 'Deudas' }).click();
  await newDebt(page, { name: 'Préstamo caro', amount: '300,000', rate: '90', minimum: '20,000' });
  await newDebt(page, { name: 'Préstamo barato', amount: '200,000', rate: '20', minimum: '10,000' });

  // Desde Deudas se llega al plan
  await page.getByTestId('debts-plan').click();
  await expect(page).toHaveURL(/\/plan$/);
  await expect(page.getByTestId('plan-capacity')).toContainText('$800,000.00');
  // Capacidad 800.000: mínimos 30.000 · colchón 200.000 · adelantos (caro primero) · fondo completo
  await expect(steps(page)).toHaveCount(5);
  expect(await steps(page).evaluateAll((els) => els.map((e) => e.getAttribute('data-step')))).toEqual(['minimums', 'miniFund', 'prepay', 'prepay', 'fullFund']);
  await expect(steps(page).nth(2)).toContainText('Adelanta $280,000.00 a «Préstamo caro»');
  await expect(steps(page).nth(3)).toContainText('«Préstamo barato»');
  // Al 90% anual, el interés ($22,500/mes) supera la cuota mínima: con solo mínimos no se termina nunca
  await expect(page.getByTestId('plan-impact')).toContainText('no terminarías nunca');
  await expect(page.getByTestId('plan-impact')).toContainText('sales en 2 meses');

  // Con 3% de inflación mensual, el préstamo al 20% se licúa: no conviene adelantarlo
  await page.getByTestId('plan-inflation').fill('3');
  await page.getByRole('button', { name: 'Guardar' }).click();
  const dont = page.locator('li[data-step="dontPrepay"]');
  await expect(dont).toContainText('Préstamo barato');
  await expect(page.locator('li[data-step="prepay"]')).toHaveCount(1);

  // Queda guardada cifrada: no aparece en claro en el dispositivo y se recuerda al volver
  const stored = await page.evaluate(() => Object.keys(localStorage).filter((k) => k.startsWith('commit.plan.')).map((k) => localStorage.getItem(k)).join());
  expect(stored).toContain('payload');
  expect(stored).not.toContain('monthlyInflation');
  await page.getByRole('link', { name: 'Inicio' }).click();
  await page.getByTestId('home-plan').getByRole('link', { name: /Ver mi plan/ }).click();
  await expect(page.getByTestId('plan-inflation')).toHaveValue('3');
  await expect(dont).toContainText('Préstamo barato');
});
