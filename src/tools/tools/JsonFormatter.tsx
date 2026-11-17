import {useState, type ReactNode} from 'react';

import CopyButton from '../components/CopyButton';
import ToolShell from '../components/ToolShell';
import styles from '../styles.module.css';

export default function JsonFormatter(): ReactNode {
  const [input, setInput] = useState('{"name":"origemite","active":true}');
  const [indent, setIndent] = useState(2);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  return (
    <ToolShell
      title="JSON 포매터"
      summary="JSON 원문을 들여쓰기하거나 한 줄로 압축합니다."
      controls={
        <>
          <div className={styles.field}>
            <label htmlFor="json-indent">들여쓰기 칸 수</label>
            <input
              id="json-indent"
              type="number"
              min={0}
              max={8}
              value={indent}
              onChange={(event) => setIndent(Number(event.target.value))}
            />
          </div>
          <div className={styles.split}>
            <div className={styles.field}>
              <label htmlFor="json-input">원문 JSON</label>
              <textarea
                id="json-input"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                spellCheck={false}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="json-output">포맷 결과</label>
              <textarea
                id="json-output"
                value={result}
                readOnly
                spellCheck={false}
                placeholder="실행하면 결과가 여기에 표시됩니다."
              />
            </div>
          </div>
        </>
      }
      actions={
        <>
          <button
            type="button"
            className={styles.primaryButton}
            onClick={() => {
              try {
                const parsed = JSON.parse(input) as unknown;
                const spaces = Number.isFinite(indent) ? Math.max(0, Math.min(8, indent)) : 2;
                setResult(JSON.stringify(parsed, null, spaces));
                setError('');
              } catch (err) {
                setError(err instanceof Error ? err.message : 'JSON 파싱에 실패했습니다.');
                setResult('');
              }
            }}>
            포맷하기
          </button>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={() => {
              try {
                const parsed = JSON.parse(input) as unknown;
                setResult(JSON.stringify(parsed));
                setError('');
              } catch (err) {
                setError(err instanceof Error ? err.message : 'JSON 파싱에 실패했습니다.');
                setResult('');
              }
            }}>
            한 줄로 압축
          </button>
        </>
      }
      result={
        <>
          {error ? <p className={styles.error}>{error}</p> : <p className={styles.hint}>위 오른쪽 영역에도 같은 결과가 표시됩니다.</p>}
          <div style={{marginTop: '0.75rem'}}>
            <CopyButton text={result} />
          </div>
        </>
      }
      example={
        <p>
          API 응답을 붙여 넣고 포맷하면 키 구조를 읽기 쉽습니다.
          전송 전에 용량을 줄이려면 한 줄 압축을 사용합니다.
        </p>
      }
    />
  );
}
