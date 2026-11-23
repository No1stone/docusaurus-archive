import type {ReactNode} from 'react';

import styles from './styles.module.css';

type Props = {
  title: string;
  guide: string;
  mock?: boolean;
  /** Named UI pieces visible in this demo (for AI prompts). */
  elements?: string[];
  controls?: ReactNode;
  children: ReactNode;
  onReset?: () => void;
  tall?: boolean;
};

export default function DemoShell({
  title,
  guide,
  mock = false,
  elements,
  controls,
  children,
  onReset,
  tall = false,
}: Props): ReactNode {
  return (
    <div className={styles.shell}>
      <section className={styles.panel} aria-label="데모">
        <div className={styles.panelHead}>
          <span>
            {title}
            {mock ? <span className={styles.mockBadge}>모의 동작</span> : null}
          </span>
          {onReset ? (
            <button type="button" className={styles.btnGhost} onClick={onReset}>
              초기화
            </button>
          ) : null}
        </div>
        <div className={styles.panelBody}>
          {elements?.length ? (
            <p className={styles.elements} aria-label="이 화면의 UI 요소">
              <strong>이 화면의 요소:</strong> {elements.join(' · ')}
            </p>
          ) : null}
          <div className={`${styles.demoStage} ${tall ? styles.demoStageTall : ''}`}>
            {children}
          </div>
        </div>
      </section>

      {controls ? (
        <section className={styles.panel} aria-label="옵션">
          <div className={styles.panelHead}>상태 · 옵션</div>
          <div className={styles.panelBody}>
            <div className={styles.controls}>{controls}</div>
          </div>
        </section>
      ) : null}

      <section className={styles.panel} aria-label="안내">
        <div className={styles.panelHead}>사용 안내</div>
        <div className={styles.panelBody}>
          <p className={styles.guide}>{guide}</p>
        </div>
      </section>
    </div>
  );
}
