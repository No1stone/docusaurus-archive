import {useMemo, useState, type ReactNode} from 'react';

import CopyButton from '../components/CopyButton';
import {
  TIME_CONVERTER_EXAMPLE,
  convertTimeInput,
  hasExplicitTimezone,
  type NaiveTimezone,
  type TimeInputFormat,
  type TimeOutputs,
} from '../utils/timeConverter';
import styles from '../styles.module.css';

const FORMAT_OPTIONS: Array<{value: TimeInputFormat; label: string}> = [
  {value: 'iso8601', label: 'ISO 8601'},
  {value: 'epoch-s', label: 'Epoch 초'},
  {value: 'epoch-ms', label: 'Epoch 밀리초'},
];

const OUTPUT_ROWS: Array<{key: keyof TimeOutputs; label: string}> = [
  {key: 'isoUtc', label: 'ISO 8601 UTC'},
  {key: 'isoKst', label: 'ISO 8601 KST'},
  {key: 'epochSeconds', label: 'Epoch 초'},
  {key: 'epochMillis', label: 'Epoch 밀리초'},
];

export default function TimeConverter(): ReactNode {
  const [format, setFormat] = useState<TimeInputFormat>('epoch-ms');
  const [input, setInput] = useState('1767225600000');
  const [naiveTimezone, setNaiveTimezone] = useState<NaiveTimezone>('utc');

  const needsNaiveChoice =
    format === 'iso8601' && input.trim() !== '' && !hasExplicitTimezone(input);

  const converted = useMemo(() => {
    try {
      if (!input.trim()) {
        return {ok: true as const, outputs: null, error: ''};
      }
      const outputs = convertTimeInput(input, format, naiveTimezone);
      return {ok: true as const, outputs, error: ''};
    } catch (err) {
      return {
        ok: false as const,
        outputs: null,
        error: err instanceof Error ? err.message : '변환에 실패했습니다.',
      };
    }
  }, [input, format, naiveTimezone]);

  const loadExample = () => {
    setFormat(TIME_CONVERTER_EXAMPLE.format);
    setInput(TIME_CONVERTER_EXAMPLE.input);
    setNaiveTimezone(TIME_CONVERTER_EXAMPLE.naiveTimezone);
  };

  const reset = () => {
    setFormat('epoch-ms');
    setInput('');
    setNaiveTimezone('utc');
  };

  const useNow = () => {
    setFormat('epoch-ms');
    setInput(String(Date.now()));
  };

  return (
    <div>
      <header className={styles.toolHeader}>
        <h1 className={styles.toolTitle}>시간 변환기</h1>
        <p className={styles.toolSummary}>
          Epoch 초·밀리초와 ISO 8601(UTC/KST)을 양방향으로 변환합니다. 같은 순간의
          네 가지 표기를 함께 보여 줍니다.
        </p>
      </header>

      <section className={styles.panel} aria-label="입력">
        <h2 className={styles.panelTitle}>입력</h2>
        <div className={styles.field}>
          <span className={styles.fieldLabel}>입력 형식</span>
          <div className={styles.row}>
            {FORMAT_OPTIONS.map((opt) => (
              <label key={opt.value} className={styles.check}>
                <input
                  type="radio"
                  name="time-format"
                  checked={format === opt.value}
                  onChange={() => setFormat(opt.value)}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="time-input">값</label>
          <input
            id="time-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              format === 'iso8601'
                ? '2026-01-01T00:00:00.000Z'
                : format === 'epoch-s'
                  ? '1767225600'
                  : '1767225600000'
            }
            spellCheck={false}
          />
        </div>

        {format === 'iso8601' ? (
          <div className={styles.field}>
            <span className={styles.fieldLabel}>
              시간대 없는 입력 해석
              {needsNaiveChoice ? ' (선택 필요)' : ''}
            </span>
            <div className={styles.row}>
              <label className={styles.check}>
                <input
                  type="radio"
                  name="naive-tz"
                  checked={naiveTimezone === 'utc'}
                  onChange={() => setNaiveTimezone('utc')}
                />
                UTC로 해석
              </label>
              <label className={styles.check}>
                <input
                  type="radio"
                  name="naive-tz"
                  checked={naiveTimezone === 'kst'}
                  onChange={() => setNaiveTimezone('kst')}
                />
                KST(+09:00)로 해석
              </label>
            </div>
            <p className={styles.hint}>
              입력에 <code>Z</code>나 <code>+09:00</code>이 있으면 그 시간대를
              쓰고, 위 선택은 무시합니다.
            </p>
          </div>
        ) : null}

        <div className={styles.actions}>
          <button type="button" className={styles.secondaryButton} onClick={loadExample}>
            예제 불러오기
          </button>
          <button type="button" className={styles.secondaryButton} onClick={useNow}>
            지금
          </button>
          <button type="button" className={styles.secondaryButton} onClick={reset}>
            초기화
          </button>
        </div>
        {converted.error ? <p className={styles.error}>{converted.error}</p> : null}
      </section>

      <section className={styles.panel} aria-label="결과">
        <h2 className={styles.panelTitle}>결과</h2>
        {converted.outputs ? (
          <div className={styles.timeResultList}>
            {OUTPUT_ROWS.map((row) => (
              <div key={row.key} className={styles.timeResultRow}>
                <div>
                  <span className={styles.fieldLabel}>{row.label}</span>
                  <pre className={styles.resultBox}>{converted.outputs![row.key]}</pre>
                </div>
                <CopyButton text={converted.outputs![row.key]} label="복사" />
              </div>
            ))}
          </div>
        ) : (
          <p className={styles.hint}>
            {converted.error
              ? '입력을 수정해 주세요.'
              : '값을 입력하면 네 가지 형식이 표시됩니다.'}
          </p>
        )}
      </section>

      <section className={styles.panel} aria-label="사용 예시">
        <h2 className={styles.panelTitle}>사용 예시</h2>
        <div className={styles.example}>
          <p>
            <code>2026-01-01T00:00:00.000Z</code>와{' '}
            <code>2026-01-01T09:00:00.000+09:00</code>은 같은 순간으로, Epoch{' '}
            <code>1767225600</code> / <code>1767225600000</code>과 같습니다.
            밀리초가 있으면 Epoch 초에 소수부(예: <code>1767225600.123</code>)를
            남깁니다.
          </p>
        </div>
      </section>
    </div>
  );
}
