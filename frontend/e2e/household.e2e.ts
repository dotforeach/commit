import { expect, test } from '@playwright/test';
import { createAccount, registerViaUi } from './helpers';

test('hogar compartido: invitar, aceptar, verificar huella, dar acceso, ver datos descifrados, quitar y rotar', async ({ browser }) => {
  test.setTimeout(120_000);
  const stamp = Date.now();
  const ownerEmail = `e2e-owner-${stamp}@example.com`;
  const guestEmail = `e2e-guest-${stamp}@example.com`;
  const ctxA = await browser.newContext();
  const ctxB = await browser.newContext();
  const a = await ctxA.newPage();
  const b = await ctxB.newPage();

  // Dueña: registra, carga una cuenta e invita
  await registerViaUi(a, { name: 'Lu Dueña', email: ownerEmail, password: 'contraseña-de-ingreso-1', passphrase: 'clave de descifrado de Lu' });
  await a.getByRole('link', { name: 'Cuentas' }).click();
  await createAccount(a, { name: 'Casa', type: 'Cuenta bancaria', initial: '100,000' });
  await a.getByRole('link', { name: 'Ajustes' }).click();
  await a.getByRole('link', { name: 'Mi hogar' }).click();
  await a.getByLabel('Email de la persona').fill(guestEmail);
  await a.getByRole('button', { name: 'Crear link' }).click();
  const link = await a.getByTestId('invite-link').inputValue();
  expect(link).toContain('/unirme?token=');

  // Invitado: con su propia cuenta abre el link y acepta; queda esperando acceso
  await registerViaUi(b, { name: 'Max Invitado', email: guestEmail, password: 'contraseña-de-ingreso-2', passphrase: 'clave de descifrado de Max' });
  await b.goto(link.replace(/^https?:\/\/[^/]+/, ''));
  await b.getByLabel('Clave de descifrado').fill('clave de descifrado de Max'); // tras ir a otra URL hay que desbloquear
  await b.getByRole('button', { name: 'Desbloquear' }).click();
  await expect(b).toHaveURL(/\/unirme\?token=/, { timeout: 15_000 });
  await b.getByRole('button', { name: 'Aceptar invitación' }).click();
  await expect(b.getByTestId('join-pending')).toBeVisible();
  const guestFingerprint = await b.getByTestId('join-fingerprint').innerText();

  // Dueña: ve al invitado pendiente con la MISMA huella y le da acceso
  await a.reload();
  await a.getByLabel('Clave de descifrado').fill('clave de descifrado de Lu');
  await a.getByRole('button', { name: 'Desbloquear' }).click();
  await expect(a).toHaveURL(/\/hogar$/, { timeout: 15_000 });
  const pending = a.locator(`li[data-member="${guestEmail}"]`);
  await expect(pending).toContainText('esperando acceso');
  await expect(pending.getByTestId('member-fingerprint')).toHaveText(guestFingerprint);
  await pending.getByRole('button', { name: 'Dar acceso' }).click();
  await expect(a.getByRole('alertdialog')).toContainText(guestFingerprint);
  await a.getByRole('alertdialog').getByRole('button', { name: 'Coincide, dar acceso' }).click();
  await expect(a.getByText('Acceso otorgado')).toBeVisible();
  await expect(pending).not.toContainText('esperando acceso');

  // Invitado: pasa al hogar compartido y ve los datos descifrados con la clave compartida
  await b.goto('/hogar');
  await b.getByLabel('Clave de descifrado').fill('clave de descifrado de Max');
  await b.getByRole('button', { name: 'Desbloquear' }).click();
  await expect(b).toHaveURL(/\/hogar$/, { timeout: 15_000 });
  const shared = b.locator('li[data-household="Finanzas de Lu Dueña"]');
  await expect(shared).toBeVisible();
  await shared.getByRole('button', { name: 'Usar este hogar' }).click();
  await expect(b.getByText('Cambiaste de hogar')).toBeVisible();
  await b.getByRole('link', { name: 'Cuentas' }).click();
  await expect(b.locator('li[data-account="Casa"] .value')).toHaveText('$100,000.00');

  // Dueña: lo quita (se rota la clave) y sigue leyendo lo viejo y lo nuevo
  await a.locator(`li[data-member="${guestEmail}"]`).getByRole('button', { name: 'Quitar a Max Invitado' }).click();
  await a.getByRole('alertdialog').getByRole('button', { name: 'Quitar' }).click();
  await expect(a.getByText('Miembro quitado y clave del hogar renovada')).toBeVisible();
  await a.getByRole('link', { name: 'Cuentas' }).click();
  await expect(a.locator('li[data-account="Casa"]')).toBeVisible();
  await createAccount(a, { name: 'Después de rotar', type: 'Efectivo', initial: '5,000' });
  await expect(a.locator('li[data-account="Después de rotar"] .value')).toHaveText('$5,000.00');

  // Invitado: al volver a entrar ya no tiene ese hogar (vuelve al suyo)
  await b.reload();
  await b.getByLabel('Clave de descifrado').fill('clave de descifrado de Max');
  await b.getByRole('button', { name: 'Desbloquear' }).click();
  await expect(b).toHaveURL(/\/cuentas$/, { timeout: 15_000 });
  await expect(b.locator('li[data-account="Casa"]')).toHaveCount(0);

  await ctxA.close();
  await ctxB.close();
});
