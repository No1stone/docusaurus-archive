import {useEffect, useId, useMemo, useRef, useState, type ReactNode} from 'react';

import {demoShellProps} from '../catalog';
import DemoShell from '../DemoShell';
import {CITIES, PEOPLE, wait} from '../sampleData';
import styles from '../styles.module.css';


export function HeaderDemo(): ReactNode {
  return (
    <DemoShell {...demoShellProps('header')}>
      <div className={styles.stickyBar} style={{position: 'relative'}}>
        <div className={styles.row} style={{justifyContent: 'space-between'}}>
          <strong>Acme Console</strong>
          <div className={styles.row}>
            <button type="button" className={styles.btn}>검색</button>
            <button type="button" className={styles.btnPrimary}>새 항목</button>
          </div>
        </div>
      </div>
      <div style={{padding: '0.75rem'}} className={styles.hint}>본문 미리보기 영역입니다.</div>
    </DemoShell>
  );
}

export function StickyHeaderDemo(): ReactNode {
  return (
    <DemoShell {...demoShellProps('sticky-header')} tall>
      <div className={styles.stickyBar}>스티키 헤더 · 아래로 스크롤해 보세요</div>
      <div style={{padding: '0.75rem'}} className={styles.stack}>
        {Array.from({length: 18}, (_, i) => (
          <div key={i} className={styles.card}>스크롤 콘텐츠 {i + 1}</div>
        ))}
      </div>
    </DemoShell>
  );
}

export function SidebarDemo(): ReactNode {
  const [open, setOpen] = useState(true);
  return (
    <DemoShell {...demoShellProps('sidebar')} controls={
        <label>
          <input type="checkbox" checked={open} onChange={(e) => setOpen(e.target.checked)} />
          사이드바 펼침
        </label>
      }
      onReset={() => setOpen(true)}>
      <div style={{display: 'grid', gridTemplateColumns: open ? '160px 1fr' : '0 1fr', minHeight: 200}}>
        <aside style={{overflow: 'hidden', borderRight: '1px solid var(--ifm-color-emphasis-200)', padding: open ? '0.75rem' : 0}}>
          {open ? (
            <nav className={styles.stack}>
              <button type="button" className={styles.btnGhost}>대시보드</button>
              <button type="button" className={styles.btnGhost}>목록</button>
              <button type="button" className={styles.btnGhost}>설정</button>
            </nav>
          ) : null}
        </aside>
        <div style={{padding: '0.75rem'}}>본문 폭이 {open ? '좁아집니다' : '넓어집니다'}.</div>
      </div>
    </DemoShell>
  );
}

export function FooterDemo(): ReactNode {
  return (
    <DemoShell {...demoShellProps('footer')} tall>
      <div style={{padding: '0.75rem'}} className={styles.stack}>
        {Array.from({length: 10}, (_, i) => (
          <div key={i} className={styles.card}>본문 {i + 1}</div>
        ))}
      </div>
      <footer style={{padding: '0.85rem', borderTop: '1px solid var(--ifm-color-emphasis-200)'}} className={styles.row}>
        <a href="#privacy">개인정보</a>
        <a href="#terms">약관</a>
        <span className={styles.hint}>© Demo</span>
      </footer>
    </DemoShell>
  );
}

export function StickyActionBarDemo(): ReactNode {
  return (
    <DemoShell {...demoShellProps('sticky-action-bar')} tall>
      <div style={{padding: '0.75rem'}} className={styles.stack}>
        {Array.from({length: 14}, (_, i) => (
          <div key={i} className={styles.card}>편집 필드 {i + 1}</div>
        ))}
      </div>
      <div className={styles.stickyBottom}>
        <div className={styles.row} style={{justifyContent: 'flex-end'}}>
          <button type="button" className={styles.btn}>취소</button>
          <button type="button" className={styles.btnPrimary}>저장</button>
        </div>
      </div>
    </DemoShell>
  );
}

export function ColumnsDemo(): ReactNode {
  const [wide, setWide] = useState(true);
  return (
    <DemoShell {...demoShellProps('columns')} controls={
        <label>
          <input type="checkbox" checked={wide} onChange={(e) => setWide(e.target.checked)} />
          넓은 데모 폭
        </label>
      }
      onReset={() => setWide(true)}>
      <div style={{maxWidth: wide ? '100%' : 280, margin: '0 auto', padding: '0.75rem'}}>
        <div className={styles.gridResponsive}>
          {['A', 'B', 'C', 'D'].map((x) => (
            <div key={x} className={styles.card}>열 {x}</div>
          ))}
        </div>
      </div>
    </DemoShell>
  );
}

export function SplitPanelDemo(): ReactNode {
  const [left, setLeft] = useState(45);
  const dragging = useRef(false);
  return (
    <DemoShell {...demoShellProps('split-panel')} onReset={() => setLeft(45)}>
      <div
        className={styles.split}
        onMouseMove={(e) => {
          if (!dragging.current) return;
          const rect = e.currentTarget.getBoundingClientRect();
          setLeft(Math.min(75, Math.max(25, ((e.clientX - rect.left) / rect.width) * 100)));
        }}
        onMouseUp={() => {
          dragging.current = false;
        }}
        onMouseLeave={() => {
          dragging.current = false;
        }}>
        <div style={{padding: '0.75rem', width: `${left}%`}} className={styles.card}>왼쪽 {Math.round(left)}%</div>
        <div
          className={styles.splitHandle}
          role="separator"
          aria-orientation="vertical"
          onMouseDown={() => {
            dragging.current = true;
          }}
        />
        <div style={{padding: '0.75rem', flex: 1}} className={styles.card}>오른쪽</div>
      </div>
    </DemoShell>
  );
}

export function ListDetailDemo(): ReactNode {
  const [id, setId] = useState(PEOPLE[0].id);
  const selected = PEOPLE.find((p) => p.id === id)!;
  return (
    <DemoShell {...demoShellProps('list-detail')} onReset={() => setId(PEOPLE[0].id)}>
      <div style={{display: 'grid', gridTemplateColumns: 'minmax(140px, 40%) 1fr', minHeight: 220}}>
        <div style={{borderRight: '1px solid var(--ifm-color-emphasis-200)'}}>
          {PEOPLE.slice(0, 5).map((p) => (
            <button
              key={p.id}
              type="button"
              className={styles.btnGhost}
              style={{display: 'block', width: '100%', textAlign: 'left', background: p.id === id ? 'var(--ifm-color-emphasis-100)' : undefined}}
              onClick={() => setId(p.id)}>
              {p.name}
            </button>
          ))}
        </div>
        <div style={{padding: '0.75rem'}} className={styles.stack}>
          <strong>{selected.name}</strong>
          <span>{selected.role}</span>
          <span className={styles.hint}>상태: {selected.status}</span>
        </div>
      </div>
    </DemoShell>
  );
}

export function ResponsiveGridDemo(): ReactNode {
  const [narrow, setNarrow] = useState(false);
  return (
    <DemoShell {...demoShellProps('responsive-grid')} controls={
        <label>
          <input type="checkbox" checked={narrow} onChange={(e) => setNarrow(e.target.checked)} />
          좁은 폭
        </label>
      }
      onReset={() => setNarrow(false)}>
      <div style={{maxWidth: narrow ? 260 : '100%', margin: '0 auto', padding: '0.75rem'}}>
        <div className={styles.gridResponsive}>
          {PEOPLE.slice(0, 6).map((p) => (
            <div key={p.id} className={styles.card}>{p.name}</div>
          ))}
        </div>
      </div>
    </DemoShell>
  );
}

export function BentoGridDemo(): ReactNode {
  return (
    <DemoShell {...demoShellProps('bento-grid')}>
      <div className={styles.bento} style={{padding: '0.75rem'}}>
        {['히어로', '통계', '알림', '최근', '바로가기', '도움말'].map((label) => (
          <div key={label} className={styles.card}>{label}</div>
        ))}
      </div>
    </DemoShell>
  );
}
