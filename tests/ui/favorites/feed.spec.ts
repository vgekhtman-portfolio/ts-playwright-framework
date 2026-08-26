import { test, expect } from '../../../fixtures/auth.fixture';
import { HomePage } from '../../../pages/HomePage';
import { followUser, unfollowUser } from '../../../api/client';
import { SEEDED_ARTICLE } from '../../../utils/seedData';

test.describe('Your Feed', () => {
  test('an article from a followed author appears in Your Feed', async ({
    authenticatedPage,
    authenticatedUser,
    apiContext,
  }) => {
    await followUser(apiContext, authenticatedUser.token, SEEDED_ARTICLE.author);

    try {
      const home = new HomePage(authenticatedPage);
      await home.goto();
      await home.yourFeedTab.click();

      await expect(home.articles.titleLink(SEEDED_ARTICLE.title)).toBeVisible();
    } finally {
      await unfollowUser(apiContext, authenticatedUser.token, SEEDED_ARTICLE.author);
    }
  });
});
