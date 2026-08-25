import type { Page } from '@playwright/test';
import { test as apiTest, expect } from './api.fixture';
import { env } from '../utils/env';
import { registerUser, type AuthenticatedUser } from '../api/client';

export const test = apiTest.extend<{
  authenticatedUser: AuthenticatedUser;
  authenticatedPage: Page;
}>({
  authenticatedUser: async ({ apiContext }, use) => {
    const user = await registerUser(apiContext);
    await use(user);
  },

  authenticatedPage: async ({ browser, authenticatedUser }, use) => {
    const context = await browser.newContext({
      storageState: {
        cookies: [],
        origins: [
          {
            origin: env.baseURL,
            localStorage: [{ name: 'jwtToken', value: authenticatedUser.token }],
          },
        ],
      },
    });
    const page = await context.newPage();
    await use(page);
    await context.close();
  },
});

export { expect };
