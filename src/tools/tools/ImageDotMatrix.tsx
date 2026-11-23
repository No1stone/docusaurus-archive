import {useRef, useState, type ChangeEvent, type ReactNode} from 'react';

import ToolShell from '../components/ToolShell';
import styles from '../styles.module.css';

type Mode = 'image' | 'text';

function drawDotMatrix(
  source: CanvasImageSource | null,
  text: string,
  mode: Mode,
  cell: number,
  cols: number,
  rows: number,
): string {
  const sample = document.createElement('canvas');
  sample.width = cols;
  sample.height = rows;
  const sctx = sample.getContext('2d');
  if (!sctx) {
    return '';
  }
  sctx.fillStyle = '#ffffff';
  sctx.fillRect(0, 0, cols, rows);

  if (mode === 'image' && source) {
    sctx.drawImage(source, 0, 0, cols, rows);
  } else {
    sctx.fillStyle = '#000000';
    sctx.font = `bold ${Math.floor(rows * 0.7)}px system-ui,sans-serif`;
    sctx.textAlign = 'center';
    sctx.textBaseline = 'middle';
    sctx.fillText(text.slice(0, 40) || 'Aa', cols / 2, rows / 2);
  }

  const out = document.createElement('canvas');
  out.width = cols * cell;
  out.height = rows * cell;
  const octx = out.getContext('2d');
  if (!octx) {
    return '';
  }
  const data = sctx.getImageData(0, 0, cols, rows).data;
  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) {
      const i = (y * cols + x) * 4;
      const r = data[i] ?? 0;
      const g = data[i + 1] ?? 0;
      const b = data[i + 2] ?? 0;
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;
      octx.fillStyle = lum < 140 ? '#111111' : '#dddddd';
      octx.fillRect(x * cell, y * cell, cell, cell);
    }
  }
  return out.toDataURL('image/png');
}

export default function ImageDotMatrix(): ReactNode {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [mode, setMode] = useState<Mode>('text');
  const [text, setText] = useState('DOT');
  const [cell, setCell] = useState(8);
  const [cols, setCols] = useState(48);
  const [rows, setRows] = useState(24);
  const [hasImage, setHasImage] = useState(false);
  const [png, setPng] = useState('');
  const [error, setError] = useState('');

  const onFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      setHasImage(true);
      setMode('image');
      setError('');
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      setError('이미지를 불러오지 못했습니다.');
      URL.revokeObjectURL(url);
    };
    img.src = url;
    event.target.value = '';
  };

  const render = () => {
    try {
      const c = Math.max(2, Math.min(32, cell));
      const w = Math.max(8, Math.min(128, cols));
      const h = Math.max(8, Math.min(128, rows));
      if (mode === 'image' && !imgRef.current) {
        setError('이미지를 먼저 업로드하세요.');
        setPng('');
        return;
      }
      const url = drawDotMatrix(
        mode === 'image' ? imgRef.current : null,
        text,
        mode,
        c,
        w,
        h,
      );
      setPng(url);
      setError('');
    } catch {
      setError('도트 행렬을 만들지 못했습니다.');
      setPng('');
    }
  };

  const reset = () => {
    imgRef.current = null;
    setHasImage(false);
    setText('DOT');
    setCell(8);
    setCols(48);
    setRows(24);
    setPng('');
    setError('');
    setMode('text');
  };

  return (
    <ToolShell
      title="이미지 도트 행렬"
      summary="이미지나 짧은 글자를 단순 도트 패턴으로 바꿉니다. PNG로 저장할 수 있습니다."
      controls={
        <>
          <div className={styles.row}>
            <label className={styles.check}>
              <input
                type="radio"
                name="dot-mode"
                checked={mode === 'text'}
                onChange={() => setMode('text')}
              />
              텍스트
            </label>
            <label className={styles.check}>
              <input
                type="radio"
                name="dot-mode"
                checked={mode === 'image'}
                onChange={() => setMode('image')}
                disabled={!hasImage}
              />
              이미지
            </label>
          </div>
          <div className={styles.field}>
            <label htmlFor="dot-file">이미지 업로드 (선택)</label>
            <input id="dot-file" type="file" accept="image/*" onChange={onFile} />
          </div>
          {mode === 'text' ? (
            <div className={styles.field}>
              <label htmlFor="dot-text">텍스트</label>
              <input id="dot-text" type="text" value={text} onChange={(e) => setText(e.target.value)} />
            </div>
          ) : null}
          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="dot-cell">도트 크기 (px)</label>
              <input id="dot-cell" type="number" min={2} max={32} value={cell} onChange={(e) => setCell(Number(e.target.value))} />
            </div>
            <div className={styles.field}>
              <label htmlFor="dot-cols">가로 칸</label>
              <input id="dot-cols" type="number" min={8} max={128} value={cols} onChange={(e) => setCols(Number(e.target.value))} />
            </div>
            <div className={styles.field}>
              <label htmlFor="dot-rows">세로 칸</label>
              <input id="dot-rows" type="number" min={8} max={128} value={rows} onChange={(e) => setRows(Number(e.target.value))} />
            </div>
          </div>
        </>
      }
      actions={
        <>
          <button type="button" className={styles.primaryButton} onClick={render}>
            렌더
          </button>
          <button type="button" className={styles.secondaryButton} onClick={reset}>
            초기화
          </button>
        </>
      }
      result={
        <>
          {error ? <p className={styles.error}>{error}</p> : null}
          {png ? (
            <div>
              <img src={png} alt="도트 행렬" style={{maxWidth: '100%', imageRendering: 'pixelated'}} />
              <div style={{marginTop: '0.75rem'}}>
                <a href={png} download="dot-matrix.png" className={styles.secondaryButton}>
                  PNG 다운로드
                </a>
              </div>
            </div>
          ) : (
            <p className={styles.hint}>렌더를 실행하면 미리보기가 표시됩니다.</p>
          )}
        </>
      }
      example={
        <p>로고 아이디어 스케치나 LED 패널 느낌의 단순 미리보기용입니다. 색은 흑백 두 단계만 사용합니다.</p>
      }
    />
  );
}