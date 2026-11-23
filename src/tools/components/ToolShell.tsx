import type {ReactNode} from 'react';

import styles from '../styles.module.css';

type Props = {
  title: string;
  summary: string;
  controls: ReactNode;
  actions: ReactNode;
  result: ReactNode;
  example?: ReactNode;
};

export default function ToolShell({
  title,
  summary,
  controls,
  actions,
  result,
  example,
}: Props): ReactNode {
  return (
    <div>
      <header className={styles.toolHeader}>
        <h1 className={styles.toolTitle}>{title}</h1>
        <p className={styles.toolSummary}>{summary}</p>
      </header>

      <section className={styles.panel} aria-label="입력과 옵션">
        <h2 className={styles.panelTitle}>입력과 옵션</h2>
        {controls}
        <div className={styles.actions}>{actions}</div>
      </section>

      <section className={styles.panel} aria-label="결과">
        <h2 className={styles.panelTitle}>결과</h2>
        {result}
      </section>

      {example ? (
        <section className={styles.panel} aria-label="사용 예시">
          <h2 className={styles.panelTitle}>사용 예시</h2>
          <div className={styles.example}>{example}</div>
        </section>
      ) : null}
    </div>
  );
}
