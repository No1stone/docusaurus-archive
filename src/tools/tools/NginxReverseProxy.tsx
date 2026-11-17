import {useMemo, useState, type ReactNode} from 'react';

import CopyButton from '../components/CopyButton';
import ToolShell from '../components/ToolShell';
import {
  buildNginxReverseProxyConfig,
  NGINX_PROXY_DEFAULTS,
  type NginxProxyInput,
  type PathPrefixMode,
  type ProxyPreset,
} from '../utils/nginxReverseProxy';
import styles from '../styles.module.css';

export default function NginxReverseProxy(): ReactNode {
  const [input, setInput] = useState<NginxProxyInput>(() => ({...NGINX_PROXY_DEFAULTS}));

  const {config, forwardExample} = useMemo(
    () => buildNginxReverseProxyConfig(input),
    [input],
  );

  const update = <K extends keyof NginxProxyInput>(key: K, value: NginxProxyInput[K]) => {
    setInput((prev) => ({...prev, [key]: value}));
  };

  const reset = () => {
    setInput({...NGINX_PROXY_DEFAULTS});
  };

  return (
    <ToolShell
      title="Nginx 리버스 프록시 설정 생성기"
      summary="도메인·경로 prefix·업스트림을 넣으면 location과 proxy_pass 블록을 만듭니다. HTTP·WebSocket·SSE 프리셋과 경로 prefix 유지/제거를 선택할 수 있습니다."
      controls={
        <>
          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="ngx-domain">도메인 (server_name)</label>
              <input
                id="ngx-domain"
                type="text"
                value={input.domain}
                onChange={(e) => update('domain', e.target.value)}
                spellCheck={false}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="ngx-upstream">업스트림 (host:port)</label>
              <input
                id="ngx-upstream"
                type="text"
                value={input.upstream}
                onChange={(e) => update('upstream', e.target.value)}
                spellCheck={false}
              />
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor="ngx-prefix">경로 prefix (location)</label>
            <input
              id="ngx-prefix"
              type="text"
              value={input.pathPrefix}
              onChange={(e) => update('pathPrefix', e.target.value)}
              spellCheck={false}
            />
          </div>

          <div className={styles.field}>
            <span className={styles.fieldLabel}>프리셋</span>
            <div className={styles.row}>
              {(
                [
                  ['http', 'HTTP'],
                  ['websocket', 'WebSocket'],
                  ['sse', 'SSE'],
                ] as const
              ).map(([id, label]) => (
                <label key={id} className={styles.check}>
                  <input
                    type="radio"
                    name="ngx-preset"
                    checked={input.preset === id}
                    onChange={() => update('preset', id as ProxyPreset)}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          <div className={styles.field}>
            <span className={styles.fieldLabel}>경로 prefix 처리</span>
            <div className={styles.row}>
              {(
                [
                  ['strip', '제거 (proxy_pass …/)'],
                  ['keep', '유지 (proxy_pass …)'],
                ] as const
              ).map(([id, label]) => (
                <label key={id} className={styles.check}>
                  <input
                    type="radio"
                    name="ngx-path-mode"
                    checked={input.pathMode === id}
                    onChange={() => update('pathMode', id as PathPrefixMode)}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>
        </>
      }
      actions={
        <button type="button" className={styles.secondaryButton} onClick={reset}>
          초기화
        </button>
      }
      result={
        <>
          <p className={styles.hint} style={{whiteSpace: 'pre-wrap'}}>
            {forwardExample}
          </p>
          <textarea
            readOnly
            value={config}
            spellCheck={false}
            style={{width: '100%', minHeight: '14rem', fontFamily: 'monospace'}}
          />
          <div style={{marginTop: '0.75rem'}}>
            <CopyButton text={config} label="설정 복사" />
          </div>
        </>
      }
      example={
        <p>
          예: 도메인 <code>api.example.com</code>, prefix <code>/api/v1/</code>, 업스트림{' '}
          <code>127.0.0.1:3000</code>, strip 모드이면 요청 <code>/api/v1/x</code> → 업스트림{' '}
          <code>/x</code>로 전달됩니다. WebSocket·SSE는 각각 Upgrade·버퍼링 off 헤더가 추가됩니다.
        </p>
      }
    />
  );
}