import { test, expect } from '../../../fixtures/auth.fixture';
import { ProfilePage } from '../../../pages/ProfilePage';
import { SEEDED_ARTICLE } from '../../../utils/seedData';

test.describe('View profile', () => {
  test('opening a profile shows the expected profile information', async ({ authenticatedPage }) => {
    const profile = new ProfilePage(authenticatedPage);
    await profile.goto(SEEDED_ARTICLE.author);

    await expect(profile.username).toHaveText(SEEDED_ARTICLE.author);
  });
});
