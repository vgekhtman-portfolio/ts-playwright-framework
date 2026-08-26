import { test, expect } from '../../../fixtures/auth.fixture';
import { HomePage } from '../../../pages/HomePage';
import { createArticle } from '../../../api/client';
import { uniqueArticle } from '../../../utils/testData';

// Only pre-seeded tags are filterable via GET /articles?tag=; a freshly
// generated tag returns no results.
const EXISTING_TAG = 'javascript';

test.describe('Filter articles by tag', () => {
  test('selecting a tag filters the article list to matching articles', async ({
    authenticatedPage,
    authenticatedUser,
    apiContext,
  }) => {
    const data = { ...uniqueArticle(), tagList: [EXISTING_TAG] };
    const article = await createArticle(apiContext, authenticatedUser.token, data);

    const home = new HomePage(authenticatedPage);
    await home.goto();
    await home.tagLink(EXISTING_TAG).click();

    await expect(authenticatedPage).toHaveURL(new RegExp(`/tag/${EXISTING_TAG}$`));
    await expect(home.articles.titleLink(article.title)).toBeVisible();
  });
});
