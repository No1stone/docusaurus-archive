import {useState, type ReactNode} from 'react';
import {CronExpressionParser} from 'cron-parser';

import ToolShell from '../components/ToolShell';
import styles from '../styles.module.css';

const EXAMPLE = '0 9 * * 1-5';

export default function CronParser(): ReactNode {
  const [expression, setExpression] = useState(EXAMPLE);
  const [count, setCount] = useState(5);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  return (
    <ToolShell
      title="Cron 표현식"
      summary="cron 표현식이 유효한지 확인하고 다음 실행 시각을 계산합니다."
      controls={
        <>
          <div className={styles.field}>
            <label htmlFor="cron-expression">cron 표현식</label>
            <input
              id="cron-expression"
              type="text"
              value={expression}
              onChange={(event) => setExpression(event.target.value)}
              spellCheck={false}
            />
            <p className={styles.hint}>
              분·시·일·월·요일(5필드) 또는 초를 포함한 6필드 형식을 지원합니다.
            </p>
          </div>
          <div className={styles.field}>
            <label htmlFor="cron-count">다음 실행 횟수</label>
            <input
              id="cron-count"
              type="number"
              min={1}
              max={100}
              value={count}
              onChange={(event) => setCount(Number(event.target.value))}
            />
          </div>
        </>
      }
      actions={
        <>
          <button
            type="button"
            className={styles.primaryButton}
            onClick={() => {
              try {
                const limit = Math.max(1, Math.min(100, count));
                const cron = CronExpressionParser.parse(expression.trim());
                const lines: string[] = [];
                for (let i = 0; i < limit; i += 1) {
                  const next = cron.next();
                  lines.push(next.toString());
                }
                setResult(lines.join('\n'));
                setError('');
              } catch (err) {
                setResult('');
                setError(
                  err instanceof Error ? err.message : 'cron 표현식을 해석하지 못했습니다.',
                );
              }
            }}>
            실행 시각 계산
          </button>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={() => {
              setExpression(EXAMPLE);
              setCount(5);
              setResult('');
              setError('');
            }}>
            초기화
          </button>
        </>
      }
      result={
        <>
          <div className={styles.resultBox}>{result || '다음 실행 시각이 여기에 표시됩니다.'}</div>
          {error ? <p className={styles.error}>{error}</p> : null}
        </>
      }
      example={
        <p>
          <code>{EXAMPLE}</code>는 평일 오전 9시(분 0)에 실행되는 전형적인 스케줄입니다.
          서버 타임존에 따라 표시 시각이 달라질 수 있습니다.
        </p>
      }
    />
  );
}