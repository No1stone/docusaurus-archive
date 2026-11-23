import {useState, type ReactNode} from 'react';

import CopyButton from '../components/CopyButton';
import ToolShell from '../components/ToolShell';
import {asBufferSource, bytesToHex, utf8ToBytes} from '../utils';
import styles from '../styles.module.css';

type HmacAlgorithm = 'SHA-256' | 'SHA-512';

async function hmacHex(algorithm: HmacAlgorithm, key: string, message: string): Promise<string> {
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    asBufferSource(utf8ToBytes(key)),
    {name: 'HMAC', hash: algorithm},
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign(
    'HMAC',
    cryptoKey,
    asBufferSource(utf8ToBytes(message)),
  );
  return bytesToHex(new Uint8Array(signature));
}

export default function HmacGenerator(): ReactNode {
  const [key, setKey] = useState('secret-key');
  const [message, setMessage] = useState('payload');
  const [algorithm, setAlgorithm] = useState<HmacAlgorithm>('SHA-256');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  return (
    <ToolShell
      title="HMAC 생성기"
      summary="비밀키와 메시지로 HMAC-SHA 해시를 계산합니다."
      controls={
        <>
          <div className={styles.field}>
            <label htmlFor="hmac-alg">알고리즘</label>
            <select
              id="hmac-alg"
              value={algorithm}
              onChange={(event) => setAlgorithm(event.target.value as HmacAlgorithm)}>
              <option value="SHA-256">HMAC-SHA-256</option>
              <option value="SHA-512">HMAC-SHA-512</option>
            </select>
          </div>
          <div className={styles.field}>
            <label htmlFor="hmac-key">비밀키</label>
            <input
              id="hmac-key"
              type="text"
              value={key}
              onChange={(event) => setKey(event.target.value)}
              spellCheck={false}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="hmac-message">메시지</label>
            <textarea
              id="hmac-message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
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
              setResult(await hmacHex(algorithm, key, message));
              setError('');
            } catch (err) {
              setResult('');
              setError(err instanceof Error ? err.message : 'HMAC 계산에 실패했습니다.');
            }
          }}>
          HMAC 계산
        </button>
      }
      result={
        <>
          <div className={styles.resultBox}>{result || 'HMAC(hex) 결과가 여기에 표시됩니다.'}</div>
          {error ? <p className={styles.error}>{error}</p> : null}
          <div style={{marginTop: '0.75rem'}}>
            <CopyButton text={result} />
          </div>
        </>
      }
      example={
        <p>
          웹훅 서명이나 API 인증 헤더를 로컬에서 검증할 때, 서버와 같은 키·알고리즘으로 HMAC을
          계산해 비교합니다.
        </p>
      }
    />
  );
}