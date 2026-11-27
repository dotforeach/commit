import { expect, test, type Page } from '@playwright/test';
import { registerViaUi } from './helpers';

const noHorizontalScroll = async (page: Page) =>
  expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);

test('celular: barra inferior, panel "Más" y nada se sale de la pantalla', async ({ page }) => {
  await registerViaUi(page, { name: 'Celu Responsive', email: `e2e-responsive-${Date.now()}@example.com`, password: 'contraseña-de-ingreso-1', passphrase: 'clave de descifrado responsive' });

  // En escritorio: menú arriba, sin barra inferior
  await expect(page.getByTestId('bottom-nav')).toBeHidden();

  await page.setViewportSize({ width: 390, height: 844 });
  const nav = page.getByTestId('bottom-nav');
  await expect(nav).toBeVisible();
  await expect(page.locator('mat-toolbar .nav')).toBeHidden();

  for (const [link, url] of [['Movimientos', /\/movimientos$/], ['Presupuesto', /\/presupuesto$/], ['Deudas', /\/deudas$/], ['Inicio', /\/inicio$/]] as const) {
    await nav.getByRole('link', { name: link }).click();
    await expect(page).toHaveURL(url);
    await expect(nav.getByRole('link', { name: link })).toHaveAttribute('aria-current', 'page');
    await noHorizontalScroll(page);
  }

  // "Más": abre el panel, navega y se cierra; queda marcado como activo
  for (const [link, url] of [['Mi progreso', /\/progreso$/], ['Recurrentes', /\/recurrentes$/], ['Ahorro', /\/ahorro$/], ['Cuentas', /\/cuentas$/], ['Plan mágico', /\/plan$/]] as const) {
    await page.getByTestId('nav-more').click();
    await page.locator('#nav-more-panel').getByRole('link', { name: link }).click();
    await expect(page).toHaveURL(url);
    await expect(page.locator('#nav-more-panel')).toHaveCount(0);
    await expect(page.getByTestId('nav-more')).toHaveClass(/active/);
    await noHorizontalScroll(page);
  }

  // Escape cierra el panel sin navegar
  await page.getByTestId('nav-more').click();
  await expect(page.locator('#nav-more-panel')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('#nav-more-panel')).toHaveCount(0);

  await page.getByRole('link', { name: 'Ajustes' }).click();
  await noHorizontalScroll(page);

  // En un diálogo, los pares de campos se apilan (las etiquetas no se cortan)
  await nav.getByRole('link', { name: 'Deudas' }).click();
  await page.getByRole('button', { name: 'Nueva deuda' }).click();
  const dialog = page.getByRole('dialog');
  const rate = await dialog.getByLabel('Tasa de interés anual').boundingBox();
  const type = await dialog.getByLabel('Tipo de tasa').boundingBox();
  expect(type!.y).toBeGreaterThan(rate!.y + 10);
});
