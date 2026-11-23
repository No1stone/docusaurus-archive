import {useState, type ReactNode} from 'react';

import CopyButton from '../components/CopyButton';
import ToolShell from '../components/ToolShell';
import styles from '../styles.module.css';

function JsonNode({name, value, depth}: {name?: string; value: unknown; depth: number}): ReactNode {
  if (value === null || typeof value !== 'object') {
    const display =
      typeof value === 'string'
        ? `"${value}"`
        : value === null
          ? 'null'
          : String(value as string | number | boolean);
    return (
      <li className={styles.hint}>
        {name !== undefined ? <strong>{name}: </strong> : null}
        {display}
      </li>
    );
  }

  if (Array.isArray(value)) {
    const label = name !== undefined ? `${name} [${value.length}]` : `배열 [${value.length}]`;
    return (
      <li>
        <details open={depth < 2}>
          <summary>{label}</summary>
          <ul style={{margin: '0.25rem 0 0.25rem 1rem', paddingLeft: '0.5rem'}}>
            {value.map((item, index) => (
              <JsonNode key={index} name={String(index)} value={item} depth={depth + 1} />
            ))}
          </ul>
        </details>
      </li>
    );
  }

  const record = value as Record<string, unknown>;
  const keys = Object.keys(record);
  const label = name !== undefined ? `${name} {${keys.length}}` : `객체 {${keys.length}}`;

  return (
    <li>
      <details open={depth < 1}>
        <summary>{label}</summary>
        <ul style={{margin: '0.25rem 0 0.25rem 1rem', paddingLeft: '0.5rem'}}>
          {keys.map((key) => (
            <JsonNode key={key} name={key} value={record[key]} depth={depth + 1} />
          ))}
        </ul>
      </details>
    </li>
  );
}

export default function JsonVisualizer(): ReactNode {
  const [input, setInput] = useState('{"users":[{"id":1,"name":"Kim"}],"ok":true}');
  const [parsed, setParsed] = useState<unknown | null>(null);
  const [error, setError] = useState('');

  const visualize = () => {
    try {
      const value = JSON.parse(input) as unknown;
      setParsed(value);
      setError('');
    } catch (err) {
      setParsed(null);
      setError(err instanceof Error ? err.message : 'JSON 파싱에 실패했습니다.');
    }
  };

  const reset = () => {
    setInput('');
    setParsed(null);
    setError('');
  };

  const formatted = parsed !== null ? JSON.stringify(parsed, null, 2) : '';

  return (
    <ToolShell
      title="JSON 시각화"
      summary="JSON을 접을 수 있는 트리 형태로 탐색합니다."
      controls={
        <div className={styles.field}>
          <label htmlFor="json-vis-input">JSON</label>
          <textarea
            id="json-vis-input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            spellCheck={false}
          />
        </div>
      }
      actions={
        <>
          <button type="button" className={styles.primaryButton} onClick={visualize}>
            시각화
          </button>
          <button type="button" className={styles.secondaryButton} onClick={reset}>
            초기화
          </button>
        </>
      }
      result={
        <>
          {error ? <p className={styles.error}>{error}</p> : null}
          {parsed !== null ? (
            <ul style={{listStyle: 'none', padding: 0, margin: 0}}>
              <JsonNode value={parsed} depth={0} />
            </ul>
          ) : (
            !error && <p className={styles.hint}>유효한 JSON을 붙여 넣고 시각화를 실행하세요.</p>
          )}
          {formatted ? (
            <div style={{marginTop: '0.75rem'}}>
              <CopyButton text={formatted} label="포맷 JSON 복사" />
            </div>
          ) : null}
        </>
      }
      example={
        <p>API 응답이나 설정 파일을 구조만 빠르게 훑을 때 사용합니다. details/summary로 깊은 계층을 접을 수 있습니다.</p>
      }
    />
  );
}