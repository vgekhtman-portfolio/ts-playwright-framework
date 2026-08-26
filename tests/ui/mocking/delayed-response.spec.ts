import { test, expect } from '@playwright/test';
import { HomePage } from '../../../pages/HomePage';

test.describe('Mock delayed response', () => {
  test('the feed shows a loading state while the article list is delayed', async ({ page }) => {
    await page.route('**/api/articles*', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      await route.continue();
    });

    const home = new HomePage(page);
    await home.goto();

    await expect(home.loadingIndicator).toBeVisible();
    await expect(home.articles.previews.first()).toBeVisible();
  });
});
