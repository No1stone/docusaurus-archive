import type {ReactNode} from 'react';

import CheatsheetTool from '../components/CheatsheetTool';
import {FIREWALL_CHEATSHEET_ENTRIES} from '../data/firewallCheatsheet';

export default function FirewallCheatsheet(): ReactNode {
  return (
    <CheatsheetTool
      title="방화벽 치트시트"
      summary="iptables, firewalld, ufw에서 자주 쓰는 규칙·진단 명령입니다."
      entries={FIREWALL_CHEATSHEET_ENTRIES}
      example={
        <p>
          배포판에 맞는 방화벽만 사용하세요. SSH를 잠그지 않도록 변경 전에 현재 세션 IP를
          허용해 둡니다.
        </p>
      }
    />
  );
}