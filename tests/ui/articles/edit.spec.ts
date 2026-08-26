import { test, expect } from '../../../fixtures/auth.fixture';
import { ArticlePage } from '../../../pages/ArticlePage';
import { ArticleEditorPage } from '../../../pages/ArticleEditorPage';
import { createArticle } from '../../../api/client';
import { uniqueArticle } from '../../../utils/testData';

test.describe('Edit article', () => {
  test('the author can edit an article and see the updated content', async ({
    authenticatedPage,
    authenticatedUser,
    apiContext,
  }) => {
    const original = await createArticle(apiContext, authenticatedUser.token, uniqueArticle());
    const updated = uniqueArticle();

    const editor = new ArticleEditorPage(authenticatedPage);
    await editor.gotoEdit(original.slug);
    await editor.fill(updated);
    await editor.publish();

    const articlePage = new ArticlePage(authenticatedPage);
    await expect(articlePage.title).toHaveText(updated.title);
    await expect(articlePage.body).toContainText(updated.body);
  });
});
