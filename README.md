# ts-playwright-framework

Production-style Playwright test automation framework demonstrating modern TypeScript and Playwright practices, tested against the public [RealWorld](https://github.com/gothinkster/realworld) demo application.

## Purpose

Demonstrates practical Playwright framework engineering: maintainable architecture, TypeScript, Page and Component Objects, reusable fixtures, API-assisted UI testing, authentication via storage state, network mocking, cross-browser execution, diagnostics, Allure reporting, Docker, and GitHub Actions CI.

Functional coverage is deliberately limited — see [`SCENARIOS.md`](SCENARIOS.md) for the full scenario list (27 functional scenarios plus a foundational connectivity check). Comprehensive REST API automation is intentionally out of scope here.

---

## Quick Start

```bash
npm ci
npx playwright install --with-deps
```

```bash
# Run the full suite (all browser projects + API, sequentially — see Parallel Execution below)
npx playwright test

# Run a specific browser project
npx playwright test --project=chromium

# Run a specific file or directory
npx playwright test tests/ui/articles

# Interactive UI mode
npx playwright test --ui
```

```bash
# View the native Playwright HTML report
npm run report

# Generate and open the Allure report
npm run report:allure
```

```bash
# Run the suite in Docker instead (same arguments work the same way)
docker compose up
docker compose run --rm tests --project=chromium
docker compose run --rm tests tests/ui/auth
```

See [Docker](#docker) or [GitHub Actions](#github-actions) for more.

---

## SUT

| System            | URL                                |
| ----------------- | ---------------------------------- |
| Web application   | `https://demo.realworld.show/`     |
| API               | `https://api.realworld.show/api`   |
| API documentation | `https://api.realworld.show/redoc` |

The SUT is external and is not built, modified, or containerized by this project.

---

## Technology Stack

- TypeScript
- Playwright Test, including `APIRequestContext`, native network interception, and browser projects
- `@faker-js/faker` for generated test data
- `allure-playwright` / `allure-commandline` for reporting
- npm, Docker, GitHub Actions

---

## Project Structure

```text
tests/
├── api/            direct API smoke tests
├── ui/             UI scenarios (articles, auth, comments, favorites, mocking, profiles)
└── integration/    UI/API cross-verification

pages/              Page Objects
pages/components/   Component Objects (Header, ArticleList, CommentSection)
fixtures/           apiContext, authenticatedUser/authenticatedPage, apiArticle
api/                API client helpers used for test setup/verification
utils/              generated test data, env config, seeded-content reference

playwright.config.ts
Dockerfile / docker-compose.yml
.github/workflows/ci.yml
```

### Page and Component Objects

Page Objects (`pages/`) encapsulate interactions with a meaningful application page — `HomePage`, `ArticlePage`, `ArticleEditorPage`, `ProfilePage`, `LoginPage`, `RegisterPage`, `SettingsPage`. Component Objects (`pages/components/`) cover UI structures repeated across pages: `Header`, `ArticleList` (the article-preview list shared by the home feed and profile tabs), and `CommentSection`.

### Fixtures

- `apiContext` — a Playwright `APIRequestContext` pointed at the API base URL.
- `authenticatedUser` / `authenticatedPage` — registers a user through the API and provides a browser page already authenticated via storage state, so ordinary scenarios don't repeat the UI login flow.
- `apiArticle` — an article created through the API for the current user, deleted automatically on teardown.

---

## Authentication

Dedicated UI scenarios cover registration, invalid registration, login, invalid login, and logout. Every other scenario authenticates through the `authenticatedUser`/`authenticatedPage` fixtures instead of repeating the UI login flow:

```text
register via API → verify the returned token → inject it into storage state → authenticated page
```

---

## Test Data

Generated with `@faker-js/faker`, created and cleaned up through the API where that's simpler or more reliable than the UI. Test data is unique per test and isolated — no test depends on another test's data or on execution order.

Scenarios that need content from an author other than the current test user use a fixed, pre-existing demo article (`utils/seedData.ts`) rather than creating a second user and article on the fly: the public deployment doesn't reliably make content created by one authenticated session visible to another session, but its own pre-seeded demo content is visible from any session. The same applies to tag filtering — only the site's existing, pre-seeded tags are filterable, so tag-filter scenarios target one of those rather than a freshly generated tag.

---

## UI / API Integration

API capabilities are used as part of the UI automation itself, not as a separate concern:

- **API → UI**: create an article through the API, verify it renders correctly in the UI.
- **UI → API**: edit an article through the UI, verify the change through the API.
- **API setup**: most scenarios create their fixtures (users, articles, comments) through the API rather than through the UI.
- **API cleanup**: scenarios that create their own throwaway data delete it through the API afterward.

---

## API Testing

A small, intentionally limited smoke suite (`tests/api/`): authentication, article creation, article retrieval, and an unauthorized-request check. Comprehensive REST API coverage is out of scope for this repository.

---

## API Mocking

Three scenarios using Playwright's native request interception (`tests/ui/mocking/`): a mocked server error (on login, since that's where the app actually surfaces one, unlike the article feed), an empty article list, and a delayed article list verified against the loading state. No separate mocking library.

---

## Cross-Browser Testing

Playwright projects: `chromium`, `firefox`, `webkit`, and a browser-independent `api` project for the direct API tests (so they run once instead of once per browser). Pull requests run the fast subset (`chromium` + `api`); pushes to `main`/`develop` and manual runs also cover `firefox` and `webkit`.

```bash
npx playwright test --project=firefox --project=webkit
```

---

## Parallel Execution

The suite runs with a single worker (`workers: 1` in `playwright.config.ts`), and CI's browser/API matrix runs sequentially (`max-parallel: 1`) rather than GitHub's default of all-at-once. The public backend does not reliably handle concurrent requests from independent sessions, so running with multiple workers reintroduces failures unrelated to the application under test.

Within that constraint, the suite is still designed for parallel-safety — isolated, generated test data, no shared mutable state, no dependency on execution order — should a future SUT (or a self-hosted one) handle concurrency reliably.

---

## Diagnostics

- Screenshot on failure
- Trace and video retained on failure (`retain-on-failure`, so even a first, non-retried failure gets full diagnostics — not just failures that needed a retry)

Successful runs don't generate this overhead.

---

## Allure Reporting

```bash
npm run report:allure
```

CI generates a combined Allure report across every browser/API project and publishes it to GitHub Pages on pushes to `main`, carrying forward trend history from the previously published report.

---

## Docker

Docker provides reproducible local execution; the SUT remains external and is never containerized. The image (Microsoft's official Playwright image) already includes all three browsers, so nothing needs installing beyond `npm ci`, which runs automatically.

```bash
# Full suite, all configured projects
docker compose up

# Anything you can pass to `npx playwright test` works the same way here
docker compose run --rm tests --project=chromium
docker compose run --rm tests tests/ui/auth --project=chromium
docker compose run --rm tests tests/ui/smoke.spec.ts --project=firefox --project=webkit
```

`BASE_URL`/`API_BASE_URL` pass through from the host shell if set there; otherwise the same defaults as running locally apply.

---

## GitHub Actions

Native Node/Playwright execution — no Docker in CI. `.github/workflows/ci.yml`:

1. **Lint** — typecheck, lint, format check. The test matrix waits on this rather than running in parallel with it.
2. **Test** — the browser/API matrix described above, sequential.
3. **Combined Allure report** — merges every project's results into one report.
4. **Deploy to Pages** — publishes that report, on pushes to `main` only.

Playwright and Allure artifacts (per-project HTML report and Allure results) are uploaded from every run, pass or fail.

---

## Design Principles

1. Prefer Playwright-native solutions over additional libraries.
2. Keep tests focused on application behavior, not locator mechanics.
3. Use API capabilities to support UI automation, not to duplicate a full API test suite.
4. Keep test data isolated and parallel-safe in design, even where the SUT currently limits actual parallel execution.
5. Use Page and Component Objects where they provide real reuse — not for every element.
6. Keep fixtures focused and composable.
7. Prefer deterministic tests over timing-based workarounds; no arbitrary sleeps anywhere in the suite.
8. Keep functional coverage deliberately limited.

---

## Out of Scope

Comprehensive REST API automation, performance/load testing, contract testing, database testing, mobile testing, comprehensive accessibility testing, visual regression testing, Cucumber/BDD, custom test runners or HTTP clients, SUT implementation or deployment, and exhaustive RealWorld application coverage.

---

## Potential Improvements

- Broader direct API coverage (currently a small smoke suite by design).
- True parallel execution once the public deployment — or a self-hosted instance — handles concurrent sessions reliably; the suite's test isolation is already designed for it.
- Running the full cross-browser matrix on pull requests too, if CI time budget allows.
- Visual regression and accessibility coverage, currently out of scope.

---

This repository is one of several portfolio projects, each demonstrating a different automation approach or technology; this one's focus is modern Playwright framework engineering specifically.
