import { test, expect } from '../../fixtures/api.fixture';
import { createArticle, deleteArticle, getArticle, registerUser } from '../../api/client';
import { uniqueArticle } from '../../utils/testData';

test.describe('API article retrieval', () => {
  test('retrieving an article returns its full data', async ({ apiContext }) => {
    const user = await registerUser(apiContext);
    const data = uniqueArticle();
    const created = await createArticle(apiContext, user.token, data);

    try {
      const response = await getArticle(apiContext, created.slug, user.token);

      expect(response.ok()).toBeTruthy();
      const { article } = await response.json();
      expect(article.slug).toBe(created.slug);
      expect(article.title).toBe(data.title);
      expect(article.author.username).toBe(user.username);
    } finally {
      await deleteArticle(apiContext, user.token, created.slug);
    }
  });
});
