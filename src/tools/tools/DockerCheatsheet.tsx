import type {ReactNode} from 'react';

import CheatsheetTool from '../components/CheatsheetTool';
import {DOCKER_CHEATSHEET_ENTRIES} from '../data/dockerCheatsheet';

export default function DockerCheatsheet(): ReactNode {
  return (
    <CheatsheetTool
      title="Docker 치트시트"
      summary="컨테이너 운영·Compose·정리에 자주 쓰는 명령 모음입니다."
      entries={DOCKER_CHEATSHEET_ENTRIES}
      example={<p>프로덕션에서는 `docker system prune` 전에 이미지 태그와 볼륨 백업을 확인하세요.</p>}
    />
  );
}