import { expect, test, type Page } from '@playwright/test';
import { createAccount, registerViaUi } from './helpers';

/** Simula un comprobante ya procesado (sin Meta ni IA): el backend lo sella para el usuario. */
async function devReceipt(page: Page, extraction: Record<string, unknown>) {
  const { accessToken } = await (await page.request.post('/api/auth/refresh')).json();
  const res = await page.request.post('/api/me/receipts/dev-sample', { data: extraction, headers: { Authorization: `Bearer ${accessToken}` } });
  expect(res.status()).toBe(204);
}

const receipt = {
  documentType: 'purchase',
  merchant: 'Súper 99 Vía España',
  date: new Date().toISOString().slice(0, 10),
  total: '23.40',
  currency: 'USD',
  tax: '1.53',
  paymentMethod: 'debit_card',
  cardLast4: null,
  category: 'groceries',
  items: [
    { description: 'Leche', amount: '2.10' },
    { description: 'Pan', amount: '1.75' },
  ],
  statement: null,
  confidence: 0.92,
  notes: null,
};

test('facturas: vincular WhatsApp con consentimiento, revisar la recomendación y aceptarla', async ({ page }) => {
  await registerViaUi(page, { name: 'Fac Turas', email: `e2e-receipts-${Date.now()}@example.com`, password: 'contraseña-de-ingreso-1', passphrase: 'clave de descifrado facturas' });
  await page.getByRole('link', { name: 'Cuentas' }).click();
  await createAccount(page, { name: 'Banco General', type: 'Cuenta bancaria', initial: '500' });

  // Ajustes → WhatsApp: hay que aceptar las condiciones antes de pedir el código
  await page.getByRole('link', { name: 'Ajustes' }).click();
  const card = page.getByTestId('whatsapp-card');
  await expect(card.getByTestId('wa-privacy')).toContainText('excepción al cifrado');
  await expect(card.getByTestId('wa-link')).toBeDisabled();
  await card.getByTestId('wa-consent').click();
  await card.getByTestId('wa-link').click();
  await expect(card.getByTestId('wa-code')).toHaveText(/^COMMIT-\d{6}$/);

  // Llega un comprobante (sellado para esta persona) y se revisa
  await devReceipt(page, receipt);
  await page.goto('/por-revisar');
  const item = page.locator('[data-receipt="Súper 99 Vía España"]');
  await expect(item).toContainText('$23.40');
  await expect(item.getByTestId('recommendation')).toContainText('Se pagó con tarjeta de débito.');
  await expect(item.getByTestId('recommendation')).toContainText('parece supermercado');
  await expect(item.getByTestId('account')).toContainText('Banco General');
  await expect(item.getByTestId('category')).toContainText('Supermercado');
  await item.getByTestId('accept').click();
  await expect(page.getByTestId('review-empty')).toBeVisible();

  // Quedó como movimiento; el siguiente del mismo comercio usa el historial
  await page.getByRole('link', { name: 'Movimientos' }).click();
  await expect(page.locator('li[data-tx="Súper 99 Vía España"]')).toContainText('-$23.40');
  await devReceipt(page, { ...receipt, paymentMethod: null, total: '10.00' });
  await page.goto('/por-revisar');
  await expect(page.getByTestId('recommendation')).toContainText('Así registraste tus últimas 1 compras en Súper 99 Vía España.');

  // Descartar
  await page.getByRole('button', { name: 'Descartar' }).click();
  await expect(page.getByTestId('review-empty')).toBeVisible();

  // Planes
  await page.goto('/suscripcion');
  await expect(page.locator('[data-plan="MONTHLY"]')).toContainText('$2');
  await expect(page.locator('[data-plan="YEARLY"]')).toContainText('$20');
});
