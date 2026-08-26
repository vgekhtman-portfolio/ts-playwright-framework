import { test, expect } from '../../../fixtures/auth.fixture';
import { ArticlePage } from '../../../pages/ArticlePage';
import { HomePage } from '../../../pages/HomePage';
import { createArticle } from '../../../api/client';
import { uniqueArticle } from '../../../utils/testData';

test.describe('Delete article', () => {
  test('the author can delete an article and it is no longer available', async ({
    authenticatedPage,
    authenticatedUser,
    apiContext,
  }) => {
    const data = uniqueArticle();
    const article = await createArticle(apiContext, authenticatedUser.token, data);

    const articlePage = new ArticlePage(authenticatedPage);
    await articlePage.goto(article.slug);
    await articlePage.deleteButton.click();

    await expect(authenticatedPage).toHaveURL(/\/$/);
    const home = new HomePage(authenticatedPage);
    await expect(home.articles.titleLink(data.title)).toHaveCount(0);
  });
});
