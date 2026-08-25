import type { Page, Locator } from '@playwright/test';

export class Header {
  readonly signInLink: Locator;
  readonly signUpLink: Locator;
  readonly settingsLink: Locator;
  readonly newArticleLink: Locator;

  constructor(private readonly page: Page) {
    this.signInLink = page.getByRole('link', { name: 'Sign in' });
    this.signUpLink = page.getByRole('link', { name: 'Sign up' });
    this.settingsLink = page.getByRole('link', { name: 'Settings' });
    this.newArticleLink = page.getByRole('link', { name: 'New Article' });
  }

  userLink(username: string): Locator {
    return this.page.getByRole('link', { name: username, exact: true });
  }
}
