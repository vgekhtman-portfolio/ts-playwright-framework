import { test, expect } from '../../fixtures/article.fixture';
import { HomePage } from '../../pages/HomePage';

test.describe('API setup, UI verification', () => {
  test('an article created through the API appears correctly in the UI feed', async ({
    authenticatedPage,
    apiArticle,
  }) => {
    const home = new HomePage(authenticatedPage);
    await home.goto();

    await expect(home.articles.titleLink(apiArticle.title)).toBeVisible();
    for (const tag of apiArticle.tagList) {
      await expect(home.articles.tags(apiArticle.title).filter({ hasText: tag })).toHaveCount(1);
    }
  });
});
