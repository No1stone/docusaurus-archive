import {useMemo, useState, type ReactNode} from 'react';

import CopyButton from '../components/CopyButton';
import ToolShell from '../components/ToolShell';
import {
  formatHeaderSummary,
  groupHeaders,
  parseRawHeaders,
  SAMPLE_HTTP_HEADERS,
} from '../utils/httpHeaderAnalyzer';
import styles from '../styles.module.css';

export default function HttpHeaderAnalyzer(): ReactNode {
  const [raw, setRaw] = useState(SAMPLE_HTTP_HEADERS);
  const [analyzed, setAnalyzed] = useState(false);

  const headers = useMemo(() => (analyzed ? parseRawHeaders(raw) : []), [analyzed, raw]);
  const groups = useMemo(() => groupHeaders(headers), [headers]);
  const summary = useMemo(() => formatHeaderSummary(groups, headers), [groups, headers]);

  const analyze = () => {
    setAnalyzed(true);
  };

  const reset = () => {
    setRaw(SAMPLE_HTTP_HEADERS);
    setAnalyzed(false);
  };

  return (
    <ToolShell
      title="HTTP 헤더 분석기"
      summary="curl -v·브라우저 개발자 도구에서 복사한 요청/응답 헤더를 붙여 넣으면 캐시·CORS·콘텐츠·프록시 등으로 묶어 봅니다. 같은 이름의 헤더는 각 줄을 따로 표시합니다."
      controls={
        <div className={styles.field}>
          <label htmlFor="header-raw">헤더 원문</label>
          <textarea
            id="header-raw"
            value={raw}
            onChange={(e) => {
              setRaw(e.target.value);
              setAnalyzed(false);
            }}
            spellCheck={false}
            style={{minHeight: '12rem'}}
          />
        </div>
      }
      actions={
        <>
          <button type="button" className={styles.primaryButton} onClick={analyze}>
            분석
          </button>
          <button type="button" className={styles.secondaryButton} onClick={reset}>
            초기화
          </button>
        </>
      }
      result={
        <>
          {!analyzed ? (
            <p className={styles.hint}>분석을 실행하면 그룹별 헤더 목록이 표시됩니다.</p>
          ) : null}
          {analyzed && headers.length === 0 ? (
            <p className={styles.error}>인식된 헤더가 없습니다. Name: value 형식인지 확인하세요.</p>
          ) : null}
          {groups.map((g) => (
            <div key={g.group} style={{marginBottom: '1rem'}}>
              <h3 style={{fontSize: '1rem', marginBottom: '0.35rem'}}>{g.label}</h3>
              <ul style={{paddingLeft: '1.25rem', margin: 0}}>
                {g.items.map((h, index) => (
                  <li key={`${h.line}-${h.name}-${index}`}>
                    <strong>{h.name}</strong>: {h.value}
                    <span className={styles.hint}> (줄 {h.line})</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {analyzed && headers.length > 0 ? (
            <>
              <textarea
                readOnly
                value={summary}
                spellCheck={false}
                style={{marginTop: '0.75rem', width: '100%', minHeight: '10rem'}}
              />
              <div style={{marginTop: '0.75rem'}}>
                <CopyButton text={summary} label="요약 복사" />
              </div>
            </>
          ) : null}
        </>
      }
      example={
        <p>
          상태 줄(<code>HTTP/1.1 200</code>)은 건너뜁니다. <code>Set-Cookie</code>처럼 같은 이름이 여러
          번 나오면 각각 별도 항목으로 나열합니다.
        </p>
      }
    />
  );
}