import type { Page, Locator } from '@playwright/test';

export class RegisterPage {
  readonly usernameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errors: Locator;

  constructor(private readonly page: Page) {
    this.usernameInput = page.getByPlaceholder('Username');
    this.emailInput = page.getByPlaceholder('Email');
    this.passwordInput = page.getByPlaceholder('Password');
    this.submitButton = page.getByRole('button', { name: 'Sign up' });
    this.errors = page.locator('.error-messages li');
  }

  async goto(): Promise<void> {
    await this.page.goto('/register');
  }

  async fill(username: string, email: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
  }

  async register(username: string, email: string, password: string): Promise<void> {
    await this.fill(username, email, password);
    await this.submitButton.click();
  }
}
