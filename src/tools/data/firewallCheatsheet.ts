import type {CheatsheetEntry} from '../components/CheatsheetTool';

export const FIREWALL_CHEATSHEET_ENTRIES: CheatsheetEntry[] = [
  {
    id: 'iptables-list',
    category: 'iptables',
    title: '규칙 목록',
    command: 'sudo iptables -L -n -v',
  },
  {
    id: 'iptables-allow-ssh',
    category: 'iptables',
    title: 'SSH 허용',
    command: 'sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT',
    note: '영구 반영은 배포판별 persist 도구를 씁니다.',
  },
  {
    id: 'iptables-save',
    category: 'iptables',
    title: '현재 규칙 저장(데비안)',
    command: 'sudo iptables-save | sudo tee /etc/iptables/rules.v4',
  },
  {
    id: 'firewalld-status',
    category: 'firewalld',
    title: '상태',
    command: 'sudo firewall-cmd --state',
  },
  {
    id: 'firewalld-list',
    category: 'firewalld',
    title: '허용 서비스·포트',
    command: 'sudo firewall-cmd --list-all',
  },
  {
    id: 'firewalld-http',
    category: 'firewalld',
    title: 'HTTP 영구 허용',
    command: 'sudo firewall-cmd --permanent --add-service=http && sudo firewall-cmd --reload',
  },
  {
    id: 'firewalld-port',
    category: 'firewalld',
    title: '포트 영구 개방',
    command: 'sudo firewall-cmd --permanent --add-port=8080/tcp && sudo firewall-cmd --reload',
  },
  {
    id: 'ufw-status',
    category: 'ufw',
    title: '상태',
    command: 'sudo ufw status verbose',
  },
  {
    id: 'ufw-allow',
    category: 'ufw',
    title: '포트 허용',
    command: 'sudo ufw allow 443/tcp',
  },
  {
    id: 'ufw-deny',
    category: 'ufw',
    title: '포트 차단',
    command: 'sudo ufw deny from 203.0.113.10 to any',
  },
  {
    id: 'ufw-enable',
    category: 'ufw',
    title: 'UFW 켜기',
    command: 'sudo ufw enable',
    note: 'SSH 포트를 먼저 allow 해 두세요.',
  },
  {
    id: 'ss-listen',
    category: '진단',
    title: '리스닝 소켓',
    command: 'sudo ss -tulpn',
  },
];