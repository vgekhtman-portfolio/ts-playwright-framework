import { test, expect } from '../../../fixtures/auth.fixture';
import { ArticleEditorPage } from '../../../pages/ArticleEditorPage';
import { ArticlePage } from '../../../pages/ArticlePage';
import { uniqueArticle } from '../../../utils/testData';

test.describe('Create article', () => {
  test('a user can publish a new article through the UI', async ({ authenticatedPage }) => {
    const article = uniqueArticle();
    const editor = new ArticleEditorPage(authenticatedPage);
    const articlePage = new ArticlePage(authenticatedPage);

    await editor.gotoNew();
    await editor.fill(article);
    for (const tag of article.tagList) {
      await editor.addTag(tag);
    }
    await editor.publish();

    await expect(articlePage.title).toHaveText(article.title);
    await expect(articlePage.body).toContainText(article.body);
    for (const tag of article.tagList) {
      await expect(articlePage.tags.filter({ hasText: tag })).toHaveCount(1);
    }
  });
});
