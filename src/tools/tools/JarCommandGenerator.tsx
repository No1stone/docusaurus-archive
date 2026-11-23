import {useMemo, useState, type ReactNode} from 'react';

import CopyButton from '../components/CopyButton';
import {
  JAR_COMMAND_DEFAULT,
  JAR_COMMAND_EXAMPLE,
  buildPreviewCommand,
  createEnvRow,
  createProp,
  suggestJarPath,
  type EnvScope,
  type GradleTask,
  type JarCommandState,
  type OutputMode,
} from '../utils/jarCommandGenerator';
import styles from '../styles.module.css';

const SCOPE_OPTIONS: Array<{value: EnvScope; label: string}> = [
  {value: 'build', label: '빌드'},
  {value: 'run', label: '실행'},
  {value: 'both', label: '둘 다'},
];

const MODE_OPTIONS: Array<{value: OutputMode; label: string}> = [
  {value: 'build-and-run', label: '빌드 후 실행'},
  {value: 'build-only', label: '빌드만'},
  {value: 'run-only', label: '실행만'},
];

export default function JarCommandGenerator(): ReactNode {
  const [state, setState] = useState<JarCommandState>(JAR_COMMAND_DEFAULT);

  const preview = useMemo(() => buildPreviewCommand(state), [state]);

  const update = (patch: Partial<JarCommandState>) => {
    setState((prev) => ({...prev, ...patch}));
  };

  const setModulePath = (modulePath: string) => {
    setState((prev) => {
      const next = {...prev, modulePath};
      if (!prev.jarPathTouched) {
        next.jarPath = suggestJarPath(modulePath, prev.task);
      }
      return next;
    });
  };

  const setTask = (task: GradleTask) => {
    setState((prev) => {
      const next = {...prev, task};
      if (!prev.jarPathTouched) {
        next.jarPath = suggestJarPath(prev.modulePath, task);
      }
      return next;
    });
  };

  const loadExample = () => {
    setState({
      ...JAR_COMMAND_EXAMPLE,
      env: JAR_COMMAND_EXAMPLE.env.map((e) =>
        createEnvRow(e.key, e.value, e.scope),
      ),
      systemProps: JAR_COMMAND_EXAMPLE.systemProps.map((p) =>
        createProp(p.key, p.value),
      ),
    });
  };

  const reset = () => setState(JAR_COMMAND_DEFAULT);

  return (
    <div>
      <header className={styles.toolHeader}>
        <h1 className={styles.toolTitle}>JAR 빌드 및 실행 명령 생성기</h1>
        <p className={styles.toolSummary}>
          Gradle 빌드와 JAR 실행 설정을 한 화면에서 맞춰 macOS/Linux 셸 명령을
          만듭니다. 기본은 빌드 후 실행이며, 실패 시 <code>&amp;&amp;</code>로
          실행이 이어지지 않습니다.
        </p>
      </header>

      <section className={styles.panel} aria-label="출력 모드">
        <h2 className={styles.panelTitle}>출력 모드</h2>
        <div className={styles.row}>
          {MODE_OPTIONS.map((mode) => (
            <label key={mode.value} className={styles.check}>
              <input
                type="radio"
                name="output-mode"
                checked={state.outputMode === mode.value}
                onChange={() => update({outputMode: mode.value})}
              />
              {mode.label}
            </label>
          ))}
        </div>
      </section>

      <div className={styles.composerLayout}>
        <section className={styles.panel} aria-label="빌드 설정">
          <h2 className={styles.panelTitle}>빌드 설정</h2>
          <div className={styles.field}>
            <label htmlFor="module-path">Gradle 모듈 경로</label>
            <input
              id="module-path"
              placeholder="api-auth → :api-auth:bootJar"
              value={state.modulePath}
              onChange={(e) => setModulePath(e.target.value)}
              spellCheck={false}
            />
          </div>
          <div className={styles.field}>
            <span className={styles.fieldLabel}>작업</span>
            <div className={styles.row}>
              {(['bootJar', 'jar'] as GradleTask[]).map((task) => (
                <label key={task} className={styles.check}>
                  <input
                    type="radio"
                    name="gradle-task"
                    checked={state.task === task}
                    onChange={() => setTask(task)}
                  />
                  {task}
                </label>
              ))}
            </div>
          </div>
          <div className={styles.row}>
            <label className={styles.check}>
              <input
                type="checkbox"
                checked={state.clean}
                onChange={(e) => update({clean: e.target.checked})}
              />
              clean
            </label>
            <label className={styles.check}>
              <input
                type="checkbox"
                checked={state.runTests}
                onChange={(e) => update({runTests: e.target.checked})}
              />
              테스트 실행 (test)
            </label>
          </div>
          <div className={styles.field}>
            <label htmlFor="extra-gradle">추가 Gradle 옵션</label>
            <input
              id="extra-gradle"
              placeholder="--info --stacktrace"
              value={state.extraGradleOptions}
              onChange={(e) => update({extraGradleOptions: e.target.value})}
              spellCheck={false}
            />
          </div>
        </section>

        <section className={styles.panel} aria-label="실행 설정">
          <h2 className={styles.panelTitle}>실행 설정</h2>
          <div className={styles.field}>
            <label htmlFor="jar-path">빌드된 JAR 경로</label>
            <input
              id="jar-path"
              value={state.jarPath}
              onChange={(e) =>
                update({jarPath: e.target.value, jarPathTouched: true})
              }
              spellCheck={false}
            />
            <p className={styles.hint}>
              모듈 경로를 바꾸면 제안 경로가 갱신됩니다. 실제 산출물 이름에 맞게
              수정하세요.
            </p>
          </div>
          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="xms">초기 메모리 (-Xms)</label>
              <input
                id="xms"
                value={state.xms}
                onChange={(e) => update({xms: e.target.value})}
                placeholder="64m"
                spellCheck={false}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="xmx">최대 메모리 (-Xmx)</label>
              <input
                id="xmx"
                value={state.xmx}
                onChange={(e) => update({xmx: e.target.value})}
                placeholder="512m"
                spellCheck={false}
              />
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="spring-profile">Spring 프로필</label>
              <input
                id="spring-profile"
                value={state.springProfile}
                onChange={(e) => update({springProfile: e.target.value})}
                placeholder="local"
                spellCheck={false}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="server-port">서버 포트</label>
              <input
                id="server-port"
                value={state.serverPort}
                onChange={(e) => update({serverPort: e.target.value})}
                placeholder="8080"
                spellCheck={false}
              />
            </div>
          </div>
          <p className={styles.hint}>
            프로필·포트는 실행 인자로 붙습니다. 같은 키를 환경변수로도 넣으면
            인자는 생략해 중복을 피합니다.
          </p>

          <div className={styles.field}>
            <span className={styles.fieldLabel}>JVM 속성 (-D)</span>
            {state.systemProps.map((prop) => (
              <div key={prop.id} className={styles.envRow}>
                <input
                  aria-label="-D 키"
                  placeholder="file.encoding"
                  value={prop.key}
                  onChange={(e) =>
                    update({
                      systemProps: state.systemProps.map((p) =>
                        p.id === prop.id ? {...p, key: e.target.value} : p,
                      ),
                    })
                  }
                  spellCheck={false}
                />
                <input
                  aria-label="-D 값"
                  placeholder="UTF-8"
                  value={prop.value}
                  onChange={(e) =>
                    update({
                      systemProps: state.systemProps.map((p) =>
                        p.id === prop.id ? {...p, value: e.target.value} : p,
                      ),
                    })
                  }
                  spellCheck={false}
                />
                <button
                  type="button"
                  className={styles.secondaryButton}
                  onClick={() =>
                    update({
                      systemProps: state.systemProps.filter(
                        (p) => p.id !== prop.id,
                      ),
                    })
                  }>
                  삭제
                </button>
              </div>
            ))}
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={() =>
                update({systemProps: [...state.systemProps, createProp()]})
              }>
              + -D 속성 추가
            </button>
          </div>
        </section>
      </div>

      <section className={styles.panel} aria-label="환경변수">
        <h2 className={styles.panelTitle}>환경변수</h2>
        {state.env.map((row) => (
          <div key={row.id} className={styles.envRowScoped}>
            <input
              aria-label="환경변수 키"
              placeholder="KEY"
              value={row.key}
              onChange={(e) =>
                update({
                  env: state.env.map((r) =>
                    r.id === row.id ? {...r, key: e.target.value} : r,
                  ),
                })
              }
              spellCheck={false}
            />
            <input
              aria-label="환경변수 값"
              placeholder='local 또는 $DB_PASSWORD'
              value={row.value}
              onChange={(e) =>
                update({
                  env: state.env.map((r) =>
                    r.id === row.id ? {...r, value: e.target.value} : r,
                  ),
                })
              }
              spellCheck={false}
            />
            <select
              aria-label="적용 위치"
              value={row.scope}
              onChange={(e) =>
                update({
                  env: state.env.map((r) =>
                    r.id === row.id
                      ? {...r, scope: e.target.value as EnvScope}
                      : r,
                  ),
                })
              }>
              {SCOPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={() =>
                update({env: state.env.filter((r) => r.id !== row.id)})
              }>
              삭제
            </button>
          </div>
        ))}
        <button
          type="button"
          className={styles.secondaryButton}
          onClick={() => update({env: [...state.env, createEnvRow()]})}>
          + 환경변수 추가
        </button>
        <p className={styles.hint}>
          적용 위치는 빌드 명령, 실행 명령, 또는 둘 다입니다. 예:{' '}
          <code>DB_PASSWORD=$DB_PASSWORD</code> →{' '}
          <code>DB_PASSWORD=&quot;$DB_PASSWORD&quot;</code>
        </p>
      </section>

      <section className={styles.panel} aria-label="명령 미리보기">
        <h2 className={styles.panelTitle}>명령 미리보기</h2>
        <div className={styles.actions}>
          <button type="button" className={styles.secondaryButton} onClick={loadExample}>
            예제 불러오기
          </button>
          <button type="button" className={styles.secondaryButton} onClick={reset}>
            초기화
          </button>
          <CopyButton text={preview} label="명령 복사" />
        </div>
        <pre className={styles.resultBox}>{preview}</pre>
      </section>

      <section className={styles.panel} aria-label="사용 예시">
        <h2 className={styles.panelTitle}>사용 예시</h2>
        <div className={styles.example}>
          <p>
            멀티 모듈 <code>api-auth</code>는{' '}
            <code>./gradlew :api-auth:bootJar</code>와{' '}
            <code>api-auth/build/libs/api-auth.jar</code> 제안을 만듭니다. 빌드
            후 실행은 <code>&amp;&amp;</code>로 이어져 빌드 실패 시 실행하지
            않습니다.
          </p>
        </div>
      </section>
    </div>
  );
}
