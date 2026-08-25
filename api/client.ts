import type { APIRequestContext, APIResponse } from '@playwright/test';
import { expect } from '@playwright/test';
import { uniqueUser, uniqueArticle, type ArticleData } from '../utils/testData';

export interface AuthenticatedUser {
  username: string;
  email: string;
  password: string;
  token: string;
}

function authHeader(token: string) {
  return { Authorization: `Token ${token}` };
}

async function fetchCurrentUsername(
  request: APIRequestContext,
  token: string,
): Promise<string | undefined> {
  const response = await request.get('user', { headers: authHeader(token) });
  if (!response.ok()) return undefined;
  const { user } = await response.json();
  return user.username;
}

/**
 * The public demo backend issues auth tokens per client session rather than
 * per credential: registrations that happen close together in time can
 * receive a token that actually identifies a different, concurrently
 * registered user. Verify the returned token before trusting it, and retry
 * with fresh data on mismatch.
 */
export async function registerUser(
  request: APIRequestContext,
  retries = 3,
): Promise<AuthenticatedUser> {
  for (let attempt = 1; attempt <= retries; attempt += 1) {
    const user = uniqueUser();
    const response = await request.post('users', { data: { user } });
    expect(
      response.ok(),
      `registration failed: ${response.status()} ${await response.text()}`,
    ).toBeTruthy();
    const { user: registered } = await response.json();

    if ((await fetchCurrentUsername(request, registered.token)) === user.username) {
      return { ...user, token: registered.token };
    }
  }
  throw new Error(
    `Could not obtain a token uniquely identifying a freshly registered user after ${retries} attempts`,
  );
}

export async function createArticle(
  request: APIRequestContext,
  token: string,
  overrides: Partial<ArticleData> = {},
): Promise<{ slug: string } & ArticleData> {
  const article = { ...uniqueArticle(), ...overrides };
  const response = await request.post('articles', {
    headers: authHeader(token),
    data: { article },
  });
  expect(
    response.ok(),
    `create article failed: ${response.status()} ${await response.text()}`,
  ).toBeTruthy();
  const { article: created } = await response.json();
  return created;
}

export function getArticle(
  request: APIRequestContext,
  slug: string,
  token?: string,
): Promise<APIResponse> {
  return request.get(`articles/${slug}`, token ? { headers: authHeader(token) } : undefined);
}

export async function deleteArticle(
  request: APIRequestContext,
  token: string,
  slug: string,
): Promise<void> {
  await request.delete(`articles/${slug}`, { headers: authHeader(token) });
}
