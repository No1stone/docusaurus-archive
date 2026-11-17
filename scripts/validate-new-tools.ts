import {mkdirSync, writeFileSync, rmSync} from 'node:fs';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {spawnSync} from 'node:child_process';

import {
  buildComposeFiles,
  defaultOptionsForPreset,
} from '../src/tools/utils/composeGenerator';
import {compareComposeYaml} from '../src/tools/utils/composeDiff';
import {
  buildNginxReverseProxyConfig,
  computeForwardedPath,
  NGINX_PROXY_DEFAULTS,
} from '../src/tools/utils/nginxReverseProxy';
import {compareSpringEnv} from '../src/tools/utils/springEnv';
import {
  buildMappingMarkdown,
  flattenJsonFields,
  parseJsonDocument,
} from '../src/tools/utils/jsonFieldMap';
import {
  formatDnsZoneExample,
  formatRoute53ChangeBatch,
  validateDnsRecords,
} from '../src/tools/utils/dnsRecord';
import {
  groupHeaders,
  parseRawHeaders,
} from '../src/tools/utils/httpHeaderAnalyzer';

function assert(cond: boolean, msg: string): void {
  if (!cond) {
    throw new Error(msg);
  }
}

function validateCompose(): void {
  const dir = join(tmpdir(), `origemite-compose-${Date.now()}`);
  mkdirSync(dir, {recursive: true});
  try {
    const {composeYaml, envExample} = buildComposeFiles(
      defaultOptionsForPreset('mysql'),
    );
    writeFileSync(join(dir, 'compose.yaml'), composeYaml);
    if (envExample) {
      writeFileSync(join(dir, '.env'), envExample);
    }
    const result = spawnSync(
      'docker',
      ['compose', '-f', 'compose.yaml', 'config', '--quiet'],
      {
        cwd: dir,
        encoding: 'utf8',
        env: {...process.env, MYSQL_ROOT_PASSWORD: 'Example-only-Root-42!'},
      },
    );
    assert(
      result.status === 0,
      `compose config failed: ${result.stdout}${result.stderr}`,
    );
    console.log('OK compose generator config');
  } finally {
    rmSync(dir, {recursive: true, force: true});
  }
}

function validateNginx(): void {
  const hasNginx =
    spawnSync('which', ['nginx'], {encoding: 'utf8'}).status === 0;
  const built = buildNginxReverseProxyConfig({
    ...NGINX_PROXY_DEFAULTS,
    pathMode: 'strip',
    preset: 'http',
  });

  const keepPath = computeForwardedPath('/api/v1/', '/api/v1/users', 'keep');
  const stripPath = computeForwardedPath('/api/v1/', '/api/v1/users', 'strip');
  assert(keepPath === '/api/v1/users', `keep path got ${keepPath}`);
  assert(stripPath === '/users', `strip path got ${stripPath}`);
  console.log('OK nginx path forward (keep/strip)');

  const dir = join(tmpdir(), `origemite-nginx-${Date.now()}`);
  mkdirSync(dir, {recursive: true});
  const confPath = join(dir, 'nginx.conf');
  const wrapped = `
worker_processes 1;
error_log /tmp/error.log;
pid /tmp/nginx.pid;
events { worker_connections 64; }
http {
  access_log off;
${built.config}
}
`;
  writeFileSync(confPath, wrapped);

  if (hasNginx) {
    const result = spawnSync('nginx', ['-t', '-c', confPath], {encoding: 'utf8'});
    const out = `${result.stdout}${result.stderr}`;
    assert(
      out.includes('syntax is ok') || result.status === 0,
      `nginx -t failed: ${out}\n---\n${wrapped}`,
    );
    console.log('OK nginx -t (local)');
  } else {
    const result = spawnSync(
      'docker',
      [
        'run',
        '--rm',
        '-v',
        `${confPath}:/etc/nginx/nginx.conf:ro`,
        'nginx:1.27',
        'nginx',
        '-t',
      ],
      {encoding: 'utf8'},
    );
    const out = `${result.stdout}${result.stderr}`;
    assert(
      out.includes('syntax is ok') || result.status === 0,
      `docker nginx -t failed: ${out}\n---\n${wrapped}`,
    );
    console.log('OK nginx -t (docker)');
  }
}

function validateLogic(): void {
  const a = `
services:
  api:
    image: nginx:1.27
    ports: ["8080:80"]
`;
  const b = `
services:
  api:
    image: nginx:1.28
    ports: ["8080:80"]
  db:
    image: postgres:18
`;
  const diff = compareComposeYaml(a, b);
  assert(!diff.error, diff.error || '');
  assert(
    diff.lines.some((l) => l.path.includes('image') || l.kind === 'changed'),
    `expected image change: ${JSON.stringify(diff.lines)}`,
  );
  assert(
    diff.lines.some((l) => l.path === 'services.db' && l.kind === 'added'),
    'expected db added',
  );

  const orderOnly = compareComposeYaml(
    'services:\n  a:\n    image: x:1\n  b:\n    image: y:1\n',
    'services:\n  b:\n    image: y:1\n  a:\n    image: x:1\n',
  );
  assert(!orderOnly.error, orderOnly.error || '');
  assert(
    orderOnly.lines.length === 0,
    `order-only should be empty, got ${JSON.stringify(orderOnly.lines)}`,
  );
  console.log('OK compose diff');

  const spring = compareSpringEnv(
    'app:\n  url: ${DB_URL}\n  name: ${APP_NAME:demo}\n',
    'DB_URL=\nUNUSED=1\nAPP_NAME=demo\n',
  );
  assert(spring.emptyValues.includes('DB_URL'), 'DB_URL empty');
  assert(
    spring.withDefaults.some((k) => k.key === 'APP_NAME'),
    'APP_NAME default',
  );
  assert(spring.unusedKeys.includes('UNUSED'), 'UNUSED key');
  assert(spring.missingKeysCopyText.includes('=') || spring.missingRequired.length === 0, 'copy text');
  console.log('OK spring env compare');

  const srcDoc = parseJsonDocument('{"user":{"id":1,"name":"a"}}');
  const dstDoc = parseJsonDocument('{"account":{"id":"1","fullName":"a"}}');
  assert(!srcDoc.error && !dstDoc.error, 'json parse');
  const src = flattenJsonFields(srcDoc.value);
  const dst = flattenJsonFields(dstDoc.value);
  assert(src.some((f) => f.path === 'user.id'), 'source path');
  const md = buildMappingMarkdown(
    [{sourcePath: 'user.name', targetPath: 'account.fullName'}],
    src,
    dst,
    [],
    ['user.id'],
    ['account.id'],
  );
  assert(md.includes('|') && md.includes('user.name'), 'markdown table');
  console.log('OK json field mapper');

  const records = [
    {id: '1', type: 'A' as const, name: 'www.example.com', value: '203.0.113.10', ttl: 300},
    {id: '2', type: 'TXT' as const, name: 'example.com', value: 'v=spf1 -all', ttl: 600},
  ];
  assert(validateDnsRecords(records).length === 0, 'dns valid');
  const zone = formatDnsZoneExample(records);
  const r53 = formatRoute53ChangeBatch(records);
  assert(zone.includes('\tIN\tA\t') || zone.includes('IN\tA'), 'zone text');
  assert(r53.includes('Changes') || r53.includes('ResourceRecordSet'), 'route53 json');
  const bad = validateDnsRecords([
    {id: '3', type: 'A', name: 'x', value: 'not-an-ip', ttl: 60},
  ]);
  assert(bad.length > 0, 'dns validation error');
  console.log('OK dns generator');

  const headers = parseRawHeaders(`HTTP/1.1 200 OK
Content-Type: application/json
Cache-Control: no-cache
Access-Control-Allow-Origin: *
X-Forwarded-For: 1.2.3.4
X-Forwarded-For: 5.6.7.8
`);
  const groups = groupHeaders(headers);
  assert(groups.some((g) => g.group === 'cors' && g.items.length >= 1), 'cors');
  assert(groups.some((g) => g.group === 'cache' && g.items.length >= 1), 'cache');
  const proxy = groups.find((g) => g.group === 'proxy');
  assert(
    (proxy?.items.filter((h) => h.name.toLowerCase() === 'x-forwarded-for').length ?? 0) === 2,
    'duplicate headers',
  );
  console.log('OK http header analyzer');

  const badJson = parseJsonDocument('{');
  assert(Boolean(badJson.error), 'json error path');
  console.log('OK json error path');
}

function main(): void {
  validateCompose();
  validateNginx();
  validateLogic();
  console.log('\nAll new-tool validations passed');
}

main();
