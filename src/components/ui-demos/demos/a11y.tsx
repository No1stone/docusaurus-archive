import {useEffect, useId, useMemo, useRef, useState, type ReactNode} from 'react';

import {demoShellProps} from '../catalog';
import DemoShell from '../DemoShell';
import {CITIES, PEOPLE, wait} from '../sampleData';
import styles from '../styles.module.css';


export function KeyboardNavDemo(): ReactNode {
  return (
    <DemoShell {...demoShellProps('keyboard-nav')}>
      <div style={{padding: '0.75rem'}} className={styles.row}>
        <button type="button" className={styles.btn}>하나</button>
        <button type="button" className={styles.btn}>둘</button>
        <a href="#kb">링크</a>
        <input className={styles.input} placeholder="입력" aria-label="샘플 입력" />
      </div>
    </DemoShell>
  );
}

export function FocusRingDemo(): ReactNode {
  return (
    <DemoShell {...demoShellProps('focus-order')}>
      <div style={{padding: '0.75rem'}} className={styles.stack}>
        <button type="button" className={styles.btn}>1</button>
        <button type="button" className={styles.btn}>2</button>
        <button type="button" className={styles.btn}>3</button>
      </div>
    </DemoShell>
  );
}

export function ModalFocusTrapDemo(): ReactNode {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const firstRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (open) firstRef.current?.focus();
    else if (triggerRef.current) triggerRef.current.focus();
  }, [open]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);
  return (
    <DemoShell {...demoShellProps('modal-focus-trap')} onReset={() => setOpen(false)}>
      <div style={{padding: '0.75rem'}}>
        <button ref={triggerRef} type="button" className={styles.btnPrimary} onClick={() => setOpen(true)}>열기</button>
        {open ? (
          <div className={styles.overlay}>
            <div className={styles.dialog} role="dialog" aria-modal="true">
              <button ref={firstRef} type="button" className={styles.btn}>첫 포커스</button>
              <button type="button" className={styles.btn}>둘째</button>
              <button type="button" className={styles.btn} onClick={() => setOpen(false)}>닫기</button>
            </div>
          </div>
        ) : null}
      </div>
    </DemoShell>
  );
}

export function ScreenReaderDemo(): ReactNode {
  const [on, setOn] = useState(false);
  return (
    <DemoShell {...demoShellProps('sr-announcement')} onReset={() => setOn(false)}>
      <div style={{padding: '0.75rem'}} className={styles.stack}>
        <button type="button" className={styles.btn} aria-label="알림 설정" aria-pressed={on} onClick={() => setOn((v) => !v)}>
          벨 아이콘
        </button>
        <div aria-live="polite">{on ? '알림이 켜졌습니다' : '알림이 꺼졌습니다'}</div>
      </div>
    </DemoShell>
  );
}

export function ColorContrastDemo(): ReactNode {
  return (
    <DemoShell {...demoShellProps('contrast-status')}>
      <div style={{padding: '0.75rem'}} className={styles.stack}>
        <span className={styles.ok}>✓ 성공</span>
        <span className={styles.danger}>! 오류</span>
        <span className={styles.hint}>i 정보</span>
      </div>
    </DemoShell>
  );
}

export function TextZoomDemo(): ReactNode {
  const [scale, setScale] = useState(1);
  return (
    <DemoShell {...demoShellProps('text-zoom')} controls={<input type="range" min={1} max={1.6} step={0.1} value={scale} onChange={(e) => setScale(Number(e.target.value))} />} onReset={() => setScale(1)}>
      <div style={{padding: '0.75rem', fontSize: `${scale}rem`}} className={styles.stack}>
        <p>본문 텍스트가 확대됩니다.</p>
        <button type="button" className={styles.btn}>버튼</button>
      </div>
    </DemoShell>
  );
}

export function ColorModeDemo(): ReactNode {
  const [dark, setDark] = useState(false);
  return (
    <DemoShell {...demoShellProps('color-mode')} controls={
        <label>
          <input type="checkbox" checked={dark} onChange={(e) => setDark(e.target.checked)} /> 다크
        </label>
      }
      onReset={() => setDark(false)}>
      <div
        style={{
          padding: '0.75rem',
          background: dark ? '#111827' : '#f8fafc',
          color: dark ? '#f8fafc' : '#111827',
          minHeight: 120,
        }}>
        <div className={styles.card} style={{background: dark ? '#1f2937' : '#fff', color: 'inherit', borderColor: dark ? '#374151' : undefined}}>
          {dark ? '다크 미리보기' : '라이트 미리보기'}
        </div>
      </div>
    </DemoShell>
  );
}

export function TouchTargetDemo(): ReactNode {
  const [count, setCount] = useState(0);
  return (
    <DemoShell {...demoShellProps('touch-target')} onReset={() => setCount(0)}>
      <div style={{padding: '0.75rem'}}>
        <button type="button" className={styles.btnPrimary} style={{minWidth: 44, minHeight: 44}} onClick={() => setCount((c) => c + 1)}>
          탭 ({count})
        </button>
      </div>
    </DemoShell>
  );
}

export function LandscapeDemo(): ReactNode {
  const [wide, setWide] = useState(true);
  return (
    <DemoShell {...demoShellProps('landscape')} controls={<label><input type="checkbox" checked={wide} onChange={(e) => setWide(e.target.checked)} /> 가로형 폭</label>} onReset={() => setWide(true)}>
      <div style={{padding: '0.75rem', maxWidth: wide ? '100%' : 280}}>
        <div className={styles.row} style={{flexWrap: wide ? 'nowrap' : 'wrap'}}>
          <div className={styles.card} style={{flex: 1}}>주 패널</div>
          <div className={styles.card} style={{flex: 1}}>보조 패널</div>
        </div>
      </div>
    </DemoShell>
  );
}

export function LongTranslationDemo(): ReactNode {
  return (
    <DemoShell {...demoShellProps('long-i18n')}>
      <div style={{padding: '0.75rem', maxWidth: 280}} className={styles.stack}>
        <button type="button" className={styles.btnPrimary} style={{whiteSpace: 'normal', height: 'auto'}}>
          이 작업은 되돌릴 수 없으며 관련된 모든 하위 항목에도 영향을 줍니다
        </button>
        <div className={styles.card}>
          SehrLangeSchaltflächenbeschriftungOhneLeerzeichenKannUmbrechenOderÜberlaufen
        </div>
      </div>
    </DemoShell>
  );
}
