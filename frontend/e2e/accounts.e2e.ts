import { expect, test } from '@playwright/test';
import { registerViaUi, unlock } from './helpers';

const passphrase = 'clave de descifrado de cuentas';

test('cuentas: alta, tarjeta, edición, archivo, borrado y todo cifrado', async ({ page }) => {
  const sent: string[] = [];
  page.on('request', (r) => {
    if (r.url().includes('/api/households/')) sent.push(r.postData() ?? '');
  });

  await registerViaUi(page, {
    name: 'Caro Cuentas',
    email: `e2e-acc-${Date.now()}@example.com`,
    password: 'contraseña-de-ingreso-1',
    passphrase,
  });

  await page.getByRole('link', { name: 'Cuentas' }).click();
  await expect(page.getByText('Todavía no cargaste cuentas')).toBeVisible();

  // Cuenta bancaria con monto en formato argentino
  await page.getByRole('button', { name: 'Nueva cuenta' }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByLabel('Nombre').fill('Cuenta sueldo');
  await dialog.getByLabel('Saldo inicial').fill('150,000.5');
  await dialog.getByLabel('Banco o entidad').fill('Banco General');
  await dialog.getByRole('button', { name: 'Guardar' }).click();
  const sueldo = page.locator('li[data-account="Cuenta sueldo"]');
  await expect(sueldo).toContainText('$150,000.50');
  await expect(sueldo).toContainText('Cuenta bancaria · Banco General');

  // Monto inválido: no deja guardar
  await page.getByRole('button', { name: 'Nueva cuenta' }).click();
  await dialog.getByLabel('Nombre').fill('Mala');
  await dialog.getByLabel('Saldo inicial').fill('12,34,5');
  await dialog.getByLabel('Nombre').click();
  await expect(dialog.getByText('Monto inválido')).toBeVisible();
  await expect(dialog.getByRole('button', { name: 'Guardar' })).toBeDisabled();
  await dialog.getByRole('button', { name: 'Cancelar' }).click();

  // Tarjeta de crédito en dólares
  await page.getByRole('button', { name: 'Nueva cuenta' }).click();
  await dialog.getByLabel('Nombre').fill('Visa Galicia');
  await dialog.getByRole('combobox', { name: 'Tipo' }).click();
  await page.getByRole('option', { name: 'Tarjeta de crédito' }).click();
  await dialog.getByRole('combobox', { name: 'Moneda' }).click();
  await page.getByRole('option', { name: 'USD · Dólar estadounidense' }).click();
  await dialog.getByLabel('Deuda actual').fill('320.75');
  await dialog.getByLabel('Últimos 4 dígitos').fill('4321');
  await dialog.getByLabel('Límite de compra').fill('2,000');
  await dialog.getByLabel('Día de cierre').fill('24');
  await dialog.getByLabel('Día de vencimiento').fill('6');
  await dialog.getByRole('button', { name: 'Guardar' }).click();
  const visa = page.locator('li[data-account="Visa Galicia"]');
  await expect(visa).toContainText('$320.75');
  await expect(visa).toContainText('•••• 4321');
  await expect(visa).toContainText('cierra el 24, vence el 6');

  // Editar
  await sueldo.getByRole('button', { name: 'Acciones de Cuenta sueldo' }).click();
  await page.getByRole('menuitem', { name: 'Editar' }).click();
  await dialog.getByLabel('Nombre').fill('Cuenta sueldo BNA');
  await dialog.getByRole('button', { name: 'Guardar' }).click();
  const sueldoBna = page.locator('li[data-account="Cuenta sueldo BNA"]');
  await expect(sueldoBna).toBeVisible();

  // Archivar y ver archivadas
  await visa.getByRole('button', { name: 'Acciones de Visa Galicia' }).click();
  await page.getByRole('menuitem', { name: 'Archivar' }).click();
  await expect(page.getByRole('button', { name: 'Archivadas (1)' })).toBeVisible();
  await expect(visa).toHaveCount(0);
  await page.getByRole('button', { name: 'Archivadas (1)' }).click();
  await expect(visa).toBeVisible();

  // Eliminar (cancelar primero, después confirmar)
  await sueldoBna.getByRole('button', { name: 'Acciones de Cuenta sueldo BNA' }).click();
  await page.getByRole('menuitem', { name: 'Eliminar' }).click();
  await page.getByRole('alertdialog').getByRole('button', { name: 'Cancelar' }).click();
  await expect(sueldoBna).toBeVisible();
  await sueldoBna.getByRole('button', { name: 'Acciones de Cuenta sueldo BNA' }).click();
  await page.getByRole('menuitem', { name: 'Eliminar' }).click();
  await page.getByRole('alertdialog').getByRole('button', { name: 'Eliminar' }).click();
  await expect(sueldoBna).toHaveCount(0);

  // Bloquear: se borran los datos descifrados; al desbloquear vuelven
  await page.getByRole('button', { name: 'Bloquear' }).click();
  await expect(page.getByRole('link', { name: 'Cuentas' })).toHaveCount(0);
  await unlock(page, passphrase);
  await expect(page).toHaveURL(/\/inicio$/, { timeout: 15_000 });
  await page.getByRole('link', { name: 'Cuentas' }).click();
  await page.getByRole('button', { name: 'Archivadas (1)' }).click();
  await expect(visa).toContainText('$320.75');

  // Nada sensible viajó en claro
  const all = sent.join('\n');
  for (const secret of ['Cuenta sueldo', 'Banco General', 'Visa Galicia', '4321', '150000', '320.75', '2000']) {
    expect(all).not.toContain(secret);
  }
});
