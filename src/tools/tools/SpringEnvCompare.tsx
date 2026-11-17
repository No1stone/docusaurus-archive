import {useMemo, useState, type ReactNode} from 'react';

import CopyButton from '../components/CopyButton';
import ToolShell from '../components/ToolShell';
import {compareSpringEnv} from '../utils/springEnv';
import styles from '../styles.module.css';

const SAMPLE_SPRING = `spring:
  datasource:
    url: jdbc:postgresql://\${DB_HOST:localhost:5432}/\${DB_NAME:app}
    username: \${DB_USER}
    password: \${DB_PASSWORD}
  redis:
    host: \${REDIS_HOST:127.0.0.1}
`;

const SAMPLE_ENV = `# 애플리케이션 환경변수 예시
DB_NAME=production
DB_USER=app_user
DB_PASSWORD=secret
REDIS_HOST=
UNUSED_KEY=demo
`;

export default function SpringEnvCompare(): ReactNode {
  const [springConfig, setSpringConfig] = useState(SAMPLE_SPRING);
  const [envExample, setEnvExample] = useState(SAMPLE_ENV);
  const [run, setRun] = useState(true);

  const report = useMemo(() => {
    if (!run) {
      return null;
    }
    return compareSpringEnv(springConfig, envExample);
  }, [springConfig, envExample, run]);

  const reset = () => {
    setSpringConfig('');
    setEnvExample('');
    setRun(false);
  };

  const loadSample = () => {
    setSpringConfig(SAMPLE_SPRING);
    setEnvExample(SAMPLE_ENV);
    setRun(true);
  };

  return (
    <ToolShell
      title="Spring 환경변수 비교기"
      summary="application.yml 또는 application.properties와 .env.example을 대조해 placeholder, 누락 키, 미사용 키를 정리합니다."
      controls={
        <div className={styles.split}>
          <div className={styles.field}>
            <label htmlFor="spring-config">Spring 설정 (YAML / properties)</label>
            <textarea
              id="spring-config"
              value={springConfig}
              onChange={(e) => {
                setSpringConfig(e.target.value);
                setRun(true);
              }}
              spellCheck={false}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="env-example">.env.example</label>
            <textarea
              id="env-example"
              value={envExample}
              onChange={(e) => {
                setEnvExample(e.target.value);
                setRun(true);
              }}
              spellCheck={false}
            />
          </div>
        </div>
      }
      actions={
        <>
          <button
            type="button"
            className={styles.primaryButton}
            onClick={() => setRun(true)}>
            비교
          </button>
          <button type="button" className={styles.secondaryButton} onClick={loadSample}>
            예제 불러오기
          </button>
          <button type="button" className={styles.secondaryButton} onClick={reset}>
            초기화
          </button>
        </>
      }
      result={
        <>
          {report?.parseError ? (
            <p className={styles.error}>YAML 참고: {report.parseError}</p>
          ) : null}
          {!report || (!springConfig.trim() && !envExample.trim()) ? (
            <p className={styles.hint}>설정과 .env.example을 입력한 뒤 비교를 실행하세요.</p>
          ) : (
            <>
              <h3 className={styles.fieldLabel}>정의됨 (값 있음)</h3>
              {report.definedKeys.length === 0 ? (
                <p className={styles.hint}>없음</p>
              ) : (
                <ul style={{paddingLeft: '1.25rem'}}>
                  {report.definedKeys.map((row) => (
                    <li key={row.key}>
                      <code>{row.key}</code> = {row.value}
                    </li>
                  ))}
                </ul>
              )}

              <h3 className={styles.fieldLabel}>빈 값 (KEY=)</h3>
              {report.emptyValues.length === 0 ? (
                <p className={styles.hint}>없음</p>
              ) : (
                <ul style={{paddingLeft: '1.25rem'}}>
                  {report.emptyValues.map((k) => (
                    <li key={k}>
                      <code>{k}</code>
                    </li>
                  ))}
                </ul>
              )}

              <h3 className={styles.fieldLabel}>누락 (필수 placeholder, .env에 없음)</h3>
              {report.missingRequired.length === 0 ? (
                <p className={styles.hint}>없음</p>
              ) : (
                <>
                  <ul style={{paddingLeft: '1.25rem'}}>
                    {report.missingRequired.map((k) => (
                      <li key={k}>
                        <code>{k}</code>
                      </li>
                    ))}
                  </ul>
                  <CopyButton text={report.missingKeysCopyText} label="누락 키 복사 (KEY=)" />
                </>
              )}

              <h3 className={styles.fieldLabel}>기본값 있는 placeholder</h3>
              {report.withDefaults.length === 0 ? (
                <p className={styles.hint}>없음</p>
              ) : (
                <ul style={{paddingLeft: '1.25rem'}}>
                  {report.withDefaults.map((row) => (
                    <li key={row.key}>
                      <code>{'${' + row.key + ':' + row.defaultValue + '}'}</code>
                    </li>
                  ))}
                </ul>
              )}

              <h3 className={styles.fieldLabel}>미사용 (.env에만 있음)</h3>
              {report.unusedKeys.length === 0 ? (
                <p className={styles.hint}>없음</p>
              ) : (
                <ul style={{paddingLeft: '1.25rem'}}>
                  {report.unusedKeys.map((k) => (
                    <li key={k}>
                      <code>{k}</code>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </>
      }
      example={
        <p>
          Spring Boot 설정에 있는 <code>{'${VAR}'}</code>, <code>{'${VAR:default}'}</code> placeholder와
          팀 .env.example을 맞출 때 씁니다. properties 형식은 <code>key=value</code> 줄에서도 동일하게
          추출합니다.
        </p>
      }
    />
  );
}