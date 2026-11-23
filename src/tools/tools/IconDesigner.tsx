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

function buildIconSvg(size: number, bg: string, fg: string, content: string): string {
  const s = Math.max(16, Math.min(512, size));
  const text = escapeXml(content || '★');
  const fontSize = Math.floor(s * 0.45);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
  <rect width="${s}" height="${s}" rx="${Math.floor(s * 0.18)}" fill="${bg}"/>
  <text x="50%" y="52%" dominant-baseline="middle" text-anchor="middle" fill="${fg}" font-size="${fontSize}" font-family="system-ui,sans-serif">${text}</text>
</svg>`;
}

export default function IconDesigner(): ReactNode {
  const [content, setContent] = useState('🗂️');
  const [bg, setBg] = useState('#2563eb');
  const [fg, setFg] = useState('#ffffff');
  const [size, setSize] = useState(128);
  const [pngUrl, setPngUrl] = useState('');
  const svg = useMemo(() => buildIconSvg(size, bg, fg, content), [size, bg, fg, content]);

  const exportPng = () => {
    const blob = new Blob([svg], {type: 'image/svg+xml;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, size, size);
        setPngUrl(canvas.toDataURL('image/png'));
      }
      URL.revokeObjectURL(url);
    };
    img.onerror = () => URL.revokeObjectURL(url);
    img.src = url;
  };

  const reset = () => {
    setContent('🗂️');
    setBg('#2563eb');
    setFg('#ffffff');
    setSize(128);
    setPngUrl('');
  };

  return (
    <ToolShell
      title="아이콘 디자이너 (간단)"
      summary="이모지나 한 글자로 모서리 둥근 사각 아이콘 SVG를 만듭니다. PNG 내보내기를 지원합니다."
      controls={
        <>
          <div className={styles.field}>
            <label htmlFor="icon-text">문자 / 이모지</label>
            <input id="icon-text" type="text" value={content} onChange={(e) => setContent(e.target.value)} maxLength={4} />
          </div>
          <div className={styles.field}>
            <label htmlFor="icon-size">크기 (px)</label>
            <input id="icon-size" type="number" min={16} max={512} value={size} onChange={(e) => setSize(Number(e.target.value))} />
          </div>
          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="icon-bg">배경색</label>
              <input id="icon-bg" type="color" value={bg} onChange={(e) => setBg(e.target.value)} />
            </div>
            <div className={styles.field}>
              <label htmlFor="icon-fg">글자색</label>
              <input id="icon-fg" type="color" value={fg} onChange={(e) => setFg(e.target.value)} />
            </div>
          </div>
        </>
      }
      actions={
        <>
          <button type="button" className={styles.primaryButton} onClick={exportPng}>
            PNG 미리보기
          </button>
          <button type="button" className={styles.secondaryButton} onClick={reset}>
            초기화
          </button>
        </>
      }
      result={
        <>
          <div
            className={styles.resultBox}
            dangerouslySetInnerHTML={{__html: svg}}
            style={{display: 'inline-block'}}
          />
          {pngUrl ? (
            <img src={pngUrl} alt="PNG 미리보기" width={size} height={size} style={{display: 'block', marginTop: '0.75rem'}} />
          ) : null}
          <textarea readOnly value={svg} spellCheck={false} style={{marginTop: '0.75rem', width: '100%', minHeight: '5rem'}} />
          <div style={{marginTop: '0.75rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap'}}>
            <CopyButton text={svg} label="SVG 복사" />
            {pngUrl ? (
              <a href={pngUrl} download="icon.png" className={styles.secondaryButton}>
                PNG 다운로드
              </a>
            ) : null}
          </div>
        </>
      }
      example={
        <p>
          PWA manifest나 사이드 프로젝트용 임시 앱 아이콘을 빠르게 만들 때 사용합니다.
          전문 벡터 편집기를 대체하지는 않습니다.
        </p>
      }
    />
  );
}