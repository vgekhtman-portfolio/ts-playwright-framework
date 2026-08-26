import { test, expect } from '../../fixtures/auth.fixture';
import { ArticleEditorPage } from '../../pages/ArticleEditorPage';
import { createArticle, deleteArticle, getArticle } from '../../api/client';
import { uniqueArticle } from '../../utils/testData';

test.describe('UI action, API verification', () => {
  test('editing an article through the UI is reflected in the API', async ({
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
    // Editing the title changes the slug, so read back the slug the UI
    // redirected to rather than reusing the pre-edit one.
    await authenticatedPage.waitForURL(/\/article\//);
    const currentSlug = new URL(authenticatedPage.url()).pathname.split('/').pop()!;

    try {
      const response = await getArticle(apiContext, currentSlug, authenticatedUser.token);
      expect(response.ok()).toBeTruthy();
      const { article } = await response.json();
      expect(article.title).toBe(updated.title);
      expect(article.body).toBe(updated.body);
    } finally {
      await deleteArticle(apiContext, authenticatedUser.token, currentSlug);
    }
  });
});
