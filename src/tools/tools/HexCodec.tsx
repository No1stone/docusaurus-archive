import {useState, type ReactNode} from 'react';

import CopyButton from '../components/CopyButton';
import ToolShell from '../components/ToolShell';
import {hexToUtf8, utf8ToHex} from '../utils';
import styles from '../styles.module.css';

export default function HexCodec(): ReactNode {
  const [input, setInput] = useState('Origemite');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  return (
    <ToolShell
      title="Hex 인코딩 / 디코딩"
      summary="UTF-8 문자열과 hex 표현을 변환합니다."
      controls={
        <>
          <div className={styles.row}>
            <label className={styles.check}>
              <input
                type="radio"
                name="hex-mode"
                checked={mode === 'encode'}
                onChange={() => setMode('encode')}
              />
              인코딩 (문자열 → hex)
            </label>
            <label className={styles.check}>
              <input
                type="radio"
                name="hex-mode"
                checked={mode === 'decode'}
                onChange={() => setMode('decode')}
              />
              디코딩 (hex → 문자열)
            </label>
          </div>
          <div className={styles.field}>
            <label htmlFor="hex-input">입력</label>
            <textarea
              id="hex-input"
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
              setResult(mode === 'encode' ? utf8ToHex(input) : hexToUtf8(input));
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
          바이너리 로그나 프로토콜 덤프에서 본 hex 값을 UTF-8 문자열로 확인하거나, 반대로 인코딩할
          때 사용합니다.
        </p>
      }
    />
  );
}