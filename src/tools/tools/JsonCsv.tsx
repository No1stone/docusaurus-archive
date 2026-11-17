import {useState, type ReactNode} from 'react';

import CopyButton from '../components/CopyButton';
import ToolShell from '../components/ToolShell';
import styles from '../styles.module.css';

function escapeCsvField(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }
  const text = typeof value === 'object' ? JSON.stringify(value) : String(value);
  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function jsonToCsv(data: unknown): string {
  if (!Array.isArray(data)) {
    throw new Error('JSON은 객체 배열이어야 합니다.');
  }
  if (data.length === 0) {
    return '';
  }
  const rows = data as Record<string, unknown>[];
  if (rows.some((row) => row === null || typeof row !== 'object' || Array.isArray(row))) {
    throw new Error('배열의 각 항목은 객체여야 합니다.');
  }
  const headers: string[] = [];
  const seen = new Set<string>();
  for (const row of rows) {
    for (const key of Object.keys(row)) {
      if (!seen.has(key)) {
        seen.add(key);
        headers.push(key);
      }
    }
  }
  const lines = [headers.map(escapeCsvField).join(',')];
  for (const row of rows) {
    lines.push(headers.map((key) => escapeCsvField(row[key])).join(','));
  }
  return lines.join('\n');
}

function parseCsvRow(line: string): string[] {
  const fields: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i]!;
    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          current += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        current += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      fields.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  fields.push(current);
  return fields;
}

function csvToJson(text: string): unknown[] {
  const lines = text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split('\n')
    .filter((line, index, all) => line.length > 0 || (index < all.length - 1 && all[index + 1] !== ''));
  if (lines.length === 0) {
    return [];
  }
  const headers = parseCsvRow(lines[0]!);
  if (headers.length === 0) {
    throw new Error('CSV 헤더 행이 비어 있습니다.');
  }
  const rows: Record<string, string>[] = [];
  for (let i = 1; i < lines.length; i += 1) {
    const cells = parseCsvRow(lines[i]!);
    if (cells.length === 1 && cells[0] === '') {
      continue;
    }
    const row: Record<string, string> = {};
    headers.forEach((header, index) => {
      row[header] = cells[index] ?? '';
    });
    rows.push(row);
  }
  return rows;
}

export default function JsonCsv(): ReactNode {
  const [direction, setDirection] = useState<'jsonToCsv' | 'csvToJson'>('jsonToCsv');
  const [input, setInput] = useState(
    '[{"name":"alice","role":"editor"},{"name":"bob","role":"viewer"}]',
  );
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  return (
    <ToolShell
      title="JSON ↔ CSV"
      summary="객체 배열 JSON과 RFC 4180에 가까운 CSV를 변환합니다."
      controls={
        <>
          <div className={styles.row}>
            <label className={styles.check}>
              <input
                type="radio"
                name="json-csv-dir"
                checked={direction === 'jsonToCsv'}
                onChange={() => setDirection('jsonToCsv')}
              />
              JSON → CSV
            </label>
            <label className={styles.check}>
              <input
                type="radio"
                name="json-csv-dir"
                checked={direction === 'csvToJson'}
                onChange={() => setDirection('csvToJson')}
              />
              CSV → JSON
            </label>
          </div>
          <div className={styles.field}>
            <label htmlFor="json-csv-input">입력</label>
            <textarea
              id="json-csv-input"
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
              if (direction === 'jsonToCsv') {
                const parsed = JSON.parse(input) as unknown;
                setResult(jsonToCsv(parsed));
              } else {
                const parsed = csvToJson(input);
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
          스프레드시트로 내보낸 CSV를 JSON 배열로 옮기거나, API 목 데이터를 CSV로 붙여 넣을 때
          사용합니다.
        </p>
      }
    />
  );
}