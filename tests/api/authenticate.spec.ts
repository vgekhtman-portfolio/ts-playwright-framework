import { test, expect } from '../../fixtures/api.fixture';
import { getCurrentUser, registerUser } from '../../api/client';

test.describe('API authentication', () => {
  test('a registered user can authenticate with the returned token', async ({ apiContext }) => {
    const user = await registerUser(apiContext);

    const current = await getCurrentUser(apiContext, user.token);

    expect(current?.username).toBe(user.username);
    expect(current?.email).toBe(user.email);
  });
});
