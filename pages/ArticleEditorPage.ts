import type { Page, Locator } from '@playwright/test';

export class ArticleEditorPage {
  readonly titleInput: Locator;
  readonly descriptionInput: Locator;
  readonly bodyInput: Locator;
  readonly tagInput: Locator;
  readonly publishButton: Locator;

  constructor(private readonly page: Page) {
    this.titleInput = page.getByPlaceholder('Article Title');
    this.descriptionInput = page.getByPlaceholder("What's this article about?");
    this.bodyInput = page.getByPlaceholder('Write your article (in markdown)');
    this.tagInput = page.getByPlaceholder('Enter tags');
    this.publishButton = page.getByRole('button', { name: 'Publish Article' });
  }

  async gotoNew(): Promise<void> {
    await this.page.goto('/editor');
  }

  async gotoEdit(slug: string): Promise<void> {
    // The editor fetches the article's current data and populates the form
    // with it after navigating; without waiting for that response, filling
    // the form immediately can race with it and get silently overwritten.
    const loaded = this.page.waitForResponse(
      (response) =>
        response.request().method() === 'GET' && response.url().includes(`/articles/${slug}`),
    );
    await this.page.goto(`/editor/${slug}`);
    await loaded;
  }

  async fill(article: { title: string; description: string; body: string }): Promise<void> {
    await this.titleInput.fill(article.title);
    await this.descriptionInput.fill(article.description);
    await this.bodyInput.fill(article.body);
  }

  async addTag(tag: string): Promise<void> {
    await this.tagInput.fill(tag);
    await this.tagInput.press('Enter');
  }

  async publish(): Promise<void> {
    await this.publishButton.click();
    // Publishing (including an edit that changes the title) redirects to
    // the resulting article page; without waiting for it, a slow redirect
    // leaves the caller reading the pre-publish page a moment longer.
    await this.page.waitForURL(/\/article\//);
  }
}
