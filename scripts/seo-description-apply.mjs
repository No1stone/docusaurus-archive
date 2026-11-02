#!/usr/bin/env node
/**
 * Apply proposed description patches (description key only).
 * Default: --dry-run. Use --apply to write files.
 *
 * Usage:
 *   node scripts/seo-description-apply.mjs --wave A
 *   node scripts/seo-description-apply.mjs --wave A --apply
 *   node scripts/seo-description-apply.mjs --wave A --apply --modes auto
 *   node scripts/seo-description-apply.mjs --wave A --apply --modes auto,review
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
  console.error('Usage: node scripts/seo-description-apply.mjs --wave A [--apply] [--modes auto,review]');
  process.exit(1);
}
const waves = waveArg
  .split(',')
  .map((w) => w.trim().toUpperCase())
  .filter(Boolean);
const waveLabel = [...waves].sort().join('');
const doApply = process.argv.includes('--apply');
const modesArg = argValue('--modes') || 'auto,review';
const modes = new Set(
  modesArg
    .split(',')
    .map((m) => m.trim().toLowerCase())
    .filter(Boolean),
);

const proposedPath = path.join(
  root,
  'reports',
  `seo-description-p2-proposed-${waveLabel}.json`,
);
if (!fs.existsSync(proposedPath)) {
  console.error(`Missing proposals: ${proposedPath}. Run propose first.`);
  process.exit(1);
}
const proposed = JSON.parse(fs.readFileSync(proposedPath, 'utf8'));
const items = proposed.proposals.filter(
  (p) => !p.skip && modes.has((p.mode || '').toLowerCase()),
);

const backupDir = path.join(root, 'reports', 'p2-backups', `wave-${waveLabel}`);
if (doApply) {
  fs.mkdirSync(backupDir, {recursive: true});
}

const results = [];
let applied = 0;
let failed = 0;

for (const item of items) {
  const abs = path.join(root, item.file);
  const text = fs.readFileSync(abs, 'utf8');
  const parts = splitFrontMatter(text);
  if (!parts) {
    results.push({file: item.file, ok: false, error: 'no front matter'});
    failed += 1;
    continue;
  }
  const guardedNow = extractGuardedFields(parts.fm);
  if (
    (item.guarded?.slug || null) !== (guardedNow.slug || null) ||
    (item.guarded?.id || null) !== (guardedNow.id || null)
  ) {
    results.push({
      file: item.file,
      ok: false,
      error: 'slug/id mismatch vs proposal — abort file',
    });
    failed += 1;
    continue;
  }
  const hashNow = bodyHash(parts.body);
  if (item.bodyHash && item.bodyHash !== hashNow) {
    results.push({
      file: item.file,
      ok: false,
      error: 'body hash changed since propose — abort file',
    });
    failed += 1;
    continue;
  }
  const current = getDescription(parts.fm).value;
  if (current !== item.before) {
    results.push({
      file: item.file,
      ok: false,
      error: 'description changed since propose — abort file',
    });
    failed += 1;
    continue;
  }

  const newFm = replaceDescription(parts.fm, item.after);
  // Ensure only description line differs in FM (slug/id/title preserved)
  const afterGuarded = extractGuardedFields(newFm);
  if (
    afterGuarded.slug !== guardedNow.slug ||
    afterGuarded.id !== guardedNow.id
  ) {
    results.push({file: item.file, ok: false, error: 'guard: slug/id would change'});
    failed += 1;
    continue;
  }
  if (bodyHash(parts.body) !== hashNow) {
    results.push({file: item.file, ok: false, error: 'guard: body mutated'});
    failed += 1;
    continue;
  }

  const newText = `---\n${newFm}\n---\n${parts.body}`;
  // body must be byte-identical suffix
  if (!newText.endsWith(parts.body) && newText.slice(newText.length - parts.body.length) !== parts.body) {
    // reconstruct carefully
  }
  const rebuilt = `---${newFm.startsWith('\n') ? '' : '\n'}${newFm.replace(/^\n/, '')}\n---\n${parts.body}`;
  // Prefer exact structure: original had ---\n + fm + \n---\n + body
  const finalText = `---\n${newFm.replace(/^\n+/, '').replace(/\n+$/, '')}\n---\n${parts.body}`;
  const verify = splitFrontMatter(finalText);
  if (!verify || verify.body !== parts.body) {
    results.push({file: item.file, ok: false, error: 'guard: body not preserved in rebuild'});
    failed += 1;
    continue;
  }
  if (bodyHash(verify.body) !== hashNow) {
    results.push({file: item.file, ok: false, error: 'guard: body hash after rebuild'});
    failed += 1;
    continue;
  }

  if (!doApply) {
    results.push({
      file: item.file,
      ok: true,
      dryRun: true,
      before: item.before,
      after: item.after,
    });
    applied += 1;
    continue;
  }

  const backup = {
    file: item.file,
    before: item.before,
    after: item.after,
    bodyHash: hashNow,
    guarded: guardedNow,
    savedAt: new Date().toISOString(),
  };
  const backupFile = path.join(
    backupDir,
    `${item.file.replace(/[\\/]/g, '__')}.json`,
  );
  fs.mkdirSync(path.dirname(backupFile), {recursive: true});
  fs.writeFileSync(backupFile, `${JSON.stringify(backup, null, 2)}\n`);
  fs.writeFileSync(abs, finalText);
  results.push({file: item.file, ok: true, applied: true, backup: path.relative(root, backupFile)});
  applied += 1;
}

const summary = {
  wave: waveLabel,
  doApply,
  modes: [...modes],
  considered: items.length,
  applied,
  failed,
};
const reportPath = path.join(
  root,
  'reports',
  `seo-description-p2-apply-${waveLabel}${doApply ? '' : '-dry'}.json`,
);
fs.writeFileSync(
  reportPath,
  `${JSON.stringify({...summary, generatedAt: new Date().toISOString(), results}, null, 2)}\n`,
);
console.log(JSON.stringify(summary, null, 2));
console.log(`wrote ${path.relative(root, reportPath)}`);
if (failed > 0) {
  process.exitCode = 1;
}
