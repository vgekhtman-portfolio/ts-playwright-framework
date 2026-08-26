import { test, expect } from '../../../fixtures/auth.fixture';
import { ProfilePage } from '../../../pages/ProfilePage';
import { registerUser } from '../../../api/client';

test.describe('View profile', () => {
  test('opening a profile shows the expected profile information', async ({
    authenticatedPage,
    apiContext,
  }) => {
    const user = await registerUser(apiContext);

    const profile = new ProfilePage(authenticatedPage);
    await profile.goto(user.username);

    await expect(profile.username).toHaveText(user.username);
  });
});
