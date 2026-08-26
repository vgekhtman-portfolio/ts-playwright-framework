import { test, expect } from '../../../fixtures/auth.fixture';
import { ArticlePage } from '../../../pages/ArticlePage';
import { addComment, createArticle } from '../../../api/client';
import { uniqueArticle, uniqueComment } from '../../../utils/testData';

test.describe('Delete comment', () => {
  test('the comment author can delete their comment', async ({
    authenticatedPage,
    authenticatedUser,
    apiContext,
  }) => {
    const article = await createArticle(apiContext, authenticatedUser.token, uniqueArticle());
    const comment = await addComment(apiContext, authenticatedUser.token, article.slug, uniqueComment());

    const articlePage = new ArticlePage(authenticatedPage);
    await articlePage.goto(article.slug);

    await expect(articlePage.comments.comment(comment.body)).toBeVisible();
    await articlePage.comments.deleteComment(comment.body);
    await expect(articlePage.comments.comment(comment.body)).toHaveCount(0);
  });
});
