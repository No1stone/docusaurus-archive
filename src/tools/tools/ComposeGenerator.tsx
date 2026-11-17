import {useMemo, useState, type ReactNode} from 'react';
import Link from '@docusaurus/Link';

import CopyButton from '../components/CopyButton';
import {
  COMPOSE_PRESET_LIST,
  COMPOSE_PRESETS,
  type ComposePresetId,
} from '../data/composePresets';
import {
  buildComposeFiles,
  defaultOptionsForPreset,
  type ComposeGeneratorOptions,
  type NetworkMode,
  type PersistMode,
  type PortMode,
} from '../utils/composeGenerator';
import styles from '../styles.module.css';

export default function ComposeGenerator(): ReactNode {
  const [options, setOptions] = useState<ComposeGeneratorOptions>(() =>
    defaultOptionsForPreset('mysql'),
  );

  const preset = COMPOSE_PRESETS[options.presetId];
  const {composeYaml, envExample} = useMemo(
    () => buildComposeFiles(options),
    [options],
  );

  const update = <K extends keyof ComposeGeneratorOptions>(
    key: K,
    value: ComposeGeneratorOptions[K],
  ) => {
    setOptions((prev) => ({...prev, [key]: value}));
  };

  const selectPreset = (presetId: ComposePresetId) => {
    setOptions(defaultOptionsForPreset(presetId));
  };

  const dbExtras = preset.supportsDbExtras;

  return (
    <div>
      <header className={styles.toolHeader}>
        <h1 className={styles.toolTitle}>Docker Compose 예제 생성기</h1>
        <p className={styles.toolSummary}>
          서비스와 옵션을 고르면 compose.yaml과 .env.example이 바로 갱신됩니다.
          이미지·환경변수·볼륨 기본값은 아카이브 Compose 문서를 따릅니다.
        </p>
        <p className={styles.hint}>
          관련 문서:{' '}
          <Link to={preset.docPath}>{preset.docLabel}</Link>
        </p>
      </header>

      <div className={styles.composerLayout}>
        <section className={styles.panel} aria-label="서비스와 옵션">
          <h2 className={styles.panelTitle}>서비스와 옵션</h2>

          <div className={styles.field}>
            <label htmlFor="compose-preset">프리셋</label>
            <select
              id="compose-preset"
              value={options.presetId}
              onChange={(event) =>
                selectPreset(event.target.value as ComposePresetId)
              }>
              {COMPOSE_PRESET_LIST.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="compose-image">이미지</label>
              <input
                id="compose-image"
                value={options.imageTag}
                onChange={(event) => update('imageTag', event.target.value)}
                spellCheck={false}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="compose-service">서비스 이름</label>
              <input
                id="compose-service"
                value={options.serviceName}
                onChange={(event) => update('serviceName', event.target.value)}
                spellCheck={false}
              />
            </div>
          </div>

          <div className={styles.field}>
            <span className={styles.fieldLabel}>포트 공개</span>
            <div className={styles.row}>
              <label className={styles.check}>
                <input
                  type="radio"
                  name="port-mode"
                  checked={options.portMode === 'internal'}
                  onChange={() => update('portMode', 'internal' as PortMode)}
                />
                Docker 네트워크 내부만
              </label>
              <label className={styles.check}>
                <input
                  type="radio"
                  name="port-mode"
                  checked={options.portMode === 'localhost'}
                  onChange={() => update('portMode', 'localhost' as PortMode)}
                />
                로컬 접속 (127.0.0.1)
              </label>
            </div>
            {options.portMode === 'localhost' ? (
              <div className={styles.field} style={{marginTop: '0.5rem'}}>
                <label htmlFor="compose-host-port">
                  호스트 포트 (컨테이너 {preset.containerPort})
                </label>
                <input
                  id="compose-host-port"
                  type="number"
                  min={1}
                  max={65535}
                  value={options.hostPort}
                  onChange={(event) => update('hostPort', event.target.value)}
                />
              </div>
            ) : (
              <p className={styles.hint}>
                ports를 넣지 않아 같은 Compose 네트워크의 다른 서비스만 접근합니다.
              </p>
            )}
          </div>

          <div className={styles.field}>
            <span className={styles.fieldLabel}>네트워크</span>
            <div className={styles.row}>
              <label className={styles.check}>
                <input
                  type="radio"
                  name="net-mode"
                  checked={options.networkMode === 'default'}
                  onChange={() =>
                    update('networkMode', 'default' as NetworkMode)
                  }
                />
                Compose 기본 네트워크
              </label>
              <label className={styles.check}>
                <input
                  type="radio"
                  name="net-mode"
                  checked={options.networkMode === 'external'}
                  onChange={() =>
                    update('networkMode', 'external' as NetworkMode)
                  }
                />
                기존 공유 네트워크
              </label>
            </div>
            {options.networkMode === 'external' ? (
              <div className={styles.field} style={{marginTop: '0.5rem'}}>
                <label htmlFor="compose-ext-net">공유 네트워크 이름</label>
                <input
                  id="compose-ext-net"
                  value={options.externalNetworkName}
                  onChange={(event) =>
                    update('externalNetworkName', event.target.value)
                  }
                  spellCheck={false}
                />
                <p className={styles.hint}>
                  `external: true`로 선언합니다. 미리 만들어 둔 네트워크 이름을
                  넣으세요.
                </p>
              </div>
            ) : null}
          </div>

          <div className={styles.field}>
            <span className={styles.fieldLabel}>영속화</span>
            <div className={styles.row}>
              <label className={styles.check}>
                <input
                  type="radio"
                  name="persist"
                  checked={options.persistMode === 'named'}
                  onChange={() => update('persistMode', 'named' as PersistMode)}
                />
                이름 있는 볼륨
              </label>
              <label className={styles.check}>
                <input
                  type="radio"
                  name="persist"
                  checked={options.persistMode === 'bind'}
                  onChange={() => update('persistMode', 'bind' as PersistMode)}
                />
                호스트 디렉터리
              </label>
              <label className={styles.check}>
                <input
                  type="radio"
                  name="persist"
                  checked={options.persistMode === 'none'}
                  onChange={() => update('persistMode', 'none' as PersistMode)}
                />
                없음
              </label>
            </div>
            {options.persistMode === 'named' ? (
              <div className={styles.field} style={{marginTop: '0.5rem'}}>
                <label htmlFor="compose-named-vol">볼륨 이름</label>
                <input
                  id="compose-named-vol"
                  value={options.namedVolumeName}
                  onChange={(event) =>
                    update('namedVolumeName', event.target.value)
                  }
                  spellCheck={false}
                />
              </div>
            ) : null}
            {options.persistMode === 'bind' ? (
              <div className={styles.field} style={{marginTop: '0.5rem'}}>
                <label htmlFor="compose-bind">호스트 경로</label>
                <input
                  id="compose-bind"
                  value={options.bindDataPath}
                  onChange={(event) =>
                    update('bindDataPath', event.target.value)
                  }
                  spellCheck={false}
                />
                <p className={styles.hint}>
                  컨테이너 경로: `{preset.dataContainerPath}`
                </p>
              </div>
            ) : null}
          </div>

          {preset.configMount ? (
            <label className={styles.check}>
              <input
                type="checkbox"
                checked={options.configMount}
                onChange={(event) =>
                  update('configMount', event.target.checked)
                }
              />
              설정 파일/디렉터리 읽기 전용 마운트 (
              {preset.configMount.host} → {preset.configMount.container}:ro)
            </label>
          ) : null}

          <div className={styles.row} style={{marginTop: '0.75rem'}}>
            <label className={styles.check}>
              <input
                type="checkbox"
                checked={options.restart}
                onChange={(event) => update('restart', event.target.checked)}
              />
              restart: unless-stopped
            </label>
            <label className={styles.check}>
              <input
                type="checkbox"
                checked={options.healthcheck}
                onChange={(event) =>
                  update('healthcheck', event.target.checked)
                }
              />
              헬스체크
            </label>
          </div>

          {dbExtras ? (
            <div className={styles.panel} style={{marginTop: '1rem'}}>
              <h3 className={styles.panelTitle}>
                {dbExtras === 'mysql' ? 'MySQL' : 'MariaDB'} 추가 옵션
              </h3>
              <div className={styles.field}>
                <label htmlFor="compose-server-id">server-id</label>
                <input
                  id="compose-server-id"
                  value={options.serverId}
                  onChange={(event) => update('serverId', event.target.value)}
                />
              </div>
              <label className={styles.check}>
                <input
                  type="checkbox"
                  checked={options.enableBinlog}
                  onChange={(event) =>
                    update('enableBinlog', event.target.checked)
                  }
                />
                바이너리 로그·relay 로그 옵션
              </label>
              <label className={styles.check}>
                <input
                  type="checkbox"
                  checked={options.readOnly}
                  onChange={(event) => update('readOnly', event.target.checked)}
                />
                read-only
              </label>
              {dbExtras === 'mysql' ? (
                <label className={styles.check}>
                  <input
                    type="checkbox"
                    checked={options.superReadOnly}
                    onChange={(event) =>
                      update('superReadOnly', event.target.checked)
                    }
                  />
                  super-read-only (MySQL)
                </label>
              ) : (
                <p className={styles.hint}>
                  MariaDB 예제에는 super-read-only를 넣지 않습니다.
                </p>
              )}
            </div>
          ) : null}
        </section>

        <section className={styles.panel} aria-label="미리보기">
          <h2 className={styles.panelTitle}>미리보기</h2>
          <div className={styles.field}>
            <div className={styles.cheatsheetMeta}>
              <span className={styles.cheatsheetTitle}>compose.yaml</span>
              <CopyButton text={composeYaml} label="compose.yaml 복사" />
            </div>
            <pre className={styles.resultBox}>{composeYaml}</pre>
          </div>
          {envExample ? (
            <div className={styles.field}>
              <div className={styles.cheatsheetMeta}>
                <span className={styles.cheatsheetTitle}>.env.example</span>
                <CopyButton text={envExample} label=".env.example 복사" />
              </div>
              <pre className={styles.resultBox}>{envExample}</pre>
            </div>
          ) : (
            <p className={styles.hint}>
              이 프리셋은 필수 비밀번호 환경변수가 없어 .env.example을 만들지
              않습니다.
            </p>
          )}
        </section>
      </div>

      <section className={styles.panel} aria-label="사용 예시">
        <h2 className={styles.panelTitle}>사용 예시</h2>
        <div className={styles.example}>
          <p>
            파일을 저장한 뒤{' '}
            <code>docker compose -f compose.yaml --env-file .env config</code>
            로 문법을 확인하고 기동합니다. 비밀번호는 Compose에서{' '}
            <code>$&#123;VAR&#125;</code>로 참조하고, .env.example의 예시값을
            실제 비밀로 바꾼 .env를 사용하세요.
          </p>
        </div>
      </section>
    </div>
  );
}
