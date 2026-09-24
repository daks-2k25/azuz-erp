import { readFileSync } from 'fs';
import { join } from 'path';

type Credentials = {
  admin: { email: string; password: string };
  client: { email: string; password: string };
};

export function loadCredentials(): Credentials {
  const raw = readFileSync(join(__dirname, '..', '.credentials.json'), 'utf-8');
  return JSON.parse(raw) as Credentials;
}

export async function loginAs(
  page: import('@playwright/test').Page,
  email: string,
  password: string,
) {
  await page.goto('/login');
  await page.locator('input[type="email"]').fill(email);
  await page.locator('input[type="password"]').fill(password);
  await page.getByRole('button', { name: 'Entrar' }).click();
  await page.waitForURL((url) => !url.pathname.includes('/login'), {
    timeout: 20000,
  });
}
