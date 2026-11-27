import { expect, test } from '@playwright/test';

test('estado: diagrama en vivo con el estado real de cada componente', async ({ page }) => {
  await page.goto('/estado');
  for (const id of ['browser', 'frontend', 'backend', 'postgres', 'redis', 'queues']) {
    await expect(page.locator(`[data-node="${id}"]`)).toHaveAttribute('data-state', 'up');
  }
  // Lo no configurado se muestra desactivado (no caído)
  await expect(page.locator('[data-node="whatsapp"]')).toHaveAttribute('data-state', /disabled|configured/);
  // Detalles al tocar un componente
  await page.locator('[data-node="postgres"]').click();
  await expect(page.getByTestId('status-details')).toContainText('PostgreSQL');
  await expect(page.getByTestId('status-details')).toContainText('migrations');
  // Se refresca solo
  const first = await page.locator('.foot').innerText();
  await expect.poll(() => page.locator('.foot').innerText(), { timeout: 15_000 }).not.toBe(first);
});
