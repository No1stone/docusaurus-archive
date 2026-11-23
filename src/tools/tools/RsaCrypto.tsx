import {useState, type ReactNode} from 'react';

import CopyButton from '../components/CopyButton';
import ToolShell from '../components/ToolShell';
import {asBufferSource, base64ToBytes, bytesToBase64, utf8ToBytes, bytesToUtf8} from '../utils';
import styles from '../styles.module.css';

function pemToArrayBuffer(pem: string): ArrayBuffer {
  const body = pem
    .replace(/-----BEGIN [^-]+-----/g, '')
    .replace(/-----END [^-]+-----/g, '')
    .replace(/\s/g, '');
  const bytes = base64ToBytes(body);
  const copy = new Uint8Array(bytes.byteLength);
  copy.set(bytes);
  return copy.buffer;
}

async function importRsaKey(
  text: string,
  usage: 'encrypt' | 'decrypt',
): Promise<CryptoKey> {
  const trimmed = text.trim();
  if (!trimmed) {
    throw new Error('키 입력이 비어 있습니다.');
  }

  if (trimmed.startsWith('{')) {
    const jwk = JSON.parse(trimmed) as JsonWebKey;
    const alg = {name: 'RSA-OAEP', hash: 'SHA-256'};
    return crypto.subtle.importKey(
      'jwk',
      jwk,
      alg,
      true,
      usage === 'encrypt' ? ['encrypt'] : ['decrypt'],
    );
  }

  const alg = {name: 'RSA-OAEP', hash: 'SHA-256'};
  if (trimmed.includes('PRIVATE')) {
    const der = pemToArrayBuffer(trimmed);
    return crypto.subtle.importKey('pkcs8', der, alg, true, ['decrypt']);
  }
  if (trimmed.includes('PUBLIC')) {
    const der = pemToArrayBuffer(trimmed);
    return crypto.subtle.importKey('spki', der, alg, true, ['encrypt']);
  }

  throw new Error('JWK JSON 또는 PEM 형식의 키를 붙여 넣습니다.');
}

export default function RsaCrypto(): ReactNode {
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [plaintext, setPlaintext] = useState('hello rsa');
  const [ciphertext, setCiphertext] = useState('');
  const [keyInput, setKeyInput] = useState('');
  const [publicJwk, setPublicJwk] = useState('');
  const [privateJwk, setPrivateJwk] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const exportedKeys =
    publicJwk || privateJwk
      ? `Public JWK\n${publicJwk}\n\nPrivate JWK\n${privateJwk}`
      : '';

  return (
    <ToolShell
      title="RSA-OAEP (2048)"
      summary="브라우저 Web Crypto로 RSA-OAEP 키 쌍을 만들고 UTF-8 텍스트를 암복호화합니다."
      controls={
        <>
          <div className={styles.warningBox}>
            <strong>데모 전용</strong>
            <p className={styles.hint} style={{margin: 0}}>
              운영 비밀·PII 저장에 쓰지 마세요. 키와 평문은 브라우저 메모리에만 있으며 새로고침 시
              사라집니다.
            </p>
          </div>
          <div className={styles.row}>
            <label className={styles.check}>
              <input
                type="radio"
                name="rsa-mode"
                checked={mode === 'encrypt'}
                onChange={() => setMode('encrypt')}
              />
              암호화
            </label>
            <label className={styles.check}>
              <input
                type="radio"
                name="rsa-mode"
                checked={mode === 'decrypt'}
                onChange={() => setMode('decrypt')}
              />
              복호화
            </label>
          </div>
          <div className={styles.row}>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={async () => {
                const pair = await crypto.subtle.generateKey(
                  {
                    name: 'RSA-OAEP',
                    modulusLength: 2048,
                    publicExponent: new Uint8Array([1, 0, 1]),
                    hash: 'SHA-256',
                  },
                  true,
                  ['encrypt', 'decrypt'],
                );
                const pub = await crypto.subtle.exportKey('jwk', pair.publicKey);
                const priv = await crypto.subtle.exportKey('jwk', pair.privateKey);
                setPublicJwk(JSON.stringify(pub, null, 2));
                setPrivateJwk(JSON.stringify(priv, null, 2));
                setKeyInput(
                  JSON.stringify(mode === 'encrypt' ? pub : priv, null, 2),
                );
              }}>
              RSA 2048 키 쌍 생성
            </button>
          </div>
          <div className={styles.field}>
            <label htmlFor="rsa-key">
              {mode === 'encrypt' ? '공개키 (JWK JSON / PEM)' : '개인키 (JWK JSON / PEM)'}
            </label>
            <textarea
              id="rsa-key"
              value={keyInput}
              onChange={(event) => setKeyInput(event.target.value)}
              spellCheck={false}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="rsa-input">
              {mode === 'encrypt' ? '평문 (UTF-8)' : '암호문 (Base64)'}
            </label>
            <textarea
              id="rsa-input"
              value={mode === 'encrypt' ? plaintext : ciphertext}
              onChange={(event) =>
                mode === 'encrypt'
                  ? setPlaintext(event.target.value)
                  : setCiphertext(event.target.value)
              }
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
              const key = await importRsaKey(keyInput, mode);
              if (mode === 'encrypt') {
                const encrypted = await crypto.subtle.encrypt(
                  {name: 'RSA-OAEP'},
                  key,
                  asBufferSource(utf8ToBytes(plaintext)),
                );
                setOutput(bytesToBase64(new Uint8Array(encrypted)));
              } else {
                const data = base64ToBytes(ciphertext.trim());
                const decrypted = await crypto.subtle.decrypt(
                  {name: 'RSA-OAEP'},
                  key,
                  asBufferSource(data),
                );
                setOutput(bytesToUtf8(new Uint8Array(decrypted)));
              }
              setError('');
            } catch (err) {
              setOutput('');
              setError(err instanceof Error ? err.message : 'RSA 처리에 실패했습니다.');
            }
          }}>
          {mode === 'encrypt' ? '암호화' : '복호화'}
        </button>
      }
      result={
        <>
          <div className={styles.resultBox}>{output || '결과가 여기에 표시됩니다.'}</div>
          {error ? <p className={styles.error}>{error}</p> : null}
          {publicJwk ? (
            <div className={styles.field} style={{marginTop: '1rem'}}>
              <label>생성된 공개키 JWK</label>
              <div className={styles.resultBox}>{publicJwk}</div>
            </div>
          ) : null}
          {privateJwk ? (
            <div className={styles.field}>
              <label>생성된 개인키 JWK</label>
              <div className={styles.resultBox}>{privateJwk}</div>
            </div>
          ) : null}
          <CopyButton text={output} />
          {exportedKeys ? <CopyButton text={exportedKeys} label="JWK 복사" /> : null}
        </>
      }
    />
  );
}