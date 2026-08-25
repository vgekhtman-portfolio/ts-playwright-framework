import { test, expect } from '@playwright/test';

test('home page loads and shows the global feed', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle('Conduit');
  await expect(page.getByRole('link', { name: 'Sign in' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Global Feed' })).toBeVisible();
});
