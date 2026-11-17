import type {ComponentType} from 'react';

import type {ToolCategory, ToolDefinition, ToolFaq, ToolId} from './types';
import AesGcm from './tools/AesGcm';
import Base64Converter from './tools/Base64Converter';
import Base64Image from './tools/Base64Image';
import BinaryCodec from './tools/BinaryCodec';
import ColorConverter from './tools/ColorConverter';
import ComposeDiff from './tools/ComposeDiff';
import CronParser from './tools/CronParser';
import CurlConverter from './tools/CurlConverter';
import ComposeGenerator from './tools/ComposeGenerator';
import DnsRecordGenerator from './tools/DnsRecordGenerator';
import DockerCheatsheet from './tools/DockerCheatsheet';
import DockerRunToCompose from './tools/DockerRunToCompose';
import FirewallCheatsheet from './tools/FirewallCheatsheet';
import GitCheatsheet from './tools/GitCheatsheet';
import HashGenerator from './tools/HashGenerator';
import HexCodec from './tools/HexCodec';
import HmacGenerator from './tools/HmacGenerator';
import HttpHeaderAnalyzer from './tools/HttpHeaderAnalyzer';
import IconDesigner from './tools/IconDesigner';
import ImageDotMatrix from './tools/ImageDotMatrix';
import IpLookup from './tools/IpLookup';
import JarCommandGenerator from './tools/JarCommandGenerator';
import JsonCsv from './tools/JsonCsv';
import JsonDiff from './tools/JsonDiff';
import JsonFieldMapper from './tools/JsonFieldMapper';
import JsonFormatter from './tools/JsonFormatter';
import JsonGenerator from './tools/JsonGenerator';
import JsonKeyFixer from './tools/JsonKeyFixer';
import JsonToml from './tools/JsonToml';
import JsonVisualizer from './tools/JsonVisualizer';
import JsonXml from './tools/JsonXml';
import JsonYaml from './tools/JsonYaml';
import JwtParser from './tools/JwtParser';
import LinuxLogHelper from './tools/LinuxLogHelper';
import LinuxPermissions from './tools/LinuxPermissions';
import NginxCheatsheet from './tools/NginxCheatsheet';
import NginxReverseProxy from './tools/NginxReverseProxy';
import PasswordGenerator from './tools/PasswordGenerator';
import QrCodeGenerator from './tools/QrCodeGenerator';
import RsaCrypto from './tools/RsaCrypto';
import SpringEnvCompare from './tools/SpringEnvCompare';
import SvgPlaceholder from './tools/SvgPlaceholder';
import TimeConverter from './tools/TimeConverter';
import UrlCodec from './tools/UrlCodec';
import UuidGenerator from './tools/UuidGenerator';
import YamlToml from './tools/YamlToml';

export const TOOL_CATEGORIES: ToolCategory[] = [
  {id: 'developers', label: '개발자 도구'},
  {id: 'converters', label: '변환기'},
  {id: 'json', label: 'JSON'},
  {id: 'images', label: '이미지'},
  {id: 'generators', label: '생성'},
  {id: 'docker', label: 'Docker'},
  {id: 'infra', label: '인프라'},
  {id: 'java', label: 'Java'},
  {id: 'spring', label: 'Spring'},
  {id: 'api', label: 'API'},
  {id: 'text', label: '텍스트'},
  {id: 'crypto', label: '암호화'},
  {id: 'network', label: '네트워크'},
  {id: 'time', label: '시간'},
];

export const TOOLS_HOME_DESCRIPTION =
  '크론, cURL, JSON/YAML/XML/TOML 변환, JWT, QR, UUID, Docker, Base64, 해시, AES/RSA, IP 조회, 시간 변환 등 개발 도구를 브라우저에서 바로 쓰는 무료 모음입니다. 민감한 입력은 로컬에서 처리하고, 외부 요청은 동의 후에만 전송합니다.';

export const TOOLS_HOME_KEYWORDS = [
  '개발 도구',
  '온라인 도구',
  '무료 유틸',
  'UUID 생성기',
  'JSON 포매터',
  'JWT 파서',
  'Base64',
  'QR 코드',
  'Docker Compose',
  'AES-GCM',
  '크론 표현식',
  'Origemite Tools',
];

export const TOOLS_HOME_FAQS: ToolFaq[] = [
  {
    question: 'Tools의 입력값은 서버로 전송되나요?',
    answer:
      '대부분의 도구는 브라우저에서만 처리합니다. IP 조회와 cURL 요청 테스트처럼 외부가 필요한 도구는 전송 대상과 데이터를 보여 준 뒤 동의한 경우에만 요청합니다.',
  },
  {
    question: '광고 스크립트가 도구 입력을 읽나요?',
    answer:
      'Tools 광고는 sandboxed iframe 안에서만 로드되며 부모 문서(JWT·암호·요청 본문 등)에 접근하지 않습니다. 문서·블로그의 자동 광고 스크립트는 /tools 진입 시 제거됩니다.',
  },
  {
    question: '비용이 드나요?',
    answer: '도구 UI는 무료입니다. 외부 API를 쓰는 도구도 별도 키 없이 동의 후 요청만 합니다.',
  },
];

const faq = (question: string, answer: string): ToolFaq => ({question, answer});

const TOOL_COMPONENTS: Record<ToolId, ComponentType> = {
  'cron-parser': CronParser,
  'curl-converter': CurlConverter,
  'git-cheatsheet': GitCheatsheet,
  'nginx-cheatsheet': NginxCheatsheet,
  'firewall-cheatsheet': FirewallCheatsheet,
  'linux-log-helper': LinuxLogHelper,
  'linux-permissions': LinuxPermissions,
  'json-csv': JsonCsv,
  'json-yaml': JsonYaml,
  'json-xml': JsonXml,
  'json-toml': JsonToml,
  'yaml-toml': YamlToml,
  'color-converter': ColorConverter,
  'json-formatter': JsonFormatter,
  'json-visualizer': JsonVisualizer,
  'json-generator': JsonGenerator,
  'json-diff': JsonDiff,
  'json-key-fixer': JsonKeyFixer,
  'jwt-parser': JwtParser,
  'qr-code-generator': QrCodeGenerator,
  'svg-placeholder': SvgPlaceholder,
  'icon-designer': IconDesigner,
  'base64-image': Base64Image,
  'image-dot-matrix': ImageDotMatrix,
  'uuid-generator': UuidGenerator,
  'password-generator': PasswordGenerator,
  'docker-run-to-compose': DockerRunToCompose,
  'docker-compose-generator': ComposeGenerator,
  'compose-diff': ComposeDiff,
  'docker-cheatsheet': DockerCheatsheet,
  'nginx-reverse-proxy': NginxReverseProxy,
  'jar-command-generator': JarCommandGenerator,
  'spring-env-compare': SpringEnvCompare,
  'json-field-mapper': JsonFieldMapper,
  'dns-record-generator': DnsRecordGenerator,
  'http-header-analyzer': HttpHeaderAnalyzer,
  base64: Base64Converter,
  'url-codec': UrlCodec,
  'hash-generator': HashGenerator,
  'sha-hash': HashGenerator,
  'hex-codec': HexCodec,
  'binary-codec': BinaryCodec,
  'aes-gcm': AesGcm,
  'rsa-crypto': RsaCrypto,
  'hmac-generator': HmacGenerator,
  'ip-lookup': IpLookup,
  'time-converter': TimeConverter,
};

function tool(
  partial: Omit<ToolDefinition, 'component'> & {id: ToolId},
): ToolDefinition {
  return {
    ...partial,
    component: TOOL_COMPONENTS[partial.id],
  };
}

export const TOOLS: ToolDefinition[] = [
  tool({
    id: 'cron-parser',
    slug: 'cron-parser',
    title: '크론 표현식 해석기',
    summary: '크론 구문을 검증하고 다가올 실행 시간을 확인합니다.',
    description:
      '크론 표현식을 검증하고 다음 실행 시각을 미리 보는 무료 온라인 도구입니다. 브라우저에서 로컬로 해석합니다.',
    categoryId: 'developers',
    layout: 'stack',
    keywords: ['크론', 'cron', 'cron parser', '스케줄', 'crontab'],
    faqs: [
      faq('어떤 형식을 지원하나요?', '일반적인 5필드 크론 표현식을 해석합니다.'),
      faq('서버로 전송되나요?', '아니요. 브라우저에서만 계산합니다.'),
    ],
  }),
  tool({
    id: 'curl-converter',
    slug: 'curl-converter',
    title: 'cURL 명령 변환기',
    summary: 'cURL을 코드로 변환하고, 동의 후에만 요청을 테스트합니다.',
    description:
      'cURL 명령을 JavaScript·Python 코드로 변환하는 도구입니다. 실제 HTTP 요청은 대상 URL과 본문을 확인한 뒤 사용자가 동의한 경우에만 전송합니다.',
    categoryId: 'developers',
    layout: 'stack',
    keywords: ['cURL', 'curl 변환', 'HTTP 테스트', 'fetch'],
    faqs: [
      faq('요청이 자동으로 나가나요?', '아니요. 변환은 로컬이며, 테스트는 동의 후에만 실행됩니다.'),
      faq('CORS 오류가 날 수 있나요?', '브라우저에서 직접 호출하므로 대상 서버 CORS 정책에 따라 실패할 수 있습니다.'),
    ],
    external: true,
  }),
  tool({
    id: 'git-cheatsheet',
    slug: 'git-cheatsheet',
    title: 'Git 빠른 참조표',
    summary: '자주 쓰는 Git 명령을 검색하고 복사합니다.',
    description: 'Git 자주 쓰는 명령 빠른 참조표입니다. 검색과 한 줄 복사를 지원합니다.',
    categoryId: 'developers',
    layout: 'stack',
    keywords: ['Git', 'git 치트시트', 'git 명령'],
    faqs: [faq('명령이 실행되나요?', '아니요. 참조와 복사만 제공합니다.')],
  }),
  tool({
    id: 'nginx-cheatsheet',
    slug: 'nginx-cheatsheet',
    title: 'Nginx 구성 요약',
    summary: 'Nginx 구성 조각을 검색하고 복사합니다.',
    description: 'Nginx 리버스 프록시·HTTPS·캐시 등 자주 쓰는 구성 조각 요약표입니다.',
    categoryId: 'developers',
    layout: 'stack',
    keywords: ['Nginx', 'nginx 설정', '리버스 프록시'],
    faqs: [faq('설정이 서버에 적용되나요?', '아니요. 복사해 직접 붙여 넣는 참조표입니다.')],
  }),
  tool({
    id: 'firewall-cheatsheet',
    slug: 'firewall-cheatsheet',
    title: 'Linux 방화벽 요약',
    summary: 'iptables, firewalld, ufw 명령을 검색·복사합니다.',
    description: 'Linux 방화벽 일반 명령 요약표입니다. iptables, firewalld, ufw를 포함합니다.',
    categoryId: 'developers',
    layout: 'stack',
    keywords: ['iptables', 'firewalld', 'ufw', '방화벽'],
    faqs: [faq('명령이 실행되나요?', '아니요. 참조와 복사만 제공합니다.')],
  }),
  tool({
    id: 'linux-log-helper',
    slug: 'linux-log-helper',
    title: 'Linux 로그 도우미',
    summary: '로그 검색·압축 해제 명령을 빠르게 찾습니다.',
    description: 'journalctl, grep, tar/gzip 등 Linux 로그·압축 명령 빠른 참조표입니다.',
    categoryId: 'developers',
    layout: 'stack',
    keywords: ['journalctl', 'linux log', 'tar', 'gzip'],
    faqs: [faq('서버 로그를 읽나요?', '아니요. 명령 예시만 제공합니다.')],
  }),
  tool({
    id: 'linux-permissions',
    slug: 'linux-permissions',
    title: 'Linux 권한 계산기',
    summary: 'rwx 체크와 8진수 모드로 chmod 명령을 만듭니다.',
    description:
      '소유자·그룹·기타의 읽기·쓰기·실행을 체크하거나 640 같은 8진수를 입력해 rw-r----- 표기와 chmod 명령을 생성하는 도구입니다. 경로는 셸에 안전하게 인용합니다.',
    categoryId: 'developers',
    layout: 'stack',
    keywords: ['chmod', 'linux 권한', 'octal', 'rwx', '파일 권한'],
    faqs: [
      faq(
        '숫자와 체크박스가 같이 바뀌나요?',
        '네. 8진수를 바꾸면 체크박스가, 체크박스를 바꾸면 8진수와 기호 표기가 함께 갱신됩니다.',
      ),
      faq(
        '경로에 공백이 있으면?',
        "작은따옴표로 감싸 chmod 640 -- './path with space' 형태로 만듭니다.",
      ),
    ],
  }),
  tool({
    id: 'json-csv',
    slug: 'json-csv',
    title: 'JSON ↔ CSV',
    summary: 'JSON 배열과 CSV를 양방향으로 변환합니다.',
    description: 'JSON 배열을 CSV로, CSV를 JSON으로 변환하는 무료 온라인 도구입니다.',
    categoryId: 'converters',
    layout: 'stack',
    keywords: ['JSON CSV', 'csv to json', 'json to csv'],
    faqs: [faq('중첩 JSON도 되나요?', '객체 배열의 1단 필드 위주입니다. 깊은 중첩은 문자열로 남을 수 있습니다.')],
  }),
  tool({
    id: 'json-yaml',
    slug: 'json-yaml',
    title: 'JSON ↔ YAML',
    summary: 'JSON과 YAML을 양방향으로 변환합니다.',
    description: 'JSON과 YAML 구성을 서로 변환하는 브라우저 로컬 도구입니다.',
    categoryId: 'converters',
    layout: 'stack',
    keywords: ['JSON YAML', 'yaml to json', 'json to yaml'],
    faqs: [faq('서버로 보내나요?', '아니요. 브라우저에서만 변환합니다.')],
  }),
  tool({
    id: 'json-xml',
    slug: 'json-xml',
    title: 'JSON ↔ XML',
    summary: 'JSON과 XML을 양방향으로 변환합니다.',
    description: 'JSON과 XML을 상호 변환하는 온라인 도구입니다. 로컬에서 처리합니다.',
    categoryId: 'converters',
    layout: 'stack',
    keywords: ['JSON XML', 'xml to json', 'json to xml'],
    faqs: [faq('복잡한 스키마도 완벽한가요?', '일반적인 변환에 초점을 둡니다. 네임스페이스·속성 규칙은 단순화되어 있습니다.')],
  }),
  tool({
    id: 'json-toml',
    slug: 'json-toml',
    title: 'JSON ↔ TOML',
    summary: 'JSON과 TOML을 양방향으로 변환합니다.',
    description: 'JSON과 TOML 구성 파일을 상호 변환하는 도구입니다.',
    categoryId: 'converters',
    layout: 'stack',
    keywords: ['JSON TOML', 'toml to json', 'json to toml'],
    faqs: [faq('서버 전송?', '없습니다. 로컬 변환입니다.')],
  }),
  tool({
    id: 'yaml-toml',
    slug: 'yaml-toml',
    title: 'YAML ↔ TOML',
    summary: 'YAML과 TOML을 양방향으로 변환합니다.',
    description: 'YAML과 TOML 구성을 상호 변환하는 무료 온라인 도구입니다.',
    categoryId: 'converters',
    layout: 'stack',
    keywords: ['YAML TOML', 'toml to yaml', 'yaml to toml'],
    faqs: [faq('로컬 처리인가요?', '네.')],
  }),
  tool({
    id: 'color-converter',
    slug: 'color-converter',
    title: '색상 변환기',
    summary: 'HEX, RGB, HSL 색상을 서로 변환합니다.',
    description: 'HEX, RGB, HSL 및 미리보기로 색상을 변환하는 온라인 도구입니다.',
    categoryId: 'converters',
    layout: 'stack',
    keywords: ['색상 변환', 'HEX RGB HSL', 'color converter'],
    faqs: [faq('CSS 이름도 되나요?', 'HEX/RGB/HSL 변환에 초점을 둡니다.')],
  }),
  tool({
    id: 'json-formatter',
    slug: 'json-formatter',
    title: 'JSON 포매터',
    summary: 'JSON 원문을 들여쓰기하거나 한 줄로 압축합니다.',
    description:
      'JSON을 보기 좋게 들여쓰기하거나 압축하는 무료 JSON 포매터입니다. 브라우저 로컬에서만 처리합니다.',
    categoryId: 'json',
    layout: 'split',
    keywords: ['JSON 포매터', 'json prettier', 'json minify'],
    faqs: [
      faq('잘못된 JSON은?', '오류 메시지를 표시하고 포맷하지 않습니다.'),
    ],
  }),
  tool({
    id: 'json-visualizer',
    slug: 'json-visualizer',
    title: 'JSON 시각화',
    summary: 'JSON을 트리 구조로 펼쳐 봅니다.',
    description: 'JSON 데이터를 접고 펼 수 있는 트리로 시각화하는 도구입니다.',
    categoryId: 'json',
    layout: 'stack',
    keywords: ['JSON 트리', 'json visualizer', 'JSON 시각화'],
    faqs: [faq('큰 JSON도?', '브라우저 메모리 한도 안에서 동작합니다.')],
  }),
  tool({
    id: 'json-generator',
    slug: 'json-generator',
    title: 'JSON 데이터 생성기',
    summary: '테스트용 모의 JSON을 생성합니다.',
    description: '필드 타입을 골라 테스트용 모의 JSON 배열을 생성하는 도구입니다.',
    categoryId: 'json',
    layout: 'stack',
    keywords: ['JSON 생성', 'mock json', '테스트 데이터'],
    faqs: [faq('서버 저장?', '생성 결과는 브라우저에만 있습니다.')],
  }),
  tool({
    id: 'json-diff',
    slug: 'json-diff',
    title: 'JSON 차이 비교',
    summary: '두 JSON의 추가·삭제·변경 경로를 비교합니다.',
    description: '두 JSON 문서의 차이를 경로 단위로 비교하는 온라인 도구입니다.',
    categoryId: 'json',
    layout: 'split',
    keywords: ['JSON diff', 'JSON 비교'],
    faqs: [faq('로컬인가요?', '네. 브라우저에서만 비교합니다.')],
  }),
  tool({
    id: 'json-key-fixer',
    slug: 'json-key-fixer',
    title: 'JSON 키 비교·수정',
    summary: '번역 파일 키 구조 차이를 찾고 채웁니다.',
    description:
      '다국어 JSON의 키 구조 차이를 감지하고 누락 키를 채우는 도구입니다. 로컬에서 처리합니다.',
    categoryId: 'json',
    layout: 'split',
    keywords: ['i18n 키', 'JSON 키 비교', 'locale sync'],
    faqs: [faq('원본을 덮어쓰나요?', '결과 텍스트만 만들며 파일을 직접 수정하지 않습니다.')],
  }),
  tool({
    id: 'jwt-parser',
    slug: 'jwt-parser',
    title: 'JWT 파서',
    summary: 'Header·Payload·시간 클레임을 확인하고 서명은 검증하지 않습니다.',
    description:
      'JWT Header와 Payload를 디코딩하고 iat/exp/nbf 시간 클레임을 읽는 도구입니다. 서명 미검증이며 토큰은 서버로 보내지 않습니다.',
    categoryId: 'json',
    layout: 'split',
    keywords: ['JWT 파서', 'jwt decode', '토큰 클레임', '서명 미검증'],
    faqs: [
      faq('서명을 검증하나요?', '아니요. 서명 미검증으로 표시합니다.'),
      faq('토큰이 유출되나요?', '브라우저 메모리에서만 디코딩합니다.'),
    ],
  }),
  tool({
    id: 'qr-code-generator',
    slug: 'qr-code-generator',
    title: 'QR 코드 생성기',
    summary: '텍스트로 QR 코드 이미지를 생성합니다.',
    description: 'URL·텍스트로 QR 코드 이미지를 생성하는 무료 온라인 도구입니다.',
    categoryId: 'images',
    layout: 'stack',
    keywords: ['QR 코드', 'qr generator', 'QR 생성'],
    faqs: [faq('로컬 생성인가요?', '네. 브라우저에서 이미지를 만듭니다.')],
  }),
  tool({
    id: 'svg-placeholder',
    slug: 'svg-placeholder',
    title: 'SVG 플레이스홀더',
    summary: '크기·색·텍스트로 SVG 플레이스홀더를 만듭니다.',
    description: '가로·세로·배경·텍스트로 SVG 플레이스홀더를 생성하는 도구입니다.',
    categoryId: 'images',
    layout: 'stack',
    keywords: ['SVG placeholder', '플레이스홀더 이미지'],
    faqs: [faq('다운로드?', 'SVG 마크업을 복사하거나 미리볼 수 있습니다.')],
  }),
  tool({
    id: 'icon-designer',
    slug: 'icon-designer',
    title: '아이콘 디자이너',
    summary: '텍스트와 색으로 간단한 아이콘 SVG를 만듭니다.',
    description:
      '텍스트·이모지와 색상으로 간단한 정사각 아이콘 SVG를 디자인하는 도구입니다. 아이콘 라이브러리 전체 대체는 아닙니다.',
    categoryId: 'images',
    layout: 'stack',
    keywords: ['아이콘 생성', 'favicon', 'SVG 아이콘'],
    faqs: [faq('아이콘 팩이 있나요?', '텍스트 기반 간단 생성에 초점을 둔 경량 도구입니다.')],
  }),
  tool({
    id: 'base64-image',
    slug: 'base64-image',
    title: 'Base64 이미지 변환기',
    summary: '이미지와 Base64 data URL을 서로 변환합니다.',
    description: '이미지를 Base64 data URL로 인코딩하거나 Base64를 이미지로 미리 보는 도구입니다.',
    categoryId: 'images',
    layout: 'stack',
    keywords: ['Base64 이미지', 'data url', 'image base64'],
    faqs: [faq('업로드가 서버로?', 'FileReader로 브라우저에서만 읽습니다.')],
  }),
  tool({
    id: 'image-dot-matrix',
    slug: 'image-dot-matrix',
    title: '도트 매트릭스 변환',
    summary: '이미지나 텍스트를 도트 매트릭스 효과로 변환합니다.',
    description: '이미지나 텍스트를 간단한 도트 매트릭스 스타일로 변환하는 브라우저 도구입니다.',
    categoryId: 'images',
    layout: 'stack',
    keywords: ['도트 매트릭스', 'pixelate', 'dot matrix'],
    faqs: [faq('원본 이미지가 전송되나요?', '아니요. 캔버스에서 로컬 처리합니다.')],
  }),
  tool({
    id: 'uuid-generator',
    slug: 'uuid-generator',
    title: 'UUID 생성기',
    summary: 'UUID v4를 개수와 출력 형식에 맞춰 생성합니다.',
    description:
      'UUID v4를 브라우저에서 생성하는 도구입니다. 개수, 대문자, 하이픈 옵션과 복사를 지원합니다.',
    categoryId: 'generators',
    layout: 'stack',
    keywords: ['UUID 생성기', 'GUID', 'uuid v4'],
    faqs: [
      faq('버전은?', 'crypto.randomUUID 기반 UUID v4입니다.'),
      faq('몇 개까지?', '1~1000개입니다.'),
    ],
  }),
  tool({
    id: 'password-generator',
    slug: 'password-generator',
    title: '비밀번호 생성기',
    summary: '안전한 무작위 비밀번호를 생성합니다.',
    description:
      '길이·문자 종류를 골라 무작위 비밀번호를 생성하는 도구입니다. crypto.getRandomValues를 쓰며 서버로 보내지 않습니다.',
    categoryId: 'generators',
    layout: 'stack',
    keywords: ['비밀번호 생성', 'password generator', '랜덤 패스워드'],
    faqs: [faq('저장하나요?', '아니요. 화면에만 표시합니다.')],
  }),
  tool({
    id: 'docker-run-to-compose',
    slug: 'docker-run-to-compose',
    title: 'Docker Run → Compose',
    summary: 'docker run 명령을 compose YAML로 변환합니다.',
    description:
      'docker run 명령을 docker-compose.yml 조각으로 변환하는 도구입니다. 자주 쓰는 옵션 위주입니다.',
    categoryId: 'docker',
    layout: 'stack',
    keywords: ['docker run', 'docker compose', 'compose 변환'],
    faqs: [faq('모든 플래그를 지원하나요?', '이름·포트·환경·볼륨·detach 등 일반 옵션 중심입니다.')],
  }),
  tool({
    id: 'docker-compose-generator',
    slug: 'docker-compose-generator',
    title: 'Docker Compose 예제 생성기',
    summary:
      'MySQL·MariaDB·PostgreSQL·Redis·Nginx 프리셋으로 compose.yaml과 .env.example을 만듭니다.',
    description:
      '서비스와 포트·네트워크·볼륨·헬스체크 옵션을 고르면 compose.yaml과 .env.example이 즉시 갱신되는 Docker Compose 예제 생성기입니다. 이미지와 환경변수 기본값은 아카이브 Compose 문서를 따릅니다.',
    categoryId: 'docker',
    layout: 'split',
    keywords: [
      'Docker Compose 생성기',
      'compose.yaml',
      'MySQL Compose',
      'MariaDB Compose',
      'PostgreSQL Compose',
      'Redis Compose',
      'Nginx Compose',
      '.env.example',
    ],
    faqs: [
      faq(
        '비밀번호를 어디에 두나요?',
        'Compose에서는 ${VAR}로 참조하고, .env.example에 변수명과 교체용 예시값을 둡니다. 실제 비밀은 .env에 넣습니다.',
      ),
      faq(
        '문서와 같나요?',
        'MySQL 8.4, MariaDB 11.4, PostgreSQL 18, Redis 7 기본값은 Knowledge Compose 예제와 맞춥니다. 화면에서 관련 문서로 이동할 수 있습니다.',
      ),
    ],
  }),
  tool({
    id: 'compose-diff',
    slug: 'compose-diff',
    title: 'Compose 설정 비교기',
    summary: '두 Compose YAML의 서비스·이미지·포트·볼륨·네트워크·환경변수 차이를 비교합니다.',
    description:
      'Compose YAML 두 개를 의미 단위로 비교합니다. 서비스 추가·삭제, 이미지 태그, 포트, 볼륨, 네트워크, 환경변수 참조 차이를 보여 주고 키 순서·들여쓰기만 다른 경우는 무시합니다.',
    categoryId: 'docker',
    layout: 'split',
    keywords: ['compose diff', 'docker compose 비교', 'yaml 비교'],
    faqs: [
      faq(
        '들여쓰기만 달라도 차이가 나오나요?',
        '아니요. 키 순서나 들여쓰기만 다른 경우는 설정 변경으로 표시하지 않습니다.',
      ),
    ],
  }),
  tool({
    id: 'docker-cheatsheet',
    slug: 'docker-cheatsheet',
    title: 'Docker 명령 참조',
    summary: '자주 쓰는 Docker 명령을 검색·복사합니다.',
    description: 'Docker 이미지·컨테이너·로그 명령 빠른 참조표입니다.',
    categoryId: 'docker',
    layout: 'stack',
    keywords: ['Docker 치트시트', 'docker 명령'],
    faqs: [faq('실행되나요?', '참조와 복사만 합니다.')],
  }),
  tool({
    id: 'nginx-reverse-proxy',
    slug: 'nginx-reverse-proxy',
    title: 'Nginx 리버스 프록시 설정 생성기',
    summary: 'HTTP·WebSocket·SSE 프리셋으로 리버스 프록시 설정을 생성합니다.',
    description:
      '도메인·경로·업스트림으로 Nginx 리버스 프록시 설정을 만드는 도구입니다. 경로 접두사 유지/제거와 실제 전달 경로 예시를 제공합니다.',
    categoryId: 'infra',
    layout: 'stack',
    keywords: ['Nginx', '리버스 프록시', 'WebSocket', 'SSE', 'proxy_pass'],
    faqs: [
      faq(
        '경로 제거는 어떻게 되나요?',
        'proxy_pass URL 끝의 슬래시 유무로 prefix 유지와 제거를 구분하고, 전달 경로 예시를 함께 보여 줍니다.',
      ),
    ],
  }),
  tool({
    id: 'jar-command-generator',
    slug: 'jar-command-generator',
    title: 'JAR 빌드 및 실행 명령 생성기',
    summary:
      'Gradle 빌드와 java -jar 실행을 한 화면에서 맞춰 셸 명령을 만듭니다.',
    description:
      '빌드 후 실행·빌드만·실행만 모드로 Gradle bootJar/jar와 java -jar 명령을 생성합니다. 환경변수는 빌드·실행·둘 다에 선택 적용하며, 공백·따옴표를 안전하게 인용합니다.',
    categoryId: 'java',
    layout: 'stack',
    keywords: [
      'Gradle',
      'bootJar',
      'java -jar',
      'JAR 실행',
      'Spring Boot',
      'Xmx',
    ],
    faqs: [
      faq(
        '빌드 실패 시 실행되나요?',
        '빌드 후 실행 모드는 두 명령을 && 로 이어 빌드가 실패하면 실행 명령을 호출하지 않습니다.',
      ),
      faq(
        '환경변수 적용 위치는?',
        '행마다 빌드, 실행, 둘 다를 고릅니다. Spring 프로필·포트는 실행 인자와 환경변수가 겹치면 인자를 생략합니다.',
      ),
    ],
  }),
  tool({
    id: 'spring-env-compare',
    slug: 'spring-env-compare',
    title: 'Spring 환경변수 비교기',
    summary: 'application 설정과 .env.example의 ${NAME} 참조를 비교합니다.',
    description:
      'application.yml/properties의 ${NAME}·${NAME:default}와 .env.example을 비교해 정의·빈 값·필수 누락·기본값·미사용 키를 표시합니다. 누락 키는 KEY= 형태로 복사할 수 있습니다.',
    categoryId: 'spring',
    layout: 'split',
    keywords: ['Spring', '환경변수', '.env.example', 'application.yml'],
    faqs: [
      faq(
        '기본값이 있는 키도 누락인가요?',
        '${NAME:default}는 기본값 있는 키로 분류하고, 기본값 없는 ${NAME}만 필수 누락으로 봅니다.',
      ),
    ],
  }),
  tool({
    id: 'json-field-mapper',
    slug: 'json-field-mapper',
    title: 'JSON 필드 매핑 비교기',
    summary: '원본·대상 JSON 필드 경로와 타입을 비교하고 매핑표를 Markdown으로 복사합니다.',
    description:
      '원본과 대상 JSON의 필드 경로·타입을 나란히 보여 주고, 이름이 다른 필드를 직접 연결합니다. 미매핑·타입 차이를 표시하며 결과는 Markdown 표로 복사합니다.',
    categoryId: 'api',
    layout: 'split',
    keywords: ['JSON 매핑', '필드 매핑', 'API 연동', 'schema mapping'],
    faqs: [
      faq(
        '결과가 무엇인가요?',
        '연동 가이드에 붙일 Markdown 표(원본 경로, 대상 경로, 타입, 비고)를 복사할 수 있습니다.',
      ),
    ],
  }),
  tool({
    id: 'http-header-analyzer',
    slug: 'http-header-analyzer',
    title: 'HTTP 헤더 분석기',
    summary: '요청·응답 헤더를 캐시·CORS·콘텐츠·프록시 관점으로 정리합니다.',
    description:
      '붙여 넣은 HTTP 헤더를 읽어 캐시, CORS, 콘텐츠 유형, 프록시 관련 항목을 정리합니다. 동일 헤더가 여러 줄이면 각각 표시합니다.',
    categoryId: 'api',
    layout: 'stack',
    keywords: ['HTTP 헤더', 'CORS', 'Cache-Control', 'X-Forwarded'],
    faqs: [
      faq(
        '중복 헤더는?',
        '같은 이름이 여러 줄이면 각각 개별 항목으로 보여 줍니다.',
      ),
    ],
  }),
  tool({
    id: 'dns-record-generator',
    slug: 'dns-record-generator',
    title: 'DNS 레코드 예제 생성기',
    summary: 'A·AAAA·CNAME·TXT 레코드로 DNS 예시와 Route 53 JSON을 생성합니다.',
    description:
      'A, AAAA, CNAME, TXT와 TTL을 입력받아 DNS 설정 예시와 Route 53 변경 요청용 JSON을 생성하고 복사합니다.',
    categoryId: 'network',
    layout: 'stack',
    keywords: ['DNS', 'Route 53', 'A 레코드', 'CNAME', 'TXT'],
    faqs: [
      faq(
        'Route 53 JSON은?',
        'ChangeResourceRecordSets에 넣을 ChangeBatch 형태의 예시를 만듭니다.',
      ),
    ],
  }),
  tool({
    id: 'base64',
    slug: 'base64',
    title: 'Base64 / Base64URL',
    summary: '문자열을 Base64 또는 Base64URL로 인코딩·디코딩합니다.',
    description: 'Base64와 Base64URL 인코딩·디코딩 도구입니다. UTF-8 문자열을 로컬에서 변환합니다.',
    categoryId: 'text',
    layout: 'stack',
    keywords: ['Base64', 'Base64URL', '인코딩'],
    faqs: [faq('차이는?', 'Base64URL은 URL·JWT에 안전한 문자셋을 사용합니다.')],
  }),
  tool({
    id: 'url-codec',
    slug: 'url-codec',
    title: 'URL 인코딩 / 디코딩',
    summary: 'URL percent-encoding으로 변환합니다.',
    description: 'URL 구성요소 percent-encoding 인코딩·디코딩 도구입니다.',
    categoryId: 'text',
    layout: 'stack',
    keywords: ['URL 인코딩', 'url decode', 'percent encoding'],
    faqs: [faq('한글도?', 'encodeURIComponent 기준으로 처리합니다.')],
  }),
  tool({
    id: 'hash-generator',
    slug: 'hash-generator',
    title: '해시 생성기',
    summary: 'MD5, SHA-1, SHA-256, SHA-512 해시를 계산합니다.',
    description:
      'MD5·SHA-1·SHA-256·SHA-512 해시를 한 화면에서 선택해 계산하는 도구입니다. 비밀번호 저장용으로는 권장하지 않습니다.',
    categoryId: 'crypto',
    layout: 'stack',
    keywords: ['MD5', 'SHA-1', 'SHA-256', 'SHA-512', '해시'],
    faqs: [
      faq('비밀번호에 쓰나요?', '솔트·느린 KDF가 있는 전용 방식을 쓰세요.'),
      faq('MD5는 안전한가요?', '무결성 확인용이며 암호 저장에는 부적합합니다.'),
    ],
  }),
  tool({
    id: 'sha-hash',
    slug: 'sha-hash',
    title: 'SHA-256 / SHA-512',
    summary: '해시 생성기와 같은 화면입니다. (이전 URL 유지)',
    description:
      'SHA 해시 계산 화면입니다. MD5·SHA-1 포함 통합 해시 생성기와 동일한 구현을 사용합니다.',
    categoryId: 'crypto',
    layout: 'stack',
    keywords: ['SHA-256', 'SHA-512', 'sha hash'],
    faqs: [faq('hash-generator와 다른가요?', '같은 도구의 별칭 URL입니다.')],
  }),
  tool({
    id: 'hex-codec',
    slug: 'hex-codec',
    title: '16진수 인코더/디코더',
    summary: '문자열과 16진수를 서로 변환합니다.',
    description: 'UTF-8 문자열과 16진수 표현을 인코딩·디코딩하는 도구입니다.',
    categoryId: 'crypto',
    layout: 'stack',
    keywords: ['hex', '16진수', 'hex encode'],
    faqs: [faq('로컬?', '네.')],
  }),
  tool({
    id: 'binary-codec',
    slug: 'binary-codec',
    title: '이진 인코더/디코더',
    summary: '문자열과 이진 비트열을 서로 변환합니다.',
    description: 'UTF-8 문자열과 이진(bit) 문자열을 변환하는 도구입니다.',
    categoryId: 'crypto',
    layout: 'stack',
    keywords: ['binary', '이진 인코딩', 'bit string'],
    faqs: [faq('로컬?', '네.')],
  }),
  tool({
    id: 'aes-gcm',
    slug: 'aes-gcm',
    title: 'AES-GCM 암복호화',
    summary: '암호 문구 기반 AES-256-GCM으로 암복호화합니다.',
    description:
      'PBKDF2+AES-256-GCM으로 암복호화하는 브라우저 도구입니다. 운영 시크릿은 Vault 등 전용 저장소를 쓰세요.',
    categoryId: 'crypto',
    layout: 'stack',
    keywords: ['AES-GCM', 'AES-256', '암호화', '복호화'],
    faqs: [faq('운영 비밀에?', '데모·짧은 메모용입니다. 전용 시크릿 저장소를 권장합니다.')],
  }),
  tool({
    id: 'rsa-crypto',
    slug: 'rsa-crypto',
    title: 'RSA 암복호화',
    summary: 'RSA-OAEP 키 생성과 암복호화를 로컬에서 수행합니다.',
    description:
      'Web Crypto RSA-OAEP로 키쌍 생성·암복호화하는 도구입니다. 데모용이며 키는 서버로 보내지 않습니다.',
    categoryId: 'crypto',
    layout: 'stack',
    keywords: ['RSA', 'RSA-OAEP', '비대칭 암호'],
    faqs: [faq('키 관리?', '브라우저에만 있으며 새로고침 시 사라질 수 있습니다. 직접 복사해 보관하세요.')],
  }),
  tool({
    id: 'hmac-generator',
    slug: 'hmac-generator',
    title: 'HMAC 생성기',
    summary: 'HMAC-SHA256/512 메시지 인증 코드를 생성합니다.',
    description: '키와 메시지로 HMAC을 생성하는 브라우저 로컬 도구입니다.',
    categoryId: 'crypto',
    layout: 'stack',
    keywords: ['HMAC', 'HMAC-SHA256', '메시지 인증'],
    faqs: [faq('키를 저장하나요?', '아니요.')],
  }),
  tool({
    id: 'ip-lookup',
    slug: 'ip-lookup',
    title: 'IP 주소 조회',
    summary: '동의 후 IP 위치·네트워크 정보를 조회합니다.',
    description:
      'IP 주소의 지리·네트워크 정보를 조회합니다. ipapi.co로 요청하며, 전송 전에 대상과 데이터를 확인하고 동의한 뒤에만 실행합니다.',
    categoryId: 'network',
    layout: 'stack',
    keywords: ['IP 조회', 'ip lookup', 'geoip'],
    faqs: [
      faq('자동 조회되나요?', '아니요. 동의 후에만 외부 API를 호출합니다.'),
      faq('어떤 API?', '기본은 https://ipapi.co/ 입니다.'),
    ],
    external: true,
  }),
  tool({
    id: 'time-converter',
    slug: 'time-converter',
    title: '시간 변환기',
    summary: 'Epoch 초·밀리초와 ISO 8601(UTC/KST)을 양방향으로 변환합니다.',
    description:
      'Epoch 초, Epoch 밀리초, ISO 8601을 서로 변환하는 도구입니다. 시간대가 명시된 ISO는 그대로 쓰고, 없는 값은 UTC 또는 KST로 해석합니다.',
    categoryId: 'time',
    layout: 'stack',
    keywords: [
      '타임스탬프',
      '밀리초 변환',
      'epoch',
      'ISO 8601',
      'UTC',
      'KST',
      '시간 변환',
    ],
    faqs: [
      faq(
        'UTC와 KST가 같은 Epoch인가요?',
        '같은 순간이면 ISO UTC와 ISO KST는 서로 다른 문자열이지만 Epoch 초·밀리초는 동일합니다.',
      ),
      faq(
        '시간대가 없는 ISO는?',
        'UTC로 해석 또는 KST(+09:00)로 해석을 직접 선택합니다. Z나 +09:00이 있으면 그 값을 씁니다.',
      ),
    ],
  }),
];

export function getTool(id: ToolId): ToolDefinition {
  const found = TOOLS.find((item) => item.id === id);
  if (!found) {
    throw new Error(`Unknown tool: ${id}`);
  }
  return found;
}

export function getToolBySlug(slug: string): ToolDefinition | undefined {
  return TOOLS.find((item) => item.slug === slug);
}

export function filterTools(query: string): ToolDefinition[] {
  const q = query.trim().toLowerCase();
  if (!q) {
    return TOOLS;
  }
  return TOOLS.filter((toolItem) => {
    const haystack = [
      toolItem.title,
      toolItem.summary,
      toolItem.description,
      toolItem.slug,
      ...toolItem.keywords,
    ]
      .join(' ')
      .toLowerCase();
    return haystack.includes(q);
  });
}
