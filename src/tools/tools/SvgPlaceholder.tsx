import {useMemo, useState, type ReactNode} from 'react';

import CopyButton from '../components/CopyButton';
import ToolShell from '../components/ToolShell';
import styles from '../styles.module.css';

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildSvg(width: number, height: number, bg: string, fg: string, label: string): string {
  const w = Math.max(1, Math.min(4000, width));
  const h = Math.max(1, Math.min(4000, height));
  const text = escapeXml(label);
  const fontSize = Math.max(10, Math.min(w, h) / 8);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="100%" height="100%" fill="${bg}"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="${fg}" font-family="system-ui,sans-serif" font-size="${fontSize}">${text}</text>
</svg>`;
}

export default function SvgPlaceholder(): ReactNode {
  const [width, setWidth] = useState(400);
  const [height, setHeight] = useState(300);
  const [bg, setBg] = useState('#e2e8f0');
  const [fg, setFg] = useState('#475569');
  const [label, setLabel] = useState('400 × 300');

  const svg = useMemo(
    () => buildSvg(width, height, bg, fg, label),
    [width, height, bg, fg, label],
  );

  const reset = () => {
    setWidth(400);
    setHeight(300);
    setBg('#e2e8f0');
    setFg('#475569');
    setLabel('400 × 300');
  };

  return (
    <ToolShell
      title="SVG 플레이스홀더"
      summary="가로·세로와 색, 문구로 간단한 SVG 더미 이미지 마크업을 만듭니다."
      controls={
        <>
          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="svg-w">너비 (px)</label>
              <input
                id="svg-w"
                type="number"
                min={1}
                max={4000}
                value={width}
                onChange={(event) => setWidth(Number(event.target.value))}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="svg-h">높이 (px)</label>
              <input
                id="svg-h"
                type="number"
                min={1}
                max={4000}
                value={height}
                onChange={(event) => setHeight(Number(event.target.value))}
              />
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="svg-bg">배경색</label>
              <input id="svg-bg" type="color" value={bg} onChange={(event) => setBg(event.target.value)} />
            </div>
            <div className={styles.field}>
              <label htmlFor="svg-fg">글자색</label>
              <input id="svg-fg" type="color" value={fg} onChange={(event) => setFg(event.target.value)} />
            </div>
          </div>
          <div className={styles.field}>
            <label htmlFor="svg-label">표시 문구</label>
            <input
              id="svg-label"
              type="text"
              value={label}
              onChange={(event) => setLabel(event.target.value)}
            />
          </div>
        </>
      }
      actions={
        <button type="button" className={styles.secondaryButton} onClick={reset}>
          초기화
        </button>
      }
      result={
        <>
          <div
            className={styles.resultBox}
            dangerouslySetInnerHTML={{__html: svg}}
            style={{maxWidth: '100%', overflow: 'auto'}}
          />
          <textarea readOnly value={svg} spellCheck={false} style={{marginTop: '0.75rem', width: '100%', minHeight: '6rem'}} />
          <div style={{marginTop: '0.75rem'}}>
            <CopyButton text={svg} />
          </div>
        </>
      }
      example={
        <p>
          목업이나 스토리북에서 크기 표시용 플레이스홀더 SVG가 필요할 때 사용합니다.
          결과 마크업을 그대로 HTML이나 디자인 도구에 붙여 넣을 수 있습니다.
        </p>
      }
    />
  );
}