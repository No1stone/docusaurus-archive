import {useState, type ReactNode} from 'react';

import CopyButton from '../components/CopyButton';
import ToolShell from '../components/ToolShell';
import {
  asBufferSource,
  base64ToBytes,
  bytesToBase64,
  bytesToUtf8,
  deriveAesKey,
  utf8ToBytes,
} from '../utils';
import styles from '../styles.module.css';

export default function AesGcm(): ReactNode {
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [passphrase, setPassphrase] = useState('change-me');
  const [input, setInput] = useState('secret message');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  return (
    <ToolShell
      title="AES-GCM 암복호화"
      summary="암호 문구 기반 AES-256-GCM으로 암복호화합니다."
      controls={
        <>
          <div className={styles.row}>
            <label className={styles.check}>
              <input
                type="radio"
                name="aes-mode"
                checked={mode === 'encrypt'}
                onChange={() => setMode('encrypt')}
              />
              암호화
            </label>
            <label className={styles.check}>
              <input
                type="radio"
                name="aes-mode"
                checked={mode === 'decrypt'}
                onChange={() => setMode('decrypt')}
              />
              복호화
            </label>
          </div>
          <div className={styles.field}>
            <label htmlFor="aes-pass">암호 문구</label>
            <input
              id="aes-pass"
              type="password"
              value={passphrase}
              onChange={(event) => setPassphrase(event.target.value)}
              autoComplete="off"
            />
            <p className={styles.hint}>
              PBKDF2로 AES-256-GCM 키를 만듭니다. 결과는 salt, iv, ciphertext를 Base64로 묶습니다.
            </p>
          </div>
          <div className={styles.field}>
            <label htmlFor="aes-input">
              {mode === 'encrypt' ? '평문' : '암호문 (Base64 묶음)'}
            </label>
            <textarea
              id="aes-input"
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
              if (!passphrase) {
                throw new Error('암호 문구를 입력합니다.');
              }
              if (mode === 'encrypt') {
                const salt = crypto.getRandomValues(new Uint8Array(16));
                const iv = crypto.getRandomValues(new Uint8Array(12));
                const key = await deriveAesKey(passphrase, salt);
                const encrypted = new Uint8Array(
                  await crypto.subtle.encrypt(
                    {name: 'AES-GCM', iv: asBufferSource(iv)},
                    key,
                    asBufferSource(utf8ToBytes(input)),
                  ),
                );
                const packed = new Uint8Array(salt.length + iv.length + encrypted.length);
                packed.set(salt, 0);
                packed.set(iv, salt.length);
                packed.set(encrypted, salt.length + iv.length);
                setResult(bytesToBase64(packed));
              } else {
                const packed = base64ToBytes(input.trim());
                if (packed.length < 16 + 12 + 1) {
                  throw new Error('암호문 형식이 올바르지 않습니다.');
                }
                const salt = packed.slice(0, 16);
                const iv = packed.slice(16, 28);
                const data = packed.slice(28);
                const key = await deriveAesKey(passphrase, salt);
                const decrypted = new Uint8Array(
                  await crypto.subtle.decrypt(
                    {name: 'AES-GCM', iv: asBufferSource(iv)},
                    key,
                    asBufferSource(data),
                  ),
                );
                setResult(bytesToUtf8(decrypted));
              }
              setError('');
            } catch (err) {
              setResult('');
              setError(
                err instanceof Error
                  ? err.message
                  : '암복호화에 실패했습니다. 암호 문구와 암호문을 확인합니다.',
              );
            }
          }}>
          {mode === 'encrypt' ? '암호화' : '복호화'}
        </button>
      }
      result={
        <>
          <div className={styles.resultBox}>{result || '결과가 여기에 표시됩니다.'}</div>
          {error ? <p className={styles.error}>{error}</p> : null}
          <div style={{marginTop: '0.75rem'}}>
            <CopyButton text={result} />
          </div>
        </>
      }
      example={
        <p>
          짧은 메모를 전달할 때 암호화한 뒤 암호문을 공유하고, 같은 암호 문구로 복호화합니다.
          운영 비밀 저장에는 Vault 같은 전용 저장소를 사용합니다.
        </p>
      }
    />
  );
}
