import { test, expect } from '../../../fixtures/auth.fixture';
import { ArticlePage } from '../../../pages/ArticlePage';
import { createArticle } from '../../../api/client';
import { uniqueArticle, uniqueComment } from '../../../utils/testData';

test.describe('Add comment', () => {
  test('an authenticated user can add a comment and see it in the comment section', async ({
    authenticatedPage,
    authenticatedUser,
    apiContext,
  }) => {
    const article = await createArticle(apiContext, authenticatedUser.token, uniqueArticle());
    const commentText = uniqueComment();

    const articlePage = new ArticlePage(authenticatedPage);
    await articlePage.goto(article.slug);
    await articlePage.comments.addComment(commentText);

    await expect(articlePage.comments.comment(commentText)).toBeVisible();
  });
});
