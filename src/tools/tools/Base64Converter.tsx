import {useState, type ReactNode} from 'react';

import CopyButton from '../components/CopyButton';
import ToolShell from '../components/ToolShell';
import {
  base64ToBytes,
  bytesToBase64,
  bytesToUtf8,
  fromBase64Url,
  toBase64Url,
  utf8ToBytes,
} from '../utils';
import styles from '../styles.module.css';

export default function Base64Converter(): ReactNode {
  const [input, setInput] = useState('Origemite Archive');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [variant, setVariant] = useState<'base64' | 'base64url'>('base64');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  return (
    <ToolShell
      title="Base64 / Base64URL"
      summary="문자열을 Base64 또는 Base64URL로 인코딩하고 디코딩합니다."
      controls={
        <>
          <div className={styles.row}>
            <label className={styles.check}>
              <input
                type="radio"
                name="b64-mode"
                checked={mode === 'encode'}
                onChange={() => setMode('encode')}
              />
              인코딩
            </label>
            <label className={styles.check}>
              <input
                type="radio"
                name="b64-mode"
                checked={mode === 'decode'}
                onChange={() => setMode('decode')}
              />
              디코딩
            </label>
          </div>
          <div className={styles.field}>
            <label htmlFor="b64-variant">형식</label>
            <select
              id="b64-variant"
              value={variant}
              onChange={(event) => setVariant(event.target.value as 'base64' | 'base64url')}>
              <option value="base64">Base64</option>
              <option value="base64url">Base64URL</option>
            </select>
          </div>
          <div className={styles.field}>
            <label htmlFor="b64-input">{mode === 'encode' ? '원문' : '인코딩된 문자열'}</label>
            <textarea
              id="b64-input"
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
              if (mode === 'encode') {
                const encoded = bytesToBase64(utf8ToBytes(input));
                setResult(variant === 'base64url' ? toBase64Url(encoded) : encoded);
              } else {
                const normalized =
                  variant === 'base64url' ? fromBase64Url(input.trim()) : input.trim();
                setResult(bytesToUtf8(base64ToBytes(normalized)));
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
        <p>
          JWT나 URL에 넣을 값은 Base64URL을 선택합니다.
          일반 파일 첨부 문자열은 Base64를 사용합니다.
        </p>
      }
    />
  );
}
