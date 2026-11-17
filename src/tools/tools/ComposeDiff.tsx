import {useState, type ReactNode} from 'react';

import CopyButton from '../components/CopyButton';
import ToolShell from '../components/ToolShell';
import {
  compareComposeYaml,
  formatComposeDiffReport,
  type ComposeDiffLine,
} from '../utils/composeDiff';
import styles from '../styles.module.css';

const SAMPLE_A = `services:
  web:
    image: nginx:1.24
    ports:
      - "8080:80"
    environment:
      - APP_ENV=dev
      - DB_URL=\${DATABASE_URL}
    volumes:
      - ./html:/usr/share/nginx/html
    networks:
      - front
networks:
  front: {}
`;

const SAMPLE_B = `services:
  web:
    image: nginx:1.25
    ports:
      - "8080:80"
      - "8443:443"
    environment:
      APP_ENV: staging
      DB_URL: \${DATABASE_URL}
      FEATURE_X: "1"
    volumes:
      - ./html:/usr/share/nginx/html
    networks:
      - front
      - back
  worker:
    image: myapp:2.0
    environment:
      - WORKER=1
networks:
  front: {}
  back: {}
`;

function kindLabel(kind: ComposeDiffLine['kind']): string {
  switch (kind) {
    case 'added':
      return '추가';
    case 'removed':
      return '삭제';
    case 'changed':
      return '변경';
    default:
      return kind;
  }
}

export default function ComposeDiff(): ReactNode {
  const [leftText, setLeftText] = useState(SAMPLE_A);
  const [rightText, setRightText] = useState(SAMPLE_B);
  const [lines, setLines] = useState<ComposeDiffLine[]>([]);
  const [report, setReport] = useState('');
  const [error, setError] = useState('');

  const compare = () => {
    const {lines: next, error: parseError} = compareComposeYaml(leftText, rightText);
    if (parseError) {
      setLines([]);
      setReport('');
      setError(parseError);
      return;
    }
    setLines(next);
    setReport(formatComposeDiffReport(next));
    setError('');
  };

  const reset = () => {
    setLeftText(SAMPLE_A);
    setRightText(SAMPLE_B);
    setLines([]);
    setReport('');
    setError('');
  };

  return (
    <ToolShell
      title="Compose 설정 비교기"
      summary="두 Docker Compose YAML의 서비스·이미지·포트·볼륨·네트워크·환경 변수를 의미 기준으로 비교합니다. 키 순서나 들여쓰기만 다른 경우는 차이로 잡지 않습니다."
      controls={
        <div className={styles.split}>
          <div className={styles.field}>
            <label htmlFor="compose-diff-a">Compose A</label>
            <textarea
              id="compose-diff-a"
              value={leftText}
              onChange={(e) => setLeftText(e.target.value)}
              spellCheck={false}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="compose-diff-b">Compose B</label>
            <textarea
              id="compose-diff-b"
              value={rightText}
              onChange={(e) => setRightText(e.target.value)}
              spellCheck={false}
            />
          </div>
        </div>
      }
      actions={
        <>
          <button type="button" className={styles.primaryButton} onClick={compare}>
            비교
          </button>
          <button type="button" className={styles.secondaryButton} onClick={reset}>
            초기화
          </button>
        </>
      }
      result={
        <>
          {error ? <p className={styles.error}>{error}</p> : null}
          {!report && !error ? (
            <p className={styles.hint}>비교를 실행하면 차이 목록이 표시됩니다.</p>
          ) : null}
          {report.startsWith('차이 없음') ? <p className={styles.hint}>{report}</p> : null}
          {lines.length > 0 ? (
            <ul style={{paddingLeft: '1.25rem'}}>
              {lines.map((line, index) => (
                <li key={`${line.path}-${index}`}>
                  <strong>[{kindLabel(line.kind)}]</strong> {line.path}
                  {line.left !== undefined ? <div>A: {line.left}</div> : null}
                  {line.right !== undefined ? <div>B: {line.right}</div> : null}
                </li>
              ))}
            </ul>
          ) : null}
          {report ? (
            <>
              <textarea
                readOnly
                value={report}
                spellCheck={false}
                style={{marginTop: '0.75rem', width: '100%', minHeight: '8rem'}}
              />
              <div style={{marginTop: '0.75rem'}}>
                <CopyButton text={report} label="리포트 복사" />
              </div>
            </>
          ) : null}
        </>
      }
      example={
        <p>
          배포 전후 compose.yaml, Git 브랜치 간 스택 정의를 대조할 때 사용합니다. 환경 변수는 키와{' '}
          <code>${'${VAR}'}</code> 참조 기준으로 비교합니다.
        </p>
      }
    />
  );
}