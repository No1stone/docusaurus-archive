import {useState, type ChangeEvent, type ReactNode} from 'react';

import CopyButton from '../components/CopyButton';
import ToolShell from '../components/ToolShell';
import styles from '../styles.module.css';

export default function Base64Image(): ReactNode {
  const [base64, setBase64] = useState('');
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');

  const onFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    if (!file.type.startsWith('image/')) {
      setError('이미지 파일만 선택할 수 있습니다.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const value = typeof reader.result === 'string' ? reader.result : '';
      setBase64(value);
      setPreview(value);
      setError('');
    };
    reader.onerror = () => {
      setError('파일을 읽지 못했습니다.');
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  const applyPaste = () => {
    const trimmed = base64.trim();
    if (!trimmed) {
      setPreview('');
      setError('');
      return;
    }
    if (!/^data:image\//i.test(trimmed) && !/^[A-Za-z0-9+/=]+$/.test(trimmed.replace(/\s/g, ''))) {
      setError('유효한 data URL 또는 Base64 문자열이 아닙니다.');
      setPreview('');
      return;
    }
    const url = trimmed.startsWith('data:') ? trimmed : `data:image/png;base64,${trimmed}`;
    setPreview(url);
    setError('');
  };

  const reset = () => {
    setBase64('');
    setPreview('');
    setError('');
  };

  return (
    <ToolShell
      title="Base64 이미지"
      summary="이미지 파일을 data URL(Base64)로 바꾸거나, Base64 문자열로 미리보기합니다."
      controls={
        <>
          <div className={styles.field}>
            <label htmlFor="b64-img-file">이미지 파일</label>
            <input id="b64-img-file" type="file" accept="image/*" onChange={onFile} />
          </div>
          <div className={styles.field}>
            <label htmlFor="b64-img-text">Base64 / data URL</label>
            <textarea
              id="b64-img-text"
              value={base64}
              onChange={(event) => setBase64(event.target.value)}
              spellCheck={false}
              placeholder="data:image/png;base64,... 또는 raw Base64"
            />
          </div>
        </>
      }
      actions={
        <>
          <button type="button" className={styles.primaryButton} onClick={applyPaste}>
            미리보기
          </button>
          <button type="button" className={styles.secondaryButton} onClick={reset}>
            초기화
          </button>
        </>
      }
      result={
        <>
          {error ? <p className={styles.error}>{error}</p> : null}
          {preview ? (
            <img src={preview} alt="Base64 미리보기" style={{maxWidth: '100%', height: 'auto'}} />
          ) : (
            <p className={styles.hint}>파일을 선택하거나 문자열을 붙여 넣은 뒤 미리보기를 실행하세요.</p>
          )}
          {base64 ? (
            <div style={{marginTop: '0.75rem'}}>
              <CopyButton text={base64} />
            </div>
          ) : null}
        </>
      }
      example={
        <p>
          작은 아이콘을 CSS나 JSON에 넣을 때 data URL로 변환하는 데 쓸 수 있습니다.
          큰 파일은 문자열이 길어지므로 용도에 맞는 크기만 사용하세요.
        </p>
      }
    />
  );
}