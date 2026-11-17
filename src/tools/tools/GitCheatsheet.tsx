import type {ReactNode} from 'react';

import CheatsheetTool from '../components/CheatsheetTool';
import {GIT_CHEATSHEET_ENTRIES} from '../data/gitCheatsheet';

export default function GitCheatsheet(): ReactNode {
  return (
    <CheatsheetTool
      title="Git 치트시트"
      summary="자주 쓰는 Git 명령을 검색하고 복사합니다. 모두 브라우저 로컬에서만 동작합니다."
      entries={GIT_CHEATSHEET_ENTRIES}
      example={
        <p>
          브랜치 전략이 정해져 있으면 `git pull --rebase`와 `git switch -c` 조합으로 일상 작업을
          단순화할 수 있습니다.
        </p>
      }
    />
  );
}