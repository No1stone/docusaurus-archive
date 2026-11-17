export type ProxyPreset = 'http' | 'websocket' | 'sse';

export type PathPrefixMode = 'strip' | 'keep';

export type NginxProxyInput = {
  domain: string;
  pathPrefix: string;
  upstream: string;
  preset: ProxyPreset;
  pathMode: PathPrefixMode;
};

function normalizePrefix(prefix: string): string {
  const trimmed = prefix.trim();
  if (!trimmed || trimmed === '/') {
    return '/';
  }
  const withLeading = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return withLeading.endsWith('/') ? withLeading : `${withLeading}/`;
}

function upstreamUrl(hostPort: string): string {
  const trimmed = hostPort.trim().replace(/^https?:\/\//, '');
  return `http://${trimmed.replace(/\/$/, '')}`;
}

function presetHeaders(preset: ProxyPreset): string[] {
  const common = [
    '        proxy_set_header Host $host;',
    '        proxy_set_header X-Real-IP $remote_addr;',
    '        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;',
    '        proxy_set_header X-Forwarded-Proto $scheme;',
  ];
  if (preset === 'http') {
    return common;
  }
  if (preset === 'websocket') {
    return [
      '        proxy_http_version 1.1;',
      '        proxy_set_header Upgrade $http_upgrade;',
      "        proxy_set_header Connection \"upgrade\";",
      ...common,
    ];
  }
  return [
    '        proxy_http_version 1.1;',
    "        proxy_set_header Connection '';",
    '        proxy_buffering off;',
    '        proxy_cache off;',
    '        chunked_transfer_encoding off;',
    ...common,
  ];
}

function presetLabel(preset: ProxyPreset): string {
  switch (preset) {
    case 'http':
      return 'HTTP';
    case 'websocket':
      return 'WebSocket';
    case 'sse':
      return 'SSE';
    default:
      return preset;
  }
}

export function computeForwardedPath(
  pathPrefix: string,
  requestPath: string,
  pathMode: PathPrefixMode,
): string {
  const prefix = normalizePrefix(pathPrefix);
  if (prefix === '/') {
    return requestPath.startsWith('/') ? requestPath : `/${requestPath}`;
  }
  const req = requestPath.startsWith('/') ? requestPath : `/${requestPath}`;
  if (!req.startsWith(prefix)) {
    return `(요청 경로가 prefix ${prefix} 와 맞지 않음)`;
  }
  const remainder = req.slice(prefix.length);
  if (pathMode === 'keep') {
    return req;
  }
  return remainder.startsWith('/') ? remainder : `/${remainder}`;
}

export function buildNginxReverseProxyConfig(input: NginxProxyInput): {
  config: string;
  forwardExample: string;
  requestExample: string;
  upstreamPathExample: string;
} {
  const domain = input.domain.trim() || 'example.com';
  const prefix = normalizePrefix(input.pathPrefix);
  const upstream = upstreamUrl(input.upstream || '127.0.0.1:8080');
  const locationPath = prefix === '/' ? '/' : prefix.replace(/\/$/, '') + '/';

  const proxyPass =
    input.pathMode === 'strip'
      ? `${upstream}/`
      : upstream;

  const headers = presetHeaders(input.preset).join('\n');

  const config = `# ${presetLabel(input.preset)} 리버스 프록시
server {
    listen 80;
    server_name ${domain};

    location ${locationPath === '/' ? '/' : locationPath} {
        proxy_pass ${proxyPass};
${headers}
    }
}
`;

  const requestExample = prefix === '/' ? '/api/v1/users' : `${locationPath}x`;
  const upstreamPathExample = computeForwardedPath(
    input.pathPrefix,
    requestExample,
    input.pathMode,
  );

  const forwardExample = [
    `클라이언트 요청: https://${domain}${requestExample}`,
    `업스트림(${input.upstream || '127.0.0.1:8080'})으로 전달되는 URI 경로: ${upstreamPathExample}`,
    input.pathMode === 'strip'
      ? '경로 prefix 제거(strip): proxy_pass URL 끝에 / 가 있습니다.'
      : '경로 prefix 유지(keep): proxy_pass URL 끝에 / 가 없습니다.',
  ].join('\n');

  return {config, forwardExample, requestExample, upstreamPathExample};
}

export const NGINX_PROXY_DEFAULTS: NginxProxyInput = {
  domain: 'api.example.com',
  pathPrefix: '/api/v1/',
  upstream: '127.0.0.1:3000',
  preset: 'http',
  pathMode: 'strip',
};