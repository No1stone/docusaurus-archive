import {useState, type ReactNode} from 'react';
import {md5} from 'js-md5';

import CopyButton from '../components/CopyButton';
import ToolShell from '../components/ToolShell';
import {bytesToHex, digest} from '../utils';
import styles from '../styles.module.css';

type HashAlgorithm = 'MD5' | 'SHA-1' | 'SHA-256' | 'SHA-512';

export default function HashGenerator(): ReactNode {
  const [input, setInput] = useState('origemite');
  const [algorithm, setAlgorithm] = useState<HashAlgorithm>('SHA-256');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  return (
    <ToolShell
      title="해시 생성기"
      summary="원문의 MD5 또는 SHA 해시를 계산합니다."
      controls={
        <>
          <div className={styles.field}>
            <label htmlFor="hash-alg">알고리즘</label>
            <select
              id="hash-alg"
              value={algorithm}
              onChange={(event) => setAlgorithm(event.target.value as HashAlgorithm)}>
              <option value="MD5">MD5</option>
              <option value="SHA-1">SHA-1</option>
              <option value="SHA-256">SHA-256</option>
              <option value="SHA-512">SHA-512</option>
            </select>
          </div>
          <div className={styles.field}>
            <label htmlFor="hash-input">원문</label>
            <textarea
              id="hash-input"
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
          onClick={async () => {
            try {
              if (algorithm === 'MD5') {
                setResult(md5(input));
              } else {
                const hashed = await digest(algorithm, input);
                setResult(bytesToHex(hashed));
              }
              setError('');
            } catch (err) {
              setResult('');
              setError(err instanceof Error ? err.message : '해시 계산에 실패했습니다.');
            }
          }}>
          해시 계산
        </button>
      }
      result={
        <>
          <div className={styles.resultBox}>{result || '해시 결과가 여기에 표시됩니다.'}</div>
          {error ? <p className={styles.error}>{error}</p> : null}
          <div style={{marginTop: '0.75rem'}}>
            <CopyButton text={result} />
          </div>
        </>
      }
      example={
        <p>
          파일 체크섬이나 설정 문자열 비교에 쓸 수 있습니다. 비밀번호 저장에는 솔트가 있는 전용
          해시 방식을 사용합니다.
        </p>
      }
    />
  );
}