#!/usr/bin/env node
/**
 * Propose description replacements for a P2 wave.
 * Does not modify markdown. Writes reports/seo-description-p2-proposed-<wave>.json
 *
 * Usage:
 *   node scripts/seo-description-propose.mjs --wave A
 *   node scripts/seo-description-propose.mjs --wave B
 *   node scripts/seo-description-propose.mjs --wave C
 *   node scripts/seo-description-propose.mjs --wave D
 *   node scripts/seo-description-propose.mjs --wave A,B,C
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {
  LONG,
  SHORT,
  bodyHash,
  bodyPlain,
  clipDescription,
  extractGuardedFields,
  getDescription,
  getFmField,
  isDraftish,
  nfc,
  splitFrontMatter,
  templateAFromBody,
  templateB,
  templateC,
} from './seo-description-lib.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const waveArg =
  process.argv.find((a) => a.startsWith('--wave='))?.slice(7) ||
  (process.argv.includes('--wave')
    ? process.argv[process.argv.indexOf('--wave') + 1]
    : null);
if (!waveArg) {
  console.error('Usage: node scripts/seo-description-propose.mjs --wave A|B|C|D|A,B,C');
  process.exit(1);
}
const waves = new Set(
  waveArg
    .split(',')
    .map((w) => w.trim().toUpperCase())
    .filter(Boolean),
);

const queuePath = path.join(root, 'reports', 'seo-description-p2-queue.json');
if (!fs.existsSync(queuePath)) {
  console.error('Missing queue. Run seo-description-queue.mjs first.');
  process.exit(1);
}
const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));

const usedDescriptions = new Map(); // desc -> file (first claimer among proposals + existing non-targets)
// Seed with existing descriptions of files NOT in this proposal set
const targetRows = queue.rows.filter(
  (r) => waves.has(r.wave) && (r.mode === 'auto' || r.mode === 'review'),
);
const targetSet = new Set(targetRows.map((r) => r.file));

function scanExistingDescriptions() {
  function walk(dir, acc = []) {
    if (!fs.existsSync(dir)) return acc;
    for (const name of fs.readdirSync(dir)) {
      const full = path.join(dir, name);
      const st = fs.statSync(full);
      if (st.isDirectory()) walk(full, acc);
      else if (/\.(md|mdx)$/.test(name)) acc.push(full);
    }
    return acc;
  }
  for (const full of walk(path.join(root, 'docs'))) {
    const rel = path.relative(root, full);
    if (targetSet.has(rel)) continue;
    const text = fs.readFileSync(full, 'utf8');
    const parts = splitFrontMatter(text);
    if (!parts) continue;
    const {value} = getDescription(parts.fm);
    if (value) {
      const list = usedDescriptions.get(value) || [];
      list.push(rel);
      usedDescriptions.set(value, list);
    }
  }
}
scanExistingDescriptions();

function uniquify(desc, file) {
  let s = nfc(desc);
  if (!usedDescriptions.has(s) || usedDescriptions.get(s).every((f) => f === file)) {
    return s;
  }
  // append distinguishing slug fragment
  const base = path.basename(file, path.extname(file));
  let candidate = clipDescription(`${s} (${base})`);
  let n = 2;
  while (
    usedDescriptions.has(candidate) &&
    !usedDescriptions.get(candidate).every((f) => f === file)
  ) {
    candidate = clipDescription(`${s} (${base}-${n})`);
    n += 1;
    if (n > 20) break;
  }
  return candidate;
}

function proposeFor(row) {
  const abs = path.join(root, row.file);
  const text = fs.readFileSync(abs, 'utf8');
  const parts = splitFrontMatter(text);
  if (!parts) {
    return {
      file: row.file,
      wave: row.wave,
      mode: row.mode,
      skip: true,
      reason: 'no front matter',
    };
  }
  const before = getDescription(parts.fm).value;
  const title = getFmField(parts.fm, 'title');
  const guarded = extractGuardedFields(parts.fm);
  const hash = bodyHash(parts.body);
  let after = null;
  let strategy = '';

  if (row.wave === 'A') {
    after = templateB(title, row.file);
    strategy = 'templateB';
  } else if (row.wave === 'C') {
    const slug = guarded.slug || path.basename(row.file, path.extname(row.file));
    const para = bodyPlain(parts.body);
    const focus =
      para.length >= 40
        ? para.slice(0, 80)
        : /subscriber/i.test(row.file)
          ? 'Redis 구독·리스너 설정'
          : /pub/i.test(row.file)
            ? 'Redis Pub 캐시·ConnectionFactory 설정'
            : title || slug;
    after = clipDescription(
      `${nfc(title || slug)}: ${focus} (slug ${slug})`.replace(/\s+/g, ' '),
    );
    strategy = 'templateD';
  } else if (/\/index\.mdx?$/.test(row.file)) {
    after = templateC(title, row.file);
    strategy = 'templateC';
  } else {
    after = templateAFromBody(title, parts.body, row.file);
    strategy = 'templateA';
  }

  if (!after) {
    return {
      file: row.file,
      wave: row.wave,
      mode: row.mode,
      skip: true,
      reason: 'could not propose',
      before,
      guarded,
      bodyHash: hash,
    };
  }

  after = uniquify(after, row.file);
  const okLen = after.length >= SHORT && after.length <= LONG;
  const okDraft = !isDraftish(after);
  if (!okLen || !okDraft) {
    return {
      file: row.file,
      wave: row.wave,
      mode: row.mode,
      skip: true,
      reason: !okLen ? `bad length ${after.length}` : 'still draftish',
      before,
      after,
      strategy,
      guarded,
      bodyHash: hash,
    };
  }

  if (before === after) {
    return {
      file: row.file,
      wave: row.wave,
      mode: row.mode,
      skip: true,
      reason: 'unchanged',
      before,
      after,
      strategy,
      guarded,
      bodyHash: hash,
    };
  }

  const list = usedDescriptions.get(after) || [];
  list.push(row.file);
  usedDescriptions.set(after, list);

  return {
    file: row.file,
    wave: row.wave,
    mode: row.mode,
    skip: false,
    reason: row.reason,
    before,
    after,
    strategy,
    length: after.length,
    guarded,
    bodyHash: hash,
  };
}

const proposals = targetRows.map(proposeFor);
const active = proposals.filter((p) => !p.skip);
const skipped = proposals.filter((p) => p.skip);

const waveLabel = [...waves].sort().join('');
const out = {
  generatedAt: new Date().toISOString(),
  waves: [...waves].sort(),
  totals: {
    considered: proposals.length,
    proposed: active.length,
    skipped: skipped.length,
  },
  proposals,
};

const outPath = path.join(
  root,
  'reports',
  `seo-description-p2-proposed-${waveLabel}.json`,
);
fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
console.log(JSON.stringify(out.totals, null, 2));
console.log(`wrote ${path.relative(root, outPath)}`);
