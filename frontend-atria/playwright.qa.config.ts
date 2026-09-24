import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter: [['list']],
  use: {
    baseURL,
    trace: 'off',
    screenshot: 'only-on-failure',
    channel: 'chrome',
    headless: false,
    launchOptions: {
      args: ['--disable-dev-shm-usage'],
    },
  },
  globalSetup: require.resolve('./e2e/global-setup.ts'),
  projects: [
    {
      name: 'chrome',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    },
  ],
});
