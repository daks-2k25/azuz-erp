#!/usr/bin/env node
import { createRequire } from "module";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const require = createRequire(
  resolve(dirname(fileURLToPath(import.meta.url)), "../../atria-erp-nextjs/package.json"),
);
const { chromium } = require("@playwright/test");

const __dirname = dirname(fileURLToPath(import.meta.url));

const mdPath = resolve(process.argv[2] ?? joinDocs("funcionalidades-atria-erp.md"));
const pdfPath = resolve(
  process.argv[3] ?? mdPath.replace(/\.md$/i, ".pdf"),
);

function joinDocs(name) {
  return resolve(__dirname, "..", name);
}

const md = readFileSync(mdPath, "utf8");

function mdToHtml(markdown) {
  let html = markdown
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>\n?)+/g, (m) => `<ul>${m}</ul>`)
    .replace(/^---$/gm, "<hr/>")
    .replace(/^\*(.+)\*$/gm, "<p class=\"footnote\">$1</p>");

  const lines = html.split("\n");
  const out = [];
  let inTable = false;
  for (const line of lines) {
    if (line.startsWith("|")) {
      if (line.includes("---")) continue;
      const cells = line
        .split("|")
        .slice(1, -1)
        .map((c) => `<td>${c.trim()}</td>`)
        .join("");
      if (!inTable) {
        out.push(
          "<table border=\"1\" cellpadding=\"6\" cellspacing=\"0\" style=\"border-collapse:collapse;width:100%;font-size:11px\">",
        );
        inTable = true;
      }
      out.push(`<tr>${cells}</tr>`);
    } else {
      if (inTable) {
        out.push("</table>");
        inTable = false;
      }
      if (line.trim() && !line.startsWith("<")) {
        out.push(`<p>${line}</p>`);
      } else {
        out.push(line);
      }
    }
  }
  if (inTable) out.push("</table>");
  return out.join("\n");
}

const html = `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="utf-8"><style>
body{font-family:Helvetica,Arial,sans-serif;font-size:12px;line-height:1.5;margin:32px;color:#1a1a1a}
h1{font-size:22px;border-bottom:2px solid #2c3e50;padding-bottom:8px;color:#2c3e50}
h2{font-size:16px;margin-top:22px;color:#2c3e50}
h3{font-size:13px;margin-top:14px}
table{margin:10px 0 14px}
td,th{padding:6px 8px;vertical-align:top;border:1px solid #ccc}
ul{margin:6px 0 10px 20px}
p{margin:5px 0}
hr{margin:18px 0;border:none;border-top:1px solid #ddd}
.footnote{font-size:10px;color:#666;font-style:italic;margin-top:24px}
strong{color:#111}
</style></head><body>${mdToHtml(md)}</body></html>`;

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.setContent(html, { waitUntil: "networkidle" });
await page.pdf({
  path: pdfPath,
  format: "A4",
  printBackground: true,
  margin: { top: "16mm", bottom: "16mm", left: "14mm", right: "14mm" },
});
await browser.close();
console.log("PDF gerado:", pdfPath);
