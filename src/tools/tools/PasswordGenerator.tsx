import {useState, type ReactNode} from 'react';

import CopyButton from '../components/CopyButton';
import ToolShell from '../components/ToolShell';
import styles from '../styles.module.css';

const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWER = 'abcdefghijklmnopqrstuvwxyz';
const DIGIT = '0123456789';
const SYMBOL = '!@#$%^&*()-_=+[]{}|;:,.<>?';

function buildCharset(upper: boolean, lower: boolean, digit: boolean, symbol: boolean): string {
  let charset = '';
  if (upper) charset += UPPER;
  if (lower) charset += LOWER;
  if (digit) charset += DIGIT;
  if (symbol) charset += SYMBOL;
  return charset;
}

function randomPassword(length: number, charset: string): string {
  const codes = new Uint32Array(length);
  crypto.getRandomValues(codes);
  let value = '';
  for (let i = 0; i < length; i += 1) {
    value += charset[codes[i]! % charset.length]!;
  }
  return value;
}

export default function PasswordGenerator(): ReactNode {
  const [length, setLength] = useState(16);
  const [count, setCount] = useState(5);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useDigit, setUseDigit] = useState(true);
  const [useSymbol, setUseSymbol] = useState(true);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  return (
    <ToolShell
      title="비밀번호 생성기"
      summary="문자 종류와 길이를 정해 무작위 비밀번호를 생성합니다."
      controls={
        <>
          <div className={styles.field}>
            <label htmlFor="pw-length">길이</label>
            <input
              id="pw-length"
              type="number"
              min={4}
              max={256}
              value={length}
              onChange={(event) => setLength(Number(event.target.value))}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="pw-count">생성 개수</label>
            <input
              id="pw-count"
              type="number"
              min={1}
              max={100}
              value={count}
              onChange={(event) => setCount(Number(event.target.value))}
            />
          </div>
          <div className={styles.row}>
            <label className={styles.check}>
              <input
                type="checkbox"
                checked={useUpper}
                onChange={(event) => setUseUpper(event.target.checked)}
              />
              대문자 (A-Z)
            </label>
            <label className={styles.check}>
              <input
                type="checkbox"
                checked={useLower}
                onChange={(event) => setUseLower(event.target.checked)}
              />
              소문자 (a-z)
            </label>
            <label className={styles.check}>
              <input
                type="checkbox"
                checked={useDigit}
                onChange={(event) => setUseDigit(event.target.checked)}
              />
              숫자 (0-9)
            </label>
            <label className={styles.check}>
              <input
                type="checkbox"
                checked={useSymbol}
                onChange={(event) => setUseSymbol(event.target.checked)}
              />
              기호
            </label>
          </div>
        </>
      }
      actions={
        <>
          <button
            type="button"
            className={styles.primaryButton}
            onClick={() => {
              const charset = buildCharset(useUpper, useLower, useDigit, useSymbol);
              if (!charset) {
                setError('하나 이상의 문자 종류를 선택합니다.');
                setResult('');
                return;
              }
              const len = Math.max(4, Math.min(256, length));
              const n = Math.max(1, Math.min(100, count));
              if (!Number.isFinite(len) || !Number.isFinite(n)) {
                setError('길이와 개수를 올바르게 입력합니다.');
                return;
              }
              setError('');
              const passwords = Array.from({length: n}, () => randomPassword(len, charset));
              setResult(passwords.join('\n'));
            }}>
            생성
          </button>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={() => {
              setLength(16);
              setCount(5);
              setUseUpper(true);
              setUseLower(true);
              setUseDigit(true);
              setUseSymbol(true);
              setResult('');
              setError('');
            }}>
            초기화
          </button>
        </>
      }
      result={
        <>
          <div className={styles.resultBox}>{result || '생성된 비밀번호가 여기에 표시됩니다.'}</div>
          {error ? <p className={styles.error}>{error}</p> : null}
          <div style={{marginTop: '0.75rem'}}>
            <CopyButton text={result} />
          </div>
        </>
      }
      example={
        <p>
          테스트 계정이나 API 키 초안을 만들 때 사용합니다. 실제 운영 비밀번호는 비밀번호 관리 도구에
          저장하는 편이 안전합니다.
        </p>
      }
    />
  );
}