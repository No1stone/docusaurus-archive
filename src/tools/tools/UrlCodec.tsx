import {useState, type ReactNode} from 'react';

import CopyButton from '../components/CopyButton';
import ToolShell from '../components/ToolShell';
import styles from '../styles.module.css';

export default function UrlCodec(): ReactNode {
  const [input, setInput] = useState('https://origemite.com/docs?q=개발과 운영');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  return (
    <ToolShell
      title="URL 인코딩 / 디코딩"
      summary="URL 구성요소를 percent-encoding으로 변환합니다."
      controls={
        <>
          <div className={styles.row}>
            <label className={styles.check}>
              <input
                type="radio"
                name="url-mode"
                checked={mode === 'encode'}
                onChange={() => setMode('encode')}
              />
              인코딩
            </label>
            <label className={styles.check}>
              <input
                type="radio"
                name="url-mode"
                checked={mode === 'decode'}
                onChange={() => setMode('decode')}
              />
              디코딩
            </label>
          </div>
          <div className={styles.field}>
            <label htmlFor="url-input">입력</label>
            <textarea
              id="url-input"
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
              setResult(
                mode === 'encode' ? encodeURIComponent(input) : decodeURIComponent(input),
              );
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
        <p>
          쿼리 파라미터에 한글이나 공백을 넣을 때 인코딩합니다.
          로그에 찍힌 `%EA%B0%9C%EB%B0%9C` 같은 값은 디코딩해 확인합니다.
        </p>
      }
    />
  );
}
