import {useEffect, useId, useMemo, useRef, useState, type ReactNode} from 'react';

import {demoShellProps} from '../catalog';
import DemoShell from '../DemoShell';
import {CITIES, PEOPLE, wait} from '../sampleData';
import styles from '../styles.module.css';


export function TopNavDemo(): ReactNode {
  const [active, setActive] = useState('홈');
  return (
    <DemoShell {...demoShellProps('top-menu')} onReset={() => setActive('홈')}>
      <nav className={styles.row} style={{padding: '0.75rem', borderBottom: '1px solid var(--ifm-color-emphasis-200)'}}>
        {['홈', '문서', '블로그', '도구'].map((item) => (
          <button
            key={item}
            type="button"
            className={active === item ? styles.btnPrimary : styles.btn}
            onClick={() => setActive(item)}>
            {item}
          </button>
        ))}
      </nav>
      <div style={{padding: '0.75rem'}}>선택: {active}</div>
    </DemoShell>
  );
}

export function HamburgerDemo(): ReactNode {
  const [open, setOpen] = useState(false);
  return (
    <DemoShell {...demoShellProps('hamburger-menu')} onReset={() => setOpen(false)}>
      <div style={{position: 'relative', minHeight: 220}}>
        <div className={styles.row} style={{padding: '0.75rem', justifyContent: 'space-between'}}>
          <strong>App</strong>
          <button type="button" className={styles.btn} aria-expanded={open} onClick={() => setOpen((v) => !v)}>
            메뉴
          </button>
        </div>
        {open ? (
          <div
            role="dialog"
            aria-modal="true"
            style={{position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)'}}
            onClick={() => setOpen(false)}
            onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}>
            <div
              className={styles.card}
              style={{width: 220, height: '100%', borderRadius: 0, padding: '1rem'}}
              onClick={(e) => e.stopPropagation()}>
              <div className={styles.stack}>
                {['홈', '검색', '설정'].map((x) => (
                  <button key={x} type="button" className={styles.btnGhost} onClick={() => setOpen(false)}>
                    {x}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </DemoShell>
  );
}

export function BottomNavDemo(): ReactNode {
  const [tab, setTab] = useState('홈');
  return (
    <DemoShell {...demoShellProps('bottom-nav')} onReset={() => setTab('홈')}>
      <div style={{minHeight: 180, display: 'flex', flexDirection: 'column'}}>
        <div style={{flex: 1, padding: '0.75rem'}}>현재: {tab}</div>
        <nav className={styles.row} style={{justifyContent: 'space-around', borderTop: '1px solid var(--ifm-color-emphasis-200)', padding: '0.5rem'}}>
          {['홈', '검색', '알림', '내 정보'].map((x) => (
            <button key={x} type="button" className={tab === x ? styles.btnPrimary : styles.btnGhost} onClick={() => setTab(x)}>
              {x}
            </button>
          ))}
        </nav>
      </div>
    </DemoShell>
  );
}

export function TabsDemo(): ReactNode {
  const [tab, setTab] = useState(0);
  const labels = ['개요', '활동', '설정'];
  return (
    <DemoShell {...demoShellProps('tabs')} onReset={() => setTab(0)}>
      <div style={{padding: '0.75rem'}}>
        <div role="tablist" className={styles.row}>
          {labels.map((label, i) => (
            <button
              key={label}
              type="button"
              role="tab"
              aria-selected={tab === i}
              className={tab === i ? styles.btnPrimary : styles.btn}
              onClick={() => setTab(i)}>
              {label}
            </button>
          ))}
        </div>
        <div role="tabpanel" className={styles.card} style={{marginTop: '0.75rem'}}>
          {labels[tab]} 패널 내용
        </div>
      </div>
    </DemoShell>
  );
}

export function BreadcrumbDemo(): ReactNode {
  return (
    <DemoShell {...demoShellProps('breadcrumb')}>
      <nav aria-label="빵부스러기" className={styles.row} style={{padding: '0.75rem'}}>
        <a href="#home">홈</a>
        <span aria-hidden>/</span>
        <a href="#docs">문서</a>
        <span aria-hidden>/</span>
        <span aria-current="page">현재 페이지</span>
      </nav>
    </DemoShell>
  );
}

export function AccordionMenuDemo(): ReactNode {
  const [open, setOpen] = useState<string | null>('a');
  return (
    <DemoShell {...demoShellProps('accordion-menu')} onReset={() => setOpen('a')}>
      <div className={styles.stack} style={{padding: '0.75rem'}}>
        {[
          ['a', '시작하기', '설치와 실행'],
          ['b', '가이드', '작성 규칙'],
          ['c', '참고', 'API 요약'],
        ].map(([id, title, body]) => (
          <div key={id} className={styles.card}>
            <button type="button" className={styles.btnGhost} aria-expanded={open === id} onClick={() => setOpen(open === id ? null : id)}>
              {title}
            </button>
            {open === id ? <p className={styles.hint}>{body}</p> : null}
          </div>
        ))}
      </div>
    </DemoShell>
  );
}

export function StepperDemo(): ReactNode {
  const [step, setStep] = useState(0);
  const steps = ['정보', '확인', '완료'];
  return (
    <DemoShell {...demoShellProps('stepper')} controls={
        <div className={styles.row}>
          <button type="button" className={styles.btn} disabled={step === 0} onClick={() => setStep((s) => s - 1)}>이전</button>
          <button type="button" className={styles.btnPrimary} disabled={step === steps.length - 1} onClick={() => setStep((s) => s + 1)}>다음</button>
        </div>
      }
      onReset={() => setStep(0)}>
      <ol className={styles.row} style={{padding: '0.75rem', listStyle: 'none', margin: 0}}>
        {steps.map((label, i) => (
          <li key={label} className={styles.badge} style={{opacity: i <= step ? 1 : 0.45}}>
            {i + 1}. {label}
          </li>
        ))}
      </ol>
      <div style={{padding: '0 0.75rem 0.75rem'}}>현재 단계: {steps[step]}</div>
    </DemoShell>
  );
}

export function TocDemo(): ReactNode {
  return (
    <DemoShell {...demoShellProps('page-toc')} tall>
      <div style={{display: 'grid', gridTemplateColumns: '140px 1fr', minHeight: 280}}>
        <nav className={styles.stack} style={{padding: '0.75rem', borderRight: '1px solid var(--ifm-color-emphasis-200)'}}>
          {['소개', '설치', '사용'].map((x) => (
            <a key={x} href={`#toc-${x}`}>{x}</a>
          ))}
        </nav>
        <div style={{padding: '0.75rem'}} className={styles.stack}>
          {['소개', '설치', '사용'].map((x) => (
            <section key={x} id={`toc-${x}`} className={styles.card} style={{minHeight: 120}}>
              <h4>{x}</h4>
              <p className={styles.hint}>{x} 섹션 본문</p>
            </section>
          ))}
        </div>
      </div>
    </DemoShell>
  );
}

export function PaginationDemo(): ReactNode {
  const [page, setPage] = useState(1);
  const total = 5;
  return (
    <DemoShell {...demoShellProps('pagination')} onReset={() => setPage(1)}>
      <div style={{padding: '0.75rem'}} className={styles.stack}>
        <div className={styles.card}>페이지 {page} 항목</div>
        <div className={styles.row}>
          <button type="button" className={styles.btn} disabled={page === 1} onClick={() => setPage((p) => p - 1)}>이전</button>
          {Array.from({length: total}, (_, i) => (
            <button key={i} type="button" className={page === i + 1 ? styles.btnPrimary : styles.btn} onClick={() => setPage(i + 1)}>
              {i + 1}
            </button>
          ))}
          <button type="button" className={styles.btn} disabled={page === total} onClick={() => setPage((p) => p + 1)}>다음</button>
        </div>
      </div>
    </DemoShell>
  );
}

export function LoadMoreDemo(): ReactNode {
  const [count, setCount] = useState(3);
  const [loading, setLoading] = useState(false);
  return (
    <DemoShell {...demoShellProps('load-more')} onReset={() => {
        setCount(3);
        setLoading(false);
      }}>
      <div style={{padding: '0.75rem'}} className={styles.stack}>
        {PEOPLE.slice(0, count).map((p) => (
          <div key={p.id} className={styles.card}>{p.name}</div>
        ))}
        {count < PEOPLE.length ? (
          <button
            type="button"
            className={styles.btn}
            disabled={loading}
            onClick={async () => {
              setLoading(true);
              await wait(400);
              setCount((c) => Math.min(PEOPLE.length, c + 2));
              setLoading(false);
            }}>
            {loading ? '불러오는 중…' : '더 보기'}
          </button>
        ) : (
          <span className={styles.hint}>모두 불러왔습니다.</span>
        )}
      </div>
    </DemoShell>
  );
}
