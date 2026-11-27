import { expect, test } from '@playwright/test';

test('impuestos: neto, tabla por rangos (valores de referencia) y quincenal', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('landing-tax').click();
  await expect(page).toHaveURL(/\/herramientas\/impuestos$/);

  // Salario propio: $1,000 → ISR 23.08, SS 97.50, SE 12.50 → neto $866.92
  await page.getByTestId('tax-salary').fill('1,000');
  await expect(page.getByTestId('tax-net')).toContainText('$866.92');
  await expect(page.getByTestId('tax-total')).toContainText('-$133.08');

  // Tabla 600 a 2,000 cada 100: 15 filas; la de $900 coincide con la pantalla de referencia
  const table = page.getByTestId('tax-table');
  await expect(table.locator('tbody tr')).toHaveCount(15);
  const row900 = table.locator('tbody tr', { hasText: '$900.00' });
  await expect(row900).toContainText('$792.92');
  await expect(row900).toContainText('-$107.08');
  await expect(row900).toContainText('-$8.08');

  // Quincenal: la mitad
  await page.getByTestId('tax-period').selectOption('biweekly');
  await expect(table.locator('tbody tr').first()).toContainText('$267.00');

  // Rango inválido
  await page.getByTestId('tax-to').fill('100');
  await expect(page.getByTestId('tax-empty')).toBeVisible();

  // En el celular la página no se sale (la tabla se desplaza dentro de su caja)
  await page.setViewportSize({ width: 390, height: 844 });
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
});

test('fintech: pública, destacadas primero, filtros y fuentes', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('landing-fintech').click();
  await expect(page).toHaveURL(/\/fintech$/);

  const cards = page.locator('[data-fintech]');
  await expect(cards).toHaveCount(8);
  // Las pedidas van primero
  await expect(cards.nth(0)).toHaveAttribute('data-fintech', 'lulubit');
  await expect(page.locator('[data-fintech="lulubit"]')).toContainText('PIX');
  await expect(page.locator('[data-fintech="arka"]')).toContainText('lo afirma la empresa');

  // Filtro por categoría
  await page.locator('[data-filter="crypto"]').click();
  await expect(cards).toHaveCount(1);
  await page.locator('[data-filter="investing"]').click();
  await expect(cards).toHaveCount(3);
  await page.locator('[data-filter="all"]').click();
  await expect(cards).toHaveCount(8);

  // Cada tarjeta tiene sitio oficial y fuentes que abren en otra pestaña
  for (const card of await cards.all()) {
    await expect(card.locator('footer a[target="_blank"]').first()).toHaveAttribute('href', /^https:\/\//);
  }
  await expect(page.getByText('Cómo verificar una fintech')).toBeVisible();

  await page.setViewportSize({ width: 390, height: 844 });
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
});
