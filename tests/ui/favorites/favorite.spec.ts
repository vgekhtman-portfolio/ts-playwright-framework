import { test, expect } from '../../../fixtures/auth.fixture';
import { ArticlePage } from '../../../pages/ArticlePage';
import { unfavoriteArticle } from '../../../api/client';
import { SEEDED_ARTICLE } from '../../../utils/seedData';

test.describe('Favorite article', () => {
  test("a user can favorite another author's article", async ({
    authenticatedPage,
    authenticatedUser,
    apiContext,
  }) => {
    try {
      const articlePage = new ArticlePage(authenticatedPage);
      await articlePage.goto(SEEDED_ARTICLE.slug);

      await expect(articlePage.favoriteButton).toContainText('Favorite Article');
      await articlePage.favoriteButton.click();
      await expect(articlePage.favoriteButton).toContainText('Unfavorite Article');
    } finally {
      await unfavoriteArticle(apiContext, authenticatedUser.token, SEEDED_ARTICLE.slug);
    }
  });
});
