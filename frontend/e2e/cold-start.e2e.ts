import { expect, test } from '@playwright/test';
import { registerViaUi } from './helpers';

// El backend de producción escala a cero: el primer pedido tras un rato tarda 20-30 s y el
// proxy puede responder 502 mientras arranca. La app no debe quedarse en blanco ni mandar a login.
test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });

test('arranque en frío: muestra "Conectando…", reintenta los 502 y llega a Inicio', async ({ page }) => {
  await registerViaUi(page, {
    name: 'Frío',
    email: `e2e-cold-${Date.now()}@example.com`,
    password: 'contraseña-de-ingreso-1',
    passphrase: 'clave de descifrado del frío',
  });
  await expect(page).toHaveURL(/\/inicio$/);

  // Backend dormido: los dos primeros intentos del refresh responden 502 y todo /api tarda 3 s.
  let refreshFailures = 2;
  await page.route('**/api/**', async (route) => {
    await new Promise((r) => setTimeout(r, 3000));
    if (route.request().url().endsWith('/api/auth/refresh') && refreshFailures-- > 0) {
      return route.fulfill({ status: 502, body: 'Bad Gateway' });
    }
    return route.continue();
  });
  await page.reload();

  // En vez de un espacio vacío: "Conectando…"; y nada de "Ingresar" mientras se sabe si hay sesión
  await expect(page.getByTestId('app-loading')).toBeVisible({ timeout: 2000 });
  await expect(page.getByRole('link', { name: 'Ingresar' })).toHaveCount(0);
  // Tras los reintentos explica que el servidor está despertando
  await expect(page.getByTestId('app-loading')).toContainText('Despertando el servidor', { timeout: 8000 });
  await expect(page.getByTestId('app-loading')).toContainText('No es un error');
  await expect(page.getByTestId('boot-tip')).toBeVisible(); // un consejo para la espera

  // Termina en Inicio (sesión recuperada, pestaña restaurada) sin pasar por login
  await expect(page).toHaveURL(/\/inicio$/, { timeout: 40_000 });
  await expect(page.getByTestId('app-loading')).toHaveCount(0, { timeout: 40_000 });
  await expect(page.getByTestId('home-plan')).toBeVisible();
});

test('sin backend lento la carga no se ve (no parpadea)', async ({ page }) => {
  await page.goto('/herramientas');
  await expect(page.locator('[data-tool]').first()).toBeVisible();
  await expect(page.getByTestId('app-loading')).toHaveCount(0);
});

test('visitante: la landing aparece al instante aunque el backend esté dormido', async ({ page }) => {
  await page.route('**/api/**', async (route) => {
    await new Promise((r) => setTimeout(r, 15_000));
    await route.continue();
  });
  const t0 = Date.now();
  await page.goto('/');
  await expect(page.getByTestId('landing-title')).toBeVisible({ timeout: 5000 });
  expect(Date.now() - t0).toBeLessThan(5000);
  await expect(page.getByRole('link', { name: 'Ingresar' })).toBeVisible();
});

test('index.html trae su propia pantalla de carga (antes de que arranque la app)', async ({ request }) => {
  const html = await (await request.get('/')).text();
  expect(html).toContain('Cargando Commit');
  expect(html).toContain('No es un error');
});
