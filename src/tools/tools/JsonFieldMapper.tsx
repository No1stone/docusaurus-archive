import {useMemo, useState, type ReactNode} from 'react';

import CopyButton from '../components/CopyButton';
import ToolShell from '../components/ToolShell';
import {
  buildMappingMarkdown,
  flattenJsonFields,
  parseJsonDocument,
  typesCompatible,
  type FlatField,
} from '../utils/jsonFieldMap';
import styles from '../styles.module.css';

const SAMPLE_SOURCE = `{
  "user_id": 1001,
  "email": "user@example.com",
  "active": true,
  "profile": { "displayName": "홍길동" }
}`;

const SAMPLE_TARGET = `{
  "id": 0,
  "mail": "",
  "isEnabled": false,
  "name": ""
}`;

export default function JsonFieldMapper(): ReactNode {
  const [sourceText, setSourceText] = useState(SAMPLE_SOURCE);
  const [targetText, setTargetText] = useState(SAMPLE_TARGET);
  const [targetToSource, setTargetToSource] = useState<Record<string, string>>({});

  const parsed = useMemo(() => {
    const source = parseJsonDocument(sourceText);
    const target = parseJsonDocument(targetText);
    const sourceFields =
      source.error || source.value === undefined ? [] : flattenJsonFields(source.value);
    const targetFields =
      target.error || target.value === undefined ? [] : flattenJsonFields(target.value);
    return {source, target, sourceFields, targetFields};
  }, [sourceText, targetText]);

  const mappings = useMemo(() => {
    return parsed.targetFields
      .filter((f) => targetToSource[f.path])
      .map((f) => ({
        targetPath: f.path,
        sourcePath: targetToSource[f.path]!,
      }));
  }, [parsed.targetFields, targetToSource]);

  const typeMismatches = useMemo(() => {
    const srcMap = new Map(parsed.sourceFields.map((f) => [f.path, f]));
    const tgtMap = new Map(parsed.targetFields.map((f) => [f.path, f]));
    const out: Array<{
      sourcePath: string;
      targetPath: string;
      sourceType: FlatField['type'];
      targetType: FlatField['type'];
    }> = [];
    for (const m of mappings) {
      const s = srcMap.get(m.sourcePath);
      const t = tgtMap.get(m.targetPath);
      if (s && t && !typesCompatible(s.type, t.type)) {
        out.push({
          sourcePath: m.sourcePath,
          targetPath: m.targetPath,
          sourceType: s.type,
          targetType: t.type,
        });
      }
    }
    return out;
  }, [mappings, parsed.sourceFields, parsed.targetFields]);

  const mappedSource = new Set(mappings.map((m) => m.sourcePath));
  const unmappedSource = parsed.sourceFields
    .map((f) => f.path)
    .filter((p) => !mappedSource.has(p));
  const unmappedTarget = parsed.targetFields
    .map((f) => f.path)
    .filter((p) => !targetToSource[p]);

  const markdown = useMemo(() => {
    if (parsed.source.error || parsed.target.error) {
      return '';
    }
    return buildMappingMarkdown(
      mappings.map((m) => ({sourcePath: m.sourcePath, targetPath: m.targetPath})),
      parsed.sourceFields,
      parsed.targetFields,
      typeMismatches,
      unmappedSource,
      unmappedTarget,
    );
  }, [
    mappings,
    parsed,
    typeMismatches,
    unmappedSource,
    unmappedTarget,
  ]);

  const setMapping = (targetPath: string, sourcePath: string) => {
    setTargetToSource((prev) => {
      const next = {...prev};
      if (!sourcePath) {
        delete next[targetPath];
      } else {
        next[targetPath] = sourcePath;
      }
      return next;
    });
  };

  const reset = () => {
    setSourceText('');
    setTargetText('');
    setTargetToSource({});
  };

  const loadSample = () => {
    setSourceText(SAMPLE_SOURCE);
    setTargetText(SAMPLE_TARGET);
    setTargetToSource({
      id: 'user_id',
      mail: 'email',
      isEnabled: 'active',
      name: 'profile.displayName',
    });
  };

  const error = parsed.source.error || parsed.target.error;

  return (
    <ToolShell
      title="JSON 필드 매핑 비교기"
      summary="소스·대상 JSON의 필드 경로와 타입을 나란히 보고, 이름이 다른 필드를 매핑해 연동 가이드용 표를 만듭니다."
      controls={
        <div className={styles.split}>
          <div className={styles.field}>
            <label htmlFor="map-source">소스 JSON</label>
            <textarea
              id="map-source"
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              spellCheck={false}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="map-target">대상 JSON</label>
            <textarea
              id="map-target"
              value={targetText}
              onChange={(e) => setTargetText(e.target.value)}
              spellCheck={false}
            />
          </div>
        </div>
      }
      actions={
        <>
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
          {error ? <p className={styles.error}>{error}</p> : null}
          {!error && parsed.sourceFields.length === 0 && parsed.targetFields.length === 0 ? (
            <p className={styles.hint}>유효한 JSON을 입력하면 필드 목록이 표시됩니다.</p>
          ) : null}

          {!error ? (
            <div className={styles.split} style={{alignItems: 'start'}}>
              <div>
                <h3 className={styles.fieldLabel}>소스 필드</h3>
                <ul style={{paddingLeft: 0, listStyle: 'none'}}>
                  {parsed.sourceFields.map((f) => (
                    <li key={f.path} style={{marginBottom: '0.35rem'}}>
                      <code>{f.path}</code> <span className={styles.hint}>({f.type})</span>
                      {unmappedSource.includes(f.path) ? (
                        <span className={styles.hint}> · 미매핑</span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className={styles.fieldLabel}>대상 필드 → 소스 매핑</h3>
                <ul style={{paddingLeft: 0, listStyle: 'none'}}>
                  {parsed.targetFields.map((f) => (
                    <li key={f.path} style={{marginBottom: '0.5rem'}}>
                      <div>
                        <code>{f.path}</code> <span className={styles.hint}>({f.type})</span>
                      </div>
                      <select
                        value={targetToSource[f.path] ?? ''}
                        onChange={(e) => setMapping(f.path, e.target.value)}
                        aria-label={`${f.path} 소스 필드 선택`}>
                        <option value="">— 매핑 안 함 —</option>
                        {parsed.sourceFields.map((sf) => (
                          <option key={sf.path} value={sf.path}>
                            {sf.path} ({sf.type})
                          </option>
                        ))}
                      </select>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : null}

          {typeMismatches.length > 0 ? (
            <>
              <h3 className={styles.fieldLabel}>타입 불일치</h3>
              <ul style={{paddingLeft: '1.25rem'}}>
                {typeMismatches.map((row) => (
                  <li key={`${row.sourcePath}-${row.targetPath}`}>
                    <code>{row.sourcePath}</code> ({row.sourceType}) →{' '}
                    <code>{row.targetPath}</code> ({row.targetType})
                  </li>
                ))}
              </ul>
            </>
          ) : null}

          {markdown ? (
            <>
              <h3 className={styles.fieldLabel}>연동 가이드 (Markdown)</h3>
              <textarea
                readOnly
                value={markdown}
                spellCheck={false}
                style={{width: '100%', minHeight: '8rem'}}
              />
              <CopyButton text={markdown} label="Markdown 복사" />
            </>
          ) : null}
        </>
      }
      example={
        <p>
          API 응답과 내부 DTO처럼 필드 이름은 다르지만 의미가 같은 JSON을 연결할 때, 대상 필드마다
          소스 경로를 고르면 표가 갱신됩니다.
        </p>
      }
    />
  );
}