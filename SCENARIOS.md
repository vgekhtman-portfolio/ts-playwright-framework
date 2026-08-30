# Scenario Coverage

This is the functional scenario suite implemented in this repository, run against the public [RealWorld](https://github.com/gothinkster/realworld) demo deployment. It's a deliberately limited set — not exhaustive coverage of the RealWorld application, but broad enough to demonstrate a realistic range of Playwright framework capabilities: UI flows, API-only checks, UI/API integration, and network mocking, each implemented once and exercised across the configured browser projects.

Where a scenario can reliably use API setup or cleanup instead of reproducing it through the UI, it does — that pattern shows up throughout the suite rather than as a handful of dedicated tests, so it's called out separately at the end rather than listed per scenario below.

---

## 1. Authentication

- [x] **Successful registration** — registers a new user through the UI with generated data and verifies the app lands authenticated.
- [x] **Invalid registration** — leaves a required field empty and verifies the submit button stays disabled.
- [x] **Successful login** — registers a user via the API, then logs in through the UI with those credentials.
- [x] **Invalid login** — attempts login with credentials that don't match any account and verifies the error message, with the user still signed out.
- [x] **Logout** — logs an authenticated user out through the UI and verifies the signed-out state.

## 2. Articles

- [x] **Create an article** — publishes a new article through the UI (including tags) and verifies the result on the article page.
- [x] **View an article** — creates an article via the API and verifies its title, author, body, and tags on the article page.
- [x] **Edit an article** — edits an existing article's title/description/body through the UI and verifies the updated content.
- [x] **Delete an article** — deletes an article through the UI and verifies it no longer appears in the feed.

## 3. Comments

- [x] **Add a comment** — adds a comment to an article through the UI and verifies it appears in the comment section.
- [x] **Delete a comment** — creates an article and comment via the API, deletes the comment through the UI, and verifies it's gone.

## 4. Favorites and Feeds

- [x] **Favorite an article** — favorites another author's article through the UI and verifies the button's state change.
- [x] **Unfavorite an article** — starts from an article already favorited (via API setup) and unfavorites it through the UI.
- [x] **View an article in Your Feed** — follows an author via the API and verifies their article appears in the "Your Feed" tab.
- [x] **Filter articles by tag** — creates an article tagged with one of the site's existing tags, selects that tag from the sidebar, and verifies the article appears in the filtered list.

  Only the pre-seeded set of tags is filterable through the API; a freshly generated tag isn't, so this scenario targets an existing tag rather than a generated one.

## 5. Profiles

- [x] **View a user profile** — opens a profile and verifies the displayed username.
- [x] **View authored articles** — verifies a user's own profile lists an article they authored.
- [x] **View favorited articles** — favorites an article via the API and verifies it appears in the profile's favorites view.

_Favorite/unfavorite/feed/profile scenarios that need content from an author other than the current test user target a fixed, pre-existing demo article/author (`utils/seedData.ts`) rather than a second, freshly registered user. The public deployment does not reliably make content created by one authenticated session visible to another; pre-seeded demo content doesn't have that problem._

## 6. Direct API Smoke Tests

Intentionally limited — comprehensive API automation is out of scope for this repository.

- [x] **Authenticate through the API** — registers a user and confirms the returned token authenticates as that user.
- [x] **Create an article through the API** — creates an article via `APIRequestContext` and verifies the returned data.
- [x] **Retrieve an article through the API** — creates then retrieves an article, verifying the response reflects it.
- [x] **Handle an invalid or unauthorized API request** — attempts to create an article with no auth token and verifies the `401` response.

## 7. UI / API Integration

- [x] **API setup → UI verification** — creates an article via the API and verifies it renders correctly in the UI feed.
- [x] **UI action → API verification** — edits an article through the UI, then retrieves it via the API and verifies the change is reflected server-side.

API-based setup and cleanup (the other two integration patterns originally scoped as their own scenarios) aren't separate test cases — they're the normal way most of this suite sets up and tears down its data. Nearly every test above creates its fixtures through the API and, where it creates its own throwaway data, cleans up through the API too.

## 8. API Mocking

Uses Playwright's native request interception; no separate mocking library.

- [x] **Mock server error** — intercepts the login request, returns a `500`, and verifies the app surfaces the error through its normal error-message UI.
- [x] **Mock empty response** — intercepts the article list request, returns an empty result, and verifies the empty-state message.
- [x] **Mock delayed response** — delays the article list request and verifies the loading indicator is visible before real content appears.

## 9. Cross-Browser Execution

Not additional scenarios — the suite above runs across Playwright's configured browser projects (Chromium, Firefox, WebKit) rather than maintaining browser-specific tests. Pull requests run the fast subset (Chromium); pushes to `main`/`develop` and manual runs also run Firefox and WebKit.

## 10. Parallel Execution

The suite is designed to be parallel-safe — isolated, generated test data; no shared mutable users/articles/comments; no dependency on execution order — but currently runs with a single worker (`workers: 1`) both locally and in CI, browser projects included. The public backend does not reliably handle concurrent requests from multiple sessions; running with multiple workers reintroduces failures unrelated to the application under test. This is a constraint of the public deployment, not of the suite's own test isolation.

---

## Scope

| Area                   | Scenarios |
| ---------------------- | --------: |
| Authentication         |         5 |
| Articles               |         4 |
| Comments               |         2 |
| Favorites & feeds      |         4 |
| Profiles               |         3 |
| Direct API smoke tests |         4 |
| UI/API integration     |         2 |
| API mocking            |         3 |
| **Total**              |    **27** |

Plus one foundational connectivity smoke test (`tests/ui/smoke.spec.ts`) verifying the app loads at all — not counted as a functional scenario, but part of the suite.
