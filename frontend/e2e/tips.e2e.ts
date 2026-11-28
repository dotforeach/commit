import { expect, test } from '@playwright/test';

test('Aprende: consejos rápidos por tema (al menos 5 cada uno) con enlace al artículo', async ({ page }) => {
  await page.goto('/aprende');
  const tips = page.getByTestId('tips');
  await expect(tips.locator('[data-tip]')).toHaveCount(24);
  for (const topic of ['personal', 'deudas', 'pareja', 'inversion']) {
    expect(await tips.locator(`[data-tip="${topic}"]`).count()).toBeGreaterThanOrEqual(5);
  }
  // El filtro de tema también filtra los consejos
  await page.getByRole('option', { name: 'Deudas y crédito' }).click();
  await expect(tips.locator('[data-tip]')).toHaveCount(6);
  await expect(tips.locator('[data-tip="deudas"]')).toHaveCount(6);
  // "Leer más" lleva al artículo
  await tips.getByRole('link', { name: 'Leer más' }).first().click();
  await expect(page).toHaveURL(/\/aprende\/tarjeta-minimo-vs-total$/);
});
