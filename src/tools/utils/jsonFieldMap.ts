export type JsonFieldType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'object'
  | 'array'
  | 'null';

export type FlatField = {
  path: string;
  type: JsonFieldType;
};

export type FieldMapping = {
  sourcePath: string;
  targetPath: string;
};

function fieldTypeOf(value: unknown): JsonFieldType {
  if (value === null) {
    return 'null';
  }
  if (Array.isArray(value)) {
    return 'array';
  }
  switch (typeof value) {
    case 'string':
      return 'string';
    case 'number':
      return 'number';
    case 'boolean':
      return 'boolean';
    case 'object':
      return 'object';
    default:
      return 'string';
  }
}

export function flattenJsonFields(value: unknown, basePath = ''): FlatField[] {
  const type = fieldTypeOf(value);
  const path = basePath || '$';
  if (type === 'object' && value !== null && !Array.isArray(value)) {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0) {
      return [{path, type: 'object'}];
    }
    return entries.flatMap(([key, child]) =>
      flattenJsonFields(child, basePath ? `${basePath}.${key}` : key),
    );
  }
  if (type === 'array') {
    const arr = value as unknown[];
    if (arr.length === 0) {
      return [{path, type: 'array'}];
    }
    return arr.flatMap((item, index) =>
      flattenJsonFields(item, basePath ? `${basePath}[${index}]` : `[${index}]`),
    );
  }
  return [{path, type}];
}

export function parseJsonDocument(text: string): {value: unknown; error?: string} {
  try {
    return {value: JSON.parse(text) as unknown};
  } catch (err) {
    return {
      value: undefined,
      error: err instanceof Error ? err.message : 'JSON 파싱에 실패했습니다.',
    };
  }
}

export function typesCompatible(source: JsonFieldType, target: JsonFieldType): boolean {
  if (source === target) {
    return true;
  }
  if (source === 'null' || target === 'null') {
    return true;
  }
  if (
    (source === 'number' && target === 'string') ||
    (source === 'string' && target === 'number')
  ) {
    return false;
  }
  if (source === 'array' || target === 'array') {
    return source === target;
  }
  if (source === 'object' || target === 'object') {
    return source === target;
  }
  return source === target;
}

export function buildMappingMarkdown(
  mappings: FieldMapping[],
  sourceFields: FlatField[],
  targetFields: FlatField[],
  typeMismatches: Array<{sourcePath: string; targetPath: string; sourceType: JsonFieldType; targetType: JsonFieldType}>,
  unmappedSource: string[],
  unmappedTarget: string[],
): string {
  const lines: string[] = [
    '## JSON 필드 매핑',
    '',
    '| 소스 필드 | 소스 타입 | 대상 필드 | 대상 타입 | 비고 |',
    '| --- | --- | --- | --- | --- |',
  ];

  const sourceByPath = new Map(sourceFields.map((f) => [f.path, f]));
  const targetByPath = new Map(targetFields.map((f) => [f.path, f]));

  for (const m of mappings) {
    const src = sourceByPath.get(m.sourcePath);
    const tgt = targetByPath.get(m.targetPath);
    const mismatch = typeMismatches.find(
      (t) => t.sourcePath === m.sourcePath && t.targetPath === m.targetPath,
    );
    const note = mismatch ? '타입 불일치' : '';
    lines.push(
      `| \`${m.sourcePath}\` | ${src?.type ?? '-'} | \`${m.targetPath}\` | ${tgt?.type ?? '-'} | ${note} |`,
    );
  }

  if (unmappedSource.length > 0 || unmappedTarget.length > 0) {
    lines.push('', '### 미매핑 필드', '');
    if (unmappedSource.length > 0) {
      lines.push('**소스**');
      for (const p of unmappedSource) {
        const f = sourceByPath.get(p);
        lines.push(`- \`${p}\` (${f?.type ?? '?'})`);
      }
      lines.push('');
    }
    if (unmappedTarget.length > 0) {
      lines.push('**대상**');
      for (const p of unmappedTarget) {
        const f = targetByPath.get(p);
        lines.push(`- \`${p}\` (${f?.type ?? '?'})`);
      }
    }
  }

  return lines.join('\n');
}