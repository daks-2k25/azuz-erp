import { expect, test } from '@playwright/test';
import { loadCredentials, loginAs } from './helpers/auth';

test.describe('Client portal RBAC UI', () => {
  test('client user lands on client portal and cannot open staff dashboard', async ({
    page,
  }) => {
    const { client } = loadCredentials();

    await loginAs(page, client.email, client.password);
    await expect(page).toHaveURL(/\/client-portal/, { timeout: 15000 });

    await page.goto('/dashboard');
    await expect(page).not.toHaveURL(/\/dashboard/);
  });
});
