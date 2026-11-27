import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    globals: true,
    root: './',
    include: ['**/*.e2e-spec.ts'],
    setupFiles: ['./test/setup-env.ts'],
    // Sin llamadas a APIs externas desde los tests.
    env: {
      RATES_REFRESH: 'false',
      REMINDERS_JOB: 'false',
      // WhatsApp de prueba (las llamadas a Meta se reemplazan en los tests)
      WHATSAPP_APP_SECRET: 'test-app-secret',
      WHATSAPP_TOKEN: 'test-token',
      WHATSAPP_PHONE_NUMBER_ID: '1000',
      WHATSAPP_VERIFY_TOKEN: 'verify-me',
      WHATSAPP_DISPLAY_NUMBER: '50760000000',
    },
  },
});
