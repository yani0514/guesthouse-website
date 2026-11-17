import { defineConfig } from '@playwright/test';
import { localUrl } from './tests/deployment';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  timeout: 30000,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: { baseURL: localUrl, headless: true, trace: 'retain-on-failure' },
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
  webServer: {
    command: 'node scripts/serve-built.mjs',
    env: { PORT: '4173' },
    url: localUrl,
    reuseExistingServer: false,
  },
});
