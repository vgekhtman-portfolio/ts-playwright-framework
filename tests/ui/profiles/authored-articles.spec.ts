import { test, expect } from '../../../fixtures/auth.fixture';
import { ProfilePage } from '../../../pages/ProfilePage';
import { createArticle } from '../../../api/client';
import { uniqueArticle } from '../../../utils/testData';

test.describe('View authored articles', () => {
  test('a profile lists the articles authored by that user', async ({
    authenticatedPage,
    authenticatedUser,
    apiContext,
  }) => {
    const article = await createArticle(apiContext, authenticatedUser.token, uniqueArticle());

    const profile = new ProfilePage(authenticatedPage);
    await profile.goto(authenticatedUser.username);

    await expect(profile.articles.titleLink(article.title)).toBeVisible();
  });
});
