import {useState, type ReactNode} from 'react';
import yaml from 'js-yaml';

import CopyButton from '../components/CopyButton';
import ToolShell from '../components/ToolShell';
import styles from '../styles.module.css';

const EXAMPLE = `name: origemite
active: true
tags:
  - docs
  - tools`;

export default function JsonYaml(): ReactNode {
  const [direction, setDirection] = useState<'jsonToYaml' | 'yamlToJson'>('yamlToJson');
  const [input, setInput] = useState(EXAMPLE);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  return (
    <ToolShell
      title="JSON ↔ YAML"
      summary="JSON과 YAML 문서를 서로 변환합니다."
      controls={
        <>
          <div className={styles.row}>
            <label className={styles.check}>
              <input
                type="radio"
                name="json-yaml-dir"
                checked={direction === 'jsonToYaml'}
                onChange={() => setDirection('jsonToYaml')}
              />
              JSON → YAML
            </label>
            <label className={styles.check}>
              <input
                type="radio"
                name="json-yaml-dir"
                checked={direction === 'yamlToJson'}
                onChange={() => setDirection('yamlToJson')}
              />
              YAML → JSON
            </label>
          </div>
          <div className={styles.field}>
            <label htmlFor="json-yaml-input">입력</label>
            <textarea
              id="json-yaml-input"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              spellCheck={false}
            />
          </div>
        </>
      }
      actions={
        <>
          <button
            type="button"
            className={styles.primaryButton}
            onClick={() => {
              try {
                if (direction === 'jsonToYaml') {
                  const parsed = JSON.parse(input) as unknown;
                  setResult(yaml.dump(parsed, {lineWidth: -1, noRefs: true}));
                } else {
                  const parsed = yaml.load(input) as unknown;
                  setResult(JSON.stringify(parsed, null, 2));
                }
                setError('');
              } catch (err) {
                setResult('');
                setError(err instanceof Error ? err.message : '변환에 실패했습니다.');
              }
            }}>
            변환하기
          </button>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={() => {
              setDirection('yamlToJson');
              setInput(EXAMPLE);
              setResult('');
              setError('');
            }}>
            초기화
          </button>
        </>
      }
      result={
        <>
          <div className={styles.resultBox}>{result || '변환 결과가 여기에 표시됩니다.'}</div>
          {error ? <p className={styles.error}>{error}</p> : null}
          <div style={{marginTop: '0.75rem'}}>
            <CopyButton text={result} />
          </div>
        </>
      }
      example={
        <p>
          Kubernetes 매니페스트나 CI 설정을 JSON과 YAML 사이에서 옮길 때 사용합니다. 초기 예시는 YAML
          → JSON 방향입니다.
        </p>
      }
    />
  );
}