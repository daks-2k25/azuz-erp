#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { chromium } from '@playwright/test';

const __dirname = dirname(fileURLToPath(import.meta.url));
const mdPath = join(__dirname, '..', 'qa-test-report.md');
const pdfPath = join(__dirname, '..', 'qa-test-report.pdf');

const md = readFileSync(mdPath, 'utf8');

function mdToHtml(markdown) {
  let html = markdown
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, (m) => `<ul>${m}</ul>`)
    .replace(/^---$/gm, '<hr/>');

  const lines = html.split('\n');
  const out = [];
  let inTable = false;
  for (const line of lines) {
    if (line.startsWith('|')) {
      if (line.includes('---')) continue;
      const cells = line
        .split('|')
        .slice(1, -1)
        .map((c) => `<td>${c.trim()}</td>`)
        .join('');
      if (!inTable) {
        out.push('<table border="1" cellpadding="4" cellspacing="0" style="border-collapse:collapse;width:100%;font-size:11px">');
        inTable = true;
      }
      out.push(`<tr>${cells}</tr>`);
    } else {
      if (inTable) {
        out.push('</table>');
        inTable = false;
      }
      if (line.trim() && !line.startsWith('<')) {
        out.push(`<p>${line}</p>`);
      } else {
        out.push(line);
      }
    }
  }
  if (inTable) out.push('</table>');
  return out.join('\n');
}

const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
body{font-family:Helvetica,Arial,sans-serif;font-size:12px;line-height:1.45;margin:32px;color:#111}
h1{font-size:22px;border-bottom:2px solid #333;padding-bottom:8px}
h2{font-size:16px;margin-top:20px;color:#222}
h3{font-size:13px}
table{margin:8px 0 12px}
td,th{padding:4px 6px;vertical-align:top}
ul{margin:4px 0 8px 18px}
p{margin:4px 0}
hr{margin:16px 0}
</style></head><body>${mdToHtml(md)}</body></html>`;

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.setContent(html, { waitUntil: 'networkidle' });
await page.pdf({
  path: pdfPath,
  format: 'A4',
  printBackground: true,
  margin: { top: '16mm', bottom: '16mm', left: '14mm', right: '14mm' },
});
await browser.close();
console.log('Wrote', pdfPath);
