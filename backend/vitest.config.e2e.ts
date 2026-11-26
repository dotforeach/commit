import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    globals: true,
    root: './',
    include: ['**/*.e2e-spec.ts'],
    // Sin llamadas a APIs externas desde los tests.
    env: { RATES_REFRESH: 'false', REMINDERS_JOB: 'false' },
  },
});
