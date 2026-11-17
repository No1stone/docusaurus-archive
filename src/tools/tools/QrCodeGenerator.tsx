import {useCallback, useState, type ReactNode} from 'react';
import QRCode from 'qrcode';

import CopyButton from '../components/CopyButton';
import ToolShell from '../components/ToolShell';
import styles from '../styles.module.css';

export default function QrCodeGenerator(): ReactNode {
  const [text, setText] = useState('https://origemite.com');
  const [size, setSize] = useState(256);
  const [dataUrl, setDataUrl] = useState('');
  const [error, setError] = useState('');

  const generate = useCallback(async () => {
    const trimmed = text.trim();
    if (!trimmed) {
      setError('QR로 만들 내용을 입력하세요.');
      setDataUrl('');
      return;
    }
    const width = Number.isFinite(size) ? Math.max(64, Math.min(1024, size)) : 256;
    try {
      const url = await QRCode.toDataURL(trimmed, {
        width,
        margin: 2,
        errorCorrectionLevel: 'M',
      });
      setDataUrl(url);
      setError('');
    } catch (err) {
      setDataUrl('');
      setError(err instanceof Error ? err.message : 'QR 생성에 실패했습니다.');
    }
  }, [text, size]);

  const reset = () => {
    setText('');
    setSize(256);
    setDataUrl('');
    setError('');
  };

  return (
    <ToolShell
      title="QR 코드 생성기"
      summary="텍스트나 URL을 입력하면 QR 코드 이미지를 만듭니다. 브라우저에서만 처리됩니다."
      controls={
        <>
          <div className={styles.field}>
            <label htmlFor="qr-text">내용</label>
            <textarea
              id="qr-text"
              value={text}
              onChange={(event) => setText(event.target.value)}
              spellCheck={false}
              placeholder="URL, 문장, 연락처 등"
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="qr-size">이미지 크기 (px)</label>
            <input
              id="qr-size"
              type="number"
              min={64}
              max={1024}
              value={size}
              onChange={(event) => setSize(Number(event.target.value))}
            />
          </div>
        </>
      }
      actions={
        <>
          <button type="button" className={styles.primaryButton} onClick={() => void generate()}>
            QR 생성
          </button>
          <button type="button" className={styles.secondaryButton} onClick={reset}>
            초기화
          </button>
        </>
      }
      result={
        <>
          {error ? <p className={styles.error}>{error}</p> : null}
          {dataUrl ? (
            <div>
              <img src={dataUrl} alt="생성된 QR 코드" width={size} height={size} />
              <div style={{marginTop: '0.75rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap'}}>
                <a href={dataUrl} download="qrcode.png" className={styles.secondaryButton}>
                  PNG 다운로드
                </a>
                <CopyButton text={text} label="원문 복사" />
              </div>
            </div>
          ) : (
            <p className={styles.hint}>생성 버튼을 누르면 미리보기가 표시됩니다.</p>
          )}
        </>
      }
      example={
        <p>
          프로모션 URL이나 Wi-Fi 접속 문자열을 QR로 만들 수 있습니다.
          용량이 큰 데이터는 QR에 넣기 어려우니 짧은 텍스트를 권장합니다.
        </p>
      }
    />
  );
}