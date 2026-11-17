import {useEffect, useId, useMemo, useRef, useState, type ReactNode} from 'react';

import {demoShellProps} from '../catalog';
import DemoShell from '../DemoShell';
import {CITIES, PEOPLE, wait} from '../sampleData';
import styles from '../styles.module.css';


export function ButtonLoadingDemo(): ReactNode {
  const [loading, setLoading] = useState(false);
  return (
    <DemoShell {...demoShellProps('button-pending')} onReset={() => setLoading(false)}>
      <div style={{padding: '0.75rem'}}>
        <button
          type="button"
          className={styles.btnPrimary}
          disabled={loading}
          onClick={async () => {
            setLoading(true);
            await wait(1200);
            setLoading(false);
          }}>
          {loading ? '처리 중…' : '제출'}
        </button>
      </div>
    </DemoShell>
  );
}

export function SpinnerDemo(): ReactNode {
  const [show, setShow] = useState(true);
  return (
    <DemoShell {...demoShellProps('spinner')} controls={<label><input type="checkbox" checked={show} onChange={(e) => setShow(e.target.checked)} /> 표시</label>} onReset={() => setShow(true)}>
      <div style={{padding: '0.75rem'}}>{show ? <div className={styles.spinner} role="status" aria-label="로딩 중" /> : <span className={styles.hint}>숨김</span>}</div>
    </DemoShell>
  );
}

export function SkeletonDemo(): ReactNode {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!loading) return;
    const t = window.setTimeout(() => setLoading(false), 1500);
    return () => window.clearTimeout(t);
  }, [loading]);
  return (
    <DemoShell {...demoShellProps('skeleton')} onReset={() => setLoading(true)}>
      <div style={{padding: '0.75rem'}} className={styles.stack}>
        {loading ? (
          <>
            <div className={styles.skeleton} style={{height: 18, width: '60%'}} />
            <div className={styles.skeleton} style={{height: 18, width: '80%'}} />
            <div className={styles.skeleton} style={{height: 72}} />
          </>
        ) : (
          <div className={styles.card}>불러온 콘텐츠</div>
        )}
      </div>
    </DemoShell>
  );
}

export function ProgressDemo(): ReactNode {
  const [value, setValue] = useState(20);
  return (
    <DemoShell {...demoShellProps('progress')} onReset={() => setValue(20)} controls={<input type="range" min={0} max={100} value={value} onChange={(e) => setValue(Number(e.target.value))} aria-label="진행률" />}>
      <div style={{padding: '0.75rem'}} className={styles.stack}>
        <span className={styles.elementLabel}>프로그레스 바 (Progress Bar)</span>
        <div className={styles.progress} aria-valuenow={value} aria-valuemin={0} aria-valuemax={100} role="progressbar">
          <span style={{width: `${value}%`}} />
        </div>
        <span>{value}%</span>
        <p className={styles.hint}>
          업로드 맥락: <a href="/docs/knowledge/frontend/ui-ux-elements/upload-progress">업로드 프로그레스</a>
        </p>
      </div>
    </DemoShell>
  );
}

export function EmptyFirstVisitDemo(): ReactNode {
  const [items, setItems] = useState<string[]>([]);
  return (
    <DemoShell {...demoShellProps('empty-first')} onReset={() => setItems([])}>
      <div style={{padding: '0.75rem'}} className={styles.stack}>
        {items.length === 0 ? (
          <>
            <p>아직 항목이 없습니다.</p>
            <button type="button" className={styles.btnPrimary} onClick={() => setItems(['첫 항목'])}>첫 항목 만들기</button>
          </>
        ) : (
          items.map((x) => <div key={x} className={styles.card}>{x}</div>)
        )}
      </div>
    </DemoShell>
  );
}

export function EmptySearchDemo(): ReactNode {
  const [q, setQ] = useState('zzz');
  const results = PEOPLE.filter((p) => p.name.includes(q));
  return (
    <DemoShell {...demoShellProps('empty-search')} onReset={() => setQ('zzz')}>
      <div style={{padding: '0.75rem'}} className={styles.stack}>
        <input className={styles.input} value={q} onChange={(e) => setQ(e.target.value)} />
        {results.length === 0 ? <div className={styles.card}>“{q}”에 대한 결과가 없습니다.</div> : results.map((p) => <div key={p.id} className={styles.card}>{p.name}</div>)}
      </div>
    </DemoShell>
  );
}

export function PartialLoadDemo(): ReactNode {
  const [profile, setProfile] = useState<'loading' | 'ok'>('loading');
  const [activity, setActivity] = useState<'loading' | 'error' | 'ok'>('loading');
  useEffect(() => {
    void wait(600).then(() => setProfile('ok'));
    void wait(900).then(() => setActivity('error'));
  }, []);
  return (
    <DemoShell {...demoShellProps('partial-state')} onReset={() => { setProfile('loading'); setActivity('loading'); void wait(600).then(() => setProfile('ok')); void wait(900).then(() => setActivity('error')); }}>
      <div style={{padding: '0.75rem'}} className={styles.gridResponsive}>
        <div className={styles.card}>{profile === 'loading' ? '프로필 로딩…' : '프로필 로드됨'}</div>
        <div className={styles.card}>
          {activity === 'loading' ? '활동 로딩…' : null}
          {activity === 'error' ? <span className={styles.danger}>활동 로드 실패 (모의)</span> : null}
          {activity === 'ok' ? '활동 로드됨' : null}
          {activity === 'error' ? <button type="button" className={styles.btn} onClick={() => { setActivity('loading'); void wait(500).then(() => setActivity('ok')); }}>재시도</button> : null}
        </div>
      </div>
    </DemoShell>
  );
}

export function ErrorRetryDemo(): ReactNode {
  const [state, setState] = useState<'error' | 'loading' | 'ok'>('error');
  return (
    <DemoShell {...demoShellProps('error-retry')} onReset={() => setState('error')}>
      <div style={{padding: '0.75rem'}} className={styles.stack}>
        {state === 'error' ? <span className={styles.danger}>불러오지 못했습니다.</span> : null}
        {state === 'loading' ? <span>다시 시도 중…</span> : null}
        {state === 'ok' ? <span className={styles.ok}>성공</span> : null}
        {state !== 'ok' ? (
          <button type="button" className={styles.btnPrimary} disabled={state === 'loading'} onClick={async () => { setState('loading'); await wait(700); setState('ok'); }}>재시도</button>
        ) : null}
      </div>
    </DemoShell>
  );
}

export function OfflineDemo(): ReactNode {
  const [online, setOnline] = useState(false);
  return (
    <DemoShell {...demoShellProps('offline')} onReset={() => setOnline(false)}>
      <div style={{padding: '0.75rem'}} className={styles.stack}>
        <span>{online ? '온라인' : '오프라인'} (모의)</span>
        <button type="button" className={styles.btnPrimary} onClick={() => setOnline((v) => !v)}>{online ? '오프라인으로' : '재연결'}</button>
      </div>
    </DemoShell>
  );
}

export function ForbiddenDemo(): ReactNode {
  return (
    <DemoShell {...demoShellProps('forbidden')}>
      <div style={{padding: '0.75rem'}} className={styles.card}>
        <strong>403</strong>
        <p className={styles.hint}>이 리소스를 볼 권한이 없습니다.</p>
        <button type="button" className={styles.btn}>권한 요청 (모의)</button>
      </div>
    </DemoShell>
  );
}
