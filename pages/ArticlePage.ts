import type { Page, Locator } from '@playwright/test';
import { CommentSection } from './components/CommentSection';

export class ArticlePage {
  readonly banner: Locator;
  readonly title: Locator;
  readonly author: Locator;
  readonly followButton: Locator;
  readonly favoriteButton: Locator;
  readonly editLink: Locator;
  readonly deleteButton: Locator;
  readonly tags: Locator;
  readonly body: Locator;
  readonly comments: CommentSection;

  constructor(private readonly page: Page) {
    this.banner = page.locator('.banner');
    this.title = this.banner.locator('h1');
    this.author = this.banner.locator('.author');
    this.followButton = this.banner.locator('app-follow-button button');
    this.favoriteButton = this.banner.locator('app-favorite-button button');
    this.editLink = this.banner.getByRole('link', { name: 'Edit Article' });
    this.deleteButton = this.banner.getByRole('button', { name: 'Delete Article' });
    this.tags = page.locator('.article-content .tag-list .tag-default');
    this.body = page.locator('.article-content');
    this.comments = new CommentSection(page);
  }

  async goto(slug: string): Promise<void> {
    await this.page.goto(`/article/${slug}`);
  }
}
