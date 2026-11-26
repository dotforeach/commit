import { expect, type Page } from '@playwright/test';

export const strip = (w: string) => w.normalize('NFD').replace(/\p{Diacritic}/gu, '');

export async function readPhrase(page: Page): Promise<string[]> {
  const items = page.locator('ol.phrase li');
  await expect(items).toHaveCount(24);
  await expect(items.last()).toBeVisible();
  return (await items.allTextContents()).map((t) => t.replace(/^\s*\d+\s*/, '').trim());
}

/** Registra una cuenta por la UI y devuelve la frase de recuperación mostrada. */
export async function registerViaUi(
  page: Page,
  opts: { name: string; email: string; password: string; passphrase: string },
): Promise<string[]> {
  await page.goto('/registro');
  await page.getByLabel('Nombre').fill(opts.name);
  await page.getByLabel('Email').fill(opts.email);
  await page.getByLabel('Contraseña de ingreso').fill(opts.password);
  await page.getByLabel('Repetí la contraseña').fill(opts.password);
  await page.getByRole('button', { name: 'Siguiente' }).first().click();

  await page.getByLabel('Clave de descifrado', { exact: true }).fill(opts.passphrase);
  await page.getByLabel('Repetí la clave de descifrado').fill(opts.passphrase);
  await page.getByRole('button', { name: 'Siguiente' }).first().click();

  const phrase = await readPhrase(page);
  await page.getByText('Guardé mi frase de recuperación').click();
  await page.getByRole('button', { name: 'Siguiente' }).first().click();

  const fields = page.getByLabel(/Palabra n\.º \d+/);
  await expect(fields).toHaveCount(3);
  for (let i = 0; i < 3; i++) {
    const field = fields.nth(i);
    const label = await field.evaluate((el) => (el as HTMLInputElement).labels?.[0]?.textContent ?? '');
    const n = Number(label.match(/\d+/)![0]);
    await field.fill(strip(phrase[n - 1]).toUpperCase());
  }
  await page.getByRole('button', { name: 'Crear cuenta' }).click();
  await expect(page).toHaveURL(/\/inicio$/, { timeout: 30_000 });
  return phrase;
}

export async function unlock(page: Page, passphrase: string) {
  await expect(page).toHaveURL(/\/desbloquear$/);
  await page.getByLabel('Clave de descifrado').fill(passphrase);
  await page.getByRole('button', { name: 'Desbloquear' }).click();
}
