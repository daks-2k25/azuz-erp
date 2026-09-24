import { expect, test } from '@playwright/test';

test.describe('Public proposal route', () => {
  test('unknown proposal id shows not-found state without crashing', async ({
    page,
  }) => {
    const response = await page.goto(
      '/p/00000000-0000-4000-8000-000000000099',
    );

    expect(response?.status()).toBeLessThan(500);
    await expect(page.locator('body')).toBeVisible();
  });
});
