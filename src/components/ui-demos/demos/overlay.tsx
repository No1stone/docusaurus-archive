import {useEffect, useId, useMemo, useRef, useState, type ReactNode} from 'react';

import {demoShellProps} from '../catalog';
import DemoShell from '../DemoShell';
import {CITIES, PEOPLE, wait} from '../sampleData';
import styles from '../styles.module.css';


export function ModalDemo(): ReactNode {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);
  useEffect(() => {
    if (!open) triggerRef.current?.focus();
  }, [open]);
  return (
    <DemoShell {...demoShellProps('modal')} onReset={() => setOpen(false)}>
      <div style={{padding: '0.75rem'}}>
        <button ref={triggerRef} type="button" className={styles.btnPrimary} onClick={() => setOpen(true)}>모달 열기</button>
        {open ? (
          <div className={styles.overlay} role="presentation" onClick={() => setOpen(false)}>
            <div className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="modal-title" onClick={(e) => e.stopPropagation()}>
              <h3 id="modal-title">모달 제목</h3>
              <p className={styles.hint}>본문 내용</p>
              <button type="button" className={styles.btn} onClick={() => setOpen(false)}>닫기</button>
            </div>
          </div>
        ) : null}
      </div>
    </DemoShell>
  );
}

export function ConfirmDeleteDemo(): ReactNode {
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState('');
  return (
    <DemoShell {...demoShellProps('confirm-dialog')} onReset={() => { setOpen(false); setResult(''); }}>
      <div style={{padding: '0.75rem'}} className={styles.stack}>
        <button type="button" className={styles.btn} onClick={() => setOpen(true)}>삭제</button>
        {result ? <span className={styles.hint}>{result}</span> : null}
        {open ? (
          <div className={styles.overlay} role="presentation">
            <div className={styles.dialog} role="alertdialog" aria-labelledby="del-title">
              <h3 id="del-title">정말 삭제할까요?</h3>
              <div className={styles.row}>
                <button type="button" className={styles.btn} onClick={() => { setOpen(false); setResult('취소함'); }}>취소</button>
                <button type="button" className={styles.btnPrimary} onClick={() => { setOpen(false); setResult('삭제됨 (모의)'); }}>삭제</button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </DemoShell>
  );
}

export function DrawerDemo(): ReactNode {
  const [open, setOpen] = useState(false);
  return (
    <DemoShell {...demoShellProps('drawer')} onReset={() => setOpen(false)}>
      <div style={{position: 'relative', minHeight: 220, padding: '0.75rem'}}>
        <button type="button" className={styles.btnPrimary} onClick={() => setOpen(true)}>드로어 열기</button>
        {open ? (
          <div className={styles.overlay} onClick={() => setOpen(false)}>
            <div className={styles.card} style={{position: 'absolute', right: 0, top: 0, bottom: 0, width: 240, borderRadius: 0}} onClick={(e) => e.stopPropagation()}>
              <div className={styles.stack} style={{padding: '0.75rem'}}>
                <strong>드로어</strong>
                <button type="button" className={styles.btn} onClick={() => setOpen(false)}>닫기</button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </DemoShell>
  );
}

export function BottomSheetDemo(): ReactNode {
  const [open, setOpen] = useState(false);
  return (
    <DemoShell {...demoShellProps('bottom-sheet')} onReset={() => setOpen(false)}>
      <div style={{position: 'relative', minHeight: 240, padding: '0.75rem'}}>
        <button type="button" className={styles.btnPrimary} onClick={() => setOpen(true)}>시트 열기</button>
        {open ? (
          <div className={styles.overlay} onClick={() => setOpen(false)}>
            <div className={styles.card} style={{position: 'absolute', left: 0, right: 0, bottom: 0, borderRadius: '12px 12px 0 0'}} onClick={(e) => e.stopPropagation()}>
              <div style={{padding: '0.75rem'}} className={styles.stack}>
                <strong>바텀 시트</strong>
                <button type="button" className={styles.btn} onClick={() => setOpen(false)}>닫기</button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </DemoShell>
  );
}

export function TooltipDemo(): ReactNode {
  return (
    <DemoShell {...demoShellProps('tooltip')}>
      <div style={{padding: '0.75rem'}}>
        <button type="button" className={styles.btn} title="저장 단축키: Ctrl+S">저장</button>
      </div>
    </DemoShell>
  );
}

export function PopoverDemo(): ReactNode {
  const [open, setOpen] = useState(false);
  return (
    <DemoShell {...demoShellProps('popover')} onReset={() => setOpen(false)}>
      <div style={{padding: '0.75rem', position: 'relative'}}>
        <button type="button" className={styles.btn} aria-expanded={open} onClick={() => setOpen((v) => !v)}>정보</button>
        {open ? (
          <div className={styles.card} style={{position: 'absolute', top: 48, left: 12, width: 200}} role="dialog">
            추가 설명과 링크를 담은 팝오버입니다.
          </div>
        ) : null}
      </div>
    </DemoShell>
  );
}

export function DropdownMenuDemo(): ReactNode {
  const [open, setOpen] = useState(false);
  const [picked, setPicked] = useState('');
  return (
    <DemoShell {...demoShellProps('dropdown-menu')} onReset={() => { setOpen(false); setPicked(''); }}>
      <div style={{padding: '0.75rem', position: 'relative'}}>
        <button type="button" className={styles.btn} aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((v) => !v)}>동작</button>
        {open ? (
          <div role="menu" className={styles.card} style={{position: 'absolute', top: 44, left: 12, minWidth: 140}}>
            {['복제', '공유', '삭제'].map((x) => (
              <button key={x} type="button" role="menuitem" className={styles.btnGhost} style={{display: 'block', width: '100%'}} onClick={() => { setPicked(x); setOpen(false); }}>
                {x}
              </button>
            ))}
          </div>
        ) : null}
        {picked ? <p className={styles.hint}>선택: {picked}</p> : null}
      </div>
    </DemoShell>
  );
}

export function ContextMenuDemo(): ReactNode {
  const [pos, setPos] = useState<{x: number; y: number} | null>(null);
  const [picked, setPicked] = useState('');
  return (
    <DemoShell {...demoShellProps('context-menu')} onReset={() => { setPos(null); setPicked(''); }}>
      <div
        className={styles.card}
        style={{margin: '0.75rem', minHeight: 120, position: 'relative'}}
        onContextMenu={(e) => {
          e.preventDefault();
          const rect = e.currentTarget.getBoundingClientRect();
          setPos({x: e.clientX - rect.left, y: e.clientY - rect.top});
        }}>
        여기서 우클릭
        <button type="button" className={styles.btn} style={{marginLeft: 8}} onClick={(e) => {
          const rect = (e.currentTarget.parentElement as HTMLElement).getBoundingClientRect();
          setPos({x: 40, y: 40});
        }}>메뉴 열기</button>
        {pos ? (
          <div role="menu" className={styles.card} style={{position: 'absolute', left: pos.x, top: pos.y}}>
            {['열기', '복사'].map((x) => (
              <button key={x} type="button" className={styles.btnGhost} onClick={() => { setPicked(x); setPos(null); }}>{x}</button>
            ))}
          </div>
        ) : null}
      </div>
      {picked ? <p className={styles.hint} style={{padding: '0 0.75rem'}}>선택: {picked}</p> : null}
    </DemoShell>
  );
}

export function FullscreenPreviewDemo(): ReactNode {
  const [open, setOpen] = useState(false);
  return (
    <DemoShell {...demoShellProps('fullscreen-preview')} onReset={() => setOpen(false)}>
      <div style={{padding: '0.75rem', position: 'relative', minHeight: 200}}>
        <button type="button" className={styles.btnPrimary} onClick={() => setOpen(true)}>미리보기</button>
        {open ? (
          <div className={styles.overlay} style={{background: 'var(--ifm-background-color)'}}>
            <div style={{padding: '1rem'}} className={styles.stack}>
              <strong>전체 화면 미리보기 (모의)</strong>
              <div className={styles.card} style={{minHeight: 120}}>콘텐츠</div>
              <button type="button" className={styles.btn} onClick={() => setOpen(false)}>닫기</button>
            </div>
          </div>
        ) : null}
      </div>
    </DemoShell>
  );
}
