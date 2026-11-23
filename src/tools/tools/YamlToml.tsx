import {useState, type ReactNode} from 'react';
import yaml from 'js-yaml';
import {parse as parseToml, stringify as stringifyToml} from 'smol-toml';

import CopyButton from '../components/CopyButton';
import ToolShell from '../components/ToolShell';
import styles from '../styles.module.css';

export default function YamlToml(): ReactNode {
  const [direction, setDirection] = useState<'yamlToToml' | 'tomlToYaml'>('yamlToToml');
  const [input, setInput] = useState(`title: Origemite
enabled: true`);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  return (
    <ToolShell
      title="YAML ↔ TOML"
      summary="YAML과 TOML 설정 형식을 변환합니다."
      controls={
        <>
          <div className={styles.row}>
            <label className={styles.check}>
              <input
                type="radio"
                name="yaml-toml-dir"
                checked={direction === 'yamlToToml'}
                onChange={() => setDirection('yamlToToml')}
              />
              YAML → TOML
            </label>
            <label className={styles.check}>
              <input
                type="radio"
                name="yaml-toml-dir"
                checked={direction === 'tomlToYaml'}
                onChange={() => setDirection('tomlToYaml')}
              />
              TOML → YAML
            </label>
          </div>
          <div className={styles.field}>
            <label htmlFor="yaml-toml-input">입력</label>
            <textarea
              id="yaml-toml-input"
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
              if (direction === 'yamlToToml') {
                const parsed = yaml.load(input) as unknown;
                if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
                  throw new Error('YAML 루트는 객체(map)여야 합니다.');
                }
                setResult(stringifyToml(parsed as Record<string, unknown>));
              } else {
                const parsed = parseToml(input) as unknown;
                setResult(yaml.dump(parsed, {lineWidth: -1, noRefs: true}));
              }
              setError('');
            } catch (err) {
              setResult('');
              setError(err instanceof Error ? err.message : '변환에 실패했습니다.');
            }
          }}>
          변환하기
        </button>
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
        <p>CI 파이프라인 YAML과 앱 TOML 설정을 맞춰 볼 때 사용합니다. 루트는 키-값 map이어야 합니다.</p>
      }
    />
  );
}