import {load as loadYaml} from 'js-yaml';

export type ComposeDiffKind = 'added' | 'removed' | 'changed';

export type ComposeDiffLine = {
  path: string;
  kind: ComposeDiffKind;
  left?: string;
  right?: string;
};

type EnvNorm = {value: string; refs: string[]};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function stableSort(items: string[]): string[] {
  return [...items].sort((a, b) => a.localeCompare(b));
}

function normalizePort(entry: unknown): string {
  if (typeof entry === 'string' || typeof entry === 'number') {
    return String(entry);
  }
  if (isRecord(entry)) {
    const published = entry.published ?? entry.host;
    const target = entry.target;
    const protocol = entry.protocol ?? 'tcp';
    if (published !== undefined && target !== undefined) {
      return `${String(published)}:${String(target)}/${String(protocol)}`;
    }
    if (target !== undefined) {
      return String(target);
    }
  }
  return JSON.stringify(entry);
}

function normalizeListField(val: unknown, normalizeItem: (item: unknown) => string): string[] {
  if (val === undefined || val === null) {
    return [];
  }
  if (Array.isArray(val)) {
    return stableSort(val.map((item) => normalizeItem(item)));
  }
  return stableSort([normalizeItem(val)]);
}

function normalizeNetworks(val: unknown): string[] {
  if (val === undefined || val === null) {
    return [];
  }
  if (Array.isArray(val)) {
    return stableSort(val.map((item) => String(item)));
  }
  if (isRecord(val)) {
    return stableSort(Object.keys(val));
  }
  return [];
}

function extractVarRefs(value: string): string[] {
  const refs: string[] = [];
  const re = /\$\{([^}]+)\}/g;
  let match: RegExpExecArray | null = re.exec(value);
  while (match !== null) {
    refs.push(match[1]!.trim());
    match = re.exec(value);
  }
  return stableSort(refs);
}

function normalizeEnvironment(env: unknown): Map<string, EnvNorm> {
  const map = new Map<string, EnvNorm>();
  if (env === undefined || env === null) {
    return map;
  }
  if (Array.isArray(env)) {
    for (const item of env) {
      if (typeof item !== 'string') {
        continue;
      }
      const eq = item.indexOf('=');
      if (eq >= 0) {
        const key = item.slice(0, eq).trim();
        const value = item.slice(eq + 1);
        map.set(key, {value, refs: extractVarRefs(value)});
      } else {
        map.set(item.trim(), {value: '', refs: []});
      }
    }
    return map;
  }
  if (isRecord(env)) {
    for (const [key, raw] of Object.entries(env)) {
      const value = raw === null || raw === undefined ? '' : String(raw);
      map.set(key, {value, refs: extractVarRefs(value)});
    }
  }
  return map;
}

function envSemanticEqual(a: EnvNorm, b: EnvNorm): boolean {
  if (a.refs.length > 0 || b.refs.length > 0) {
    return a.refs.join('\0') === b.refs.join('\0');
  }
  return a.value === b.value;
}

function formatEnvNorm(entry: EnvNorm): string {
  if (entry.refs.length > 0) {
    return entry.refs.map((r) => `\${${r}}`).join(', ');
  }
  return entry.value;
}

function getServices(doc: unknown): Record<string, Record<string, unknown>> | null {
  if (!isRecord(doc)) {
    return null;
  }
  const services = doc.services;
  if (!isRecord(services)) {
    return {};
  }
  const out: Record<string, Record<string, unknown>> = {};
  for (const [name, cfg] of Object.entries(services)) {
    if (isRecord(cfg)) {
      out[name] = cfg;
    }
  }
  return out;
}

function imageTagOnlyChange(leftImage: string, rightImage: string): boolean {
  const split = (img: string) => {
    const lastColon = img.lastIndexOf(':');
    const lastSlash = img.lastIndexOf('/');
    if (lastColon === -1 || lastColon < lastSlash) {
      return {repo: img, tag: 'latest'};
    }
    return {repo: img.slice(0, lastColon), tag: img.slice(lastColon + 1)};
  };
  const a = split(leftImage);
  const b = split(rightImage);
  return a.repo === b.repo && a.tag !== b.tag;
}

function pushChanged(
  out: ComposeDiffLine[],
  path: string,
  left: string,
  right: string,
): void {
  out.push({path, kind: 'changed', left, right});
}

function compareServiceFields(
  serviceName: string,
  left: Record<string, unknown>,
  right: Record<string, unknown>,
  out: ComposeDiffLine[],
): void {
  const base = `services.${serviceName}`;

  const leftImage = typeof left.image === 'string' ? left.image : undefined;
  const rightImage = typeof right.image === 'string' ? right.image : undefined;
  if (leftImage !== rightImage) {
    if (leftImage !== undefined && rightImage !== undefined) {
      const path = imageTagOnlyChange(leftImage, rightImage)
        ? `${base}.image (태그)`
        : `${base}.image`;
      pushChanged(out, path, leftImage, rightImage);
    } else if (leftImage !== undefined) {
      out.push({path: `${base}.image`, kind: 'removed', left: leftImage});
    } else if (rightImage !== undefined) {
      out.push({path: `${base}.image`, kind: 'added', right: rightImage});
    }
  }

  const leftPorts = normalizeListField(left.ports, normalizePort);
  const rightPorts = normalizeListField(right.ports, normalizePort);
  if (leftPorts.join('\n') !== rightPorts.join('\n')) {
    pushChanged(out, `${base}.ports`, leftPorts.join(', ') || '(없음)', rightPorts.join(', ') || '(없음)');
  }

  const leftVolumes = normalizeListField(left.volumes, (v) =>
    typeof v === 'string' ? v : JSON.stringify(v),
  );
  const rightVolumes = normalizeListField(right.volumes, (v) =>
    typeof v === 'string' ? v : JSON.stringify(v),
  );
  if (leftVolumes.join('\n') !== rightVolumes.join('\n')) {
    pushChanged(
      out,
      `${base}.volumes`,
      leftVolumes.join(', ') || '(없음)',
      rightVolumes.join(', ') || '(없음)',
    );
  }

  const leftNetworks = normalizeNetworks(left.networks);
  const rightNetworks = normalizeNetworks(right.networks);
  if (leftNetworks.join('\n') !== rightNetworks.join('\n')) {
    pushChanged(
      out,
      `${base}.networks`,
      leftNetworks.join(', ') || '(없음)',
      rightNetworks.join(', ') || '(없음)',
    );
  }

  const leftEnv = normalizeEnvironment(left.environment);
  const rightEnv = normalizeEnvironment(right.environment);
  const envKeys = new Set([...leftEnv.keys(), ...rightEnv.keys()]);
  for (const key of [...envKeys].sort()) {
    const l = leftEnv.get(key);
    const r = rightEnv.get(key);
    if (l && !r) {
      out.push({
        path: `${base}.environment.${key}`,
        kind: 'removed',
        left: formatEnvNorm(l),
      });
    } else if (!l && r) {
      out.push({
        path: `${base}.environment.${key}`,
        kind: 'added',
        right: formatEnvNorm(r),
      });
    } else if (l && r && !envSemanticEqual(l, r)) {
      pushChanged(out, `${base}.environment.${key}`, formatEnvNorm(l), formatEnvNorm(r));
    }
  }
}

export function compareComposeYaml(leftYaml: string, rightYaml: string): {
  lines: ComposeDiffLine[];
  error?: string;
} {
  let leftDoc: unknown;
  let rightDoc: unknown;
  try {
    leftDoc = loadYaml(leftYaml);
    rightDoc = loadYaml(rightYaml);
  } catch (err) {
    return {
      lines: [],
      error: err instanceof Error ? err.message : 'YAML 파싱에 실패했습니다.',
    };
  }

  const leftServices = getServices(leftDoc);
  const rightServices = getServices(rightDoc);
  if (leftServices === null || rightServices === null) {
    return {lines: [], error: 'Compose 파일에 services 맵이 필요합니다.'};
  }

  const lines: ComposeDiffLine[] = [];
  const names = new Set([...Object.keys(leftServices), ...Object.keys(rightServices)]);

  for (const name of [...names].sort()) {
    const left = leftServices[name];
    const right = rightServices[name];
    if (left && !right) {
      lines.push({path: `services.${name}`, kind: 'removed', left: '(서비스 제거됨)'});
      continue;
    }
    if (!left && right) {
      lines.push({path: `services.${name}`, kind: 'added', right: '(서비스 추가됨)'});
      continue;
    }
    if (left && right) {
      compareServiceFields(name, left, right, lines);
    }
  }

  return {lines};
}

function kindLabel(kind: ComposeDiffKind): string {
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

export function formatComposeDiffReport(lines: ComposeDiffLine[]): string {
  if (lines.length === 0) {
    return '차이 없음 (키 순서·들여쓰기만 바뀐 경우는 표시하지 않습니다)';
  }
  return lines
    .map((line) => {
      if (line.kind === 'changed') {
        return `[${kindLabel(line.kind)}] ${line.path}\n  A: ${line.left ?? ''}\n  B: ${line.right ?? ''}`;
      }
      if (line.kind === 'added') {
        return `[${kindLabel(line.kind)}] ${line.path}\n  B: ${line.right ?? ''}`;
      }
      return `[${kindLabel(line.kind)}] ${line.path}\n  A: ${line.left ?? ''}`;
    })
    .join('\n\n');
}