import {useState, type ReactNode} from 'react';

import {copyText} from '../utils';
import styles from '../styles.module.css';

type Props = {
  text: string;
  label?: string;
};

export default function CopyButton({text, label = '결과 복사'}: Props): ReactNode {
  const [status, setStatus] = useState<'idle' | 'ok' | 'fail'>('idle');

  return (
    <span className={styles.actions}>
      <button
        type="button"
        className={styles.secondaryButton}
        disabled={!text}
        onClick={async () => {
          const ok = await copyText(text);
          setStatus(ok ? 'ok' : 'fail');
          window.setTimeout(() => setStatus('idle'), 1500);
        }}>
        {label}
      </button>
      {status === 'ok' ? <span className={styles.statusOk}>복사했습니다.</span> : null}
      {status === 'fail' ? <span className={styles.error}>복사에 실패했습니다.</span> : null}
    </span>
  );
}
