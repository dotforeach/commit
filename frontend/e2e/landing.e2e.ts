import { expect, test } from '@playwright/test';
import { registerViaUi } from './helpers';

const noHorizontalScroll = (page: import('@playwright/test').Page) =>
  expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);

test('landing y Aprendé: públicas, navegables y adaptadas al celular', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('landing-title')).toHaveText('Tus finanzas, de 0 a 100.');
  await expect(page).toHaveTitle(/Commit/);

  // Aprendé sin cuenta: filtros y lectura
  await page.getByRole('link', { name: 'Ver todas' }).click();
  await expect(page).toHaveURL(/\/aprende$/);
  await expect(page.locator('[data-article]')).toHaveCount(25);
  await page.getByRole('option', { name: 'Pareja y familia' }).click();
  await page.getByRole('option', { name: 'Avanzado' }).click();
  await expect(page.locator('[data-article]')).toHaveCount(2);
  await page.locator('[data-article="comprar-casa-hipoteca"]').click();
  await expect(page.getByTestId('article-title')).toContainText('Comprar casa');
  await expect(page).toHaveTitle(/Comprar casa.*Commit/);
  await expect(page.getByText('Llevá esto a la práctica')).toBeVisible();

  // Celular: sin scroll horizontal
  await page.setViewportSize({ width: 390, height: 844 });
  await noHorizontalScroll(page);
  await page.goto('/');
  await noHorizontalScroll(page);

  // CTA → registro; con sesión, "/" lleva a Inicio y Aprendé queda en la barra
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.getByTestId('landing-cta').click();
  await expect(page).toHaveURL(/\/registro$/);
  await registerViaUi(page, { name: 'Lan Ding', email: `e2e-landing-${Date.now()}@example.com`, password: 'contraseña-de-ingreso-1', passphrase: 'clave de descifrado landing' });
  await page.getByTestId('nav-learn').click();
  await expect(page).toHaveURL(/\/aprende$/);
  await expect(page.getByText('Llevá esto a la práctica')).toHaveCount(0);
  await page.getByRole('link', { name: 'Inicio' }).click();
  await expect(page).toHaveURL(/\/inicio$/);
});
