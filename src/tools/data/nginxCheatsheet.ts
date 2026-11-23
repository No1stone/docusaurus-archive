import type {CheatsheetEntry} from '../components/CheatsheetTool';

export const NGINX_CHEATSHEET_ENTRIES: CheatsheetEntry[] = [
  {
    id: 'nginx-test',
    category: '설정',
    title: '설정 문법 검사',
    command: 'sudo nginx -t',
  },
  {
    id: 'nginx-reload',
    category: '서비스',
    title: '설정 반영(무중단)',
    command: 'sudo nginx -s reload',
  },
  {
    id: 'nginx-start',
    category: '서비스',
    title: '시작',
    command: 'sudo systemctl start nginx',
  },
  {
    id: 'nginx-status',
    category: '서비스',
    title: '상태 확인',
    command: 'systemctl status nginx',
  },
  {
    id: 'nginx-logs-access',
    category: '로그',
    title: '액세스 로그 실시간',
    command: 'sudo tail -f /var/log/nginx/access.log',
  },
  {
    id: 'nginx-logs-error',
    category: '로그',
    title: '에러 로그 실시간',
    command: 'sudo tail -f /var/log/nginx/error.log',
  },
  {
    id: 'curl-header',
    category: '진단',
    title: '응답 헤더만 확인',
    command: 'curl -I https://example.com',
  },
  {
    id: 'curl-vhost',
    category: '진단',
    title: '가상 호스트 지정 요청',
    command: 'curl -H "Host: example.com" http://127.0.0.1/',
  },
  {
    id: 'openssl-sni',
    category: 'TLS',
    title: 'SNI 인증서 확인',
    command: 'openssl s_client -connect example.com:443 -servername example.com </dev/null',
  },
  {
    id: 'certbot',
    category: 'TLS',
    title: "Let's Encrypt 발급",
    command: 'sudo certbot --nginx -d example.com',
  },
  {
    id: 'nginx-locations',
    category: '설정',
    title: '설정에서 location 블록 찾기',
    command: 'grep -R "location " /etc/nginx/',
  },
];