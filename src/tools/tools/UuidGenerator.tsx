import {useState, type ReactNode} from 'react';

import CopyButton from '../components/CopyButton';
import ToolShell from '../components/ToolShell';
import styles from '../styles.module.css';

function formatUuid(value: string, uppercase: boolean, withHyphen: boolean): string {
  let next = withHyphen ? value : value.replace(/-/g, '');
  next = uppercase ? next.toUpperCase() : next.toLowerCase();
  return next;
}

export default function UuidGenerator(): ReactNode {
  const [count, setCount] = useState(10);
  const [uppercase, setUppercase] = useState(false);
  const [withHyphen, setWithHyphen] = useState(true);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  return (
    <ToolShell
      title="UUID 생성기"
      summary="UUID v4를 개수와 출력 형식에 맞춰 생성합니다."
      controls={
        <>
          <div className={styles.field}>
            <label htmlFor="uuid-count">생성 개수</label>
            <input
              id="uuid-count"
              type="number"
              min={1}
              max={1000}
              value={count}
              onChange={(event) => setCount(Number(event.target.value))}
            />
            <p className={styles.hint}>1~1000개의 UUID v4를 생성합니다.</p>
          </div>
          <div className={styles.row}>
            <label className={styles.check}>
              <input
                type="checkbox"
                checked={uppercase}
                onChange={(event) => setUppercase(event.target.checked)}
              />
              대문자
            </label>
            <label className={styles.check}>
              <input
                type="checkbox"
                checked={withHyphen}
                onChange={(event) => setWithHyphen(event.target.checked)}
              />
              하이픈 포함 (표준 형식)
            </label>
          </div>
        </>
      }
      actions={
        <button
          type="button"
          className={styles.primaryButton}
          onClick={() => {
            if (!Number.isFinite(count) || count < 1 || count > 1000) {
              setError('생성 개수는 1에서 1000 사이로 입력합니다.');
              return;
            }
            if (typeof crypto.randomUUID !== 'function') {
              setError('이 브라우저는 crypto.randomUUID를 지원하지 않습니다.');
              return;
            }
            setError('');
            const values = Array.from({length: count}, () =>
              formatUuid(crypto.randomUUID(), uppercase, withHyphen),
            );
            setResult(values.join('\n'));
          }}>
          UUID 생성
        </button>
      }
      result={
        <>
          <div className={styles.resultBox} aria-live="polite">
            {result || '생성 결과가 여기에 표시됩니다.'}
          </div>
          {error ? <p className={styles.error}>{error}</p> : null}
          <div style={{marginTop: '0.75rem'}}>
            <CopyButton text={result} />
          </div>
        </>
      }
      example={
        <p>
          데이터베이스 기본 키나 API 요청 ID가 필요할 때 개수를 정한 뒤 생성합니다.
          하이픈 없는 형식은 파일명이나 경로에 쓰기 쉽습니다.
        </p>
      }
    />
  );
}
