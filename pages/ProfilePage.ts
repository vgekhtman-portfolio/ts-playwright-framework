import type { Page, Locator } from '@playwright/test';
import { ArticleList } from './components/ArticleList';

export class ProfilePage {
  readonly username: Locator;
  readonly bio: Locator;
  readonly editSettingsLink: Locator;
  readonly followButton: Locator;
  readonly myPostsTab: Locator;
  readonly favoritedPostsTab: Locator;
  readonly articles: ArticleList;

  constructor(private readonly page: Page) {
    this.username = page.locator('.user-info h4');
    this.bio = page.locator('.user-info p');
    this.editSettingsLink = page.getByRole('link', { name: 'Edit Profile Settings' });
    this.followButton = page.locator('.user-info app-follow-button button');
    this.myPostsTab = page.getByRole('link', { name: 'My Posts' });
    this.favoritedPostsTab = page.getByRole('link', { name: 'Favorited Posts' });
    this.articles = new ArticleList(page);
  }

  async goto(username: string): Promise<void> {
    await this.page.goto(`/profile/${username}`);
  }

  async gotoFavorites(username: string): Promise<void> {
    await this.page.goto(`/profile/${username}/favorites`);
  }
}
