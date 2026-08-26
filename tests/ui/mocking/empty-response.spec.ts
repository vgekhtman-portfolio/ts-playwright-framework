import { test, expect } from '@playwright/test';
import { HomePage } from '../../../pages/HomePage';

test.describe('Mock empty response', () => {
  test('an empty article feed shows the empty state', async ({ page }) => {
    await page.route('**/api/articles*', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ articles: [], articlesCount: 0 }),
      }),
    );

    const home = new HomePage(page);
    await home.goto();

    await expect(home.articles.previews).toHaveCount(0);
    await expect(home.emptyState).toBeVisible();
  });
});
