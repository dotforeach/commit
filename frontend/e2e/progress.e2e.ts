import { expect, test } from '@playwright/test';
import { pick, registerViaUi } from './helpers';

/** Un día del mes que nunca es hoy (así ningún recurrente se registra durante el test). */
const safeDay = String((new Date().getDate() % 28) + 1);

test('de 0 a 100: onboarding, puntaje, nivel, tips y lo que dejó armado', async ({ page }) => {
  await registerViaUi(page, {
    name: 'Juli Progreso',
    email: `e2e-progress-${Date.now()}@example.com`,
    password: 'contraseña-de-ingreso-1',
    passphrase: 'clave de descifrado de progreso',
  });

  await expect(page.getByTestId('onboarding-banner')).toBeVisible();
  await page.getByRole('link', { name: 'Primeros pasos' }).click();
  await expect(page).toHaveURL(/\/bienvenida$/);

  // 1. Sueldo (sin cuentas: crea la cuenta sueldo)
  await page.getByLabel('Saldo actual').fill('100.000');
  await page.getByLabel('Sueldo neto mensual').fill('1.000.000');
  await page.getByLabel('Día de cobro').fill(safeDay);
  await page.getByRole('region', { name: 'Tu sueldo' }).getByRole('button', { name: 'Guardar y seguir' }).click();

  // 2. Gastos fijos
  const fixed = page.getByRole('region', { name: 'Gastos fijos' });
  await fixed.getByLabel('Monto de Alquiler').fill('300.000');
  await fixed.getByLabel('Monto de Luz').fill('25.000');
  for (const input of await fixed.getByLabel('Día').all()) await input.fill(safeDay);
  await expect(fixed.getByText('Total de gastos fijos: $ 325.000,00')).toBeVisible();
  await fixed.getByRole('button', { name: 'Guardar y seguir' }).click();

  // 3. Deudas
  const debts = page.getByRole('region', { name: /Tus deudas/ });
  await debts.getByLabel('Nombre de la deuda 1').fill('Préstamo de mamá');
  await debts.getByLabel('Saldo de la deuda 1').fill('200.000');
  await debts.getByLabel('Cuota de la deuda 1').fill('20.000');
  await debts.getByRole('button', { name: 'Guardar y seguir' }).click();

  // 4. Presupuesto sugerido
  const budget = page.getByTestId('onboarding-budget');
  await expect(budget).toContainText('Necesidades (50%): $ 500.000,00 · tus gastos fijos ocupan $ 325.000,00');
  await expect(budget).toContainText('Ahorro y deudas (20%): $ 200.000,00');
  await page.getByRole('button', { name: 'Terminar y ver mi progreso' }).click();
  await expect(page).toHaveURL(/\/progreso$/, { timeout: 15_000 });

  // Puntaje: sin historial de movimientos todavía; el presupuesto (2 categorías, ninguna excedida) suma 15
  await expect(page.getByTestId('score')).toContainText('15');
  await expect(page.locator('[data-component="budget"]')).toContainText('15 / 15');
  await expect(page.locator('[data-component="debt"]')).toContainText('0 / 25');

  // Nivel 1 "Empezar": cuenta e ingreso listos, faltan movimientos
  const start = page.locator('li[data-level="start"]');
  await expect(start).toHaveClass(/current/);
  await expect(start.locator('li.ok')).toHaveCount(2);

  // Tip: armar el fondo de emergencia; al descartarlo desaparece
  const tip = page.locator('[data-tip="emergency.start"]');
  await expect(tip).toBeVisible();
  await tip.getByRole('button', { name: 'Ya está / no aplica' }).click();
  await expect(tip).toHaveCount(0);

  // Lo que dejó armado el onboarding
  await page.getByRole('link', { name: 'Recurrentes' }).click();
  for (const name of ['Sueldo', 'Alquiler', 'Luz']) await expect(page.locator(`li[data-rule="${name}"]`)).toBeVisible();
  await expect(page.locator('li[data-rule="Luz"]')).toContainText('con confirmación');
  await page.getByRole('link', { name: 'Presupuesto', exact: true }).click();
  await expect(page.getByTestId('budget-summary')).toContainText('50/30/20');
  await expect(page.locator('li[data-budget-item="Alquiler y expensas"]')).toContainText('$ 300.000,00');

  // Inicio: sin el aviso de primeros pasos y con el puntaje
  await page.getByRole('link', { name: 'Inicio' }).click();
  await expect(page.getByTestId('onboarding-banner')).toHaveCount(0);
  await expect(page.getByTestId('home-progress')).toContainText('Salud financiera: 15/100');

  // Con 5 movimientos se completa el nivel 1: se registra el logro y se pasa a "Controlar"
  await page.getByRole('link', { name: 'Movimientos' }).click();
  const dialog = page.getByRole('dialog');
  for (let i = 1; i <= 5; i++) {
    await page.getByRole('button', { name: 'Nuevo movimiento' }).click();
    await dialog.getByLabel('Monto', { exact: true }).fill(String(1000 * i));
    await pick(page, 'Cuenta', 'Cuenta sueldo · ARS');
    await dialog.getByLabel('Descripción').fill(`Gasto ${i}`);
    await dialog.getByRole('button', { name: 'Guardar' }).click();
    await expect(page.locator(`li[data-tx="Gasto ${i}"]`)).toBeVisible();
  }
  await page.getByRole('link', { name: 'Mi progreso' }).click();
  await expect(page.getByText('¡Subiste de nivel! Completaste «Empezar»')).toBeVisible();
  await expect(page.locator('li[data-level="start"]')).toHaveClass(/done/);
  await expect(page.locator('li[data-level="control"]')).toHaveClass(/current/);
  // Al volver no se repite el festejo (el logro ya está guardado)
  await expect(page.getByText('¡Subiste de nivel!')).toHaveCount(0, { timeout: 10_000 });
  await page.getByRole('link', { name: 'Inicio' }).click();
  await page.getByRole('link', { name: 'Mi progreso' }).click();
  await expect(page.locator('li[data-level="control"]')).toHaveClass(/current/);
  await page.waitForTimeout(1500);
  await expect(page.getByText('¡Subiste de nivel!')).toHaveCount(0);
});
