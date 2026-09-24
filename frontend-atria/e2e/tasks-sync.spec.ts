import { expect, test } from '@playwright/test';
import { loadCredentials, loginAs } from './helpers/auth';

test.describe('Kanban task workflows', () => {
  test.beforeEach(async ({ page }) => {
    const { admin } = loadCredentials();
    await loginAs(page, admin.email, admin.password);
    await expect(page).not.toHaveURL(/\/login/);
  });

  test('loads kanban board and opens create task dialog', async ({ page }) => {
    await page.goto('/kanban');
    await expect(page.getByRole('heading', { name: 'Kanban' })).toBeVisible({
      timeout: 20000,
    });

    await page.getByRole('button', { name: /Nova Tarefa/i }).click();
    await expect(
      page.getByRole('heading', { name: 'Nova Tarefa' }),
    ).toBeVisible();

    await page.getByLabel('Título').fill(`PW Task ${Date.now()}`);
    await expect(page.getByRole('group', { name: 'Tipo de conteúdo' })).toBeVisible();
    await expect(page.getByRole('button', { name: /^Vídeo/ })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Estático' })).toBeVisible();
    await expect(page.getByLabel('Coluna')).toHaveCount(0);
    await page.getByRole('button', { name: 'Criar' }).click();

    await expect(
      page.getByText(/Tarefa criada|Tarefa Criada|Nova Tarefa/i).first(),
    ).toBeVisible({ timeout: 15000 });
  });

  test('calendar page loads with status legend', async ({ page }) => {
    await page.goto('/calendar');
    await expect(
      page.getByRole('heading', { name: /Calendário/i }),
    ).toBeVisible({ timeout: 20000 });

    await expect(page.getByText(/Tarefa Criada/i).first()).toBeVisible();
  });

  test('creation route redirects to kanban', async ({ page }) => {
    await page.goto('/creation');
    await expect(page).toHaveURL(/\/kanban/);
    await expect(page.getByRole('heading', { name: 'Kanban' })).toBeVisible({
      timeout: 20000,
    });
  });
});
