import {useState, type ReactNode} from 'react';

import CopyButton from '../components/CopyButton';
import ToolShell from '../components/ToolShell';
import {utf8ToBytes} from '../utils';
import styles from '../styles.module.css';

function utf8ToBinary(text: string): string {
  const bytes = utf8ToBytes(text);
  return Array.from(bytes, (b) => b.toString(2).padStart(8, '0')).join('');
}

function binaryToUtf8(bits: string): string {
  const normalized = bits.replace(/\s+/g, '');
  if (normalized.length === 0) {
    return '';
  }
  if (!/^[01]+$/.test(normalized)) {
    throw new Error('이진 문자열은 0과 1만 포함해야 합니다.');
  }
  if (normalized.length % 8 !== 0) {
    throw new Error('비트 길이는 8의 배수여야 합니다.');
  }
  const bytes = new Uint8Array(normalized.length / 8);
  for (let i = 0; i < bytes.length; i += 1) {
    bytes[i] = Number.parseInt(normalized.slice(i * 8, i * 8 + 8), 2);
  }
  return new TextDecoder().decode(bytes);
}

export default function BinaryCodec(): ReactNode {
  const [input, setInput] = useState('Hi');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  return (
    <ToolShell
      title="이진 인코딩 / 디코딩"
      summary="UTF-8 문자열과 8비트 단위 이진 문자열을 변환합니다."
      controls={
        <>
          <div className={styles.row}>
            <label className={styles.check}>
              <input
                type="radio"
                name="bin-mode"
                checked={mode === 'encode'}
                onChange={() => setMode('encode')}
              />
              인코딩
            </label>
            <label className={styles.check}>
              <input
                type="radio"
                name="bin-mode"
                checked={mode === 'decode'}
                onChange={() => setMode('decode')}
              />
              디코딩
            </label>
          </div>
          <div className={styles.field}>
            <label htmlFor="bin-input">입력</label>
            <textarea
              id="bin-input"
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
              setResult(mode === 'encode' ? utf8ToBinary(input) : binaryToUtf8(input));
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
        <p>문자 &quot;Hi&quot;를 인코딩하면 UTF-8 바이트마다 8비트가 이어 붙은 문자열이 됩니다.</p>
      }
    />
  );
}