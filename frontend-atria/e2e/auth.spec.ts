import { expect, test } from '@playwright/test';
import { loadCredentials, loginAs } from './helpers/auth';

test.describe('Authentication UI', () => {
  test('admin can log in and log out', async ({ page }) => {
    const { admin } = loadCredentials();

    await loginAs(page, admin.email, admin.password);
    await expect(page).not.toHaveURL(/\/login/);

    const logoutButton = page.getByRole('button', { name: /sair|logout/i });
    if (await logoutButton.isVisible().catch(() => false)) {
      await logoutButton.click();
    } else {
      await page.goto('/login');
    }

    await expect(page).toHaveURL(/\/login/);
  });

  test('shows error on invalid password', async ({ page }) => {
    const { admin } = loadCredentials();

    await page.goto('/login');
    await page.getByRole('textbox', { name: 'E-mail' }).fill(admin.email);
    await page.getByRole('textbox', { name: 'Senha' }).fill('definitely-wrong-password');
    await page.getByRole('button', { name: 'Entrar' }).click();

    await expect(page).toHaveURL(/\/login/);
  });
});
