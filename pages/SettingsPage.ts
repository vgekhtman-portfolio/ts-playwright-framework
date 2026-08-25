import type { Page, Locator } from '@playwright/test';

export class SettingsPage {
  readonly logoutButton: Locator;

  constructor(private readonly page: Page) {
    this.logoutButton = page.getByRole('button', { name: 'Or click here to logout.' });
  }

  async goto(): Promise<void> {
    await this.page.goto('/settings');
  }

  async logout(): Promise<void> {
    await this.logoutButton.click();
  }
}
