import {useMemo, useState, type ReactNode} from 'react';

import CopyButton from '../components/CopyButton';
import ExternalRequestGate from '../components/ExternalRequestGate';
import ToolShell from '../components/ToolShell';
import {
  curlToFetchSnippet,
  curlToPythonSnippet,
  parseCurlCommand,
} from '../utils/curlParse';
import styles from '../styles.module.css';

const SAMPLE =
  "curl -X POST https://httpbin.org/post -H 'Content-Type: application/json' -d '{\"hello\":\"world\"}'";

export default function CurlConverter(): ReactNode {
  const [curl, setCurl] = useState(SAMPLE);
  const [parseError, setParseError] = useState('');
  const [parsed, setParsed] = useState<ReturnType<typeof parseCurlCommand> | null>(null);
  const [fetchResult, setFetchResult] = useState('');
  const [fetchError, setFetchError] = useState('');

  const snippets = useMemo(() => {
    if (!parsed) {
      return {fetch: '', python: ''};
    }
    return {
      fetch: curlToFetchSnippet(parsed),
      python: curlToPythonSnippet(parsed),
    };
  }, [parsed]);

  const previewText = parsed
    ? [
        `URL: ${parsed.url}`,
        `Method: ${parsed.method}`,
        `Headers: ${JSON.stringify(parsed.headers, null, 2)}`,
        `Body: ${parsed.body || '(없음)'}`,
      ].join('\n')
    : '';

  return (
    <ToolShell
      title="curl 변환기"
      summary="기본 curl 옵션(-X, -H, -d)을 JavaScript fetch와 Python requests 예시로 변환합니다."
      controls={
        <div className={styles.field}>
          <label htmlFor="curl-input">curl 명령</label>
          <textarea
            id="curl-input"
            value={curl}
            onChange={(event) => setCurl(event.target.value)}
            spellCheck={false}
          />
          <p className={styles.hint}>
            요청 테스트는 직접 동의한 경우에만 브라우저에서 전송합니다. CORS로 실패할 수 있습니다.
          </p>
        </div>
      }
      actions={
        <button
          type="button"
          className={styles.primaryButton}
          onClick={() => {
            try {
              setParsed(parseCurlCommand(curl));
              setParseError('');
              setFetchResult('');
              setFetchError('');
            } catch (err) {
              setParsed(null);
              setParseError(err instanceof Error ? err.message : 'curl 파싱에 실패했습니다.');
            }
          }}>
          변환하기
        </button>
      }
      result={
        <>
          {parseError ? <p className={styles.error}>{parseError}</p> : null}
          {parsed ? (
            <>
              <CodeSnippets fetch={snippets.fetch} python={snippets.python} />
              <section className={styles.panel} aria-label="요청 테스트">
                <h3 className={styles.panelTitle}>요청 테스트 (선택)</h3>
                <div className={styles.resultBox}>{previewText}</div>
                <ExternalRequestGate
                  destinationLabel="curl에 지정한 URL"
                  destinationUrl={parsed.url}
                  payloadSummary={`HTTP ${parsed.method}, 헤더 ${Object.keys(parsed.headers).length}개, 본문 ${parsed.body ? `${parsed.body.length}자` : '없음'}`}
                  confirmLabel="요청 테스트 실행"
                  onConfirm={async () => {
                    setFetchResult('');
                    setFetchError('');
                    try {
                      const response = await fetch(parsed.url, {
                        method: parsed.method,
                        headers: parsed.headers,
                        body:
                          parsed.body && parsed.method !== 'GET' && parsed.method !== 'HEAD'
                            ? parsed.body
                            : undefined,
                      });
                      const text = await response.text();
                      setFetchResult(
                        `HTTP ${response.status}\n\n${text.slice(0, 8000)}`,
                      );
                    } catch (err) {
                      setFetchError(
                        err instanceof Error
                          ? `${err.message} (CORS 또는 네트워크 오류일 수 있습니다.)`
                          : '요청에 실패했습니다.',
                      );
                    }
                  }}
                />
                {fetchResult ? (
                  <div className={styles.resultBox} style={{marginTop: '0.75rem'}}>
                    {fetchResult}
                  </div>
                ) : null}
                {fetchError ? <p className={styles.error}>{fetchError}</p> : null}
              </section>
            </>
          ) : (
            <p className={styles.hint}>curl 명령을 붙여 넣고 변환하기를 누르세요.</p>
          )}
        </>
      }
    />
  );
}

function CodeSnippets({fetch, python}: {fetch: string; python: string}): ReactNode {
  return (
    <>
      <div className={styles.field}>
        <label>JavaScript (fetch)</label>
        <div className={styles.resultBox}>{fetch}</div>
        <CopyButton text={fetch} label="fetch 복사" />
      </div>
      <div className={styles.field}>
        <label>Python (requests)</label>
        <div className={styles.resultBox}>{python}</div>
        <CopyButton text={python} label="Python 복사" />
      </div>
    </>
  );
}