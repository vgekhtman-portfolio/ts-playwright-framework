import { test, expect } from '../../../fixtures/auth.fixture';
import { SettingsPage } from '../../../pages/SettingsPage';
import { Header } from '../../../pages/components/Header';

test.describe('Logout', () => {
  test('a logged in user can log out', async ({ authenticatedPage, authenticatedUser }) => {
    const settingsPage = new SettingsPage(authenticatedPage);
    const header = new Header(authenticatedPage);

    await settingsPage.goto();
    await expect(header.userLink(authenticatedUser.username)).toBeVisible();

    await settingsPage.logout();

    await expect(header.signInLink).toBeVisible();
  });
});
