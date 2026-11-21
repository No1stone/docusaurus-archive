export type ParsedCurl = {
  url: string;
  method: string;
  headers: Record<string, string>;
  body: string;
};

function nextQuotedArg(input: string, start: number): {value: string; end: number} | null {
  const quote = input[start];
  if (quote !== '"' && quote !== "'") {
    return null;
  }
  let value = '';
  let i = start + 1;
  while (i < input.length) {
    const ch = input[i]!;
    if (ch === '\\' && i + 1 < input.length) {
      value += input[i + 1];
      i += 2;
      continue;
    }
    if (ch === quote) {
      return {value, end: i + 1};
    }
    value += ch;
    i += 1;
  }
  throw new Error('따옴표가 닫히지 않았습니다.');
}

function tokenizeCurl(input: string): string[] {
  const tokens: string[] = [];
  let i = 0;
  const s = input.trim();
  while (i < s.length) {
    while (i < s.length && /\s/.test(s[i]!)) {
      i += 1;
    }
    if (i >= s.length) {
      break;
    }
    if (s[i] === '"' || s[i] === "'") {
      const parsed = nextQuotedArg(s, i);
      if (parsed) {
        tokens.push(parsed.value);
        i = parsed.end;
        continue;
      }
    }
    let token = '';
    while (i < s.length && !/\s/.test(s[i]!)) {
      token += s[i]!;
      i += 1;
    }
    tokens.push(token);
  }
  return tokens;
}

export function parseCurlCommand(raw: string): ParsedCurl {
  let tokens = tokenizeCurl(raw);
  if (tokens[0]?.toLowerCase() === 'curl') {
    tokens = tokens.slice(1);
  }

  const headers: Record<string, string> = {};
  let method = 'GET';
  let body = '';
  let url = '';

  for (let i = 0; i < tokens.length; i += 1) {
    const t = tokens[i]!;
    const lower = t.toLowerCase();
    if (lower === '-x' || lower === '--request') {
      method = (tokens[i + 1] ?? 'GET').toUpperCase();
      i += 1;
      continue;
    }
    if (t === '-H' || lower === '--header') {
      const header = tokens[i + 1] ?? '';
      const colon = header.indexOf(':');
      if (colon >= 0) {
        const name = header.slice(0, colon).trim();
        const value = header.slice(colon + 1).trim();
        headers[name] = value;
      }
      i += 1;
      continue;
    }
    if (
      lower === '-d' ||
      lower === '--data' ||
      lower === '--data-raw' ||
      lower === '--data-binary'
    ) {
      body = tokens[i + 1] ?? '';
      if (method === 'GET') {
        method = 'POST';
      }
      i += 1;
      continue;
    }
    if (t.startsWith('http://') || t.startsWith('https://')) {
      url = t;
    }
  }

  if (!url) {
    throw new Error('URL을 찾지 못했습니다. curl 명령에 https:// 주소가 있어야 합니다.');
  }

  return {url, method, headers, body};
}

export function curlToFetchSnippet(parsed: ParsedCurl): string {
  const headerLines = Object.entries(parsed.headers)
    .map(([k, v]) => `    '${k}': '${v.replace(/'/g, "\\'")}',`)
    .join('\n');
  const bodyPart = parsed.body
    ? `,\n  body: ${JSON.stringify(parsed.body)}`
    : '';
  return `const response = await fetch(${JSON.stringify(parsed.url)}, {
  method: ${JSON.stringify(parsed.method)},
  headers: {
${headerLines || "    'Content-Type': 'application/json',"}
  }${bodyPart}
});
const data = await response.json();`;
}

export function curlToPythonSnippet(parsed: ParsedCurl): string {
  const headerBlock =
    Object.keys(parsed.headers).length > 0
      ? `headers = ${JSON.stringify(parsed.headers, null, 4)}\n`
      : 'headers = {}\n';
  const bodyLine = parsed.body
    ? `,\n    data=${JSON.stringify(parsed.body)}`
    : '';
  return `import requests

${headerBlock}response = requests.request(
    ${JSON.stringify(parsed.method)},
    ${JSON.stringify(parsed.url)},
    headers=headers${bodyLine}
)
print(response.status_code, response.text)`;
}