import {useMemo, useState, type ReactNode} from 'react';

import CopyButton from '../components/CopyButton';
import ExternalRequestGate from '../components/ExternalRequestGate';
import ToolShell from '../components/ToolShell';
import styles from '../styles.module.css';

function buildIpApiUrl(ip: string): string {
  const trimmed = ip.trim();
  if (!trimmed) {
    return 'https://ipapi.co/json/';
  }
  return `https://ipapi.co/${encodeURIComponent(trimmed)}/json/`;
}

export default function IpLookup(): ReactNode {
  const [ip, setIp] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const targetUrl = useMemo(() => buildIpApiUrl(ip), [ip]);
  const queryLabel = ip.trim() ? `IP ${ip.trim()}` : '현재 공인 IP (내 IP)';

  return (
    <ToolShell
      title="IP 조회"
      summary="공인 IP 정보를 ipapi.co JSON API로 조회합니다. 요청은 동의 후에만 전송합니다."
      controls={
        <>
          <div className={styles.field}>
            <label htmlFor="ip-input">IP 주소 (비우면 내 IP)</label>
            <input
              id="ip-input"
              value={ip}
              onChange={(event) => setIp(event.target.value)}
              placeholder="203.0.113.1"
              spellCheck={false}
            />
          </div>
          <p className={styles.hint}>
            조회 시 ipapi.co에 IP가 전달됩니다. VPN·회사 NAT 환경에서는 결과가 예상과 다를 수 있습니다.
            응답은 제3자 서비스 정책을 따르며, 민감한 내부망 IP를 붙여 넣지 마세요.
          </p>
        </>
      }
      actions={<span className={styles.hint}>조회는 아래 동의 후 실행됩니다.</span>}
      result={
        <>
          <div className={styles.resultBox}>
            대상: {queryLabel}
            {'\n'}
            요청 URL: {targetUrl}
          </div>
          <ExternalRequestGate
            destinationLabel="ipapi.co"
            destinationUrl={targetUrl}
            payloadSummary={`GET — 조회 대상: ${queryLabel}`}
            confirmLabel="IP 조회 실행"
            onConfirm={async () => {
              setResult('');
              setError('');
              try {
                const response = await fetch(targetUrl);
                const text = await response.text();
                if (!response.ok) {
                  throw new Error(`HTTP ${response.status}: ${text.slice(0, 200)}`);
                }
                try {
                  setResult(JSON.stringify(JSON.parse(text), null, 2));
                } catch {
                  setResult(text);
                }
              } catch (err) {
                setError(
                  err instanceof Error
                    ? err.message
                    : '조회에 실패했습니다. CORS 또는 할당량 제한일 수 있습니다.',
                );
              }
            }}
          />
          {result ? (
            <div className={styles.resultBox} style={{marginTop: '0.75rem'}}>
              {result}
            </div>
          ) : null}
          {error ? <p className={styles.error}>{error}</p> : null}
          {result ? <CopyButton text={result} /> : null}
        </>
      }
      example={
        <p>
          빈 입력은 `https://ipapi.co/json/`으로 브라우저가 보이는 공인 IP를 조회합니다. 조회는
          무료 한도가 있으니 과도한 반복을 피하세요.
        </p>
      }
    />
  );
}