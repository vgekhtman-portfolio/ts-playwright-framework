import { test, expect } from '@playwright/test';
import { RegisterPage } from '../../../pages/RegisterPage';
import { Header } from '../../../pages/components/Header';
import { uniqueUser } from '../../../utils/testData';

test.describe('Registration', () => {
  test('a new user can register and lands authenticated', async ({ page }) => {
    const user = uniqueUser();
    const registerPage = new RegisterPage(page);
    const header = new Header(page);

    await registerPage.goto();
    await registerPage.register(user.username, user.email, user.password);

    await expect(header.userLink(user.username)).toBeVisible();
    await expect(header.settingsLink).toBeVisible();
  });

  test('the submit button stays disabled with a required field missing', async ({ page }) => {
    const registerPage = new RegisterPage(page);

    await registerPage.goto();
    await registerPage.emailInput.fill('missing-username@example.com');
    await registerPage.passwordInput.fill('Passw0rd!123');

    await expect(registerPage.submitButton).toBeDisabled();
  });
});
