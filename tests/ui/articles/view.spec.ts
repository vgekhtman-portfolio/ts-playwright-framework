import { test, expect } from '../../../fixtures/auth.fixture';
import { ArticlePage } from '../../../pages/ArticlePage';
import { createArticle } from '../../../api/client';
import { uniqueArticle } from '../../../utils/testData';

test.describe('View article', () => {
  test('an existing article shows its title, author, body, and tags', async ({
    authenticatedPage,
    authenticatedUser,
    apiContext,
  }) => {
    const data = uniqueArticle();
    const article = await createArticle(apiContext, authenticatedUser.token, data);

    const articlePage = new ArticlePage(authenticatedPage);
    await articlePage.goto(article.slug);

    await expect(articlePage.title).toHaveText(data.title);
    await expect(articlePage.author).toHaveText(authenticatedUser.username);
    await expect(articlePage.body).toContainText(data.body);
    for (const tag of data.tagList) {
      await expect(articlePage.tags.filter({ hasText: tag })).toHaveCount(1);
    }
  });
});
