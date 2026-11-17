import {useState, type ReactNode} from 'react';

import CopyButton from '../components/CopyButton';
import ToolShell from '../components/ToolShell';
import styles from '../styles.module.css';

type FillMode = 'empty' | 'copyA';

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function collectKeyPaths(value: unknown, prefix: string, out: Set<string>): void {
  if (!isPlainObject(value)) {
    return;
  }
  for (const key of Object.keys(value)) {
    const path = prefix ? `${prefix}.${key}` : key;
    out.add(path);
    collectKeyPaths(value[key], path, out);
  }
}

function hasPath(root: unknown, path: string): boolean {
  const parts = path.split('.');
  let cur: unknown = root;
  for (const part of parts) {
    if (!isPlainObject(cur) || !(part in cur)) {
      return false;
    }
    cur = cur[part];
  }
  return true;
}

function getAtPath(root: unknown, path: string): unknown {
  const parts = path.split('.');
  let cur: unknown = root;
  for (const part of parts) {
    if (!isPlainObject(cur)) {
      return undefined;
    }
    cur = cur[part];
  }
  return cur;
}

function setAtPath(root: Record<string, unknown>, path: string, val: unknown): void {
  const parts = path.split('.');
  let cur: Record<string, unknown> = root;
  for (let i = 0; i < parts.length - 1; i += 1) {
    const part = parts[i]!;
    const next = cur[part];
    if (!isPlainObject(next)) {
      cur[part] = {};
    }
    cur = cur[part] as Record<string, unknown>;
  }
  const last = parts[parts.length - 1]!;
  cur[last] = val;
}

function cloneJson<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export default function JsonKeyFixer(): ReactNode {
  const [textA, setTextA] = useState('{"common":{"save":"저장","cancel":"취소"},"home":{"title":"홈"}}');
  const [textB, setTextB] = useState('{"common":{"save":"Save"},"home":{}}');
  const [fillMode, setFillMode] = useState<FillMode>('empty');
  const [missing, setMissing] = useState<string[]>([]);
  const [fixedJson, setFixedJson] = useState('');
  const [error, setError] = useState('');

  const analyze = () => {
    try {
      const a = JSON.parse(textA) as unknown;
      const b = JSON.parse(textB) as unknown;
      if (!isPlainObject(a) || !isPlainObject(b)) {
        setError('A와 B는 JSON 객체여야 합니다.');
        setMissing([]);
        setFixedJson('');
        return;
      }
      const keysA = new Set<string>();
      collectKeyPaths(a, '', keysA);
      const missingInB = [...keysA].filter((path) => !hasPath(b, path)).sort();
      setMissing(missingInB);

      const merged = cloneJson(b);
      for (const path of missingInB) {
        const fill =
          fillMode === 'copyA'
            ? cloneJson(getAtPath(a, path))
            : typeof getAtPath(a, path) === 'object' && getAtPath(a, path) !== null
              ? Array.isArray(getAtPath(a, path))
                ? []
                : {}
              : '';
        setAtPath(merged, path, fill);
      }
      setFixedJson(JSON.stringify(merged, null, 2));
      setError('');
    } catch (err) {
      setMissing([]);
      setFixedJson('');
      setError(err instanceof Error ? err.message : 'JSON 파싱에 실패했습니다.');
    }
  };

  const reset = () => {
    setTextA('');
    setTextB('');
    setMissing([]);
    setFixedJson('');
    setError('');
  };

  const missingReport = missing.length ? missing.join('\n') : '누락된 키 없음';

  return (
    <ToolShell
      title="JSON 키 보정"
      summary="로케일 등 두 JSON 객체의 키 트리를 비교해 B에 없는 키를 찾고, 필요하면 B를 채웁니다."
      controls={
        <>
          <div className={styles.field}>
            <label htmlFor="key-fill">누락 키 채우기</label>
            <select id="key-fill" value={fillMode} onChange={(e) => setFillMode(e.target.value as FillMode)}>
              <option value="empty">빈 문자열 / 빈 객체</option>
              <option value="copyA">A의 값 복사</option>
            </select>
          </div>
          <div className={styles.split}>
            <div className={styles.field}>
              <label htmlFor="key-a">JSON A (기준)</label>
              <textarea id="key-a" value={textA} onChange={(e) => setTextA(e.target.value)} spellCheck={false} />
            </div>
            <div className={styles.field}>
              <label htmlFor="key-b">JSON B (대상)</label>
              <textarea id="key-b" value={textB} onChange={(e) => setTextB(e.target.value)} spellCheck={false} />
            </div>
          </div>
        </>
      }
      actions={
        <>
          <button type="button" className={styles.primaryButton} onClick={analyze}>
            분석 · 보정
          </button>
          <button type="button" className={styles.secondaryButton} onClick={reset}>
            초기화
          </button>
        </>
      }
      result={
        <>
          {error ? <p className={styles.error}>{error}</p> : null}
          <div className={styles.field}>
            <label>B에 없는 키 (A 기준)</label>
            <textarea readOnly value={missingReport} spellCheck={false} />
            <CopyButton text={missingReport} label="누락 목록 복사" />
          </div>
          {fixedJson ? (
            <div className={styles.field} style={{marginTop: '0.75rem'}}>
              <label>보정된 B</label>
              <textarea readOnly value={fixedJson} spellCheck={false} />
              <CopyButton text={fixedJson} label="보정 JSON 복사" />
            </div>
          ) : null}
        </>
      }
      example={
        <p>
          i18n ko.json을 기준으로 en.json에 빠진 키를 찾을 때 사용합니다.
          값 타입은 단순 채우기만 하며 번역 품질은 검수해야 합니다.
        </p>
      }
    />
  );
}