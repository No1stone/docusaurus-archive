import {Fragment, useEffect, useId, useMemo, useRef, useState, type ReactNode} from 'react';

import {demoShellProps} from '../catalog';
import DemoShell from '../DemoShell';
import {CITIES, PEOPLE, wait} from '../sampleData';
import styles from '../styles.module.css';


export function ListSearchDemo(): ReactNode {
  const [q, setQ] = useState('');
  const results = PEOPLE.filter((p) => p.name.includes(q) || p.role.includes(q));
  return (
    <DemoShell {...demoShellProps('list-search')} onReset={() => setQ('')}>
      <div style={{padding: '0.75rem'}} className={styles.stack}>
        <input className={styles.input} value={q} onChange={(e) => setQ(e.target.value)} placeholder="검색" aria-label="목록 검색" />
        {results.length === 0 ? <span className={styles.hint}>결과 없음</span> : null}
        {results.map((p) => (
          <div key={p.id} className={styles.card}>{p.name} · {p.role}</div>
        ))}
      </div>
    </DemoShell>
  );
}

export function FilterChipsDemo(): ReactNode {
  const [tags, setTags] = useState<string[]>([]);
  const filtered = tags.length ? PEOPLE.filter((p) => tags.every((t) => p.tags.includes(t))) : PEOPLE;
  const allTags = Array.from(new Set(PEOPLE.flatMap((p) => p.tags)));
  return (
    <DemoShell {...demoShellProps('filter-chips')} onReset={() => setTags([])}>
      <div style={{padding: '0.75rem'}} className={styles.stack}>
        <div className={styles.row}>
          {allTags.map((t) => (
            <button key={t} type="button" className={tags.includes(t) ? styles.btnPrimary : styles.btn} onClick={() => setTags((x) => (x.includes(t) ? x.filter((i) => i !== t) : [...x, t]))}>
              {t}
            </button>
          ))}
          <button type="button" className={styles.btnGhost} onClick={() => setTags([])}>초기화</button>
        </div>
        {filtered.map((p) => (
          <div key={p.id} className={styles.card}>{p.name} · {p.tags.join(', ')}</div>
        ))}
      </div>
    </DemoShell>
  );
}

export function SortDemo(): ReactNode {
  const [asc, setAsc] = useState(true);
  const sorted = useMemo(() => [...PEOPLE].sort((a, b) => (asc ? a.name.localeCompare(b.name, 'ko') : b.name.localeCompare(a.name, 'ko'))), [asc]);
  return (
    <DemoShell {...demoShellProps('sort')} onReset={() => setAsc(true)}>
      <div style={{padding: '0.75rem'}} className={styles.stack}>
        <button type="button" className={styles.btn} onClick={() => setAsc((v) => !v)}>{asc ? '이름 ↑' : '이름 ↓'}</button>
        {sorted.slice(0, 5).map((p) => (
          <div key={p.id} className={styles.card}>{p.name}</div>
        ))}
      </div>
    </DemoShell>
  );
}

export function InfiniteScrollDemo(): ReactNode {
  const [count, setCount] = useState(4);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 24) {
        setCount((c) => Math.min(PEOPLE.length, c + 2));
      }
    };
    el.addEventListener('scroll', onScroll);
    return () => el.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <DemoShell {...demoShellProps('infinite-scroll')} onReset={() => setCount(4)}>
      <div ref={ref} style={{maxHeight: 220, overflow: 'auto', padding: '0.75rem'}} className={styles.stack}>
        {PEOPLE.slice(0, count).map((p) => (
          <div key={p.id} className={styles.card}>{p.name}</div>
        ))}
        <span className={styles.hint}>{count}/{PEOPLE.length}</span>
      </div>
    </DemoShell>
  );
}

export function BulkSelectDemo(): ReactNode {
  const [selected, setSelected] = useState<string[]>([]);
  const [msg, setMsg] = useState('');
  return (
    <DemoShell {...demoShellProps('bulk-actions')} onReset={() => { setSelected([]); setMsg(''); }}>
      <div style={{padding: '0.75rem'}} className={styles.stack}>
        {PEOPLE.slice(0, 5).map((p) => (
          <label key={p.id} className={styles.row}>
            <input
              type="checkbox"
              checked={selected.includes(p.id)}
              onChange={(e) => setSelected((s) => (e.target.checked ? [...s, p.id] : s.filter((id) => id !== p.id)))}
            />
            {p.name}
          </label>
        ))}
        <button
          type="button"
          className={styles.btnPrimary}
          disabled={!selected.length}
          onClick={() => setMsg(`${selected.length}건 보관 처리 (모의)`)}>
          선택 보관
        </button>
        {msg ? <span className={styles.ok}>{msg}</span> : null}
      </div>
    </DemoShell>
  );
}

export function StickyTableDemo(): ReactNode {
  return (
    <DemoShell {...demoShellProps('sticky-table')} tall>
      <div style={{overflow: 'auto', maxHeight: 240}}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th style={{position: 'sticky', left: 0, top: 0, zIndex: 2, background: 'var(--ifm-background-color)'}}>이름</th>
              {Array.from({length: 8}, (_, i) => (
                <th key={i} style={{position: 'sticky', top: 0, background: 'var(--ifm-background-color)'}}>열 {i + 1}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PEOPLE.map((p) => (
              <tr key={p.id}>
                <td style={{position: 'sticky', left: 0, background: 'var(--ifm-background-color)'}}>{p.name}</td>
                {Array.from({length: 8}, (_, i) => (
                  <td key={i}>{p.role[i % p.role.length]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DemoShell>
  );
}

export function ColumnToggleDemo(): ReactNode {
  const cols = ['name', 'role', 'status'] as const;
  const [visible, setVisible] = useState<string[]>([...cols]);
  const [order, setOrder] = useState<string[]>([...cols]);
  return (
    <DemoShell {...demoShellProps('column-config')} onReset={() => { setVisible([...cols]); setOrder([...cols]); }}>
      <div style={{padding: '0.75rem'}} className={styles.stack}>
        <div className={styles.row}>
          {cols.map((c) => (
            <label key={c}>
              <input type="checkbox" checked={visible.includes(c)} onChange={(e) => setVisible((v) => (e.target.checked ? [...v, c] : v.filter((x) => x !== c)))} /> {c}
            </label>
          ))}
          <button type="button" className={styles.btn} onClick={() => setOrder((o) => [...o].reverse())}>순서 뒤집기</button>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>{order.filter((c) => visible.includes(c)).map((c) => <th key={c}>{c}</th>)}</tr>
          </thead>
          <tbody>
            {PEOPLE.slice(0, 3).map((p) => (
              <tr key={p.id}>
                {order.filter((c) => visible.includes(c)).map((c) => (
                  <td key={c}>{c === "name" ? p.name : c === "role" ? p.role : p.status}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DemoShell>
  );
}

export function RowExpandDemo(): ReactNode {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <DemoShell {...demoShellProps('row-expand')} onReset={() => setOpen(null)}>
      <table className={styles.table}>
        <tbody>
          {PEOPLE.slice(0, 4).map((p) => (
            <Fragment key={p.id}>
              <tr>
                <td>
                  <button type="button" className={styles.btnGhost} onClick={() => setOpen(open === p.id ? null : p.id)}>
                    {open === p.id ? '▾' : '▸'} {p.name}
                  </button>
                </td>
                <td>{p.role}</td>
              </tr>
              {open === p.id ? (
                <tr>
                  <td colSpan={2} className={styles.hint}>태그: {p.tags.join(', ')}</td>
                </tr>
              ) : null}
            </Fragment>
          ))}
        </tbody>
      </table>
    </DemoShell>
  );
}

export function InlineEditDemo(): ReactNode {
  const [rows, setRows] = useState(PEOPLE.slice(0, 3).map((p) => ({...p})));
  return (
    <DemoShell {...demoShellProps('inline-edit')} onReset={() => setRows(PEOPLE.slice(0, 3).map((p) => ({...p})))}>
      <table className={styles.table}>
        <thead><tr><th>이름</th><th>역할</th></tr></thead>
        <tbody>
          {rows.map((p, i) => (
            <tr key={p.id}>
              <td>
                <input
                  className={styles.input}
                  value={p.name}
                  onChange={(e) => setRows((r) => r.map((x, idx) => (idx === i ? {...x, name: e.target.value} : x)))}
                />
              </td>
              <td>{p.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </DemoShell>
  );
}

export function NarrowTableDemo(): ReactNode {
  const [card, setCard] = useState(true);
  return (
    <DemoShell {...demoShellProps('narrow-table')} controls={
        <label>
          <input type="checkbox" checked={card} onChange={(e) => setCard(e.target.checked)} /> 카드형
        </label>
      }
      onReset={() => setCard(true)}>
      <div style={{padding: '0.75rem', maxWidth: card ? 280 : '100%'}}>
        {card ? (
          <div className={styles.stack}>
            {PEOPLE.slice(0, 3).map((p) => (
              <div key={p.id} className={styles.card}>
                <strong>{p.name}</strong>
                <div className={styles.hint}>{p.role}</div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{overflowX: 'auto'}}>
            <table className={styles.table}>
              <thead><tr><th>이름</th><th>역할</th><th>상태</th></tr></thead>
              <tbody>
                {PEOPLE.slice(0, 3).map((p) => (
                  <tr key={p.id}><td>{p.name}</td><td>{p.role}</td><td>{p.status}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DemoShell>
  );
}
