import {useEffect, useId, useMemo, useRef, useState, type ReactNode} from 'react';

import {demoShellProps} from '../catalog';
import DemoShell from '../DemoShell';
import {CITIES, PEOPLE, wait} from '../sampleData';
import styles from '../styles.module.css';


export function ButtonDemo(): ReactNode {
  const [last, setLast] = useState('없음');
  return (
    <DemoShell {...demoShellProps('button')} onReset={() => setLast('없음')}>
      <div className={styles.row} style={{padding: '0.75rem'}}>
        <button type="button" className={styles.btn} onClick={() => setLast('기본')}>기본</button>
        <button type="button" className={styles.btnPrimary} onClick={() => setLast('강조')}>강조</button>
        <button type="button" className={styles.btnGhost} onClick={() => setLast('고스트')}>고스트</button>
        <button type="button" className={styles.btn} disabled>비활성</button>
      </div>
      <div style={{padding: '0 0.75rem 0.75rem'}} className={styles.hint}>마지막 클릭: {last}</div>
    </DemoShell>
  );
}

export function IconButtonDemo(): ReactNode {
  const [count, setCount] = useState(0);
  return (
    <DemoShell {...demoShellProps('icon-button')} onReset={() => setCount(0)}>
      <div className={styles.row} style={{padding: '0.75rem'}}>
        <button type="button" className={styles.btn} aria-label="좋아요" onClick={() => setCount((c) => c + 1)}>♡</button>
        <button type="button" className={styles.btn} aria-label="공유">↗</button>
        <button type="button" className={styles.btn} aria-label="더 보기">⋯</button>
        <span className={styles.hint}>좋아요 {count}</span>
      </div>
    </DemoShell>
  );
}

export function FabDemo(): ReactNode {
  const [open, setOpen] = useState(false);
  return (
    <DemoShell {...demoShellProps('fab')} onReset={() => setOpen(false)}>
      <div style={{position: 'relative', minHeight: 220, padding: '0.75rem'}}>
        <p className={styles.hint}>본문 위 FAB</p>
        {open ? (
          <div className={styles.stack} style={{position: 'absolute', right: 16, bottom: 72}}>
            <button type="button" className={styles.btn} onClick={() => setOpen(false)}>작성</button>
            <button type="button" className={styles.btn} onClick={() => setOpen(false)}>업로드</button>
          </div>
        ) : null}
        <button
          type="button"
          className={styles.btnPrimary}
          aria-label="빠른 동작"
          style={{position: 'absolute', right: 16, bottom: 16, borderRadius: 999, width: 48, height: 48}}
          onClick={() => setOpen((v) => !v)}>
          +
        </button>
      </div>
    </DemoShell>
  );
}

export function ButtonGroupDemo(): ReactNode {
  const [align, setAlign] = useState<'left' | 'center' | 'right'>('left');
  return (
    <DemoShell {...demoShellProps('button-group')} onReset={() => setAlign('left')}>
      <div className={styles.row} style={{padding: '0.75rem'}} role="group" aria-label="정렬">
        {(['left', 'center', 'right'] as const).map((v) => (
          <button key={v} type="button" className={align === v ? styles.btnPrimary : styles.btn} onClick={() => setAlign(v)}>
            {v}
          </button>
        ))}
      </div>
      <div style={{padding: '0 0.75rem 0.75rem', textAlign: align}}>정렬된 텍스트</div>
    </DemoShell>
  );
}

export function SegmentedDemo(): ReactNode {
  const [view, setView] = useState<'list' | 'grid'>('list');
  return (
    <DemoShell {...demoShellProps('segmented')} onReset={() => setView('list')}>
      <div className={styles.row} style={{padding: '0.75rem'}} role="group">
        <button type="button" className={view === 'list' ? styles.btnPrimary : styles.btn} onClick={() => setView('list')}>목록</button>
        <button type="button" className={view === 'grid' ? styles.btnPrimary : styles.btn} onClick={() => setView('grid')}>격자</button>
      </div>
      <div style={{padding: '0 0.75rem 0.75rem'}} className={view === 'grid' ? styles.gridResponsive : styles.stack}>
        {PEOPLE.slice(0, 4).map((p) => (
          <div key={p.id} className={styles.card}>{p.name}</div>
        ))}
      </div>
    </DemoShell>
  );
}

export function TextInputDemo(): ReactNode {
  const [value, setValue] = useState('');
  const id = useId();
  return (
    <DemoShell {...demoShellProps('text-input')} onReset={() => setValue('')}>
      <div style={{padding: '0.75rem'}} className={styles.stack}>
        <label htmlFor={id}>이름</label>
        <input id={id} className={styles.input} value={value} onChange={(e) => setValue(e.target.value)} placeholder="이름을 입력" />
        <span className={styles.hint}>값: {value || '(비어 있음)'}</span>
      </div>
    </DemoShell>
  );
}

export function TextareaDemo(): ReactNode {
  const [value, setValue] = useState('');
  return (
    <DemoShell {...demoShellProps('textarea')} onReset={() => setValue('')}>
      <div style={{padding: '0.75rem'}} className={styles.stack}>
        <textarea className={styles.input} rows={4} value={value} onChange={(e) => setValue(e.target.value)} placeholder="메모" />
        <span className={styles.hint}>{value.length}자</span>
      </div>
    </DemoShell>
  );
}

export function CheckboxDemo(): ReactNode {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const ids = PEOPLE.slice(0, 4).map((p) => p.id);
  const all = ids.every((id) => checked[id]);
  const some = ids.some((id) => checked[id]) && !all;
  return (
    <DemoShell {...demoShellProps('checkbox-select-all')} onReset={() => setChecked({})}>
      <div style={{padding: '0.75rem'}} className={styles.stack}>
        <label>
          <input
            type="checkbox"
            checked={all}
            ref={(el) => {
              if (el) el.indeterminate = some;
            }}
            onChange={(e) => {
              const next = e.target.checked;
              setChecked(Object.fromEntries(ids.map((id) => [id, next])));
            }}
          />{' '}
          전체 선택
        </label>
        {PEOPLE.slice(0, 4).map((p) => (
          <label key={p.id}>
            <input
              type="checkbox"
              checked={!!checked[p.id]}
              onChange={(e) => setChecked((c) => ({...c, [p.id]: e.target.checked}))}
            />{' '}
            {p.name}
          </label>
        ))}
      </div>
    </DemoShell>
  );
}

export function RadioDemo(): ReactNode {
  const [plan, setPlan] = useState('basic');
  return (
    <DemoShell {...demoShellProps('radio')} onReset={() => setPlan('basic')}>
      <fieldset style={{padding: '0.75rem', border: 0}} className={styles.stack}>
        <legend>요금제</legend>
        {[
          ['basic', '기본'],
          ['pro', '프로'],
          ['team', '팀'],
        ].map(([v, label]) => (
          <label key={v}>
            <input type="radio" name="plan" value={v} checked={plan === v} onChange={() => setPlan(v)} /> {label}
          </label>
        ))}
        <span className={styles.hint}>선택: {plan}</span>
      </fieldset>
    </DemoShell>
  );
}

export function ToggleDemo(): ReactNode {
  const [on, setOn] = useState(false);
  return (
    <DemoShell {...demoShellProps('toggle')} onReset={() => setOn(false)}>
      <div style={{padding: '0.75rem'}} className={styles.row}>
        <button
          type="button"
          role="switch"
          aria-checked={on}
          className={on ? styles.btnPrimary : styles.btn}
          onClick={() => setOn((v) => !v)}>
          알림 {on ? '켜짐' : '꺼짐'}
        </button>
      </div>
    </DemoShell>
  );
}

export function SelectDemo(): ReactNode {
  const [city, setCity] = useState(CITIES[0]);
  return (
    <DemoShell {...demoShellProps('select')} onReset={() => setCity(CITIES[0])}>
      <div style={{padding: '0.75rem'}} className={styles.stack}>
        <label>
          도시
          <select className={styles.input} value={city} onChange={(e) => setCity(e.target.value)}>
            {CITIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>
        <span className={styles.hint}>선택: {city}</span>
      </div>
    </DemoShell>
  );
}

export function ComboboxDemo(): ReactNode {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const filtered = CITIES.filter((c) => c.includes(value));
  return (
    <DemoShell {...demoShellProps('combobox')} onReset={() => { setValue(''); setOpen(false); }}>
      <div style={{padding: '0.75rem', position: 'relative'}} className={styles.stack}>
        <input
          className={styles.input}
          role="combobox"
          aria-expanded={open}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="도시 입력"
        />
        {open ? (
          <ul className={styles.card} style={{listStyle: 'none', margin: 0, padding: 0, maxHeight: 160, overflow: 'auto'}}>
            {filtered.map((c) => (
              <li key={c}>
                <button type="button" className={styles.btnGhost} style={{width: '100%', textAlign: 'left'}} onClick={() => { setValue(c); setOpen(false); }}>
                  {c}
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </DemoShell>
  );
}

export function AutocompleteDemo(): ReactNode {
  const [q, setQ] = useState('');
  const results = useMemo(() => PEOPLE.filter((p) => p.name.includes(q) || p.role.includes(q)), [q]);
  return (
    <DemoShell {...demoShellProps('autocomplete')} onReset={() => setQ('')}>
      <div style={{padding: '0.75rem'}} className={styles.stack}>
        <input className={styles.input} value={q} onChange={(e) => setQ(e.target.value)} placeholder="이름 또는 역할" aria-autocomplete="list" />
        <ul style={{margin: 0, paddingLeft: '1.1rem'}}>
          {(q ? results : PEOPLE.slice(0, 3)).map((p) => (
            <li key={p.id}>{p.name} · {p.role}</li>
          ))}
        </ul>
      </div>
    </DemoShell>
  );
}

export function SliderDemo(): ReactNode {
  const [v, setV] = useState(40);
  return (
    <DemoShell {...demoShellProps('slider')} onReset={() => setV(40)}>
      <div style={{padding: '0.75rem'}} className={styles.stack}>
        <input type="range" min={0} max={100} value={v} onChange={(e) => setV(Number(e.target.value))} aria-valuetext={`${v}%`} />
        <span>{v}%</span>
      </div>
    </DemoShell>
  );
}

export function NumberInputDemo(): ReactNode {
  const [n, setN] = useState(1);
  return (
    <DemoShell {...demoShellProps('number-input')} onReset={() => setN(1)}>
      <div className={styles.row} style={{padding: '0.75rem'}}>
        <button type="button" className={styles.btn} onClick={() => setN((x) => Math.max(0, x - 1))}>-</button>
        <input className={styles.input} style={{width: 80}} type="number" value={n} onChange={(e) => setN(Number(e.target.value))} />
        <button type="button" className={styles.btn} onClick={() => setN((x) => x + 1)}>+</button>
      </div>
    </DemoShell>
  );
}

export function DatePickerDemo(): ReactNode {
  const [date, setDate] = useState('2026-03-17');
  return (
    <DemoShell {...demoShellProps('date-picker')} onReset={() => setDate('2026-03-17')}>
      <div style={{padding: '0.75rem'}}>
        <input className={styles.input} type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>
    </DemoShell>
  );
}

export function TimePickerDemo(): ReactNode {
  const [time, setTime] = useState('09:30');
  return (
    <DemoShell {...demoShellProps('time-picker')} onReset={() => setTime('09:30')}>
      <div style={{padding: '0.75rem'}}>
        <input className={styles.input} type="time" value={time} onChange={(e) => setTime(e.target.value)} />
      </div>
    </DemoShell>
  );
}

export function DateRangeDemo(): ReactNode {
  const [from, setFrom] = useState('2026-03-01');
  const [to, setTo] = useState('2026-03-17');
  return (
    <DemoShell {...demoShellProps('date-range')} onReset={() => { setFrom('2026-03-01'); setTo('2026-03-17'); }}>
      <div className={styles.row} style={{padding: '0.75rem'}}>
        <input className={styles.input} type="date" value={from} onChange={(e) => setFrom(e.target.value)} aria-label="시작일" />
        <span>~</span>
        <input className={styles.input} type="date" value={to} onChange={(e) => setTo(e.target.value)} aria-label="종료일" />
      </div>
    </DemoShell>
  );
}
