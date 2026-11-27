import { expect, type Page } from '@playwright/test';

export const strip = (w: string) => w.normalize('NFD').replace(/\p{Diacritic}/gu, '');

export async function readPhrase(page: Page): Promise<string[]> {
  const items = page.locator('ol.phrase li');
  await expect(items).toHaveCount(24);
  await expect(items.last()).toBeVisible();
  return (await items.allTextContents()).map((t) => t.replace(/^\s*\d+\s*/, '').trim());
}

/** "Siguiente" del paso abierto (durante la animación, el del paso anterior sigue visible). */
const nextIn = (page: Page, step: string) =>
  page.getByRole('region', { name: step }).getByRole('button', { name: 'Siguiente' }).click();

/** Registra una cuenta por la UI y devuelve la frase de recuperación mostrada. */
export async function registerViaUi(
  page: Page,
  opts: { name: string; email: string; password: string; passphrase: string; currency?: string },
): Promise<string[]> {
  await page.goto('/registro');
  await page.getByLabel('Nombre').fill(opts.name);
  await page.getByLabel('Email').fill(opts.email);
  if (opts.currency) {
    await page.getByRole('combobox', { name: 'Moneda principal' }).click();
    await page.getByRole('option', { name: opts.currency, exact: true }).click();
  }
  await page.getByLabel('Contraseña de ingreso').fill(opts.password);
  await page.getByLabel('Repite la contraseña').fill(opts.password);
  await nextIn(page, 'Tu cuenta');

  await page.getByLabel('Clave de descifrado', { exact: true }).fill(opts.passphrase);
  await page.getByLabel('Repite la clave de descifrado').fill(opts.passphrase);
  await nextIn(page, 'Clave de descifrado');

  const phrase = await readPhrase(page);
  await page.getByText('Guardé mi frase de recuperación').click();
  await nextIn(page, 'Frase de recuperación');

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

/** Crea una cuenta desde la pantalla Cuentas (ya abierta). */
export async function createAccount(
  page: Page,
  a: { name: string; type?: string; currency?: string; initial: string; label?: string },
) {
  await page.getByRole('button', { name: 'Nueva cuenta' }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByLabel('Nombre').fill(a.name);
  if (a.type) {
    await dialog.getByRole('combobox', { name: 'Tipo' }).click();
    await page.getByRole('option', { name: a.type }).click();
  }
  if (a.currency) {
    await dialog.getByRole('combobox', { name: 'Moneda' }).click();
    await page.getByRole('option', { name: a.currency }).click();
  }
  await dialog.getByLabel(a.label ?? 'Saldo inicial').fill(a.initial);
  await dialog.getByRole('button', { name: 'Guardar' }).click();
  await expect(page.locator(`li[data-account="${a.name}"]`)).toBeVisible();
}

/** Selecciona una opción de un mat-select dentro del diálogo abierto. */
export async function pick(page: Page, label: string, option: string) {
  await page.getByRole('dialog').getByRole('combobox', { name: label, exact: true }).click();
  await page.getByRole('option', { name: option, exact: true }).click();
}

const MAILPIT = 'http://localhost:8025/api/v1';

/** Último correo a esa dirección con ese asunto (Mailpit, bandeja de desarrollo) y su enlace. */
export async function mailLink(page: Page, to: string, subject: RegExp): Promise<string> {
  let link = '';
  await expect
    .poll(
      async () => {
        const res = await page.request.get(`${MAILPIT}/search?query=${encodeURIComponent(`to:"${to}"`)}`);
        const { messages } = (await res.json()) as { messages: { ID: string; Subject: string }[] };
        const m = messages.find((x) => subject.test(x.Subject));
        if (!m) return '';
        const full = (await (await page.request.get(`${MAILPIT}/message/${m.ID}`)).json()) as { Text: string };
        link = /https?:\/\/\S+token=[\w-]+/.exec(full.Text)?.[0] ?? '';
        return link;
      },
      { timeout: 15_000 },
    )
    .not.toBe('');
  return link.replace(/^https?:\/\/[^/]+/, ''); // mismo origen que el test
}

/** Confirma el correo siguiendo el enlace que llegó a Mailpit. */
export async function verifyEmail(page: Page, email: string) {
  await page.goto(await mailLink(page, email, /Confirma tu correo/));
  await expect(page.getByTestId('link-ok')).toBeVisible();
}
