import {useMemo, useState, type ReactNode} from 'react';

import CopyButton from '../components/CopyButton';
import ToolShell from '../components/ToolShell';
import {bytesToUtf8, fromBase64Url, base64ToBytes} from '../utils';
import styles from '../styles.module.css';

const SAMPLE =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

function decodePart(part: string): unknown {
  const json = bytesToUtf8(base64ToBytes(fromBase64Url(part)));
  return JSON.parse(json) as unknown;
}

type TimeClaimRow = {
  claim: string;
  unix: number;
  local: string;
};

function extractTimeClaims(payload: unknown): TimeClaimRow[] {
  if (!payload || typeof payload !== 'object') {
    return [];
  }
  const obj = payload as Record<string, unknown>;
  const keys = ['iat', 'exp', 'nbf'] as const;
  return keys
    .filter((key) => typeof obj[key] === 'number')
    .map((key) => {
      const unix = obj[key] as number;
      return {
        claim: key,
        unix,
        local: new Date(unix * 1000).toLocaleString(),
      };
    });
}

export default function JwtParser(): ReactNode {
  const [token, setToken] = useState(SAMPLE);
  const [header, setHeader] = useState('');
  const [payload, setPayload] = useState('');
  const [payloadObject, setPayloadObject] = useState<unknown>(null);
  const [error, setError] = useState('');

  const timeClaims = useMemo(() => extractTimeClaims(payloadObject), [payloadObject]);

  const resultText = [header && `Header\n${header}`, payload && `Payload\n${payload}`]
    .filter(Boolean)
    .join('\n\n');

  const resetAll = () => {
    setToken(SAMPLE);
    setHeader('');
    setPayload('');
    setPayloadObject(null);
    setError('');
  };

  return (
    <ToolShell
      title="JWT 파서"
      summary="JWT Header와 Payload를 디코딩해 확인합니다."
      controls={
        <div className={styles.field}>
          <label htmlFor="jwt-input">JWT</label>
          <textarea
            id="jwt-input"
            value={token}
            onChange={(event) => setToken(event.target.value)}
            spellCheck={false}
          />
          <p className={styles.hint}>
            <span className={styles.badgeWarn}>서명 미검증</span> — Header와 Payload만 디코딩합니다.
          </p>
        </div>
      }
      actions={
        <>
          <button
            type="button"
            className={styles.primaryButton}
            onClick={() => {
              try {
                const parts = token.trim().split('.');
                if (parts.length < 2) {
                  throw new Error('JWT는 header.payload.signature 형식이어야 합니다.');
                }
                const headerObj = decodePart(parts[0]!);
                const payloadObj = decodePart(parts[1]!);
                setHeader(JSON.stringify(headerObj, null, 2));
                setPayload(JSON.stringify(payloadObj, null, 2));
                setPayloadObject(payloadObj);
                setError('');
              } catch (err) {
                setHeader('');
                setPayload('');
                setPayloadObject(null);
                setError(err instanceof Error ? err.message : 'JWT 파싱에 실패했습니다.');
              }
            }}>
            파싱하기
          </button>
          <button type="button" className={styles.secondaryButton} onClick={resetAll}>
            초기화
          </button>
        </>
      }
      result={
        <>
          <p className={styles.hint} style={{marginTop: 0}}>
            <span className={styles.badgeWarn}>서명 미검증</span> — 토큰 위·변조 여부는 확인하지
            않습니다.
          </p>
          <div className={styles.split}>
            <div className={styles.field}>
              <label>Header</label>
              <div className={styles.resultBox}>{header || '-'}</div>
            </div>
            <div className={styles.field}>
              <label>Payload</label>
              <div className={styles.resultBox}>{payload || '-'}</div>
            </div>
          </div>
          {timeClaims.length > 0 ? (
            <table className={styles.dataTable} aria-label="시간 클레임">
              <thead>
                <tr>
                  <th>클레임</th>
                  <th>Unix (초)</th>
                  <th>로컬 시각</th>
                </tr>
              </thead>
              <tbody>
                {timeClaims.map((row) => (
                  <tr key={row.claim}>
                    <td>{row.claim}</td>
                    <td>{row.unix}</td>
                    <td>{row.local}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : null}
          {error ? <p className={styles.error}>{error}</p> : null}
          <div style={{marginTop: '0.75rem'}}>
            <CopyButton text={resultText} />
          </div>
        </>
      }
      example={
        <p>
          Access 토큰의 `sub`, `exp`, `roles` 클레임을 확인할 때 사용합니다. 만료 시각은 위 표 또는
          Payload의 `exp` 유닉스 초를 보면 됩니다.
        </p>
      }
    />
  );
}