import { expect, test, type Page } from '@playwright/test';
import { createAccount, pick, registerViaUi, unlock } from './helpers';

const passphrase = 'clave de descifrado de recurrentes';

/** Día 1 del mes actual desplazado `delta` meses, como lo muestra la app (d/M/aaaa). */
function firstOfMonth(delta: number): string {
  const now = new Date();
  const d = new Date(now.getFullYear(), now.getMonth() + delta, 1);
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}

async function newRule(
  page: Page,
  r: { type: 'Gasto' | 'Ingreso'; description: string; amount: string; day: string; start: string; confirm?: boolean; salary?: boolean },
) {
  await page.getByRole('button', { name: 'Nuevo recurrente' }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('radio', { name: r.type, exact: true }).click();
  await dialog.getByLabel('Descripción').fill(r.description);
  await dialog.getByLabel('Monto', { exact: true }).fill(r.amount);
  await pick(page, 'Cuenta', 'Banco · ARS');
  await dialog.getByLabel('Día del mes').fill(r.day);
  await dialog.getByLabel('Desde').fill(r.start);
  if (r.confirm) await dialog.getByRole('radio', { name: /Pedirme confirmación/ }).click();
  if (r.salary) await dialog.getByText('Es mi sueldo').click();
  await dialog.getByRole('button', { name: 'Guardar' }).click();
  await expect(dialog).toHaveCount(0);
  await expect(page.locator(`li[data-rule="${r.description}"]`)).toBeVisible();
}

test('recurrentes: automático se pone al día, con confirmación se confirma u omite, sin duplicar', async ({ page }) => {
  // Fechas relativas a hoy, siempre el día 1: el resultado no depende del día en que corra el test.
  await registerViaUi(page, {
    name: 'Eli Recurrentes',
    email: `e2e-rec-rules-${Date.now()}@example.com`,
    password: 'contraseña-de-ingreso-1',
    passphrase,
  });
  await page.getByRole('link', { name: 'Cuentas' }).click();
  await createAccount(page, { name: 'Banco', type: 'Cuenta bancaria', initial: '0' });

  await page.getByRole('link', { name: 'Recurrentes' }).click();
  await expect(page.getByText('Todavía no tenés recurrentes')).toBeVisible();

  // Sueldo automático desde hace dos meses: se registran los tres de una vez.
  await newRule(page, { type: 'Ingreso', description: 'Sueldo', amount: '800.000', day: '1', start: firstOfMonth(-2), salary: true });
  await expect(page.getByText('Se registraron 3 movimientos recurrentes')).toBeVisible();
  const sueldo = page.locator('li[data-rule="Sueldo"]');
  await expect(sueldo).toContainText('Todos los meses, el día 1');
  await expect(sueldo).toContainText(`Próximo: ${firstOfMonth(1)}`);
  await expect(sueldo).toContainText('+$ 800.000,00');

  // Luz con confirmación desde el mes pasado: queda pendiente la del mes pasado (y la de este).
  await newRule(page, { type: 'Gasto', description: 'Luz', amount: '25.000', day: '1', start: firstOfMonth(-1), confirm: true });
  const pending = page.locator('li[data-pending="Luz"]');
  await expect(pending).toContainText(firstOfMonth(-1));
  await expect(pending).toContainText('1 más después');

  // Confirmo la del mes pasado con otro monto y omito la de este mes.
  await pending.getByLabel('Monto').fill('27.500');
  await pending.getByRole('button', { name: 'Confirmar' }).click();
  await expect(pending).toContainText(firstOfMonth(0));
  await pending.getByRole('button', { name: 'Omitir' }).click();
  await expect(page.getByTestId('pending')).toHaveCount(0);

  // Movimientos: este mes tiene el sueldo pero no la luz (omitida); el anterior tiene la luz confirmada.
  await page.getByRole('link', { name: 'Movimientos' }).click();
  await expect(page.locator('mat-card[data-currency="ARS"]')).toContainText('$ 800.000,00');
  await expect(page.locator('li[data-tx="Luz"]')).toHaveCount(0);
  await page.getByRole('button', { name: 'Mes anterior' }).click();
  await expect(page.locator('li[data-tx="Luz"]')).toContainText('-$ 27.500,00');
  await expect(page.locator('li[data-tx="Sueldo"]')).toContainText('+$ 800.000,00');

  // Saldo: 3 sueldos − luz de octubre
  await page.getByRole('link', { name: 'Cuentas' }).click();
  await expect(page.locator('li[data-account="Banco"] .value')).toHaveText('$ 2.372.500,00');

  // Pausar y reanudar no carga los meses pausados: retoma desde hoy.
  await page.getByRole('link', { name: 'Recurrentes' }).click();
  await sueldo.getByRole('button', { name: 'Acciones de Sueldo' }).click();
  await page.getByRole('menuitem', { name: 'Pausar' }).click();
  await expect(page.getByText('Pausados')).toBeVisible();
  await sueldo.getByRole('button', { name: 'Acciones de Sueldo' }).click();
  await page.getByRole('menuitem', { name: 'Reanudar' }).click();
  await expect(sueldo).toContainText(`Próximo: ${firstOfMonth(1)}`);

  // Recargar y volver a entrar: el inicio reprocesa recurrentes, pero no duplica nada.
  await page.reload();
  await unlock(page, passphrase);
  await expect(page).toHaveURL(/\/inicio$/, { timeout: 15_000 });
  await page.getByRole('link', { name: 'Cuentas' }).click();
  await expect(page.locator('li[data-account="Banco"] .value')).toHaveText('$ 2.372.500,00', { timeout: 15_000 });
});
