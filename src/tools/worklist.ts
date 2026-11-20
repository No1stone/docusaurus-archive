/**
 * ToolkitPub(ko) 전체 목록 대조표.
 * 양방향·해시 계열은 한 화면으로 묶되, 묶인 방향/알고리즘은 각각 검증한다.
 */
export type WorkItemStatus =
  | 'implemented-local'
  | 'implemented-external'
  | 'alias';

export type WorkItem = {
  source: string;
  path: string;
  verify: string;
  privacy: 'local' | 'external-consent';
  status: WorkItemStatus;
};

export const TOOLKITPUB_WORKLIST: WorkItem[] = [
  // 개발자 도구
  {
    source: '크론 표현식 해석기',
    path: '/tools/cron-parser',
    verify: '유효 cron → 다음 실행 시각 목록',
    privacy: 'local',
    status: 'implemented-local',
  },
  {
    source: 'cURL 명령 변환기',
    path: '/tools/curl-converter',
    verify: 'curl→코드 변환 + 동의 후 요청 테스트',
    privacy: 'external-consent',
    status: 'implemented-external',
  },
  {
    source: 'Git 빠른 참조표',
    path: '/tools/git-cheatsheet',
    verify: '검색·명령 복사',
    privacy: 'local',
    status: 'implemented-local',
  },
  {
    source: 'Nginx 구성 요약',
    path: '/tools/nginx-cheatsheet',
    verify: '검색·조각 복사',
    privacy: 'local',
    status: 'implemented-local',
  },
  {
    source: 'Linux 방화벽 요약',
    path: '/tools/firewall-cheatsheet',
    verify: 'iptables/firewalld/ufw 검색·복사',
    privacy: 'local',
    status: 'implemented-local',
  },
  {
    source: 'Linux 로그 도우미',
    path: '/tools/linux-log-helper',
    verify: '로그/압축 명령 검색·복사',
    privacy: 'local',
    status: 'implemented-local',
  },
  // 변환기 (양방향 묶음)
  {
    source: 'JSON↔CSV (json-to-csv, csv-to-json)',
    path: '/tools/json-csv',
    verify: '양방향 변환',
    privacy: 'local',
    status: 'implemented-local',
  },
  {
    source: 'JSON↔YAML (json-to-yaml, yaml-to-json)',
    path: '/tools/json-yaml',
    verify: '양방향 변환',
    privacy: 'local',
    status: 'implemented-local',
  },
  {
    source: 'JSON↔XML (json-to-xml, xml-to-json)',
    path: '/tools/json-xml',
    verify: '양방향 변환',
    privacy: 'local',
    status: 'implemented-local',
  },
  {
    source: 'JSON↔TOML (json-to-toml, toml-to-json)',
    path: '/tools/json-toml',
    verify: '양방향 변환',
    privacy: 'local',
    status: 'implemented-local',
  },
  {
    source: 'YAML↔TOML (yaml-to-toml, toml-to-yaml)',
    path: '/tools/yaml-toml',
    verify: '양방향 변환',
    privacy: 'local',
    status: 'implemented-local',
  },
  {
    source: '색상 변환기',
    path: '/tools/color-converter',
    verify: 'HEX/RGB/HSL 변환',
    privacy: 'local',
    status: 'implemented-local',
  },
  // JSON
  {
    source: 'JSON 포맷터',
    path: '/tools/json-formatter',
    verify: '포맷·압축·오류',
    privacy: 'local',
    status: 'implemented-local',
  },
  {
    source: 'JSON 시각화',
    path: '/tools/json-visualizer',
    verify: '트리 표시',
    privacy: 'local',
    status: 'implemented-local',
  },
  {
    source: 'JSON 데이터 생성기',
    path: '/tools/json-generator',
    verify: '모의 JSON 생성',
    privacy: 'local',
    status: 'implemented-local',
  },
  {
    source: 'JSON 차이 비교',
    path: '/tools/json-diff',
    verify: '경로별 diff',
    privacy: 'local',
    status: 'implemented-local',
  },
  {
    source: 'JSON 키 비교 및 수정',
    path: '/tools/json-key-fixer',
    verify: '누락 키 감지·채우기',
    privacy: 'local',
    status: 'implemented-local',
  },
  {
    source: 'JWT 파서 (추가 요청)',
    path: '/tools/jwt-parser',
    verify: 'Header/Payload/시간 클레임·서명 미검증',
    privacy: 'local',
    status: 'implemented-local',
  },
  // 이미지
  {
    source: 'QR 코드 생성기',
    path: '/tools/qr-code-generator',
    verify: 'QR 미리보기',
    privacy: 'local',
    status: 'implemented-local',
  },
  {
    source: 'SVG 플레이스홀더',
    path: '/tools/svg-placeholder',
    verify: 'SVG 생성·복사',
    privacy: 'local',
    status: 'implemented-local',
  },
  {
    source: '아이콘 디자이너',
    path: '/tools/icon-designer',
    verify: '텍스트 아이콘 SVG',
    privacy: 'local',
    status: 'implemented-local',
  },
  {
    source: 'Base64 이미지 변환기',
    path: '/tools/base64-image',
    verify: '이미지↔Base64',
    privacy: 'local',
    status: 'implemented-local',
  },
  {
    source: '이미지를 도트 매트릭스로',
    path: '/tools/image-dot-matrix',
    verify: '도트 미리보기',
    privacy: 'local',
    status: 'implemented-local',
  },
  // 생성
  {
    source: 'UUID 생성기',
    path: '/tools/uuid-generator',
    verify: '개수·대문자·하이픈·복사',
    privacy: 'local',
    status: 'implemented-local',
  },
  {
    source: '비밀번호 생성기',
    path: '/tools/password-generator',
    verify: '옵션별 생성',
    privacy: 'local',
    status: 'implemented-local',
  },
  // Docker
  {
    source: 'Docker Run → Compose',
    path: '/tools/docker-run-to-compose',
    verify: 'docker run 파싱→compose',
    privacy: 'local',
    status: 'implemented-local',
  },
  {
    source: 'Docker Compose 예제 생성기 (추가)',
    path: '/tools/docker-compose-generator',
    verify: '프리셋·포트·네트워크·볼륨 → compose.yaml/.env + compose config',
    privacy: 'local',
    status: 'implemented-local',
  },
  {
    source: 'Compose 설정 비교기 (추가)',
    path: '/tools/compose-diff',
    verify: '서비스/이미지/포트/볼륨/네트워크/env 의미 비교',
    privacy: 'local',
    status: 'implemented-local',
  },
  {
    source: 'Docker 명령어 빠른 참조',
    path: '/tools/docker-cheatsheet',
    verify: '검색·복사',
    privacy: 'local',
    status: 'implemented-local',
  },
  {
    source: 'Nginx 리버스 프록시 설정 생성기 (추가)',
    path: '/tools/nginx-reverse-proxy',
    verify: 'HTTP/WS/SSE·경로 keep/strip + nginx -t',
    privacy: 'local',
    status: 'implemented-local',
  },
  {
    source: 'Spring 환경변수 비교기 (추가)',
    path: '/tools/spring-env-compare',
    verify: '${NAME} vs .env.example 분류·누락 KEY= 복사',
    privacy: 'local',
    status: 'implemented-local',
  },
  {
    source: 'JSON 필드 매핑 비교기 (추가)',
    path: '/tools/json-field-mapper',
    verify: '경로·타입·매핑 Markdown',
    privacy: 'local',
    status: 'implemented-local',
  },
  {
    source: 'DNS 레코드 예제 생성기 (추가)',
    path: '/tools/dns-record-generator',
    verify: 'zone 예시 + Route53 JSON',
    privacy: 'local',
    status: 'implemented-local',
  },
  {
    source: 'HTTP 헤더 분석기 (추가)',
    path: '/tools/http-header-analyzer',
    verify: '캐시·CORS·콘텐츠·프록시·중복 헤더',
    privacy: 'local',
    status: 'implemented-local',
  },
  // 텍스트
  {
    source: 'Base64 인코딩/디코딩',
    path: '/tools/base64',
    verify: 'Base64/Base64URL',
    privacy: 'local',
    status: 'implemented-local',
  },
  {
    source: 'URL 인코딩/디코딩',
    path: '/tools/url-codec',
    verify: '인코딩·디코딩',
    privacy: 'local',
    status: 'implemented-local',
  },
  // 암호화 (해시 묶음)
  {
    source: 'MD5/SHA1/SHA256/SHA512 해시',
    path: '/tools/hash-generator',
    verify: '알고리즘별 해시',
    privacy: 'local',
    status: 'implemented-local',
  },
  {
    source: 'SHA-256/512 기존 URL',
    path: '/tools/sha-hash',
    verify: 'hash-generator와 동일 화면(별칭)',
    privacy: 'local',
    status: 'alias',
  },
  {
    source: '16진수 인코더/디코더',
    path: '/tools/hex-codec',
    verify: '양방향',
    privacy: 'local',
    status: 'implemented-local',
  },
  {
    source: '이진 인코더/디코더',
    path: '/tools/binary-codec',
    verify: '양방향',
    privacy: 'local',
    status: 'implemented-local',
  },
  {
    source: 'AES 암호화/복호기',
    path: '/tools/aes-gcm',
    verify: '암·복호화',
    privacy: 'local',
    status: 'implemented-local',
  },
  {
    source: 'RSA 암호화/복호화',
    path: '/tools/rsa-crypto',
    verify: '키 생성·암복호',
    privacy: 'local',
    status: 'implemented-local',
  },
  {
    source: 'HMAC 생성기',
    path: '/tools/hmac-generator',
    verify: 'HMAC 출력',
    privacy: 'local',
    status: 'implemented-local',
  },
  // 네트워크
  {
    source: 'IP 주소 조회',
    path: '/tools/ip-lookup',
    verify: '동의 후 ipapi.co 조회',
    privacy: 'external-consent',
    status: 'implemented-external',
  },
  // 시간
  {
    source: '밀리초 시간 변환기',
    path: '/tools/time-converter',
    verify: 'epoch s/ms ↔ ISO UTC/KST',
    privacy: 'local',
    status: 'implemented-local',
  },
];
