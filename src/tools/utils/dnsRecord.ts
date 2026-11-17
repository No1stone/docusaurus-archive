export type DnsRecordType = 'A' | 'AAAA' | 'CNAME' | 'TXT';

export type DnsRecordInput = {
  id: string;
  type: DnsRecordType;
  name: string;
  value: string;
  ttl: number;
};

export type DnsValidationIssue = {
  id: string;
  message: string;
};

const IPV4_RE =
  /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d?\d)$/;

const IPV6_RE =
  /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/;

function normalizeName(name: string): string {
  const t = name.trim();
  return t.endsWith('.') ? t : `${t}.`;
}

function escapeTxt(value: string): string {
  const inner = value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  return `"${inner}"`;
}

export function validateDnsRecords(records: DnsRecordInput[]): DnsValidationIssue[] {
  const issues: DnsValidationIssue[] = [];
  for (const rec of records) {
    if (!rec.name.trim()) {
      issues.push({id: rec.id, message: '이름(name)을 입력하세요.'});
    }
    if (!rec.value.trim()) {
      issues.push({id: rec.id, message: '값(value)을 입력하세요.'});
    }
    if (!Number.isFinite(rec.ttl) || rec.ttl < 0) {
      issues.push({id: rec.id, message: 'TTL은 0 이상의 숫자여야 합니다.'});
    }
    const v = rec.value.trim();
    if (rec.type === 'A' && v && !IPV4_RE.test(v)) {
      issues.push({id: rec.id, message: 'A 레코드는 IPv4 주소 형식이어야 합니다.'});
    }
    if (rec.type === 'AAAA' && v && !IPV6_RE.test(v)) {
      issues.push({id: rec.id, message: 'AAAA 레코드는 IPv6 주소 형식이어야 합니다(간단 검사).'});
    }
  }
  return issues;
}

export function formatDnsZoneExample(records: DnsRecordInput[]): string {
  const lines: string[] = ['; DNS zone file 예시 (브라우저에서 생성)', '$ORIGIN example.com.', ''];
  for (const rec of records) {
    if (!rec.name.trim() || !rec.value.trim()) {
      continue;
    }
    const name = normalizeName(rec.name);
    const ttl = Math.max(0, Math.floor(rec.ttl));
    let rdata = rec.value.trim();
    if (rec.type === 'TXT') {
      rdata = escapeTxt(rdata);
    }
    lines.push(`${name}\t${ttl}\tIN\t${rec.type}\t${rdata}`);
  }
  return lines.join('\n').trimEnd();
}

function route53ResourceRecord(type: DnsRecordType, value: string): {Value: string}[] {
  const v = value.trim();
  if (type === 'TXT') {
    return [{Value: v.includes('"') ? v : `"${v.replace(/"/g, '\\"')}"`}];
  }
  if (type === 'CNAME') {
    const normalized = v.endsWith('.') ? v : `${v}.`;
    return [{Value: normalized}];
  }
  return [{Value: v}];
}

export function formatRoute53ChangeBatch(records: DnsRecordInput[]): string {
  const changes = records
    .filter((r) => r.name.trim() && r.value.trim())
    .map((rec) => ({
      Action: 'UPSERT',
      ResourceRecordSet: {
        Name: normalizeName(rec.name),
        Type: rec.type,
        TTL: Math.max(0, Math.floor(rec.ttl)),
        ResourceRecords: route53ResourceRecord(rec.type, rec.value),
      },
    }));

  const batch = {
    Comment: 'Generated in browser — DNS 레코드 예제',
    Changes: changes,
  };

  return JSON.stringify({ChangeBatch: batch}, null, 2);
}