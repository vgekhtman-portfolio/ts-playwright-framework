import { test, expect } from '../../fixtures/api.fixture';
import { registerUser, createArticle, getArticle, deleteArticle } from '../../api/client';

test.describe('API smoke', () => {
  test('a registered user can authenticate and create an article that can be retrieved', async ({
    apiContext,
  }) => {
    const user = await registerUser(apiContext);

    const article = await createArticle(apiContext, user.token);
    expect(article.slug).toBeTruthy();

    const response = await getArticle(apiContext, article.slug, user.token);
    expect(response.ok()).toBeTruthy();

    const { article: fetched } = await response.json();
    expect(fetched.title).toBe(article.title);
    expect(fetched.author.username).toBe(user.username);

    await deleteArticle(apiContext, user.token, article.slug);
  });
});
