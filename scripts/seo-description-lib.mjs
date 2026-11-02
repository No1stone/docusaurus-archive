/**
 * Shared helpers for SEO description queue / propose / apply.
 * Front-matter description only — never mutates body, slug, or id.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

export const SHORT = 40;
export const LONG = 160;
export const TARGET_MIN = 70;
export const TARGET_MAX = 120;
export const SUBSTANTIVE_PLAIN = 200;

export const WAVE_B_PREFIXES = [
  'docs/knowledge/backend/spring/',
  'docs/knowledge/data/',
  'docs/knowledge/messaging/',
  'docs/patterns/',
  'docs/knowledge/backend/java/',
];

export function nfc(s) {
  return (s || '').normalize('NFC');
}

export function splitFrontMatter(text) {
  if (!text.startsWith('---')) {
    return null;
  }
  const end = text.indexOf('\n---', 3);
  if (end < 0) {
    return null;
  }
  const fm = text.slice(3, end);
  const body = text.slice(end + 4); // after \n---
  const bodyStart = body.startsWith('\n') ? 1 : 0;
  return {
    fm,
    body: body.slice(bodyStart),
    fmStart: 3,
    fmEnd: end,
    rawOpen: text.slice(0, 3),
    rawClose: text.slice(end, end + 4),
  };
}

export function getFmField(fm, key) {
  const re = new RegExp(`^${key}:\\s*(.*)$`, 'm');
  const m = fm.match(re);
  if (!m) {
    return null;
  }
  let value = m[1].trim();
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1);
  }
  return value;
}

export function getDescription(fm) {
  const m = fm.match(/^description:\s*(.*)$/m);
  if (!m) {
    return {present: false, value: null, line: null};
  }
  let value = m[1].trim();
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1);
  }
  return {present: true, value, line: m[0]};
}

export function isDraftish(value) {
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

export function bodyPlain(body) {
  let t = body || '';
  t = t.replace(/```[\s\S]*?```/g, ' ');
  t = t.replace(/^\|.*\|$/gm, ' ');
  t = t.replace(/!\[[^\]]*\]\([^)]*\)/g, ' ');
  t = t.replace(/\[[^\]]*\]\([^)]*\)/g, ' ');
  t = t.replace(/^#{1,6}\s+/gm, '');
  t = t.replace(/[*_`>#\-]+/g, ' ');
  t = t.replace(/\s+/g, ' ').trim();
  return nfc(t);
}

export function firstMeaningfulParagraph(body) {
  const lines = (body || '').split(/\n/);
  const chunks = [];
  let buf = [];
  const flush = () => {
    if (buf.length) {
      chunks.push(buf.join(' ').trim());
      buf = [];
    }
  };
  for (const line of lines) {
    if (/^```/.test(line)) {
      flush();
      // skip fence block
      continue;
    }
    if (/^\s*$/.test(line) || /^#{1,6}\s/.test(line) || /^\|/.test(line) || /^>\s*$/.test(line)) {
      flush();
      continue;
    }
    if (/^작성 예정입니다\.?\s*$/.test(line.trim())) {
      flush();
      continue;
    }
    buf.push(line.replace(/!\[[^\]]*\]\([^)]*\)/g, '').replace(/\[[^\]]*\]\(([^)]*)\)/g, '$1'));
  }
  flush();
  for (const c of chunks) {
    const plain = bodyPlain(c);
    if (plain.length >= 20 && !/^이전 메모는/.test(plain)) {
      return plain;
    }
  }
  return '';
}

export function clipDescription(text) {
  let s = nfc(text).replace(/\s+/g, ' ').trim();
  s = s.replace(/\(작성 예정\)/g, '').replace(/작성 예정/g, '').trim();
  if (s.length <= LONG) {
    return s;
  }
  // cut at sentence or space near TARGET_MAX
  const cutAt = Math.min(s.length, TARGET_MAX);
  let slice = s.slice(0, cutAt);
  const sp = Math.max(slice.lastIndexOf('. '), slice.lastIndexOf('。'), slice.lastIndexOf(' '));
  if (sp >= TARGET_MIN) {
    slice = slice.slice(0, sp + (slice[sp] === '.' ? 1 : 0)).trim();
  }
  if (slice.length < SHORT) {
    slice = s.slice(0, LONG).trim();
  }
  if (slice.length > LONG) {
    slice = slice.slice(0, LONG).trim();
  }
  return slice;
}

export function springArea(relFile) {
  const m = relFile.match(/docs\/knowledge\/backend\/spring\/([^/]+)/);
  return m ? m[1] : 'spring';
}

export function templateB(title, relFile) {
  const area = springArea(relFile);
  const t = nfc(title || path.basename(relFile, path.extname(relFile)));
  return clipDescription(
    `${t} — Spring ${area} 문서 초안입니다. 본문 작성 전이며 Legacy 메모를 참고하세요.`,
  );
}

export function templateC(title, relFile) {
  const parts = relFile.split('/');
  const area =
    getFolderLabel(parts) ||
    nfc(title || '').replace(/\s*목차\s*$/, '') ||
    '이 영역';
  const t = nfc(title || '').trim();
  let base = t
    ? `${area}(${t}) 하위 문서 목차와 학습·실무 진입 경로를 제공합니다.`
    : `${area} 하위 문서 목차와 학습·실무 진입 경로를 제공합니다.`;
  if (base.length < SHORT) {
    base = `${area} 관련 하위 문서 목차와 학습·실무 진입 경로를 한곳에서 제공합니다.`;
  }
  return clipDescription(base);
}

function getFolderLabel(parts) {
  // docs/knowledge/backend/spring/batch/index.md -> Spring batch
  if (parts.includes('spring') && parts.length >= 6) {
    return `Spring ${parts[parts.length - 2]}`;
  }
  if (parts.includes('java')) {
    return 'Java';
  }
  if (parts.includes('data')) {
    return parts[parts.length - 2] === 'data'
      ? '데이터'
      : parts[parts.length - 2];
  }
  return null;
}

export function templateAFromBody(title, body, relFile) {
  const para = firstMeaningfulParagraph(body);
  if (para && para.length >= 40) {
    return clipDescription(para);
  }
  const plain = bodyPlain(body);
  if (plain.length >= SUBSTANTIVE_PLAIN) {
    return clipDescription(plain);
  }
  const t = nfc(title || '');
  if (t && plain.length >= 40) {
    return clipDescription(`${t}: ${plain}`);
  }
  if (t && plain.length >= 20) {
    return clipDescription(
      `${t} 관련 메모를 정리합니다. ${plain}`.slice(0, LONG),
    );
  }
  // weak body — expand title into acceptable length without inventing facts
  if (/index\.mdx?$/.test(relFile)) {
    return templateC(title, relFile);
  }
  if (t.length >= SHORT) {
    return clipDescription(`${t}에 대한 기술 메모와 예제를 정리합니다.`);
  }
  if (t) {
    return clipDescription(
      `${t} 주제의 핵심 개념과 실무 메모를 짧게 정리한 문서입니다.`,
    );
  }
  return null;
}

export function isStubBody(body, fm) {
  const plain = bodyPlain(body);
  const status = (getFmField(fm, 'status') || '').toLowerCase();
  if (status === 'draft') {
    return plain.length < SUBSTANTIVE_PLAIN;
  }
  if (/작성 예정/.test(body || '')) {
    return plain.length < SUBSTANTIVE_PLAIN;
  }
  return plain.length < 80;
}

export function isScratchFile(relFile) {
  const base = path.basename(relFile);
  return (
    /^작업-/.test(base) ||
    /^aaa\./i.test(base) ||
    relFile.startsWith('docs/harness/')
  );
}

export function bodyHash(body) {
  return crypto.createHash('sha256').update(body || '', 'utf8').digest('hex');
}

export function replaceDescription(fm, newDescription) {
  const quoted = JSON.stringify(nfc(newDescription)); // double-quoted, escaped
  if (/^description:\s*.*$/m.test(fm)) {
    return fm.replace(/^description:\s*.*$/m, `description: ${quoted}`);
  }
  // insert after title if present, else at start
  if (/^title:\s*.*$/m.test(fm)) {
    return fm.replace(/^(title:\s*.*)$/m, `$1\ndescription: ${quoted}`);
  }
  return `description: ${quoted}\n${fm}`;
}

export function extractGuardedFields(fm) {
  return {
    slug: getFmField(fm, 'slug'),
    id: getFmField(fm, 'id'),
    title: getFmField(fm, 'title'),
  };
}

export function loadAudit(root) {
  const p = path.join(root, 'reports', 'seo-description-audit.json');
  if (!fs.existsSync(p)) {
    throw new Error(`Missing audit report: ${p}. Run seo-audit-descriptions.mjs first.`);
  }
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

export function waveBOrder(file) {
  for (let i = 0; i < WAVE_B_PREFIXES.length; i++) {
    if (file.startsWith(WAVE_B_PREFIXES[i])) {
      return i;
    }
  }
  return 999;
}
