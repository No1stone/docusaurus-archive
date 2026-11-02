#!/usr/bin/env node
/**
 * Restore descriptions from reports/p2-backups/wave-<WAVE>/
 *
 * Usage:
 *   node scripts/seo-description-rollback.mjs --wave A
 *   node scripts/seo-description-rollback.mjs --wave A --dry-run
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {
  bodyHash,
  extractGuardedFields,
  getDescription,
  replaceDescription,
  splitFrontMatter,
} from './seo-description-lib.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

function argValue(name) {
  const eq = process.argv.find((a) => a.startsWith(`${name}=`));
  if (eq) return eq.slice(name.length + 1);
  const i = process.argv.indexOf(name);
  if (i >= 0) return process.argv[i + 1];
  return null;
}

const waveArg = argValue('--wave');
if (!waveArg) {
  console.error('Usage: node scripts/seo-description-rollback.mjs --wave A [--dry-run]');
  process.exit(1);
}
const waveLabel = waveArg
  .split(',')
  .map((w) => w.trim().toUpperCase())
  .filter(Boolean)
  .sort()
  .join('');
const dryRun = process.argv.includes('--dry-run');

const backupDir = path.join(root, 'reports', 'p2-backups', `wave-${waveLabel}`);
if (!fs.existsSync(backupDir)) {
  console.error(`No backups at ${backupDir}`);
  process.exit(1);
}

function walkJson(dir, acc = []) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) walkJson(full, acc);
    else if (name.endsWith('.json')) acc.push(full);
  }
  return acc;
}

const backups = walkJson(backupDir);
let restored = 0;
let failed = 0;
const results = [];

for (const bp of backups) {
  const backup = JSON.parse(fs.readFileSync(bp, 'utf8'));
  const abs = path.join(root, backup.file);
  if (!fs.existsSync(abs)) {
    results.push({file: backup.file, ok: false, error: 'missing file'});
    failed += 1;
    continue;
  }
  const text = fs.readFileSync(abs, 'utf8');
  const parts = splitFrontMatter(text);
  if (!parts) {
    results.push({file: backup.file, ok: false, error: 'no FM'});
    failed += 1;
    continue;
  }
  const guarded = extractGuardedFields(parts.fm);
  if (
    (backup.guarded?.slug || null) !== (guarded.slug || null) ||
    (backup.guarded?.id || null) !== (guarded.id || null)
  ) {
    results.push({file: backup.file, ok: false, error: 'slug/id changed — refuse'});
    failed += 1;
    continue;
  }
  if (backup.bodyHash && bodyHash(parts.body) !== backup.bodyHash) {
    results.push({file: backup.file, ok: false, error: 'body changed — refuse'});
    failed += 1;
    continue;
  }
  const current = getDescription(parts.fm).value;
  if (current !== backup.after && current !== backup.before) {
    results.push({
      file: backup.file,
      ok: false,
      error: 'description neither before nor after — refuse',
    });
    failed += 1;
    continue;
  }
  const newFm = replaceDescription(parts.fm, backup.before);
  const finalText = `---\n${newFm.replace(/^\n+/, '').replace(/\n+$/, '')}\n---\n${parts.body}`;
  const verify = splitFrontMatter(finalText);
  if (!verify || verify.body !== parts.body) {
    results.push({file: backup.file, ok: false, error: 'body not preserved'});
    failed += 1;
    continue;
  }
  if (dryRun) {
    results.push({file: backup.file, ok: true, dryRun: true, restoreTo: backup.before});
    restored += 1;
    continue;
  }
  fs.writeFileSync(abs, finalText);
  results.push({file: backup.file, ok: true, restored: true});
  restored += 1;
}

console.log(
  JSON.stringify(
    {wave: waveLabel, dryRun, backups: backups.length, restored, failed},
    null,
    2,
  ),
);
if (failed > 0) process.exitCode = 1;
