import { test, expect } from '../../../fixtures/auth.fixture';
import { ProfilePage } from '../../../pages/ProfilePage';
import { favoriteArticle, unfavoriteArticle } from '../../../api/client';
import { SEEDED_ARTICLE } from '../../../utils/seedData';

test.describe('View favorited articles', () => {
  test("a profile's favorites view lists the articles that user favorited", async ({
    authenticatedPage,
    authenticatedUser,
    apiContext,
  }) => {
    await favoriteArticle(apiContext, authenticatedUser.token, SEEDED_ARTICLE.slug);

    try {
      const profile = new ProfilePage(authenticatedPage);
      await profile.gotoFavorites(authenticatedUser.username);

      await expect(profile.articles.titleLink(SEEDED_ARTICLE.title)).toBeVisible();
    } finally {
      await unfavoriteArticle(apiContext, authenticatedUser.token, SEEDED_ARTICLE.slug);
    }
  });
});
