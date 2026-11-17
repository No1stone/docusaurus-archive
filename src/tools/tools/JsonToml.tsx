import {useState, type ReactNode} from 'react';
import {parse as parseToml, stringify as stringifyToml} from 'smol-toml';

import CopyButton from '../components/CopyButton';
import ToolShell from '../components/ToolShell';
import styles from '../styles.module.css';

export default function JsonToml(): ReactNode {
  const [direction, setDirection] = useState<'jsonToToml' | 'tomlToJson'>('jsonToToml');
  const [input, setInput] = useState('{"title":"Origemite","enabled":true}');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  return (
    <ToolShell
      title="JSON ↔ TOML"
      summary="JSON과 TOML 설정 문서를 변환합니다."
      controls={
        <>
          <div className={styles.row}>
            <label className={styles.check}>
              <input
                type="radio"
                name="json-toml-dir"
                checked={direction === 'jsonToToml'}
                onChange={() => setDirection('jsonToToml')}
              />
              JSON → TOML
            </label>
            <label className={styles.check}>
              <input
                type="radio"
                name="json-toml-dir"
                checked={direction === 'tomlToJson'}
                onChange={() => setDirection('tomlToJson')}
              />
              TOML → JSON
            </label>
          </div>
          <div className={styles.field}>
            <label htmlFor="json-toml-input">입력</label>
            <textarea
              id="json-toml-input"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              spellCheck={false}
            />
          </div>
        </>
      }
      actions={
        <button
          type="button"
          className={styles.primaryButton}
          onClick={() => {
            try {
              if (direction === 'jsonToToml') {
                const parsed = JSON.parse(input) as unknown;
                if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
                  throw new Error('JSON 루트는 객체여야 합니다.');
                }
                setResult(stringifyToml(parsed as Record<string, unknown>));
              } else {
                const parsed = parseToml(input) as unknown;
                setResult(JSON.stringify(parsed, null, 2));
              }
              setError('');
            } catch (err) {
              setResult('');
              setError(err instanceof Error ? err.message : '변환에 실패했습니다.');
            }
          }}>
          변환하기
        </button>
      }
      result={
        <>
          <div className={styles.resultBox}>{result || '변환 결과가 여기에 표시됩니다.'}</div>
          {error ? <p className={styles.error}>{error}</p> : null}
          <div style={{marginTop: '0.75rem'}}>
            <CopyButton text={result} />
          </div>
        </>
      }
      example={
        <p>Rust·Python 프로젝트의 TOML 설정을 JSON으로 비교하거나 문서에 옮길 때 사용합니다.</p>
      }
    />
  );
}