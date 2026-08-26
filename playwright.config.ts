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
  reporter: [
    ['html', { open: 'never' }],
    ['allure-playwright', { resultsDir: 'allure-results' }],
  ],
  use: {
    baseURL: env.baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    // API tests never touch a browser, so they run once here rather than
    // once per browser project below.
    {
      name: 'api',
      testDir: './tests/api',
    },
    {
      name: 'chromium',
      testIgnore: '**/api/**',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      testIgnore: '**/api/**',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      testIgnore: '**/api/**',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
