import yaml from 'js-yaml';

const PLACEHOLDER_RE = /\$\{([A-Za-z_][A-Za-z0-9_.-]*)(?::([^}]*))?\}/g;

export type SpringPlaceholder = {
  name: string;
  defaultValue?: string;
};

export type SpringEnvReport = {
  definedKeys: Array<{key: string; value: string}>;
  emptyValues: string[];
  missingRequired: string[];
  withDefaults: Array<{key: string; defaultValue: string}>;
  unusedKeys: string[];
  missingKeysCopyText: string;
  placeholders: SpringPlaceholder[];
  parseError?: string;
};

function detectSpringFormat(text: string): 'yaml' | 'properties' {
  const trimmed = text.trim();
  if (!trimmed) {
    return 'properties';
  }
  const first = trimmed.split(/\r?\n/).find((line) => line.trim() && !line.trim().startsWith('#'));
  if (!first) {
    return 'properties';
  }
  if (/^[a-zA-Z0-9_.-]+\s*=\s*/.test(first.trim())) {
    return 'properties';
  }
  return 'yaml';
}

function collectFromStringValue(value: string, out: Map<string, SpringPlaceholder>): void {
  PLACEHOLDER_RE.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = PLACEHOLDER_RE.exec(value)) !== null) {
    const name = match[1]!;
    const hasDefault = match[2] !== undefined;
    const existing = out.get(name);
    if (!existing) {
      out.set(name, hasDefault ? {name, defaultValue: match[2] ?? ''} : {name});
    } else if (hasDefault && existing.defaultValue === undefined) {
      out.set(name, {name, defaultValue: match[2] ?? ''});
    }
  }
}

function walkYamlStrings(node: unknown): string[] {
  if (typeof node === 'string') {
    return [node];
  }
  if (Array.isArray(node)) {
    return node.flatMap(walkYamlStrings);
  }
  if (node && typeof node === 'object') {
    return Object.values(node as Record<string, unknown>).flatMap(walkYamlStrings);
  }
  return [];
}

export function extractSpringPlaceholders(springConfig: string): {
  placeholders: SpringPlaceholder[];
  parseError?: string;
} {
  const map = new Map<string, SpringPlaceholder>();
  const format = detectSpringFormat(springConfig);

  PLACEHOLDER_RE.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = PLACEHOLDER_RE.exec(springConfig)) !== null) {
    const name = match[1]!;
    const hasDefault = match[2] !== undefined;
    const existing = map.get(name);
    if (!existing) {
      map.set(name, hasDefault ? {name, defaultValue: match[2] ?? ''} : {name});
    }
  }

  if (format === 'yaml') {
    try {
      const doc = yaml.load(springConfig);
      for (const str of walkYamlStrings(doc)) {
        collectFromStringValue(str, map);
      }
    } catch (err) {
      return {
        placeholders: [...map.values()].sort((a, b) => a.name.localeCompare(b.name)),
        parseError: err instanceof Error ? err.message : 'YAML 파싱에 실패했습니다.',
      };
    }
  }

  return {
    placeholders: [...map.values()].sort((a, b) => a.name.localeCompare(b.name)),
  };
}

export function parseEnvExample(text: string): Map<string, string> {
  const map = new Map<string, string>();
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }
    const exportPrefix = trimmed.startsWith('export ') ? 'export ' : '';
    const body = exportPrefix ? trimmed.slice(exportPrefix.length).trim() : trimmed;
    const eq = body.indexOf('=');
    if (eq <= 0) {
      continue;
    }
    const key = body.slice(0, eq).trim();
    let value = body.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (key) {
      map.set(key, value);
    }
  }
  return map;
}

export function compareSpringEnv(springConfig: string, envExample: string): SpringEnvReport {
  const {placeholders, parseError} = extractSpringPlaceholders(springConfig);
  const env = parseEnvExample(envExample);
  const referenced = new Set(placeholders.map((p) => p.name));

  const definedKeys: Array<{key: string; value: string}> = [];
  const emptyValues: string[] = [];
  for (const [key, value] of env.entries()) {
    if (referenced.has(key)) {
      if (value !== '') {
        definedKeys.push({key, value});
      } else {
        emptyValues.push(key);
      }
    }
  }
  definedKeys.sort((a, b) => a.key.localeCompare(b.key));
  emptyValues.sort();

  const missingRequired: string[] = [];
  const withDefaults: Array<{key: string; defaultValue: string}> = [];
  for (const ph of placeholders) {
    if (ph.defaultValue !== undefined) {
      withDefaults.push({key: ph.name, defaultValue: ph.defaultValue});
    } else if (!env.has(ph.name)) {
      missingRequired.push(ph.name);
    }
  }
  withDefaults.sort((a, b) => a.key.localeCompare(b.key));
  missingRequired.sort();

  const unusedKeys = [...env.keys()].filter((k) => !referenced.has(k)).sort();

  const missingKeysCopyText = missingRequired.map((k) => `${k}=`).join('\n');

  return {
    definedKeys,
    emptyValues,
    missingRequired,
    withDefaults,
    unusedKeys,
    missingKeysCopyText,
    placeholders,
    parseError,
  };
}