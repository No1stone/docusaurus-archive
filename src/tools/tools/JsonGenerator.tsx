import {useState, type ReactNode} from 'react';

import CopyButton from '../components/CopyButton';
import ToolShell from '../components/ToolShell';
import styles from '../styles.module.css';

type FieldType = 'string' | 'number' | 'boolean' | 'uuid';

type FieldDef = {
  id: string;
  name: string;
  type: FieldType;
};

function randomUuid(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function mockValue(type: FieldType, index: number): string | number | boolean {
  switch (type) {
    case 'string':
      return `item_${index + 1}`;
    case 'number':
      return index + 1;
    case 'boolean':
      return index % 2 === 0;
    case 'uuid':
      return randomUuid();
    default:
      return '';
  }
}

let fieldSeq = 0;

function newField(): FieldDef {
  fieldSeq += 1;
  return {id: String(fieldSeq), name: `field${fieldSeq}`, type: 'string'};
}

export default function JsonGenerator(): ReactNode {
  const [count, setCount] = useState(5);
  const [fields, setFields] = useState<FieldDef[]>([
    {id: '1', name: 'id', type: 'uuid'},
    {id: '2', name: 'title', type: 'string'},
    {id: '3', name: 'active', type: 'boolean'},
  ]);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const generate = () => {
    const names = new Set<string>();
    for (const field of fields) {
      const name = field.name.trim();
      if (!name) {
        setError('모든 필드에 이름을 입력하세요.');
        setResult('');
        return;
      }
      if (names.has(name)) {
        setError(`중복된 필드 이름: ${name}`);
        setResult('');
        return;
      }
      names.add(name);
    }
    const n = Math.max(1, Math.min(500, count));
    const rows: Record<string, string | number | boolean>[] = [];
    for (let i = 0; i < n; i += 1) {
      const row: Record<string, string | number | boolean> = {};
      for (const field of fields) {
        row[field.name.trim()] = mockValue(field.type, i);
      }
      rows.push(row);
    }
    setResult(JSON.stringify(rows, null, 2));
    setError('');
  };

  const reset = () => {
    setCount(5);
    setFields([
      {id: '1', name: 'id', type: 'uuid'},
      {id: '2', name: 'title', type: 'string'},
      {id: '3', name: 'active', type: 'boolean'},
    ]);
    setResult('');
    setError('');
  };

  return (
    <ToolShell
      title="JSON 목 데이터 생성"
      summary="필드 이름과 타입만 정하면 객체 배열 형태의 샘플 JSON을 만듭니다."
      controls={
        <>
          <div className={styles.field}>
            <label htmlFor="json-gen-count">항목 개수</label>
            <input
              id="json-gen-count"
              type="number"
              min={1}
              max={500}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
            />
          </div>
          <div className={styles.field}>
            <label>필드</label>
            {fields.map((field, index) => (
              <div key={field.id} className={styles.row} style={{marginBottom: '0.5rem'}}>
                <input
                  type="text"
                  value={field.name}
                  aria-label={`필드 ${index + 1} 이름`}
                  onChange={(e) =>
                    setFields((prev) =>
                      prev.map((f) => (f.id === field.id ? {...f, name: e.target.value} : f)),
                    )
                  }
                />
                <select
                  value={field.type}
                  aria-label={`필드 ${index + 1} 타입`}
                  onChange={(e) =>
                    setFields((prev) =>
                      prev.map((f) =>
                        f.id === field.id ? {...f, type: e.target.value as FieldType} : f,
                      ),
                    )
                  }>
                  <option value="string">string</option>
                  <option value="number">number</option>
                  <option value="boolean">boolean</option>
                  <option value="uuid">uuid</option>
                </select>
                <button
                  type="button"
                  className={styles.secondaryButton}
                  disabled={fields.length <= 1}
                  onClick={() => setFields((prev) => prev.filter((f) => f.id !== field.id))}>
                  삭제
                </button>
              </div>
            ))}
            <button type="button" className={styles.secondaryButton} onClick={() => setFields((p) => [...p, newField()])}>
              필드 추가
            </button>
          </div>
        </>
      }
      actions={
        <>
          <button type="button" className={styles.primaryButton} onClick={generate}>
            생성
          </button>
          <button type="button" className={styles.secondaryButton} onClick={reset}>
            초기화
          </button>
        </>
      }
      result={
        <>
          {error ? <p className={styles.error}>{error}</p> : null}
          <textarea readOnly value={result} spellCheck={false} placeholder="생성 결과" />
          <div style={{marginTop: '0.75rem'}}>
            <CopyButton text={result} />
          </div>
        </>
      }
      example={<p>프론트 목록 UI나 Storybook용 고정 패턴 데이터가 필요할 때 빠르게 배열 JSON을 만듭니다.</p>}
    />
  );
}