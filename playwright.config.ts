import { defineConfig, devices } from '@playwright/test';
import { env } from './utils/env';

export default defineConfig({
  testDir: './tests',
  // This backend attributes requests to the wrong session under concurrent
  // load: with workers > 1, a worker's own just-created article/comment
  // intermittently 404s when that same worker immediately reads it back.
  // Confirmed empirically (workers: 4 turned 28/28 passing into 8 failures,
  // all read-your-own-write races); the suite itself has no shared mutable
  // state or execution-order dependencies.
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [['html', { open: 'never' }]],
  use: {
    baseURL: env.baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
