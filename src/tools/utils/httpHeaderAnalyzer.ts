export type ParsedHeader = {
  name: string;
  value: string;
  line: number;
};

export type HeaderGroup = 'cache' | 'cors' | 'content' | 'proxy' | 'other';

export type GroupedHeaders = {
  group: HeaderGroup;
  label: string;
  items: ParsedHeader[];
};

const GROUP_RULES: {group: HeaderGroup; label: string; test: (name: string) => boolean}[] = [
  {
    group: 'cache',
    label: '캐시',
    test: (n) =>
      ['cache-control', 'etag', 'expires', 'age', 'pragma'].includes(n.toLowerCase()),
  },
  {
    group: 'cors',
    label: 'CORS',
    test: (n) => n.toLowerCase().startsWith('access-control-'),
  },
  {
    group: 'content',
    label: '콘텐츠',
    test: (n) => {
      const l = n.toLowerCase();
      return l === 'content-type' || l === 'content-length' || l === 'content-encoding';
    },
  },
  {
    group: 'proxy',
    label: '프록시',
    test: (n) => {
      const l = n.toLowerCase();
      return l.startsWith('x-forwarded-') || l === 'via' || l === 'forwarded';
    },
  },
];

function classifyHeader(name: string): HeaderGroup {
  for (const rule of GROUP_RULES) {
    if (rule.test(name)) {
      return rule.group;
    }
  }
  return 'other';
}

export function parseRawHeaders(raw: string): ParsedHeader[] {
  const lines = raw.replace(/\r\n/g, '\n').split('\n');
  const out: ParsedHeader[] = [];
  let lineNo = 0;
  for (const line of lines) {
    lineNo += 1;
    const trimmed = line.trim();
    if (!trimmed) {
      continue;
    }
    if (/^(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS|CONNECT|TRACE)\s+/i.test(trimmed)) {
      continue;
    }
    if (/^HTTP\/\d/i.test(trimmed)) {
      continue;
    }
    const colon = line.indexOf(':');
    if (colon <= 0) {
      continue;
    }
    const name = line.slice(0, colon).trim();
    const value = line.slice(colon + 1).trim();
    if (!name) {
      continue;
    }
    out.push({name, value, line: lineNo});
  }
  return out;
}

export function groupHeaders(headers: ParsedHeader[]): GroupedHeaders[] {
  const buckets = new Map<HeaderGroup, ParsedHeader[]>();
  const labels = new Map<HeaderGroup, string>([
    ['cache', '캐시'],
    ['cors', 'CORS'],
    ['content', '콘텐츠'],
    ['proxy', '프록시'],
    ['other', '기타'],
  ]);

  for (const header of headers) {
    const group = classifyHeader(header.name);
    if (!buckets.has(group)) {
      buckets.set(group, []);
    }
    buckets.get(group)!.push(header);
  }

  const order: HeaderGroup[] = ['cache', 'cors', 'content', 'proxy', 'other'];
  return order
    .filter((g) => (buckets.get(g)?.length ?? 0) > 0)
    .map((group) => ({
      group,
      label: labels.get(group) ?? group,
      items: buckets.get(group)!,
    }));
}

export function formatHeaderSummary(groups: GroupedHeaders[], headers: ParsedHeader[]): string {
  if (headers.length === 0) {
    return '(헤더 없음)';
  }
  const lines: string[] = [`총 ${headers.length}개 헤더 필드 (동일 이름 중복 포함)`];
  for (const g of groups) {
    lines.push('', `## ${g.label}`);
    for (const h of g.items) {
      lines.push(`${h.name}: ${h.value}`);
    }
  }
  return lines.join('\n');
}

export const SAMPLE_HTTP_HEADERS = `HTTP/1.1 200 OK
Cache-Control: no-cache, private
ETag: "abc123"
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST
Content-Type: application/json; charset=utf-8
Content-Length: 42
X-Forwarded-For: 203.0.113.10
X-Forwarded-Proto: https
Via: 1.1 proxy.example
Set-Cookie: session=abc; Path=/
Set-Cookie: theme=dark; Path=/
`;