import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/LoginPage';
import { uniqueUser } from '../../../utils/testData';

test.describe('Mock server error', () => {
  test('a failed login request surfaces the server error', async ({ page }) => {
    await page.route('**/api/users/login', (route) =>
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ errors: { body: ['internal server error'] } }),
      }),
    );

    const user = uniqueUser();
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(user.email, user.password);

    await expect(loginPage.errors).toContainText('internal server error');
  });
});
