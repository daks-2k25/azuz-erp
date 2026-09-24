import { expect, test, type Page } from '@playwright/test';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { loginAs } from './helpers/auth';

type CheckResult = {
  name: string;
  ok: boolean;
  detail: string;
  url?: string;
};

const QA_EMAIL = process.env.QA_EMAIL ?? 'qa-user-1786105836@atria.test';
const QA_PASSWORD = process.env.QA_PASSWORD ?? 'QaTest!Pass123';

const ROUTES: { name: string; path: string }[] = [
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Meta Insights', path: '/insights' },
  { name: 'Kanban', path: '/kanban' },
  { name: 'Calendário', path: '/calendar' },
  { name: 'Clientes', path: '/clients' },
  { name: 'Prospecção de Leads', path: '/leads' },
  { name: 'Leads Kanban', path: '/leads/kanban' },
  { name: 'Financeiro', path: '/financial' },
  { name: 'Contratos', path: '/contracts' },
  { name: 'Propostas', path: '/proposals' },
  { name: 'Operações', path: '/operations' },
  { name: 'Settings Branding', path: '/settings/branding' },
  { name: 'Settings Appearance', path: '/settings/appearance' },
  { name: 'Settings API Integrations', path: '/settings/api-integrations' },
  { name: 'Settings Users', path: '/settings/users' },
  { name: 'Assets', path: '/assets' },
  { name: 'Reports', path: '/reports' },
  { name: 'Resumos', path: '/resumos' },
];

const results: CheckResult[] = [];

function record(result: CheckResult) {
  results.push(result);
  const mark = result.ok ? 'PASS' : 'FAIL';
  console.log(`[${mark}] ${result.name}: ${result.detail}`);
}

async function pageHasFatalError(page: Page): Promise<string | null> {
  const bodyText = ((await page.locator('body').innerText().catch(() => '')) || '')
    .slice(0, 4000)
    .toLowerCase();

  const fatalPatterns = [
    'application error',
    'unhandled runtime error',
    'internal server error',
    'this page could not be found',
    'something went wrong',
    'erro inesperado',
    'failed to fetch',
  ];

  for (const pattern of fatalPatterns) {
    if (bodyText.includes(pattern)) return `Page shows: "${pattern}"`;
  }

  // Next.js error overlay
  const nextError = page.locator('#__next-build-error, [data-nextjs-dialog-overlay]');
  if (await nextError.first().isVisible().catch(() => false)) {
    return 'Next.js error overlay visible';
  }

  return null;
}

async function visitRoute(page: Page, name: string, path: string) {
  const failedApi: string[] = [];
  const onResponse = (res: import('@playwright/test').Response) => {
    const reqUrl = res.url();
    if (
      res.status() >= 400 &&
      (reqUrl.includes('localhost:3001') ||
        reqUrl.includes('/api/') ||
        reqUrl.includes('/auth/'))
    ) {
      failedApi.push(`${res.status()} ${reqUrl.slice(0, 180)}`);
    }
  };
  const pageErrors: string[] = [];
  const onPageError = (err: Error) => pageErrors.push(err.message.slice(0, 300));

  page.on('response', onResponse);
  page.on('pageerror', onPageError);

  try {
    const response = await page.goto(path, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(1500);

    const status = response?.status() ?? 0;
    const url = page.url();
    const fatal = await pageHasFatalError(page);

    if (url.includes('/login')) {
      record({
        name: `Route: ${name}`,
        ok: false,
        detail: `Redirected to login (status ${status})`,
        url,
      });
      return;
    }

    if (status >= 500) {
      record({
        name: `Route: ${name}`,
        ok: false,
        detail: `HTTP ${status}`,
        url,
      });
      return;
    }

    if (fatal) {
      record({ name: `Route: ${name}`, ok: false, detail: fatal, url });
      return;
    }

    const hardApiFails = failedApi.filter((f) => !f.includes('/auth/refresh') || f.startsWith('500'));
    if (pageErrors.length > 0 || hardApiFails.some((f) => f.startsWith('5'))) {
      record({
        name: `Route: ${name}`,
        ok: false,
        detail: `Errors: ${[...pageErrors, ...hardApiFails].slice(0, 3).join(' | ')}`,
        url,
      });
      return;
    }

    record({
      name: `Route: ${name}`,
      ok: true,
      detail:
        failedApi.length > 0
          ? `Loaded with non-fatal API issues: ${failedApi.slice(0, 2).join(' | ')}`
          : `Loaded OK (HTTP ${status || 'n/a'})`,
      url,
    });
  } catch (err) {
    record({
      name: `Route: ${name}`,
      ok: false,
      detail: err instanceof Error ? err.message : String(err),
      url: page.url(),
    });
  } finally {
    page.off('response', onResponse);
    page.off('pageerror', onPageError);
  }
}

async function tryCreateClient(page: Page) {
  await page.goto('/clients', { waitUntil: 'domcontentloaded' });
  const openBtn = page.getByRole('button', { name: /novo cliente/i }).first();
  try {
    await openBtn.waitFor({ state: 'visible', timeout: 15000 });
  } catch {
    record({
      name: 'CRUD: Create client dialog',
      ok: false,
      detail: 'Novo Cliente button not found',
      url: page.url(),
    });
    return;
  }

  await openBtn.click();
  await page.waitForTimeout(500);

  const stamp = Date.now();
  const name = `QA Client ${stamp}`;

  const companyInput = page.getByLabel(/empresa|razão|nome da empresa|company/i).first();
  const nameInput = page.getByLabel(/^nome$/i).first();
  if (await companyInput.isVisible().catch(() => false)) {
    await companyInput.fill(name);
  } else if (await nameInput.isVisible().catch(() => false)) {
    await nameInput.fill(name);
  } else {
    // Fallback: first text input in dialog
    await page.locator('[role="dialog"] input').first().fill(name);
  }

  const emailInput = page.getByLabel(/e-?mail/i).first();
  if (await emailInput.isVisible().catch(() => false)) {
    await emailInput.fill(`qa.client.${stamp}@example.com`);
  }

  const submit = page.getByRole('button', { name: /criar cliente|salvar|criar/i }).last();
  await submit.click();
  await page.getByText(name).first().waitFor({ state: 'visible', timeout: 15000 }).catch(() => null);

  const visible = await page.getByText(name).first().isVisible().catch(() => false);
  record({
    name: 'CRUD: Create client',
    ok: visible,
    detail: visible ? `Created "${name}"` : 'Client name not visible after submit',
    url: page.url(),
  });
}

async function tryCreateProposal(page: Page) {
  await page.goto('/proposals/new', { waitUntil: 'domcontentloaded' });
  try {
    await page.getByText(/nova proposta/i).first().waitFor({ state: 'visible', timeout: 15000 });
  } catch {
    record({
      name: 'CRUD: New proposal page',
      ok: false,
      detail: 'Proposal page heading not found',
      url: page.url(),
    });
    return;
  }

  const titleInput = page.locator('input').nth(1);
  const stamp = Date.now();
  const title = `QA Proposal ${stamp}`;

  // Prefer labeled title field when available
  const labeled = page.getByLabel(/título/i).first();
  if (await labeled.isVisible().catch(() => false)) {
    await labeled.fill(title);
  } else {
    await titleInput.fill(title);
  }

  // Select first client if searchable select present
  const clientTrigger = page.getByRole('button', { name: /selecione/i }).first();
  if (await clientTrigger.isVisible().catch(() => false)) {
    await clientTrigger.click();
    await page.waitForTimeout(400);
    const option = page.locator('[role="option"], [cmdk-item], li').first();
    if (await option.isVisible().catch(() => false)) {
      await option.click();
    } else {
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('Enter');
    }
  }

  const saveBtn = page.getByRole('button', { name: /salvar rascunho|salvar/i }).first();
  if (await saveBtn.isVisible().catch(() => false)) {
    await saveBtn.click();
    await page.waitForTimeout(2000);
  }

  const fatal = await pageHasFatalError(page);
  const stillOnForm = await page.getByText(/nova proposta|editar proposta|proposta/i).first().isVisible().catch(() => false);
  record({
    name: 'CRUD: New proposal page',
    ok: !fatal && stillOnForm && !page.url().includes('/login'),
    detail: fatal ?? `Proposal form usable; title set to "${title}"`,
    url: page.url(),
  });
}

async function tryOpenKanban(page: Page) {
  const failed: string[] = [];
  const onResponse = (res: import('@playwright/test').Response) => {
    if (res.url().includes('/creation/pipeline') && res.status() >= 400) {
      failed.push(`${res.status()} ${res.url()}`);
    }
  };
  page.on('response', onResponse);
  await page.goto('/kanban', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2500);
  page.off('response', onResponse);

  const boardish =
    (await page.locator('[data-rbd-droppable-id], [class*="kanban"], [class*="column"]').first().isVisible().catch(() => false)) ||
    (await page.getByText(/a fazer|todo|em progresso|done|conclu|kanban/i).first().isVisible().catch(() => false));
  const fatal = await pageHasFatalError(page);
  const pipelineOk = failed.length === 0;
  record({
    name: 'Feature: Kanban board',
    ok: !fatal && pipelineOk,
    detail:
      fatal ??
      (pipelineOk
        ? boardish
          ? 'Board UI present; pipeline OK'
          : 'Page loaded; pipeline OK'
        : `Pipeline errors: ${failed.slice(0, 2).join(' | ')}`),
    url: page.url(),
  });
}

async function tryUsersPage(page: Page) {
  const usersResponses: number[] = [];
  const onResponse = (res: import('@playwright/test').Response) => {
    if (res.url().includes('localhost:3001/users') && !res.url().includes('/users/')) {
      usersResponses.push(res.status());
    }
  };
  page.on('response', onResponse);

  await page.goto('/settings/users', { waitUntil: 'domcontentloaded' });
  const addMember = page.getByRole('button', { name: /adicionar membro|provisionar|novo usuário|criar usuário/i }).first();
  try {
    await addMember.waitFor({ state: 'visible', timeout: 15000 });
  } catch {
    page.off('response', onResponse);
    record({
      name: 'Feature: Users settings',
      ok: false,
      detail: 'Users UI incomplete',
      url: page.url(),
    });
    return;
  }

  // Wait until members finished loading (count leaves the loading placeholder).
  await page
    .waitForFunction(() => {
      const el = Array.from(document.querySelectorAll('button')).find((b) =>
        /Membros\s*\(/i.test(b.textContent || ''),
      );
      if (!el) return false;
      const text = el.textContent || '';
      if (text.includes('…') || text.includes('...')) return false;
      const match = text.match(/Membros\s*\((\d+)\)/i);
      return match ? Number(match[1]) > 0 : false;
    }, undefined, { timeout: 15000 })
    .catch(() => null);

  page.off('response', onResponse);

  const membersLabel = await page.getByText(/membros\s*\(/i).first().innerText().catch(() => '');
  const countMatch = membersLabel.match(/(\d+)/);
  const count = countMatch ? Number(countMatch[1]) : -1;
  record({
    name: 'Feature: Users settings',
    ok: count >= 1,
    detail: `Users UI present (${membersLabel || 'no count'}); /users statuses=${usersResponses.join(',') || 'none'}`,
    url: page.url(),
  });
}

test.describe.configure({ mode: 'serial' });

test('full QA smoke with newly registered user', async ({ page }) => {
  test.setTimeout(300000);

  // Login
  try {
    await loginAs(page, QA_EMAIL, QA_PASSWORD);
  } catch (err) {
    record({
      name: 'Auth: Login with new user',
      ok: false,
      detail: err instanceof Error ? err.message : String(err),
      url: page.url(),
    });
    throw err;
  }

  const loggedIn = !page.url().includes('/login');
  record({
    name: 'Auth: Login with new user',
    ok: loggedIn,
    detail: loggedIn ? `Logged in as ${QA_EMAIL}` : `Still on login: ${page.url()}`,
    url: page.url(),
  });

  expect(loggedIn).toBeTruthy();

  for (const route of ROUTES) {
    await visitRoute(page, route.name, route.path);
  }

  await tryCreateClient(page);
  await tryCreateProposal(page);
  await tryOpenKanban(page);
  await tryUsersPage(page);

  // Forgot password placeholder check
  await page.goto('/forgot-password', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);
  const body = (await page.locator('body').innerText()).toLowerCase();
  record({
    name: 'Auth: Forgot password page',
    ok: !body.includes('application error'),
    detail: body.includes('em breve')
      ? 'Placeholder only (em breve) — expected incomplete'
      : 'Page loaded',
    url: page.url(),
  });

  const outDir = join(__dirname, 'qa-results');
  mkdirSync(outDir, { recursive: true });
  const report = {
    user: QA_EMAIL,
    generatedAt: new Date().toISOString(),
    passed: results.filter((r) => r.ok).length,
    failed: results.filter((r) => !r.ok).length,
    results,
  };
  writeFileSync(join(outDir, 'full-qa-smoke.json'), JSON.stringify(report, null, 2));
  console.log('\n=== QA SUMMARY ===');
  console.log(`PASS: ${report.passed}  FAIL: ${report.failed}`);
  for (const r of results.filter((x) => !x.ok)) {
    console.log(` - ${r.name}: ${r.detail}`);
  }

  // Soft assertion: print failures but keep artifacts; fail test if critical auth/routes fail
  const criticalFails = results.filter(
    (r) => !r.ok && (r.name.startsWith('Auth: Login') || r.name.startsWith('Route:')),
  );
  expect(
    criticalFails,
    `Critical failures:\n${criticalFails.map((f) => `${f.name}: ${f.detail}`).join('\n')}`,
  ).toEqual([]);
});
