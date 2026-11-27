import { expect, test, type Page } from '@playwright/test';
import { createAccount, registerViaUi } from './helpers';

/**
 * La fuente de íconos está recortada (scripts/icons). Si a un ícono le falta su ligadura, se ve su
 * nombre como texto ("account_balance_wallet") y el elemento queda mucho más ancho que un ícono.
 */
async function expectIconsRendered(page: Page, where: string) {
  await page.evaluate(() => document.fonts.ready);
  const bad = await page.evaluate(() =>
    [...document.querySelectorAll<HTMLElement>('.material-symbols-outlined')]
      .filter((el) => el.offsetParent !== null && el.textContent!.trim() !== '')
      .map((el) => {
        // Ancho de lo DIBUJADO (no del elemento: los avatares de tarjeta miden 40 px fijos)
        const range = document.createRange();
        range.selectNodeContents(el);
        return { name: el.textContent!.trim(), width: range.getBoundingClientRect().width, size: parseFloat(getComputedStyle(el).fontSize) };
      })
      .filter((i) => i.width > i.size * 1.5),
  );
  expect(bad, `íconos que se ven como texto en ${where}`).toEqual([]);
}

test('íconos: la fuente recortada dibuja todos los íconos de la app', async ({ page }) => {
  // La fuente servida es la recortada
  const fonts: string[] = [];
  page.on('response', (r) => r.url().endsWith('.woff2') && fonts.push(r.url()));

  for (const path of ['/', '/aprende', '/herramientas', '/herramientas/hipoteca', '/ingresar', '/registro', '/estado']) {
    await page.goto(path);
    await expectIconsRendered(page, path);
  }
  expect(fonts.some((u) => u.includes('material-symbols-outlined-subset'))).toBe(true);
  expect(fonts.some((u) => /material-symbols-outlined-[A-Z0-9]{8}\.woff2/.test(u))).toBe(false);

  await registerViaUi(page, { name: 'Íco Nos', email: `e2e-icons-${Date.now()}@example.com`, password: 'contraseña-de-ingreso-1', passphrase: 'clave de descifrado íconos' });
  await expectIconsRendered(page, '/inicio');
  await page.getByRole('link', { name: 'Cuentas' }).click();
  await createAccount(page, { name: 'Banco', type: 'Cuenta bancaria', initial: '100' });
  for (const link of ['Cuentas', 'Movimientos', 'Presupuesto', 'Recurrentes', 'Deudas', 'Ahorro', 'Mi progreso']) {
    await page.getByRole('link', { name: link, exact: true }).first().click();
    await expectIconsRendered(page, link);
  }
  for (const path of ['/plan', '/por-revisar', '/suscripcion', '/ajustes', '/hogar', '/cotizaciones']) {
    await page.goto(path);
    await expectIconsRendered(page, path);
  }
});
