import type { Page, Locator } from '@playwright/test';
import { ArticleList } from './components/ArticleList';

export class HomePage {
  readonly yourFeedTab: Locator;
  readonly globalFeedTab: Locator;
  readonly popularTags: Locator;
  readonly loadingIndicator: Locator;
  readonly emptyState: Locator;
  readonly articles: ArticleList;

  constructor(private readonly page: Page) {
    this.yourFeedTab = page.getByRole('link', { name: 'Your Feed' });
    this.globalFeedTab = page.getByRole('link', { name: 'Global Feed' });
    this.popularTags = page.locator('.sidebar .tag-list a');
    this.loadingIndicator = page.getByText('Loading articles...');
    this.emptyState = page.getByText('No articles are here... yet.');
    this.articles = new ArticleList(page);
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  tagLink(tag: string): Locator {
    return this.popularTags.filter({ hasText: tag });
  }
}
