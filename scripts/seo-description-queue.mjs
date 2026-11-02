#!/usr/bin/env node
/**
 * Build P2 auto/review/skip queue from seo-description-audit.json.
 * Read-only — does not modify markdown.
 *
 * Usage: node scripts/seo-description-queue.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {
  SUBSTANTIVE_PLAIN,
  WAVE_B_PREFIXES,
  bodyPlain,
  isScratchFile,
  isStubBody,
  loadAudit,
  splitFrontMatter,
  waveBOrder,
} from './seo-description-lib.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const audit = loadAudit(root);
const byFile = new Map();
for (const issue of audit.issues) {
  const entry = byFile.get(issue.file) || {file: issue.file, codes: new Set(), issues: []};
  entry.codes.add(issue.code);
  entry.issues.push(issue);
  byFile.set(issue.file, entry);
}

const rows = [];

for (const [file, entry] of [...byFile.entries()].sort((a, b) =>
  a[0].localeCompare(b[0]),
)) {
  const codes = [...entry.codes].sort();
  const abs = path.join(root, file);
  let plainLen = 0;
  let stub = false;
  let hasFm = false;
  if (fs.existsSync(abs)) {
    const text = fs.readFileSync(abs, 'utf8');
    const parts = splitFrontMatter(text);
    if (parts) {
      hasFm = true;
      plainLen = bodyPlain(parts.body).length;
      stub = isStubBody(parts.body, parts.fm);
    }
  }

  let wave = 'E';
  let mode = 'skip';
  let reason = '';

  if (codes.includes('MISSING') || file.startsWith('docs/harness/')) {
    wave = 'E';
    mode = 'skip';
    reason = 'harness/internal — out of P2 success metrics';
  } else if (codes.includes('DRAFTISH')) {
    wave = 'A';
    mode = stub || plainLen < SUBSTANTIVE_PLAIN ? 'review' : 'auto';
    reason = mode === 'review' ? 'stub body — template B + human review' : 'draftish with body';
  } else if (codes.includes('DUP')) {
    wave = 'C';
    mode = 'review';
    reason = 'duplicate description pair — differentiate or defer merge';
  } else if (codes.includes('SHORT')) {
    const inWaveB = WAVE_B_PREFIXES.some((p) => file.startsWith(p));
    if (isScratchFile(file) && !inWaveB) {
      wave = 'D';
      mode = 'skip';
      reason = 'scratch / low search value';
    } else if (inWaveB) {
      wave = 'B';
      if (/\/index\.mdx?$/.test(file)) {
        mode = 'auto';
        reason = 'index — template C';
      } else if (plainLen >= SUBSTANTIVE_PLAIN && !stub) {
        mode = 'auto';
        reason = 'substantive body — template A';
      } else if (plainLen >= 80 && !stub) {
        mode = 'auto';
        reason = 'partial body — expand from title+paragraph';
      } else {
        mode = 'review';
        reason = 'thin body — needs human description';
      }
    } else if (isScratchFile(file) || /^docs\/architecture\/작업-/.test(file)) {
      wave = 'D';
      mode = 'skip';
      reason = 'scratch / low search value';
    } else {
      wave = 'D';
      if (plainLen >= SUBSTANTIVE_PLAIN && !stub) {
        mode = 'auto';
        reason = 'remaining SHORT with body';
      } else {
        mode = 'review';
        reason = 'remaining SHORT thin/scratch-like';
      }
    }
  } else {
    wave = 'D';
    mode = 'skip';
    reason = `unhandled codes: ${codes.join(',')}`;
  }

  rows.push({
    file,
    codes,
    wave,
    mode,
    reason,
    plainLen,
    stub,
    hasFm,
    waveBOrder: waveBOrder(file),
  });
}

rows.sort((a, b) => {
  const w = a.wave.localeCompare(b.wave);
  if (w) return w;
  if (a.wave === 'B') {
    const o = a.waveBOrder - b.waveBOrder;
    if (o) return o;
  }
  const m = a.mode.localeCompare(b.mode);
  if (m) return m;
  return a.file.localeCompare(b.file);
});

const summary = {
  total: rows.length,
  byWave: {},
  byMode: {},
};
for (const r of rows) {
  summary.byWave[r.wave] = (summary.byWave[r.wave] || 0) + 1;
  summary.byMode[r.mode] = (summary.byMode[r.mode] || 0) + 1;
}

const outDir = path.join(root, 'reports');
fs.mkdirSync(outDir, {recursive: true});
const jsonPath = path.join(outDir, 'seo-description-p2-queue.json');
fs.writeFileSync(
  jsonPath,
  `${JSON.stringify({generatedAt: new Date().toISOString(), summary, rows}, null, 2)}\n`,
);

const md = [
  '# SEO description P2 queue',
  '',
  `- generatedAt: ${new Date().toISOString()}`,
  `- total files: ${summary.total}`,
  `- byWave: ${JSON.stringify(summary.byWave)}`,
  `- byMode: ${JSON.stringify(summary.byMode)}`,
  '',
  '| wave | mode | file | codes | plainLen | reason |',
  '|------|------|------|-------|----------|--------|',
  ...rows.map(
    (r) =>
      `| ${r.wave} | ${r.mode} | \`${r.file}\` | ${r.codes.join('+')} | ${r.plainLen} | ${r.reason} |`,
  ),
  '',
];
fs.writeFileSync(path.join(outDir, 'seo-description-p2-queue.md'), md.join('\n'));

console.log(JSON.stringify(summary, null, 2));
console.log(`wrote ${path.relative(root, jsonPath)}`);
console.log('wrote reports/seo-description-p2-queue.md');
