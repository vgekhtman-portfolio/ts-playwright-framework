import type { Page, Locator } from '@playwright/test';

export class CommentSection {
  readonly commentInput: Locator;
  readonly postButton: Locator;
  readonly comments: Locator;

  constructor(page: Page) {
    this.commentInput = page.getByPlaceholder('Write a comment...');
    this.postButton = page.getByRole('button', { name: 'Post Comment' });
    this.comments = page.locator('.card').filter({ has: page.locator('.card-text') });
  }

  async addComment(text: string): Promise<void> {
    await this.commentInput.fill(text);
    await this.postButton.click();
  }

  comment(text: string): Locator {
    return this.comments.filter({ hasText: text });
  }

  async deleteComment(text: string): Promise<void> {
    await this.comment(text).locator('.ion-trash-a').click();
  }
}
