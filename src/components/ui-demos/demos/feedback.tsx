import {useEffect, useId, useMemo, useRef, useState, type ReactNode} from 'react';

import {demoShellProps} from '../catalog';
import DemoShell from '../DemoShell';
import {CITIES, PEOPLE, wait} from '../sampleData';
import styles from '../styles.module.css';


export function ToastDemo(): ReactNode {
  const [show, setShow] = useState(false);
  return (
    <DemoShell {...demoShellProps('toast')} onReset={() => setShow(false)}>
      <div style={{padding: '0.75rem', position: 'relative', minHeight: 120}} className={styles.stack}>
        <span className={styles.elementLabel}>토스트 (Toast) — 액션 없음 · 자동 소멸</span>
        <button
          type="button"
          className={styles.btnPrimary}
          onClick={async () => {
            setShow(true);
            await wait(1800);
            setShow(false);
          }}>
          토스트 표시
        </button>
        {show ? <div className={styles.toast} role="status">저장되었습니다</div> : null}
        <p className={styles.hint}>실행 취소가 필요하면 스낵바 데모를 봅니다.</p>
      </div>
    </DemoShell>
  );
}

export function SnackbarUndoDemo(): ReactNode {
  const [show, setShow] = useState(false);
  const [undone, setUndone] = useState(false);
  return (
    <DemoShell {...demoShellProps('snackbar-undo')} onReset={() => { setShow(false); setUndone(false); }}>
      <div style={{padding: '0.75rem', minHeight: 120}} className={styles.stack}>
        <span className={styles.elementLabel}>스낵바 (Snackbar) — 실행 취소 액션</span>
        <button type="button" className={styles.btn} onClick={() => { setShow(true); setUndone(false); }}>항목 삭제</button>
        {show ? (
          <div className={styles.toast} role="status">
            삭제됨
            <button type="button" className={styles.btnGhost} onClick={() => { setUndone(true); setShow(false); }}>실행 취소</button>
          </div>
        ) : null}
        {undone ? <p className={styles.ok}>되돌렸습니다.</p> : null}
        <p className={styles.hint}>액션 없이 사라지기만 하면 토스트입니다.</p>
      </div>
    </DemoShell>
  );
}

export function InlineMessageDemo(): ReactNode {
  return (
    <DemoShell {...demoShellProps('inline-message')}>
      <div style={{padding: '0.75rem'}} className={styles.stack}>
        <div className={`${styles.card} ${styles.ok}`}>성공 메시지</div>
        <div className={`${styles.card} ${styles.danger}`}>오류 메시지</div>
        <div className={styles.card}>정보 메시지</div>
      </div>
    </DemoShell>
  );
}

export function BannerDemo(): ReactNode {
  const [show, setShow] = useState(true);
  return (
    <DemoShell {...demoShellProps('announcement-banner')} onReset={() => setShow(true)}>
      {show ? (
        <div className={styles.row} style={{padding: '0.75rem', background: 'var(--ifm-color-warning-contrast-background)', justifyContent: 'space-between'}}>
          <span>점검 안내: 오늘 22시 이후</span>
          <button type="button" className={styles.btnGhost} onClick={() => setShow(false)}>닫기</button>
        </div>
      ) : (
        <div style={{padding: '0.75rem'}} className={styles.hint}>배너 닫힘</div>
      )}
    </DemoShell>
  );
}

export function CopyDoneDemo(): ReactNode {
  const [done, setDone] = useState(false);
  return (
    <DemoShell {...demoShellProps('copy-feedback')} onReset={() => setDone(false)}>
      <div style={{padding: '0.75rem'}} className={styles.row}>
        <code>demo-token</code>
        <button
          type="button"
          className={styles.btn}
          onClick={async () => {
            try {
              await navigator.clipboard.writeText('demo-token');
            } catch {
              /* 모의 */
            }
            setDone(true);
            await wait(1200);
            setDone(false);
          }}>
          복사
        </button>
        {done ? <span className={styles.ok} role="status">복사됨</span> : null}
      </div>
    </DemoShell>
  );
}

export function NotificationBadgeDemo(): ReactNode {
  const [count, setCount] = useState(3);
  return (
    <DemoShell {...demoShellProps('notification-badge')} onReset={() => setCount(3)}>
      <div style={{padding: '0.75rem'}} className={styles.row}>
        <button type="button" className={styles.btn} aria-label={`알림 ${count}건`}>
          알림 {count > 0 ? <span className={styles.badge}>{count}</span> : null}
        </button>
        <button type="button" className={styles.btnGhost} onClick={() => setCount((c) => Math.max(0, c - 1))}>하나 읽음</button>
      </div>
    </DemoShell>
  );
}

export function NotificationCenterDemo(): ReactNode {
  const [items, setItems] = useState([
    {id: '1', text: '배포 완료', read: false},
    {id: '2', text: '댓글 알림', read: false},
    {id: '3', text: '주간 리포트', read: true},
  ]);
  const unread = items.filter((i) => !i.read).length;
  return (
    <DemoShell {...demoShellProps('notification-center')} onReset={() => setItems([
      {id: '1', text: '배포 완료', read: false},
      {id: '2', text: '댓글 알림', read: false},
      {id: '3', text: '주간 리포트', read: true},
    ])}>
      <div style={{padding: '0.75rem'}} className={styles.stack}>
        <span className={styles.badge}>미확인 {unread}</span>
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            className={styles.card}
            style={{textAlign: 'left', opacity: item.read ? 0.6 : 1}}
            onClick={() => setItems((list) => list.map((x) => (x.id === item.id ? {...x, read: true} : x)))}>
            {item.text} {item.read ? '(읽음)' : '(새 알림)'}
          </button>
        ))}
      </div>
    </DemoShell>
  );
}
