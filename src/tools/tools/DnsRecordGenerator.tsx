import {useMemo, useState, type ReactNode} from 'react';

import CopyButton from '../components/CopyButton';
import ToolShell from '../components/ToolShell';
import {
  formatDnsZoneExample,
  formatRoute53ChangeBatch,
  validateDnsRecords,
  type DnsRecordInput,
  type DnsRecordType,
} from '../utils/dnsRecord';
import styles from '../styles.module.css';

function newId(): string {
  return `rec-${Math.random().toString(36).slice(2, 9)}`;
}

const SAMPLE_RECORDS: DnsRecordInput[] = [
  {
    id: 'sample-1',
    type: 'A',
    name: 'api.example.com',
    value: '203.0.113.10',
    ttl: 300,
  },
  {
    id: 'sample-2',
    type: 'CNAME',
    name: 'www.example.com',
    value: 'api.example.com',
    ttl: 300,
  },
  {
    id: 'sample-3',
    type: 'TXT',
    name: 'example.com',
    value: 'v=spf1 include:_spf.example.com ~all',
    ttl: 3600,
  },
];

export default function DnsRecordGenerator(): ReactNode {
  const [records, setRecords] = useState<DnsRecordInput[]>(SAMPLE_RECORDS);

  const issues = useMemo(() => validateDnsRecords(records), [records]);
  const zoneText = useMemo(() => formatDnsZoneExample(records), [records]);
  const route53Text = useMemo(() => formatRoute53ChangeBatch(records), [records]);

  const updateRecord = (id: string, patch: Partial<DnsRecordInput>) => {
    setRecords((prev) => prev.map((r) => (r.id === id ? {...r, ...patch} : r)));
  };

  const addRecord = () => {
    setRecords((prev) => [
      ...prev,
      {id: newId(), type: 'A', name: '', value: '', ttl: 300},
    ]);
  };

  const removeRecord = (id: string) => {
    setRecords((prev) => (prev.length <= 1 ? prev : prev.filter((r) => r.id !== id)));
  };

  const reset = () => {
    setRecords([{id: newId(), type: 'A', name: '', value: '', ttl: 300}]);
  };

  const loadSample = () => {
    setRecords(SAMPLE_RECORDS.map((r) => ({...r, id: newId()})));
  };

  const issuesById = new Map(issues.map((i) => [i.id, i.message]));

  return (
    <ToolShell
      title="DNS 레코드 예제 생성기"
      summary="A·AAAA·CNAME·TXT 레코드를 입력하면 zone file 스타일 예시와 Route 53 ChangeBatch JSON을 만듭니다."
      controls={
        <>
          {records.map((rec, index) => (
            <div key={rec.id} className={styles.panel} style={{marginBottom: '0.75rem'}}>
              <h3 className={styles.fieldLabel}>레코드 {index + 1}</h3>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label htmlFor={`dns-type-${rec.id}`}>타입</label>
                  <select
                    id={`dns-type-${rec.id}`}
                    value={rec.type}
                    onChange={(e) =>
                      updateRecord(rec.id, {type: e.target.value as DnsRecordType})
                    }>
                    <option value="A">A</option>
                    <option value="AAAA">AAAA</option>
                    <option value="CNAME">CNAME</option>
                    <option value="TXT">TXT</option>
                  </select>
                </div>
                <div className={styles.field}>
                  <label htmlFor={`dns-ttl-${rec.id}`}>TTL</label>
                  <input
                    id={`dns-ttl-${rec.id}`}
                    type="number"
                    min={0}
                    value={rec.ttl}
                    onChange={(e) =>
                      updateRecord(rec.id, {ttl: Number(e.target.value)})
                    }
                  />
                </div>
              </div>
              <div className={styles.field}>
                <label htmlFor={`dns-name-${rec.id}`}>이름 (name)</label>
                <input
                  id={`dns-name-${rec.id}`}
                  value={rec.name}
                  onChange={(e) => updateRecord(rec.id, {name: e.target.value})}
                  spellCheck={false}
                />
              </div>
              <div className={styles.field}>
                <label htmlFor={`dns-value-${rec.id}`}>값 (value)</label>
                <input
                  id={`dns-value-${rec.id}`}
                  value={rec.value}
                  onChange={(e) => updateRecord(rec.id, {value: e.target.value})}
                  spellCheck={false}
                />
              </div>
              {issuesById.has(rec.id) ? (
                <p className={styles.error}>{issuesById.get(rec.id)}</p>
              ) : null}
              {records.length > 1 ? (
                <button
                  type="button"
                  className={styles.secondaryButton}
                  onClick={() => removeRecord(rec.id)}>
                  이 레코드 삭제
                </button>
              ) : null}
            </div>
          ))}
        </>
      }
      actions={
        <>
          <button type="button" className={styles.primaryButton} onClick={addRecord}>
            레코드 추가
          </button>
          <button type="button" className={styles.secondaryButton} onClick={loadSample}>
            예제 불러오기
          </button>
          <button type="button" className={styles.secondaryButton} onClick={reset}>
            초기화
          </button>
        </>
      }
      result={
        <>
          <h3 className={styles.fieldLabel}>Zone file 스타일 예시</h3>
          <textarea
            readOnly
            value={zoneText}
            spellCheck={false}
            style={{width: '100%', minHeight: '6rem'}}
          />
          <CopyButton text={zoneText} label="Zone 예시 복사" />

          <h3 className={styles.fieldLabel} style={{marginTop: '1rem'}}>
            Route 53 ChangeResourceRecordSets (ChangeBatch)
          </h3>
          <textarea
            readOnly
            value={route53Text}
            spellCheck={false}
            style={{width: '100%', minHeight: '10rem'}}
          />
          <CopyButton text={route53Text} label="Route 53 JSON 복사" />
        </>
      }
      example={
        <p>
          문서나 티켓에 붙일 DNS 예시를 빠르게 만들 때 사용합니다. A/AAAA는 대략적인 주소 형식만
          검사합니다.
        </p>
      }
    />
  );
}