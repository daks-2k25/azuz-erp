#!/usr/bin/env node
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..', '..');
const DOCS = join(ROOT, 'docs');
const ART = join(DOCS, 'qa-artifacts');

function readJson(path, fallback = null) {
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch {
    return fallback;
  }
}

function readText(path, fallback = '') {
  try {
    return readFileSync(path, 'utf8');
  } catch {
    return fallback;
  }
}

const rbac = readJson(join(ART, 'rbac-api-results.json'), { results: [], passed: 0, failed: 0, total: 0, roleUsers: {} });
const now = new Date();
const dateStr = now.toISOString().slice(0, 10);

const backendUnit = {
  passed: 16,
  failed: 2,
  total: 18,
  notes: 'kanban-defaults.spec.ts — 2 failures on statusLabel expectations',
};

const backendE2e = {
  passed: 0,
  failed: 0,
  skipped: 9,
  total: 9,
  notes: 'All 9 suites blocked: Cannot find module src/ai/ai.service in Jest e2e bootstrap',
};

const playwrightAuth = { passed: 2, failed: 0, total: 2 };
const playwrightPortal = { passed: 0, failed: 1, total: 1, notes: 'e2e-client@atria.test login blocked — client unlinked from company' };

const grand = {
  passed: rbac.passed + backendUnit.passed + playwrightAuth.passed,
  failed: rbac.failed + backendUnit.failed + playwrightPortal.failed,
  skipped: backendE2e.skipped,
  total:
    rbac.total +
    backendUnit.total +
    backendE2e.total +
    playwrightAuth.total +
    playwrightPortal.total,
};

const sections = [
  'Auth',
  'User provisioning',
  'RBAC/Kanban',
  'Clients module',
  'Client portal',
  'Creation pipeline',
  'Other routes',
  'Backend unit tests',
  'Backend e2e (Jest)',
  'Frontend e2e (Playwright)',
];

function groupResults(source, section) {
  return (source.results ?? []).filter((r) => r.section === section);
}

const extraFrontend = [
  {
    section: 'Frontend e2e (Playwright)',
    name: 'Admin login and logout',
    role: 'ADMIN',
    steps: 'Playwright e2e/auth.spec.ts — login e2e-admin, logout',
    result: 'PASS',
    expected: 'Redirect off /login',
    actual: 'Passed in 5.9s',
    notes: '',
  },
  {
    section: 'Frontend e2e (Playwright)',
    name: 'Invalid password shows login error',
    role: 'ALL',
    steps: 'Playwright e2e/auth.spec.ts — wrong password',
    result: 'PASS',
    expected: 'Stay on /login',
    actual: 'Passed in 2.4s',
    notes: '',
  },
  {
    section: 'Frontend e2e (Playwright)',
    name: 'Client portal redirect and staff block',
    role: 'CLIENT',
    steps: 'Playwright e2e/client-portal.spec.ts',
    result: 'FAIL',
    expected: 'Land on /client-portal',
    actual: 'Login timeout — e2e-client@atria.test returns 401 (no linked company)',
    notes: 'API GET /client-portal works when clientId is valid (verified separately before seed breakage)',
  },
];

const extraBackendUnit = [
  {
    section: 'Backend unit tests',
    name: 'Jest unit suite (src/)',
    role: 'ALL',
    steps: 'npm test in atria-backend',
    result: 'FAIL',
    expected: '18/18 pass',
    actual: '16 passed, 2 failed',
    notes: backendUnit.notes,
  },
];

const extraBackendE2e = [
  {
    section: 'Backend e2e (Jest)',
    name: 'Jest e2e suite (test/*.e2e-spec.ts)',
    role: 'ALL',
    steps: 'npm run test:e2e in atria-backend',
    result: 'SKIP',
    expected: '9 suites runnable',
    actual: '0 tests executed — bootstrap module resolution failure',
    notes: backendE2e.notes,
  },
];

const allResults = [
  ...rbac.results,
  ...extraFrontend,
  ...extraBackendUnit,
  ...extraBackendE2e,
];

const failures = allResults.filter((r) => r.result === 'FAIL' || r.result === 'SKIP');

function mdTable(rows) {
  if (!rows.length) return '_No tests in this section._\n';
  let md = '| Test | Role | Steps | Result | Expected | Actual | Notes |\n';
  md += '|------|------|-------|--------|----------|--------|-------|\n';
  for (const r of rows) {
    md += `| ${r.name} | ${r.role} | ${r.steps.replace(/\|/g, '/')} | **${r.result}** | ${r.expected} | ${r.actual} | ${(r.notes || '').replace(/\|/g, '/')} |\n`;
  }
  return md + '\n';
}

let md = `# Atria ERP — Comprehensive QA Test Report\n\n`;
md += `**Date:** ${dateStr}  \n`;
md += `**Environment:** Local development  \n`;
md += `**Frontend:** http://localhost:3000 (Next.js ${readJson(join(ROOT, 'atria-erp-nextjs/package.json'))?.dependencies?.next ?? '16.x'})  \n`;
md += `**Backend API:** http://localhost:3001 (NestJS atria-backend v${readJson(join(ROOT, 'atria-backend/package.json'))?.version ?? '0.0.1'})  \n`;
md += `**Node:** ${process.version}  \n`;
md += `**QA run id:** ${rbac.runId ?? 'n/a'}  \n\n`;

md += `## Executive summary\n\n`;
md += `Automated QA covered live API RBAC checks (all 7 roles), backend unit tests, backend e2e (blocked), and Playwright UI smoke tests. Core RBAC behaviors for designers, internal approval, and staff/client separation **passed** against the running API. Failures concentrate on **CLIENT user provisioning** (Prisma bug), **broken e2e seed/client login**, and **Jest e2e bootstrap**.\n\n`;

md += `## Summary table\n\n`;
md += `| Suite | Total | Passed | Failed | Skipped |\n`;
md += `|-------|------:|-------:|-------:|--------:|\n`;
md += `| Live RBAC API (${API_LABEL()}) | ${rbac.total} | ${rbac.passed} | ${rbac.failed} | 0 |\n`;
md += `| Backend unit (Jest) | ${backendUnit.total} | ${backendUnit.passed} | ${backendUnit.failed} | 0 |\n`;
md += `| Backend e2e (Jest) | ${backendE2e.total} | ${backendE2e.passed} | ${backendE2e.failed} | ${backendE2e.skipped} |\n`;
md += `| Playwright auth UI | ${playwrightAuth.total} | ${playwrightAuth.passed} | ${playwrightAuth.failed} | 0 |\n`;
md += `| Playwright client portal UI | ${playwrightPortal.total} | ${playwrightPortal.passed} | ${playwrightPortal.failed} | 0 |\n`;
md += `| **Combined** | **${grand.total}** | **${grand.passed + playwrightAuth.passed}** | **${grand.failed + playwrightPortal.failed}** | **${grand.skipped}** |\n\n`;

md += `## How test users were created\n\n`;
md += `| Role | Email | Password | Method |\n`;
md += `|------|-------|----------|--------|\n`;
md += `| ADMIN (seed) | e2e-admin@atria.test | E2eAdmin!Pass123 | \`npm run test:e2e:seed\` (existing) |\n`;
md += `| CLIENT (seed) | e2e-client@atria.test | E2eClient!Pass123 | Seed script (**currently broken** — FK + unlinked client) |\n`;
for (const [role, u] of Object.entries(rbac.roleUsers ?? {})) {
  if (role === 'ADMIN' || !u?.email) continue;
  md += `| ${role} | ${u.email} | ${u.password ?? 'QaRoleTest!Pass123'} | POST /users/provision (as ADMIN) |\n`;
}
md += `\nProvisioning endpoint: \`POST /users/provision\` authenticated as ADMIN with body \`{ name, role, email, password, clientId? }\`.\n\n`;

md += `## Key RBAC behaviors verified\n\n`;
md += `| Behavior | Result |\n`;
md += `|----------|--------|\n`;
md += `| Internal approve/reject — MASTER only | **PASS** — ADMIN & DESIGNER_MASTER receive 403 |\n`;
md += `| DESIGNER_MASTER — edit any kanban task | **PASS** |\n`;
md += `| DESIGNER_JUNIOR — read-only unassigned, edit assigned | **PASS** (403 unassigned, 200 assigned) |\n`;
md += `| Designers blocked from /clients and /users/clients | **PASS** (403) |\n`;
md += `| CRM access to /clients | **PASS** (200) |\n`;
md += `| CLIENT blocked from staff APIs | **PASS** (403 on /clients, /finance, /users/members) |\n`;
md += `| CLIENT portal API GET /client-portal | **PASS** when clientId linked (200 in earlier run; seed regression broke UI login) |\n`;
md += `| Provision CLIENT / EXTERNAL_CLIENT_CRM | **FAIL** — 500 Prisma \`companyRepresentative.upsert\` invalid \`companyId_userId\` |\n\n`;

for (const section of sections) {
  md += `## ${section}\n\n`;
  const rows = allResults.filter((r) => r.section === section);
  md += mdTable(rows);
}

md += `## Failed tests — details\n\n`;
for (const f of failures) {
  md += `### ${f.name} (${f.result})\n\n`;
  md += `- **Role:** ${f.role}\n`;
  md += `- **Steps:** ${f.steps}\n`;
  md += `- **Expected:** ${f.expected}\n`;
  md += `- **Actual:** ${f.actual}\n`;
  if (f.notes) md += `- **Notes:** ${f.notes}\n`;
  md += `\n`;
}

md += `## Blockers encountered\n\n`;
md += `1. **Backend Jest e2e** cannot bootstrap AppModule — \`src/ai/ai.service\` path alias missing in Jest config.\n`;
md += `2. **E2e seed cleanup** fails with FK \`CalendarEvent_createdById_fkey\` after QA kanban tasks created — prevents Playwright global setup.\n`;
md += `3. **CLIENT provisioning** throws Prisma validation on \`companyRepresentative.upsert\` composite key.\n`;
md += `4. **e2e-client@atria.test** login returns 401 — account without linked company after partial seed failure.\n\n`;

md += `## Recommendations\n\n`;
md += `1. Fix \`UsersService.ensureCompanyRepresentative\` — align Prisma \`where\` clause with schema composite unique (\`companyId_userId\` vs actual model fields).\n`;
md += `2. Add Jest \`moduleNameMapper\` for \`src/*\` imports in \`test/jest-e2e.json\` (same as Nest build paths).\n`;
md += `3. Harden \`cleanupE2EData\` to delete dependent calendar/kanban rows before user deletion.\n`;
md += `4. Re-run \`npm run test:e2e:seed\` after cleanup fix; restore Playwright client-portal spec.\n`;
md += `5. Update \`kanban-defaults.spec.ts\` expectations to match current default status labels.\n`;
md += `6. Add dedicated RBAC e2e spec covering all 7 roles (extend \`run-qa-rbac-api.mjs\` into CI).\n\n`;

md += `## Artifacts\n\n`;
md += `- Markdown: \`docs/qa-test-report.md\`\n`;
md += `- PDF: \`docs/qa-test-report.pdf\`\n`;
md += `- RBAC JSON: \`docs/qa-artifacts/rbac-api-results.json\`\n`;
md += `- Script: \`docs/scripts/run-qa-rbac-api.mjs\`\n\n`;

md += `---\n*Report generated automatically on ${now.toISOString()}*\n`;

function API_LABEL() {
  return rbac.api ?? 'localhost:3001';
}

mkdirSync(DOCS, { recursive: true });
const mdPath = join(DOCS, 'qa-test-report.md');
writeFileSync(mdPath, md);
console.log('Wrote', mdPath);

const pdfPath = join(DOCS, 'qa-test-report.pdf');

// Try pandoc first, then md-to-pdf
let pdfOk = false;
try {
  execSync(`pandoc "${mdPath}" -o "${pdfPath}" --pdf-engine=wkhtmltopdf`, { stdio: 'pipe' });
  pdfOk = true;
  console.log('Wrote PDF via pandoc');
} catch {
  try {
    execSync(`pandoc "${mdPath}" -o "${pdfPath}"`, { stdio: 'pipe' });
    pdfOk = true;
    console.log('Wrote PDF via pandoc (default engine)');
  } catch {
    // fallback: npx md-to-pdf
  }
}

if (!pdfOk) {
  try {
    execSync(`npx --yes md-to-pdf "${mdPath}" --dest "${pdfPath}"`, {
      cwd: DOCS,
      stdio: 'inherit',
      env: { ...process.env, PUPPETEER_SKIP_DOWNLOAD: 'false' },
    });
    pdfOk = existsSync(pdfPath);
    if (pdfOk) console.log('Wrote PDF via md-to-pdf');
  } catch (e) {
    console.error('md-to-pdf failed', e.message);
  }
}

if (!pdfOk) {
  // Minimal PDF via Python reportlab if available
  try {
    const py = `import sys\nfrom reportlab.lib.pagesizes import A4\nfrom reportlab.pdfgen import canvas\nfrom reportlab.lib.units import cm\n\nmd=open(sys.argv[1]).read().split('\\n')\nc=canvas.Canvas(sys.argv[2], pagesize=A4)\nw,h=A4\ny=h-2*cm\nfor line in md:\n    if y<2*cm:\n        c.showPage(); y=h-2*cm\n    c.setFont('Helvetica', 9)\n    c.drawString(2*cm, y, line[:110])\n    y-=0.45*cm\nc.save()\n`;
    writeFileSync(join(ART, '_pdf_gen.py'), py);
    execSync(`python3 "${join(ART, '_pdf_gen.py')}" "${mdPath}" "${pdfPath}"`, { stdio: 'inherit' });
    pdfOk = existsSync(pdfPath);
    if (pdfOk) console.log('Wrote PDF via reportlab fallback');
  } catch (e) {
    console.error('PDF generation failed — markdown report available at', mdPath);
  }
}

console.log(JSON.stringify({ mdPath, pdfPath, pdfOk, grand }, null, 2));
