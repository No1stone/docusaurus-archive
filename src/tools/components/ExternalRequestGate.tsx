import {useState, type ReactNode} from 'react';

import styles from '../styles.module.css';

type Props = {
  destinationLabel: string;
  destinationUrl: string;
  payloadSummary: string;
  onConfirm: () => void;
  confirmLabel?: string;
  children?: ReactNode;
};

export default function ExternalRequestGate({
  destinationLabel,
  destinationUrl,
  payloadSummary,
  onConfirm,
  confirmLabel = '요청 보내기',
  children,
}: Props): ReactNode {
  const [agreed, setAgreed] = useState(false);

  return (
    <div className={styles.warningBox}>
      <strong>외부 서비스로 데이터가 전송됩니다</strong>
      <p className={styles.hint} style={{marginTop: 0}}>
        대상: {destinationLabel}
      </p>
      <p className={styles.hint}>
        URL: <code>{destinationUrl}</code>
      </p>
      <p className={styles.hint}>전송 요약: {payloadSummary}</p>
      {children}
      <div className={styles.row} style={{marginBottom: 0, marginTop: '0.65rem'}}>
        <label className={styles.check}>
          <input
            type="checkbox"
            checked={agreed}
            onChange={(event) => setAgreed(event.target.checked)}
          />
          전송에 동의
        </label>
        <button
          type="button"
          className={styles.primaryButton}
          disabled={!agreed}
          onClick={onConfirm}>
          {confirmLabel}
        </button>
      </div>
    </div>
  );
}