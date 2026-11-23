import {useMemo, useState, type ReactNode} from 'react';

import CopyButton from './CopyButton';
import ToolShell from './ToolShell';
import styles from '../styles.module.css';

export type CheatsheetEntry = {
  id: string;
  category: string;
  title: string;
  command: string;
  note?: string;
};

type Props = {
  title: string;
  summary: string;
  entries: CheatsheetEntry[];
  example?: ReactNode;
};

function normalizeSearch(value: string): string {
  return value.trim().toLowerCase();
}

export default function CheatsheetTool({
  title,
  summary,
  entries,
  example,
}: Props): ReactNode {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = normalizeSearch(query);
    if (!q) {
      return entries;
    }
    return entries.filter((entry) => {
      const haystack = [
        entry.category,
        entry.title,
        entry.command,
        entry.note ?? '',
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [entries, query]);

  return (
    <ToolShell
      title={title}
      summary={summary}
      controls={
        <div className={styles.field}>
          <label htmlFor="cheatsheet-search">검색</label>
          <input
            id="cheatsheet-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="명령어, 카테고리, 설명"
            className={styles.homeSearch}
            style={{maxWidth: '100%', margin: 0}}
          />
          <p className={styles.hint}>
            {filtered.length} / {entries.length}개 항목
          </p>
        </div>
      }
      actions={
        <button
          type="button"
          className={styles.secondaryButton}
          onClick={() => setQuery('')}>
          검색 초기화
        </button>
      }
      result={
        <ul className={styles.entryList}>
          {filtered.length === 0 ? (
            <li className={styles.hint}>검색 결과가 없습니다.</li>
          ) : (
            filtered.map((entry) => (
              <li key={entry.id} className={styles.entryCard}>
                <div className={styles.entryMeta}>
                  <span className={styles.badge}>{entry.category}</span>
                </div>
                <h3 className={styles.entryTitle}>{entry.title}</h3>
                <div className={styles.commandLine}>
                  <code>{entry.command}</code>
                  <CopyButton text={entry.command} label="복사" />
                </div>
                {entry.note ? <p className={styles.hint}>{entry.note}</p> : null}
              </li>
            ))
          )}
        </ul>
      }
      example={example}
    />
  );
}