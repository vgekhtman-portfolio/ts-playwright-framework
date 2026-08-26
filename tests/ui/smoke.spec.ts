import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { Header } from '../../pages/components/Header';

test('home page loads and shows the global feed', async ({ page }) => {
  const home = new HomePage(page);
  const header = new Header(page);
  await home.goto();

  await expect(page).toHaveTitle('Conduit');
  await expect(header.signInLink).toBeVisible();
  await expect(home.globalFeedTab).toBeVisible();
});
