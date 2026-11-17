import {useState, type ReactNode} from 'react';
import {XMLBuilder, XMLParser} from 'fast-xml-parser';

import CopyButton from '../components/CopyButton';
import ToolShell from '../components/ToolShell';
import styles from '../styles.module.css';

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  allowBooleanAttributes: true,
});

const builder = new XMLBuilder({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  format: true,
  suppressEmptyNode: true,
});

function jsonValueToXmlTree(value: unknown): Record<string, unknown> {
  if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return {root: value};
}

export default function JsonXml(): ReactNode {
  const [direction, setDirection] = useState<'jsonToXml' | 'xmlToJson'>('jsonToXml');
  const [input, setInput] = useState('{"name":"origemite","active":true}');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  return (
    <ToolShell
      title="JSON ↔ XML"
      summary="JSON 객체와 XML 문자열을 변환합니다."
      controls={
        <>
          <div className={styles.row}>
            <label className={styles.check}>
              <input
                type="radio"
                name="json-xml-dir"
                checked={direction === 'jsonToXml'}
                onChange={() => setDirection('jsonToXml')}
              />
              JSON → XML
            </label>
            <label className={styles.check}>
              <input
                type="radio"
                name="json-xml-dir"
                checked={direction === 'xmlToJson'}
                onChange={() => setDirection('xmlToJson')}
              />
              XML → JSON
            </label>
          </div>
          <div className={styles.field}>
            <label htmlFor="json-xml-input">입력</label>
            <textarea
              id="json-xml-input"
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
              if (direction === 'jsonToXml') {
                const parsed = JSON.parse(input) as unknown;
                const xml = builder.build(jsonValueToXmlTree(parsed));
                setResult(typeof xml === 'string' ? xml : String(xml));
              } else {
                const parsed = parser.parse(input.trim()) as unknown;
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
          레거시 XML API 응답을 JSON으로 풀어 보거나, 설정 객체를 XML로 내보낼 때 사용합니다. 배열·
          원시값은 <code>root</code> 요소로 감쌉니다.
        </p>
      }
    />
  );
}