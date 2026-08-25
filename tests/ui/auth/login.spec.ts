import { test, expect } from '../../../fixtures/api.fixture';
import { LoginPage } from '../../../pages/LoginPage';
import { Header } from '../../../pages/components/Header';
import { registerUser } from '../../../api/client';

test.describe('Login', () => {
  test('a registered user can log in', async ({ page, apiContext }) => {
    const user = await registerUser(apiContext);
    const loginPage = new LoginPage(page);
    const header = new Header(page);

    await loginPage.goto();
    await loginPage.login(user.email, user.password);

    await expect(header.userLink(user.username)).toBeVisible();
  });

  test('invalid credentials show an error and the user stays signed out', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const header = new Header(page);

    await loginPage.goto();
    await loginPage.login('nonexistent-user@example.com', 'WrongPassword123');

    await expect(loginPage.errors).toContainText('credentials invalid');
    await expect(header.signInLink).toBeVisible();
  });
});
