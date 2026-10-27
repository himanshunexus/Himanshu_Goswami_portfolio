import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  use: { baseURL: 'http://127.0.0.1:4173', channel: 'chrome', headless: true },
  webServer: { command: 'node server.mjs', env: { PORT: '4173' }, url: 'http://127.0.0.1:4173', reuseExistingServer: false },
});
