import {useEffect, useId, useMemo, useRef, useState, type ReactNode} from 'react';

import {demoShellProps} from '../catalog';
import DemoShell from '../DemoShell';
import {CITIES, PEOPLE, wait} from '../sampleData';
import styles from '../styles.module.css';


export function CardDemo(): ReactNode {
  return (
    <DemoShell {...demoShellProps('card')}>
      <div className={styles.gridResponsive} style={{padding: '0.75rem'}}>
        {PEOPLE.slice(0, 3).map((p) => (
          <article key={p.id} className={styles.card}>
            <strong>{p.name}</strong>
            <p className={styles.hint}>{p.role}</p>
          </article>
        ))}
      </div>
    </DemoShell>
  );
}

export function ListDemo(): ReactNode {
  return (
    <DemoShell {...demoShellProps('list')}>
      <ul style={{margin: 0, padding: '0.75rem', listStyle: 'none'}} className={styles.stack}>
        {PEOPLE.slice(0, 5).map((p) => (
          <li key={p.id} className={styles.card}>{p.name} · {p.role}</li>
        ))}
      </ul>
    </DemoShell>
  );
}

export function BadgeDemo(): ReactNode {
  return (
    <DemoShell {...demoShellProps('badge')}>
      <div style={{padding: '0.75rem'}} className={styles.stack}>
        <span className={styles.elementLabel}>배지 (Badge) — 읽기 전용 상태·수치</span>
        <div className={styles.row}>
          <span className={styles.badge}>신규</span>
          <span className={styles.badge}>3</span>
          <span className={`${styles.badge} ${styles.ok}`}>완료</span>
          <span className={`${styles.badge} ${styles.danger}`}>오류</span>
        </div>
        <p className={styles.hint}>칩처럼 누르지 않습니다. 알림 숫자는 알림 배지 데모를 봅니다.</p>
      </div>
    </DemoShell>
  );
}

export function ChipDemo(): ReactNode {
  const [active, setActive] = useState(['React']);
  return (
    <DemoShell {...demoShellProps('chip')} onReset={() => setActive(['React'])}>
      <div style={{padding: '0.75rem'}} className={styles.stack}>
        <span className={styles.elementLabel}>칩 (Chip) — 선택·해제 가능</span>
        <div className={styles.row}>
          {['React', '접근성', '모바일'].map((c) => (
            <button
              key={c}
              type="button"
              className={active.includes(c) ? `${styles.chip} ${styles.chipActive}` : styles.chip}
              onClick={() => setActive((a) => (a.includes(c) ? a.filter((x) => x !== c) : [...a, c]))}>
              {c}
              {active.includes(c) ? ' ×' : ''}
            </button>
          ))}
        </div>
        <p className={styles.hint}>선택: {active.join(', ') || '(없음)'} · 배지(상태)·태그(고정 라벨)와 다릅니다.</p>
      </div>
    </DemoShell>
  );
}

export function TagDemo(): ReactNode {
  return (
    <DemoShell {...demoShellProps('tag')}>
      <div style={{padding: '0.75rem'}} className={styles.stack}>
        <span className={styles.elementLabel}>태그 (Tag) — 읽기 전용 분류</span>
        <div className={styles.row}>
          {['문서', '프론트엔드', '가이드'].map((t) => (
            <span key={t} className={styles.tag}>#{t}</span>
          ))}
        </div>
        <p className={styles.hint}>클릭해도 상태가 바뀌지 않습니다.</p>
      </div>
    </DemoShell>
  );
}

export function AvatarDemo(): ReactNode {
  return (
    <DemoShell {...demoShellProps('avatar')}>
      <div className={styles.row} style={{padding: '0.75rem'}}>
        {PEOPLE.slice(0, 4).map((p, i) => (
          <span
            key={p.id}
            className={styles.badge}
            style={{width: 36, height: 36, borderRadius: 999, display: 'inline-grid', placeItems: 'center', marginLeft: i ? -8 : 0}}
            aria-label={p.name}>
            {p.name[0]}
          </span>
        ))}
      </div>
    </DemoShell>
  );
}

export function DividerDemo(): ReactNode {
  return (
    <DemoShell {...demoShellProps('divider')}>
      <div style={{padding: '0.75rem'}}>
        <p>위 구역</p>
        <hr />
        <p>아래 구역</p>
      </div>
    </DemoShell>
  );
}

export function DescriptionListDemo(): ReactNode {
  return (
    <DemoShell {...demoShellProps('description-list')}>
      <dl style={{padding: '0.75rem', display: 'grid', gridTemplateColumns: '120px 1fr', gap: '0.5rem'}}>
        <dt>이름</dt><dd>김민수</dd>
        <dt>역할</dt><dd>프론트엔드</dd>
        <dt>상태</dt><dd>active</dd>
      </dl>
    </DemoShell>
  );
}

export function TimelineDemo(): ReactNode {
  return (
    <DemoShell {...demoShellProps('timeline')}>
      <ol style={{padding: '0.75rem 0.75rem 0.75rem 1.5rem'}} className={styles.stack}>
        <li className={styles.card}>09:00 요청 수신</li>
        <li className={styles.card}>09:12 검토 시작</li>
        <li className={styles.card}>09:40 배포 완료</li>
      </ol>
    </DemoShell>
  );
}

export function ExpandDetailsDemo(): ReactNode {
  return (
    <DemoShell {...demoShellProps('expand-detail')}>
      <div style={{padding: '0.75rem'}}>
        <details className={styles.card}>
          <summary>주문 상세</summary>
          <p className={styles.hint}>배송지, 결제 수단, 영수증 링크</p>
        </details>
      </div>
    </DemoShell>
  );
}

export function StatCardDemo(): ReactNode {
  return (
    <DemoShell {...demoShellProps('stat-card')}>
      <div className={styles.gridResponsive} style={{padding: '0.75rem'}}>
        {[
          ['방문', '1,240'],
          ['전환', '8.2%'],
          ['오류', '3'],
        ].map(([k, v]) => (
          <div key={k} className={styles.card}>
            <div className={styles.hint}>{k}</div>
            <strong style={{fontSize: '1.4rem'}}>{v}</strong>
          </div>
        ))}
      </div>
    </DemoShell>
  );
}

export function ChartLegendDemo(): ReactNode {
  const visit = [40, 70, 55, 90, 60];
  const convert = [20, 35, 28, 50, 32];
  const [showVisit, setShowVisit] = useState(true);
  const [showConvert, setShowConvert] = useState(true);
  return (
    <DemoShell {...demoShellProps('chart-legend')} onReset={() => { setShowVisit(true); setShowConvert(true); }}>
      <div style={{padding: '0.75rem'}} className={styles.stack}>
        <span className={styles.elementLabel}>차트 (Chart)</span>
        <div className={styles.row} style={{alignItems: 'flex-end', height: 120, gap: 10}}>
          {visit.map((h, i) => (
            <div key={i} className={styles.row} style={{alignItems: 'flex-end', gap: 2}}>
              {showVisit ? <div style={{width: 12, height: `${h}%`, background: 'var(--ifm-color-primary)', borderRadius: 3}} title={`방문 ${h}`} /> : null}
              {showConvert ? <div style={{width: 12, height: `${convert[i]}%`, background: 'var(--ifm-color-success)', borderRadius: 3}} title={`전환 ${convert[i]}`} /> : null}
            </div>
          ))}
        </div>
        <span className={styles.elementLabel}>범례 (Legend) — 눌러 시리즈 표시/숨김</span>
        <div className={styles.row}>
          <button type="button" className={showVisit ? styles.btnPrimary : styles.btn} onClick={() => setShowVisit((v) => !v)}>방문</button>
          <button type="button" className={showConvert ? styles.btnPrimary : styles.btn} onClick={() => setShowConvert((v) => !v)}>전환</button>
        </div>
      </div>
    </DemoShell>
  );
}
