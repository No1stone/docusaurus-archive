import {useState, type ReactNode} from 'react';

import CopyButton from '../components/CopyButton';
import ToolShell from '../components/ToolShell';
import styles from '../styles.module.css';

type ColorFormat = 'hex' | 'rgb' | 'hsl';

type Rgb = {r: number; g: number; b: number};
type Hsl = {h: number; s: number; l: number};

function clampByte(value: number): number {
  return Math.max(0, Math.min(255, Math.round(value)));
}

function parseHex(input: string): Rgb {
  let hex = input.trim().replace(/^#/, '');
  if (/^[\da-fA-F]{3}$/.test(hex)) {
    hex = hex
      .split('')
      .map((c) => c + c)
      .join('');
  }
  if (!/^[\da-fA-F]{6}$/.test(hex)) {
    throw new Error('HEX는 #RRGGBB 또는 #RGB 형식이어야 합니다.');
  }
  return {
    r: Number.parseInt(hex.slice(0, 2), 16),
    g: Number.parseInt(hex.slice(2, 4), 16),
    b: Number.parseInt(hex.slice(4, 6), 16),
  };
}

function rgbToHex(rgb: Rgb): string {
  const part = (n: number) => clampByte(n).toString(16).padStart(2, '0');
  return `#${part(rgb.r)}${part(rgb.g)}${part(rgb.b)}`;
}

function parseRgb(input: string): Rgb {
  const match = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i.exec(
    input.trim(),
  );
  if (!match) {
    throw new Error('RGB는 rgb(r, g, b) 형식이어야 합니다.');
  }
  const r = Number(match[1]);
  const g = Number(match[2]);
  const b = Number(match[3]);
  if ([r, g, b].some((v) => v < 0 || v > 255)) {
    throw new Error('RGB 각 값은 0~255 사이여야 합니다.');
  }
  return {r, g, b};
}

function rgbToHsl(rgb: Rgb): Hsl {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) {
    return {h: 0, s: 0, l: l * 100};
  }
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  switch (max) {
    case r:
      h = (g - b) / d + (g < b ? 6 : 0);
      break;
    case g:
      h = (b - r) / d + 2;
      break;
    default:
      h = (r - g) / d + 4;
      break;
  }
  h /= 6;
  return {h: h * 360, s: s * 100, l: l * 100};
}

function hslToRgb(hsl: Hsl): Rgb {
  const h = ((hsl.h % 360) + 360) % 360 / 360;
  const s = Math.max(0, Math.min(100, hsl.s)) / 100;
  const l = Math.max(0, Math.min(100, hsl.l)) / 100;
  if (s === 0) {
    const gray = clampByte(l * 255);
    return {r: gray, g: gray, b: gray};
  }
  const hue2rgb = (p: number, q: number, t: number): number => {
    let x = t;
    if (x < 0) x += 1;
    if (x > 1) x -= 1;
    if (x < 1 / 6) return p + (q - p) * 6 * x;
    if (x < 1 / 2) return q;
    if (x < 2 / 3) return p + (q - p) * (2 / 3 - x) * 6;
    return p;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return {
    r: clampByte(hue2rgb(p, q, h + 1 / 3) * 255),
    g: clampByte(hue2rgb(p, q, h) * 255),
    b: clampByte(hue2rgb(p, q, h - 1 / 3) * 255),
  };
}

function parseHsl(input: string): Hsl {
  const match =
    /^hsl\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)%\s*,\s*(\d+(?:\.\d+)?)%\s*\)$/i.exec(
      input.trim(),
    );
  if (!match) {
    throw new Error('HSL은 hsl(h, s%, l%) 형식이어야 합니다.');
  }
  return {h: Number(match[1]), s: Number(match[2]), l: Number(match[3])};
}

function formatRgb(rgb: Rgb): string {
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
}

function formatHsl(hsl: Hsl): string {
  const round = (n: number) => Math.round(n * 10) / 10;
  return `hsl(${round(hsl.h)}, ${round(hsl.s)}%, ${round(hsl.l)}%)`;
}

function toCanonical(format: ColorFormat, input: string): {rgb: Rgb; hex: string; rgbText: string; hslText: string} {
  let rgb: Rgb;
  if (format === 'hex') {
    rgb = parseHex(input);
  } else if (format === 'rgb') {
    rgb = parseRgb(input);
  } else {
    rgb = hslToRgb(parseHsl(input));
  }
  const hsl = rgbToHsl(rgb);
  return {
    rgb,
    hex: rgbToHex(rgb),
    rgbText: formatRgb(rgb),
    hslText: formatHsl(hsl),
  };
}

export default function ColorConverter(): ReactNode {
  const [source, setSource] = useState<ColorFormat>('hex');
  const [input, setInput] = useState('#3b82f6');
  const [hex, setHex] = useState('');
  const [rgb, setRgb] = useState('');
  const [hsl, setHsl] = useState('');
  const [error, setError] = useState('');

  return (
    <ToolShell
      title="색상 변환기"
      summary="HEX, RGB, HSL 표기를 서로 변환하고 미리봅니다."
      controls={
        <>
          <div className={styles.field}>
            <label htmlFor="color-source">입력 형식</label>
            <select
              id="color-source"
              value={source}
              onChange={(event) => setSource(event.target.value as ColorFormat)}>
              <option value="hex">HEX</option>
              <option value="rgb">RGB</option>
              <option value="hsl">HSL</option>
            </select>
          </div>
          <div className={styles.field}>
            <label htmlFor="color-input">색상 값</label>
            <input
              id="color-input"
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              spellCheck={false}
            />
          </div>
        </>
      }
      actions={
        <button
          type="button"
          className={styles.primaryButton}
          onClick={() => {
            try {
              const converted = toCanonical(source, input);
              setHex(converted.hex);
              setRgb(converted.rgbText);
              setHsl(converted.hslText);
              setError('');
            } catch (err) {
              setHex('');
              setRgb('');
              setHsl('');
              setError(err instanceof Error ? err.message : '색상을 해석하지 못했습니다.');
            }
          }}>
          변환하기
        </button>
      }
      result={
        <>
          {hex ? (
            <div
              className={styles.row}
              style={{alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem'}}>
              <div
                aria-hidden
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 8,
                  border: '1px solid var(--ifm-color-emphasis-300)',
                  background: hex,
                }}
              />
              <div className={styles.resultBox} style={{flex: 1}}>
                {hex}
                {'\n'}
                {rgb}
                {'\n'}
                {hsl}
              </div>
            </div>
          ) : (
            <div className={styles.resultBox}>변환 결과가 여기에 표시됩니다.</div>
          )}
          {error ? <p className={styles.error}>{error}</p> : null}
          {hex ? (
            <div className={styles.row} style={{marginTop: '0.75rem', gap: '0.5rem'}}>
              <CopyButton text={hex} />
              <CopyButton text={rgb} />
              <CopyButton text={hsl} />
            </div>
          ) : null}
        </>
      }
      example={
        <p>디자인 토큰이나 CSS 변수를 문서에 옮길 때 HEX와 rgb()/hsl() 표기를 맞춥니다.</p>
      }
    />
  );
}