import { test as authTest, expect } from './auth.fixture';
import { createArticle, deleteArticle } from '../api/client';
import { uniqueArticle, type ArticleData } from '../utils/testData';

export const test = authTest.extend<{ apiArticle: { slug: string } & ArticleData }>({
  apiArticle: async ({ authenticatedUser, apiContext }, use) => {
    const article = await createArticle(apiContext, authenticatedUser.token, uniqueArticle());
    await use(article);
    await deleteArticle(apiContext, authenticatedUser.token, article.slug);
  },
});

export { expect };
