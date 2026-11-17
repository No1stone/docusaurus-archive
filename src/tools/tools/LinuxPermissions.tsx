import {useMemo, useState, type ReactNode} from 'react';

import CopyButton from '../components/CopyButton';
import {
  LINUX_PERMISSIONS_DEFAULT,
  LINUX_PERMISSIONS_EXAMPLE,
  bitsToDigit,
  buildChmodCommand,
  isValidOctal,
  parseOctal,
  triadToOctal,
  triadToSymbolic,
  type PermissionBits,
  type PermissionTriad,
  type LinuxPermissionsState,
} from '../utils/linuxPermissions';
import styles from '../styles.module.css';

type RoleKey = keyof PermissionTriad;

const ROLES: Array<{key: RoleKey; label: string}> = [
  {key: 'owner', label: '소유자 (user)'},
  {key: 'group', label: '그룹 (group)'},
  {key: 'other', label: '기타 (other)'},
];

const FLAGS: Array<{key: keyof PermissionBits; label: string; short: string}> = [
  {key: 'read', label: '읽기', short: 'r'},
  {key: 'write', label: '쓰기', short: 'w'},
  {key: 'execute', label: '실행', short: 'x'},
];

export default function LinuxPermissions(): ReactNode {
  const [state, setState] = useState<LinuxPermissionsState>(
    LINUX_PERMISSIONS_DEFAULT,
  );

  const octalValid = isValidOctal(state.octalInput);
  const symbolic = useMemo(
    () => (octalValid ? triadToSymbolic(state.triad) : '---------'),
    [octalValid, state.triad],
  );
  const command = useMemo(
    () => buildChmodCommand(state.octalInput, state.path),
    [state.octalInput, state.path],
  );

  const setTriad = (triad: PermissionTriad) => {
    setState((prev) => ({
      ...prev,
      triad,
      octalInput: triadToOctal(triad),
    }));
  };

  const toggleBit = (role: RoleKey, flag: keyof PermissionBits) => {
    setTriad({
      ...state.triad,
      [role]: {
        ...state.triad[role],
        [flag]: !state.triad[role][flag],
      },
    });
  };

  const onOctalChange = (value: string) => {
    const cleaned = value.replace(/[^\d]/g, '').slice(0, 3);
    const parsed = parseOctal(cleaned);
    setState((prev) => ({
      ...prev,
      octalInput: cleaned,
      triad: parsed ?? prev.triad,
    }));
  };

  return (
    <div>
      <header className={styles.toolHeader}>
        <h1 className={styles.toolTitle}>Linux 권한 계산기</h1>
        <p className={styles.toolSummary}>
          소유자·그룹·기타의 rwx 체크와 8진수 모드를 서로 맞춰 보고, 경로에 맞는{' '}
          <code>chmod</code> 명령을 복사합니다.
        </p>
      </header>

      <section className={styles.panel} aria-label="권한">
        <h2 className={styles.panelTitle}>권한</h2>
        <div className={styles.permGrid}>
          {ROLES.map((role) => (
            <div key={role.key} className={styles.permRole}>
              <span className={styles.fieldLabel}>
                {role.label}{' '}
                <code>{bitsToDigit(state.triad[role.key])}</code>
              </span>
              <div className={styles.row}>
                {FLAGS.map((flag) => (
                  <label key={flag.key} className={styles.check}>
                    <input
                      type="checkbox"
                      checked={state.triad[role.key][flag.key]}
                      onChange={() => toggleBit(role.key, flag.key)}
                    />
                    {flag.label} ({flag.short})
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="octal-mode">8진수 권한</label>
            <input
              id="octal-mode"
              inputMode="numeric"
              maxLength={3}
              value={state.octalInput}
              onChange={(e) => onOctalChange(e.target.value)}
              spellCheck={false}
              aria-invalid={!octalValid}
            />
            {!octalValid ? (
              <p className={styles.error}>000–777 세 자리 8진수를 입력하세요.</p>
            ) : null}
          </div>
          <div className={styles.field}>
            <span className={styles.fieldLabel}>기호 표기</span>
            <pre className={styles.resultBox}>{symbolic}</pre>
          </div>
        </div>
      </section>

      <section className={styles.panel} aria-label="경로와 chmod">
        <h2 className={styles.panelTitle}>경로와 chmod</h2>
        <div className={styles.field}>
          <label htmlFor="chmod-path">파일명 또는 경로</label>
          <input
            id="chmod-path"
            value={state.path}
            onChange={(e) =>
              setState((prev) => ({...prev, path: e.target.value}))
            }
            placeholder="./config/app settings.yml"
            spellCheck={false}
          />
        </div>
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={() => setState(LINUX_PERMISSIONS_EXAMPLE)}>
            예제 불러오기
          </button>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={() => setState(LINUX_PERMISSIONS_DEFAULT)}>
            초기화
          </button>
          <CopyButton text={command ?? ''} label="명령 복사" />
        </div>
        <pre className={styles.resultBox}>
          {command ??
            (octalValid
              ? '경로를 입력하면 chmod 명령이 표시됩니다.'
              : '유효한 권한과 경로가 필요합니다.')}
        </pre>
      </section>

      <section className={styles.panel} aria-label="사용 예시">
        <h2 className={styles.panelTitle}>사용 예시</h2>
        <div className={styles.example}>
          <p>
            <code>640</code>과 <code>./config/app settings.yml</code>이면{' '}
            <code>chmod 640 -- &apos;./config/app settings.yml&apos;</code>이
            됩니다. 경로의 공백·따옴표는 작은따옴표로 감쌉니다.
          </p>
        </div>
      </section>
    </div>
  );
}
