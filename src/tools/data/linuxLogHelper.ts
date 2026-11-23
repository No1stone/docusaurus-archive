import type {CheatsheetEntry} from '../components/CheatsheetTool';

export const LINUX_LOG_HELPER_ENTRIES: CheatsheetEntry[] = [
  {
    id: 'journalctl-follow',
    category: 'journalctl',
    title: '유닛 로그 실시간',
    command: 'journalctl -u nginx -f',
  },
  {
    id: 'journalctl-since',
    category: 'journalctl',
    title: '최근 1시간',
    command: 'journalctl --since "1 hour ago"',
  },
  {
    id: 'journalctl-priority',
    category: 'journalctl',
    title: '에러 이상만',
    command: 'journalctl -p err -b',
  },
  {
    id: 'journalctl-boot',
    category: 'journalctl',
    title: '이번 부팅 로그',
    command: 'journalctl -b',
  },
  {
    id: 'grep-log',
    category: 'grep',
    title: '로그 파일에서 검색',
    command: 'grep -i "error" /var/log/syslog',
  },
  {
    id: 'grep-context',
    category: 'grep',
    title: '앞뒤 줄 포함',
    command: 'grep -C 3 "timeout" /var/log/app/app.log',
  },
  {
    id: 'zgrep',
    category: 'grep',
    title: '압축 로그 검색',
    command: 'zgrep "OutOfMemory" /var/log/kern.log*.gz',
  },
  {
    id: 'tail-f',
    category: 'tail',
    title: '파일 끝 실시간',
    command: 'tail -n 200 -f /var/log/messages',
  },
  {
    id: 'tar-xzf',
    category: '압축',
    title: 'tar.gz 풀기',
    command: 'tar -xzf archive.tar.gz -C /tmp/extract',
  },
  {
    id: 'tar-czf',
    category: '압축',
    title: 'tar.gz 만들기',
    command: 'tar -czf backup.tar.gz /var/log/app/',
  },
  {
    id: 'gzip',
    category: '압축',
    title: 'gzip 압축',
    command: 'gzip -9 large.log',
  },
  {
    id: 'gunzip',
    category: '압축',
    title: 'gzip 해제',
    command: 'gunzip large.log.gz',
  },
  {
    id: 'zstd',
    category: '압축',
    title: 'zstd 압축·해제',
    command: 'zstd -d file.log.zst',
  },
];