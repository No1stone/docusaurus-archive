#!/usr/bin/env node
/**
 * Read-only description audit for docs (and optional blog).
 * Does not modify markdown. Writes reports only.
 *
 * Usage:
 *   node scripts/seo-audit-descriptions.mjs
 *   node scripts/seo-audit-descriptions.mjs --include-blog
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const includeBlog = process.argv.includes('--include-blog');

const SHORT = 40;
const LONG = 160;

function walk(dir, acc = []) {
  if (!fs.existsSync(dir)) {
    return acc;
  }
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) {
      walk(full, acc);
    } else if (/\.(md|mdx)$/.test(name)) {
      acc.push(full);
    }
  }
  return acc;
}

function parseFrontMatter(text) {
  if (!text.startsWith('---')) {
    return null;
  }
  const end = text.indexOf('\n---', 3);
  if (end < 0) {
    return null;
  }
  return text.slice(3, end);
}

function getDescription(fm) {
  const m = fm.match(/^description:\s*(.*)$/m);
  if (!m) {
    return {present: false, value: null};
  }
  let value = m[1].trim();
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1);
  }
  return {present: true, value};
}

function isDraftish(value) {
  if (!value) {
    return true;
  }
  const v = value.trim();
  return (
    v.includes('작성 예정') ||
    v.endsWith('(작성 예정)') ||
    /^draft$/i.test(v) ||
    /^todo$/i.test(v)
  );
}

const dirs = [path.join(root, 'docs')];
if (includeBlog) {
  dirs.push(path.join(root, 'blog'));
}

const files = dirs.flatMap((d) => walk(d));
const issues = [];
const byDescription = new Map();

for (const file of files) {
  const rel = path.relative(root, file);
  const text = fs.readFileSync(file, 'utf8');
  const fm = parseFrontMatter(text);
  if (fm == null) {
    issues.push({file: rel, code: 'MISSING', detail: 'no front matter'});
    continue;
  }
  const {present, value} = getDescription(fm);
  if (!present) {
    issues.push({file: rel, code: 'MISSING', detail: 'no description key'});
    continue;
  }
  if (!value) {
    issues.push({file: rel, code: 'EMPTY', detail: 'empty description'});
    continue;
  }
  if (value.length < SHORT) {
    issues.push({
      file: rel,
      code: 'SHORT',
      detail: `length=${value.length}`,
      description: value,
    });
  }
  if (value.length > LONG) {
    issues.push({
      file: rel,
      code: 'LONG',
      detail: `length=${value.length}`,
      description: value,
    });
  }
  if (isDraftish(value)) {
    issues.push({
      file: rel,
      code: 'DRAFTISH',
      detail: 'draft-like description',
      description: value,
    });
  }
  const list = byDescription.get(value) || [];
  list.push(rel);
  byDescription.set(value, list);
}

for (const [description, fileList] of byDescription) {
  if (fileList.length > 1) {
    for (const file of fileList) {
      issues.push({
        file,
        code: 'DUP',
        detail: `shared_by=${fileList.length}`,
        description,
        peers: fileList.filter((f) => f !== file),
      });
    }
  }
}

const counts = {};
for (const issue of issues) {
  counts[issue.code] = (counts[issue.code] || 0) + 1;
}

const report = {
  generatedAt: new Date().toISOString(),
  root,
  includeBlog,
  totals: {
    filesScanned: files.length,
    issues: issues.length,
    byCode: counts,
  },
  issues: issues.sort((a, b) =>
    a.code === b.code ? a.file.localeCompare(b.file) : a.code.localeCompare(b.code),
  ),
};

const outDir = path.join(root, 'reports');
fs.mkdirSync(outDir, {recursive: true});
const jsonPath = path.join(outDir, 'seo-description-audit.json');
fs.writeFileSync(jsonPath, `${JSON.stringify(report, null, 2)}\n`);

const mdLines = [
  '# SEO description audit',
  '',
  `- generatedAt: ${report.generatedAt}`,
  `- filesScanned: ${report.totals.filesScanned}`,
  `- includeBlog: ${includeBlog}`,
  `- issues: ${report.totals.issues}`,
  '',
  '## Counts',
  '',
  ...Object.entries(counts)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([code, n]) => `- ${code}: ${n}`),
  '',
  '## Notes',
  '',
  '- This report is read-only. Markdown bodies were not modified.',
  `- SHORT threshold: < ${SHORT} chars; LONG: > ${LONG} chars.`,
  '',
];

fs.writeFileSync(path.join(outDir, 'seo-description-audit.md'), mdLines.join('\n'));
console.log(JSON.stringify(report.totals, null, 2));
console.log(`wrote ${path.relative(root, jsonPath)}`);
console.log(`wrote reports/seo-description-audit.md`);
