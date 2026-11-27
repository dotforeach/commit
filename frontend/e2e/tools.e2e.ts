import { expect, test } from '@playwright/test';

test('herramientas: públicas, con tasas de bancos y resultados correctos', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('landing-tools').click();
  await expect(page).toHaveURL(/\/herramientas$/);
  await expect(page.locator('[data-tool]')).toHaveCount(5);

  // Interés compuesto: 1,000 sin aportes al 12% por 1 año ≈ $1,126.83
  await page.locator('[data-tool="interes-compuesto"]').click();
  await page.getByTestId('initial').fill('1,000');
  await page.getByTestId('monthly').fill('0');
  await page.getByTestId('rate').fill('12');
  await page.getByTestId('years').fill('1');
  await expect(page.getByTestId('final')).toHaveText('$1,126.83');

  // Hipoteca: 180,000 al 6.2% (Banistmo, tarifario SBP) a 30 años ≈ $1,102.44
  await page.goto('/herramientas/hipoteca');
  await page.getByTestId('price').fill('200,000');
  await page.getByTestId('down').fill('20,000');
  await page.locator('[data-bank="Banistmo"]').click();
  await page.getByTestId('years').fill('30');
  await expect(page.getByTestId('payment')).toHaveText(/\$1,102\.4\d/);
  await expect(page.getByText('Superintendencia de Bancos')).toBeVisible();

  // Tarjeta de crédito: el pago fijo termina antes que el mínimo
  await page.goto('/herramientas/tarjeta-de-credito');
  await expect(page.getByTestId('saving')).toContainText('ahorras');

  // Débito vs. crédito: financiar cuesta, pagar el total con cashback ahorra
  await page.goto('/herramientas/tarjeta-de-debito');
  await expect(page.locator('[data-option="creditFull"]')).toContainText('-$6.00');
  await expect(page.locator('[data-option="creditFinanced"]')).toContainText('+$');

  // En el celular no se sale de la pantalla
  await page.setViewportSize({ width: 390, height: 844 });
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
});

test('modo oscuro: se activa, se recuerda al recargar y sigue al sistema por defecto', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/');
  const bg = () => page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  const light = await bg();
  // Sistema → Claro → Oscuro → Sistema
  await expect(page.locator('html')).not.toHaveAttribute('data-theme', /.+/);
  await page.getByTestId('theme-toggle').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.getByTestId('theme-toggle').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect.poll(bg).not.toBe(light);
  const dark = await bg();
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect.poll(bg).toBe(dark);
  await page.getByTestId('theme-toggle').click();
  await expect(page.locator('html')).not.toHaveAttribute('data-theme', /.+/);
  expect(await page.evaluate(() => localStorage.getItem('commit.theme'))).toBeNull();

  // Sin preferencia guardada, sigue al sistema
  await page.evaluate(() => localStorage.removeItem('commit.theme'));
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.reload();
  await expect(page.locator('html')).not.toHaveAttribute('data-theme', /.+/);
  await expect.poll(bg).toBe(dark);
});
