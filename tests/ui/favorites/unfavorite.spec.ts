import { test, expect } from '../../../fixtures/auth.fixture';
import { ArticlePage } from '../../../pages/ArticlePage';
import { favoriteArticle, unfavoriteArticle } from '../../../api/client';
import { SEEDED_ARTICLE } from '../../../utils/seedData';

test.describe('Unfavorite article', () => {
  test('a user can unfavorite an article they previously favorited', async ({
    authenticatedPage,
    authenticatedUser,
    apiContext,
  }) => {
    await favoriteArticle(apiContext, authenticatedUser.token, SEEDED_ARTICLE.slug);

    try {
      const articlePage = new ArticlePage(authenticatedPage);
      await articlePage.goto(SEEDED_ARTICLE.slug);

      await expect(articlePage.favoriteButton).toContainText('Unfavorite Article');
      await articlePage.favoriteButton.click();
      await expect(articlePage.favoriteButton).toContainText('Favorite Article');
    } finally {
      await unfavoriteArticle(apiContext, authenticatedUser.token, SEEDED_ARTICLE.slug);
    }
  });
});
