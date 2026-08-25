import { test as base, expect, type APIRequestContext } from '@playwright/test';
import { env } from '../utils/env';

export const test = base.extend<{ apiContext: APIRequestContext }>({
  apiContext: async ({ playwright }, use) => {
    const context = await playwright.request.newContext({ baseURL: env.apiBaseURL });
    await use(context);
    await context.dispose();
  },
});

export { expect };
