import {useState, type ReactNode} from 'react';

import CopyButton from '../components/CopyButton';
import ToolShell from '../components/ToolShell';
import styles from '../styles.module.css';

type DiffKind = 'added' | 'removed' | 'changed';

type DiffLine = {
  path: string;
  kind: DiffKind;
  left?: string;
  right?: string;
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function stringify(value: unknown): string {
  if (typeof value === 'string') {
    return value;
  }
  return JSON.stringify(value);
}

function collectDiff(left: unknown, right: unknown, basePath: string, out: DiffLine[]): void {
  if (left === undefined && right !== undefined) {
    out.push({path: basePath || '(root)', kind: 'added', right: stringify(right)});
    return;
  }
  if (left !== undefined && right === undefined) {
    out.push({path: basePath || '(root)', kind: 'removed', left: stringify(left)});
    return;
  }
  if (Array.isArray(left) && Array.isArray(right)) {
    const max = Math.max(left.length, right.length);
    for (let i = 0; i < max; i += 1) {
      const path = basePath ? `${basePath}[${i}]` : `[${i}]`;
      collectDiff(left[i], right[i], path, out);
    }
    return;
  }
  if (isPlainObject(left) && isPlainObject(right)) {
    const keys = new Set([...Object.keys(left), ...Object.keys(right)]);
    for (const key of keys) {
      const path = basePath ? `${basePath}.${key}` : key;
      collectDiff(left[key], right[key], path, out);
    }
    return;
  }
  if (JSON.stringify(left) !== JSON.stringify(right)) {
    out.push({
      path: basePath || '(root)',
      kind: 'changed',
      left: stringify(left),
      right: stringify(right),
    });
  }
}

function kindLabel(kind: DiffKind): string {
  switch (kind) {
    case 'added':
      return '추가';
    case 'removed':
      return '삭제';
    case 'changed':
      return '변경';
    default:
      return kind;
  }
}

function formatReport(lines: DiffLine[]): string {
  if (lines.length === 0) {
    return '차이 없음';
  }
  return lines
    .map((line) => {
      if (line.kind === 'changed') {
        return `[${kindLabel(line.kind)}] ${line.path}\n  A: ${line.left ?? ''}\n  B: ${line.right ?? ''}`;
      }
      if (line.kind === 'added') {
        return `[${kindLabel(line.kind)}] ${line.path}\n  B: ${line.right ?? ''}`;
      }
      return `[${kindLabel(line.kind)}] ${line.path}\n  A: ${line.left ?? ''}`;
    })
    .join('\n\n');
}

export default function JsonDiff(): ReactNode {
  const [leftText, setLeftText] = useState('{"name":"alpha","count":1}');
  const [rightText, setRightText] = useState('{"name":"beta","count":1,"extra":true}');
  const [lines, setLines] = useState<DiffLine[]>([]);
  const [report, setReport] = useState('');
  const [error, setError] = useState('');

  const compare = () => {
    try {
      const left = JSON.parse(leftText) as unknown;
      const right = JSON.parse(rightText) as unknown;
      const next: DiffLine[] = [];
      collectDiff(left, right, '', next);
      setLines(next);
      setReport(formatReport(next));
      setError('');
    } catch (err) {
      setLines([]);
      setReport('');
      setError(err instanceof Error ? err.message : 'JSON 파싱에 실패했습니다.');
    }
  };

  const reset = () => {
    setLeftText('');
    setRightText('');
    setLines([]);
    setReport('');
    setError('');
  };

  return (
    <ToolShell
      title="JSON diff"
      summary="두 JSON 문서의 경로별 차이(추가·삭제·변경)를 목록으로 봅니다."
      controls={
        <div className={styles.split}>
          <div className={styles.field}>
            <label htmlFor="diff-a">JSON A</label>
            <textarea id="diff-a" value={leftText} onChange={(e) => setLeftText(e.target.value)} spellCheck={false} />
          </div>
          <div className={styles.field}>
            <label htmlFor="diff-b">JSON B</label>
            <textarea id="diff-b" value={rightText} onChange={(e) => setRightText(e.target.value)} spellCheck={false} />
          </div>
        </div>
      }
      actions={
        <>
          <button type="button" className={styles.primaryButton} onClick={compare}>
            비교
          </button>
          <button type="button" className={styles.secondaryButton} onClick={reset}>
            초기화
          </button>
        </>
      }
      result={
        <>
          {error ? <p className={styles.error}>{error}</p> : null}
          {!report && !error ? (
            <p className={styles.hint}>비교를 실행하면 차이 목록이 표시됩니다.</p>
          ) : null}
          {report === '차이 없음' ? <p className={styles.hint}>차이 없음</p> : null}
          {lines.length > 0 ? (
            <ul style={{paddingLeft: '1.25rem'}}>
              {lines.map((line, index) => (
                <li key={`${line.path}-${index}`}>
                  <strong>[{kindLabel(line.kind)}]</strong> {line.path}
                  {line.left !== undefined ? <div>A: {line.left}</div> : null}
                  {line.right !== undefined ? <div>B: {line.right}</div> : null}
                </li>
              ))}
            </ul>
          ) : null}
          <textarea readOnly value={report} spellCheck={false} style={{marginTop: '0.75rem', width: '100%', minHeight: '6rem'}} />
          <div style={{marginTop: '0.75rem'}}>
            <CopyButton text={report} label="리포트 복사" />
          </div>
        </>
      }
      example={<p>설정 파일이나 API 응답 두 버전을 빠르게 대조할 때 사용합니다. 순서가 다른 배열은 인덱스 기준으로만 비교합니다.</p>}
    />
  );
}