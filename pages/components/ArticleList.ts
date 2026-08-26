import type { Page, Locator } from '@playwright/test';

export class ArticleList {
  readonly previews: Locator;

  constructor(page: Page) {
    this.previews = page.locator('.article-preview');
  }

  preview(title: string): Locator {
    return this.previews.filter({ hasText: title });
  }

  titleLink(title: string): Locator {
    return this.preview(title).getByRole('link', { name: title });
  }

  favoriteButton(title: string): Locator {
    return this.preview(title).locator('app-favorite-button button');
  }

  tags(title: string): Locator {
    return this.preview(title).locator('.tag-list .tag-default');
  }
}
