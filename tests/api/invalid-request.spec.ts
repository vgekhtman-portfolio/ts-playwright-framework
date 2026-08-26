import { test, expect } from '../../fixtures/api.fixture';
import { uniqueArticle } from '../../utils/testData';

test.describe('Invalid API request', () => {
  test('creating an article without authorization is rejected', async ({ apiContext }) => {
    const response = await apiContext.post('articles', { data: { article: uniqueArticle() } });

    expect(response.status()).toBe(401);
    const { errors } = await response.json();
    expect(errors).toBeTruthy();
  });
});
