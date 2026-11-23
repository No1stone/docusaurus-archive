import type {ReactNode} from 'react';

import CheatsheetTool from '../components/CheatsheetTool';
import {NGINX_CHEATSHEET_ENTRIES} from '../data/nginxCheatsheet';

export default function NginxCheatsheet(): ReactNode {
  return (
    <CheatsheetTool
      title="Nginx 치트시트"
      summary="프록시·TLS·로그 점검에 자주 쓰는 Nginx 명령을 모았습니다."
      entries={NGINX_CHEATSHEET_ENTRIES}
      example={<p>설정 변경 후에는 `nginx -t`로 검사한 뒤 `reload`하세요.</p>}
    />
  );
}