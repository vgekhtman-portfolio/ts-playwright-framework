import { test, expect } from '../../fixtures/api.fixture';
import { createArticle, deleteArticle, registerUser } from '../../api/client';
import { uniqueArticle } from '../../utils/testData';

test.describe('API article creation', () => {
  test('creating an article returns the created article data', async ({ apiContext }) => {
    const user = await registerUser(apiContext);
    const data = uniqueArticle();

    const article = await createArticle(apiContext, user.token, data);

    try {
      expect(article.title).toBe(data.title);
      expect(article.description).toBe(data.description);
      expect(article.body).toBe(data.body);
      expect(article.tagList.sort()).toEqual([...data.tagList].sort());
      expect(article.slug).toBeTruthy();
    } finally {
      await deleteArticle(apiContext, user.token, article.slug);
    }
  });
});
