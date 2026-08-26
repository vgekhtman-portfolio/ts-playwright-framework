/**
 * An article/author created dynamically by one authenticated session is not
 * reliably visible to a different session on this backend: GET /articles/:slug
 * for another session's freshly created article returns 404 (the public demo
 * explicitly advertises "session isolation"). Pre-seeded demo content, by
 * contrast, is visible across sessions, so scenarios that need an
 * article/author other than the current user use this fixed seed data
 * instead of registering a second user.
 */
export const SEEDED_ARTICLE = {
  slug: 'how-to-learn-javascript-efficiently',
  title: 'How to Learn JavaScript Efficiently',
  author: 'johndoe',
};
