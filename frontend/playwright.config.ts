import { defineConfig, devices } from '@playwright/test';

/** E2E contra el stack de desarrollo: `docker compose --profile dev up` antes de correrlos. */
export default defineConfig({
  testDir: './e2e',
  testMatch: '**/*.e2e.ts',
  timeout: 60_000,
  // En serie: comparten la base de desarrollo y Argon2 (128 MiB por desbloqueo) satura la CPU en paralelo.
  workers: 1,
  fullyParallel: false,
  use: {
    baseURL: process.env.E2E_BASE_URL ?? 'http://localhost:4200',
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
