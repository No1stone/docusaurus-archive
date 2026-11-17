import {useEffect, useId, useMemo, useRef, useState, type ReactNode} from 'react';

import {demoShellProps} from '../catalog';
import DemoShell from '../DemoShell';
import {CITIES, PEOPLE, wait} from '../sampleData';
import styles from '../styles.module.css';


export function FileDropDemo(): ReactNode {
  const [files, setFiles] = useState<string[]>([]);
  const [over, setOver] = useState(false);
  return (
    <DemoShell {...demoShellProps('file-drop')} onReset={() => { setFiles([]); setOver(false); }}>
      <div style={{padding: '0.75rem'}} className={styles.stack}>
        <div>
          <span className={styles.elementLabel}>파일 선택 (File Picker)</span>
          <input
            type="file"
            multiple
            aria-label="파일 선택"
            onChange={(e) => setFiles(Array.from(e.target.files ?? []).map((f) => f.name))}
          />
        </div>
        <div>
          <span className={styles.elementLabel}>드롭존 (Drop Zone)</span>
          <div
            className={styles.card}
            style={{borderStyle: 'dashed', background: over ? 'var(--ifm-color-emphasis-100)' : undefined, minHeight: 88}}
            onDragOver={(e) => { e.preventDefault(); setOver(true); }}
            onDragLeave={() => setOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setOver(false);
              setFiles(Array.from(e.dataTransfer.files).map((f) => f.name));
            }}>
            파일을 여기로 드래그 앤 드롭
          </div>
        </div>
        <p className={styles.hint}>
          진행률 표시는{' '}
          <a href="/docs/knowledge/frontend/ui-ux-elements/upload-progress">업로드 프로그레스</a>
          {' '}·{' '}
          <a href="/docs/knowledge/frontend/ui-ux-elements/progress">프로그레스 바</a>
          를 봅니다.
        </p>
        <ul>{files.map((f) => <li key={f}>{f}</li>)}</ul>
      </div>
    </DemoShell>
  );
}

export function FileValidateDemo(): ReactNode {
  const [msg, setMsg] = useState('');
  return (
    <DemoShell {...demoShellProps('file-validation')} onReset={() => setMsg('')}>
      <div style={{padding: '0.75rem'}} className={styles.stack}>
        <input
          type="file"
          accept="image/png,image/jpeg"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            if (!['image/png', 'image/jpeg'].includes(file.type)) {
              setMsg('형식이 올바르지 않습니다.');
              return;
            }
            if (file.size > 1024 * 1024) {
              setMsg('용량이 1MB를 초과합니다.');
              return;
            }
            setMsg(`통과: ${file.name}`);
          }}
        />
        {msg ? <span className={msg.startsWith('통과') ? styles.ok : styles.danger}>{msg}</span> : null}
      </div>
    </DemoShell>
  );
}

export function UploadProgressDemo(): ReactNode {
  const [progress, setProgress] = useState(0);
  const [state, setState] = useState<'idle' | 'uploading' | 'done' | 'error' | 'canceled'>('idle');
  const timer = useRef<number | null>(null);
  const stop = () => {
    if (timer.current) window.clearInterval(timer.current);
    timer.current = null;
  };
  const start = (fail = false) => {
    stop();
    setProgress(0);
    setState('uploading');
    timer.current = window.setInterval(() => {
      setProgress((p) => {
        const next = p + 10;
        if (next >= 100) {
          stop();
          setState(fail ? 'error' : 'done');
          return 100;
        }
        return next;
      });
    }, 200);
  };
  return (
    <DemoShell {...demoShellProps('upload-progress')} onReset={() => { stop(); setProgress(0); setState('idle'); }}>
      <div style={{padding: '0.75rem'}} className={styles.stack}>
        <div>
          <span className={styles.elementLabel}>프로그레스 바 (Progress Bar)</span>
          <div className={styles.progress} role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
            <span style={{width: `${progress}%`}} />
          </div>
          <span className={styles.hint}>{progress}%</span>
        </div>
        <span className={styles.elementLabel}>버튼 (Button) — 업로드 · 취소 · 재시도</span>
        <span className={styles.hint}>상태: {state}</span>
        <div className={styles.row}>
          <button type="button" className={styles.btnPrimary} disabled={state === 'uploading'} onClick={() => start(false)}>업로드</button>
          <button type="button" className={styles.btn} disabled={state === 'uploading'} onClick={() => start(true)}>실패 시나리오</button>
          <button type="button" className={styles.btn} disabled={state !== 'uploading'} onClick={() => { stop(); setState('canceled'); }}>취소</button>
          <button type="button" className={styles.btn} disabled={state !== 'error' && state !== 'canceled'} onClick={() => start(false)}>재시도</button>
        </div>
        <p className={styles.hint}>
          단독 프로그레스 바: <a href="/docs/knowledge/frontend/ui-ux-elements/progress">프로그레스 바</a>
        </p>
      </div>
    </DemoShell>
  );
}

export function AttachmentListDemo(): ReactNode {
  const files = ['스펙.pdf', '화면.png'];
  const [msg, setMsg] = useState('');
  return (
    <DemoShell {...demoShellProps('attachment-list')} onReset={() => setMsg('')}>
      <ul style={{padding: '0.75rem', listStyle: 'none'}} className={styles.stack}>
        {files.map((f) => (
          <li key={f} className={styles.row} style={{justifyContent: 'space-between'}}>
            <span>{f}</span>
            <button type="button" className={styles.btn} onClick={() => setMsg(`${f} 다운로드 (모의)`)}>다운로드</button>
          </li>
        ))}
      </ul>
      {msg ? <p className={styles.hint} style={{padding: '0 0.75rem'}}>{msg}</p> : null}
    </DemoShell>
  );
}

export function ImagePreviewDemo(): ReactNode {
  const [zoom, setZoom] = useState(false);
  return (
    <DemoShell {...demoShellProps('image-zoom')} onReset={() => setZoom(false)}>
      <div style={{padding: '0.75rem'}}>
        <button type="button" className={styles.btnGhost} onClick={() => setZoom(true)} aria-label="이미지 확대">
          <div style={{width: 160, height: 100, background: 'linear-gradient(135deg,#8ab,#def)'}} />
        </button>
        {zoom ? (
          <div className={styles.overlay} onClick={() => setZoom(false)}>
            <div style={{width: '70%', height: '50%', background: 'linear-gradient(135deg,#8ab,#def)'}} />
          </div>
        ) : null}
      </div>
    </DemoShell>
  );
}

export function GalleryDemo(): ReactNode {
  const [active, setActive] = useState(0);
  const colors = ['#8ab', '#b8a', '#ab8', '#88b'];
  return (
    <DemoShell {...demoShellProps('gallery')} onReset={() => setActive(0)}>
      <div style={{padding: '0.75rem'}} className={styles.stack}>
        <div style={{height: 140, background: colors[active]}} />
        <div className={styles.row}>
          {colors.map((c, i) => (
            <button key={c} type="button" className={styles.btnGhost} aria-label={`이미지 ${i + 1}`} onClick={() => setActive(i)}>
              <span style={{display: 'block', width: 48, height: 32, background: c}} />
            </button>
          ))}
        </div>
      </div>
    </DemoShell>
  );
}

export function CarouselDemo(): ReactNode {
  const slides = ['슬라이드 1', '슬라이드 2', '슬라이드 3'];
  const [i, setI] = useState(0);
  return (
    <DemoShell {...demoShellProps('carousel')} onReset={() => setI(0)}>
      <div style={{padding: '0.75rem'}} className={styles.stack}>
        <div className={styles.card} style={{minHeight: 100, display: 'grid', placeItems: 'center'}}>{slides[i]}</div>
        <div className={styles.row}>
          <button type="button" className={styles.btn} onClick={() => setI((x) => (x + slides.length - 1) % slides.length)}>이전</button>
          <span className={styles.hint}>{i + 1}/{slides.length}</span>
          <button type="button" className={styles.btn} onClick={() => setI((x) => (x + 1) % slides.length)}>다음</button>
        </div>
      </div>
    </DemoShell>
  );
}
