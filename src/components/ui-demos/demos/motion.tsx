import {useEffect, useId, useMemo, useRef, useState, type ReactNode} from 'react';

import {demoShellProps} from '../catalog';
import DemoShell from '../DemoShell';
import {CITIES, PEOPLE, wait} from '../sampleData';
import styles from '../styles.module.css';


export function PressFeedbackDemo(): ReactNode {
  const [pressed, setPressed] = useState(false);
  return (
    <DemoShell {...demoShellProps('press-feedback')}>
      <div style={{padding: '0.75rem'}}>
        <button
          type="button"
          className={styles.btnPrimary}
          style={{transform: pressed ? 'scale(0.96)' : undefined}}
          onMouseDown={() => setPressed(true)}
          onMouseUp={() => setPressed(false)}
          onMouseLeave={() => setPressed(false)}
          onTouchStart={() => setPressed(true)}
          onTouchEnd={() => setPressed(false)}>
          눌러 보세요
        </button>
      </div>
    </DemoShell>
  );
}

export function HoverFocusDemo(): ReactNode {
  return (
    <DemoShell {...demoShellProps('hover-focus')}>
      <div className={styles.row} style={{padding: '0.75rem'}}>
        <button type="button" className={styles.btn}>포커스 가능한 버튼</button>
        <a href="#focus-demo">포커스 가능한 링크</a>
      </div>
    </DemoShell>
  );
}

export function CollapseDemo(): ReactNode {
  const [open, setOpen] = useState(false);
  return (
    <DemoShell {...demoShellProps('collapse')} onReset={() => setOpen(false)}>
      <div style={{padding: '0.75rem'}}>
        <button type="button" className={styles.btn} aria-expanded={open} onClick={() => setOpen((v) => !v)}>{open ? '접기' : '펼치기'}</button>
        <div style={{overflow: 'hidden', maxHeight: open ? 120 : 0, transition: 'max-height 0.25s ease'}} className={styles.reduceMotion}>
          <div className={styles.card} style={{marginTop: 8}}>펼쳐진 내용</div>
        </div>
      </div>
    </DemoShell>
  );
}

export function ListEnterDemo(): ReactNode {
  const [items, setItems] = useState(PEOPLE.slice(0, 2));
  return (
    <DemoShell {...demoShellProps('list-enter')} onReset={() => setItems(PEOPLE.slice(0, 2))}>
      <div style={{padding: '0.75rem'}} className={styles.stack}>
        <button type="button" className={styles.btnPrimary} onClick={() => setItems((list) => PEOPLE.slice(0, Math.min(PEOPLE.length, list.length + 1)))}>항목 추가</button>
        {items.map((p) => (
          <div key={p.id} className={`${styles.card} ${styles.reduceMotion}`} style={{animation: 'fadeIn 0.3s ease'}}>{p.name}</div>
        ))}
      </div>
    </DemoShell>
  );
}

export function PageTransitionDemo(): ReactNode {
  const [page, setPage] = useState('A');
  return (
    <DemoShell {...demoShellProps('view-transition')} onReset={() => setPage('A')}>
      <div style={{padding: '0.75rem'}} className={styles.stack}>
        <div className={styles.row}>
          <button type="button" className={styles.btn} onClick={() => setPage('A')}>A</button>
          <button type="button" className={styles.btn} onClick={() => setPage('B')}>B</button>
        </div>
        <div key={page} className={`${styles.card} ${styles.reduceMotion}`} style={{animation: 'fadeIn 0.25s ease'}}>화면 {page}</div>
      </div>
    </DemoShell>
  );
}

export function DragSortDemo(): ReactNode {
  const [items, setItems] = useState(['알파', '베타', '감마', '델타']);
  const move = (from: number, to: number) => {
    setItems((list) => {
      const next = [...list];
      const [x] = next.splice(from, 1);
      next.splice(to, 0, x);
      return next;
    });
  };
  return (
    <DemoShell {...demoShellProps('drag-sort')} onReset={() => setItems(['알파', '베타', '감마', '델타'])}>
      <ul style={{padding: '0.75rem', listStyle: 'none', margin: 0}} className={styles.stack}>
        {items.map((item, i) => (
          <li
            key={item}
            className={styles.card}
            draggable
            onDragStart={(e) => e.dataTransfer.setData('text/plain', String(i))}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              move(Number(e.dataTransfer.getData('text/plain')), i);
            }}>
            <div className={styles.row} style={{justifyContent: 'space-between'}}>
              <span>{item}</span>
              <span className={styles.row}>
                <button type="button" className={styles.btnGhost} aria-label={`${item} 위로`} disabled={i === 0} onClick={() => move(i, i - 1)}>↑</button>
                <button type="button" className={styles.btnGhost} aria-label={`${item} 아래로`} disabled={i === items.length - 1} onClick={() => move(i, i + 1)}>↓</button>
              </span>
            </div>
          </li>
        ))}
      </ul>
    </DemoShell>
  );
}

export function SwipeActionDemo(): ReactNode {
  const [removed, setRemoved] = useState(false);
  const startX = useRef(0);
  const [dx, setDx] = useState(0);
  return (
    <DemoShell {...demoShellProps('swipe-action')} onReset={() => { setRemoved(false); setDx(0); }}>
      <div style={{padding: '0.75rem'}}>
        {removed ? <span className={styles.hint}>삭제됨</span> : (
          <div
            className={styles.card}
            style={{transform: `translateX(${dx}px)`}}
            onTouchStart={(e) => { startX.current = e.touches[0].clientX; }}
            onTouchMove={(e) => setDx(e.touches[0].clientX - startX.current)}
            onTouchEnd={() => {
              if (dx < -80) setRemoved(true);
              setDx(0);
            }}>
            <div className={styles.row} style={{justifyContent: 'space-between'}}>
              <span>스와이프하거나 삭제</span>
              <button type="button" className={styles.btn} onClick={() => setRemoved(true)}>삭제</button>
            </div>
          </div>
        )}
      </div>
    </DemoShell>
  );
}

export function LongPressDemo(): ReactNode {
  const [armed, setArmed] = useState(false);
  const timer = useRef<number | null>(null);
  const clear = () => {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = null;
  };
  return (
    <DemoShell {...demoShellProps('long-press')} onReset={() => setArmed(false)}>
      <div style={{padding: '0.75rem'}} className={styles.stack}>
        <button
          type="button"
          className={styles.btn}
          onMouseDown={() => { timer.current = window.setTimeout(() => setArmed(true), 500); }}
          onMouseUp={clear}
          onMouseLeave={clear}
          onTouchStart={() => { timer.current = window.setTimeout(() => setArmed(true), 500); }}
          onTouchEnd={clear}>
          길게 누르기
        </button>
        {armed ? <div className={styles.card}>롱프레스 메뉴 (모의)</div> : null}
      </div>
    </DemoShell>
  );
}

export function PullRefreshDemo(): ReactNode {
  const [status, setStatus] = useState('당겨서 새로고침');
  return (
    <DemoShell {...demoShellProps('pull-refresh')} onReset={() => setStatus('당겨서 새로고침')}>
      <div style={{padding: '0.75rem'}} className={styles.stack}>
        <span className={styles.hint}>{status}</span>
        <button
          type="button"
          className={styles.btnPrimary}
          onClick={async () => {
            setStatus('새로고침 중…');
            await wait(800);
            setStatus('갱신 완료 (모의)');
          }}>
          새로고침 실행
        </button>
      </div>
    </DemoShell>
  );
}

export function ReducedMotionDemo(): ReactNode {
  const [forceReduce, setForceReduce] = useState(false);
  return (
    <DemoShell {...demoShellProps('reduced-motion')} controls={<label><input type="checkbox" checked={forceReduce} onChange={(e) => setForceReduce(e.target.checked)} /> 모션 줄이기</label>} onReset={() => setForceReduce(false)}>
      <div style={{padding: '0.75rem'}}>
        <div
          className={styles.card}
          style={{
            animation: forceReduce ? 'none' : 'fadeIn 1s ease infinite alternate',
          }}>
          {forceReduce ? '애니메이션 없음' : '애니메이션 동작 중'}
        </div>
      </div>
    </DemoShell>
  );
}
