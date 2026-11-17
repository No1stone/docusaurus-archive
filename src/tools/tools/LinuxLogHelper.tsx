import type {ReactNode} from 'react';

import CheatsheetTool from '../components/CheatsheetTool';
import {LINUX_LOG_HELPER_ENTRIES} from '../data/linuxLogHelper';

export default function LinuxLogHelper(): ReactNode {
  return (
    <CheatsheetTool
      title="Linux 로그·압축 도우미"
      summary="journalctl, grep, tail, tar/gzip 명령을 빠르게 찾습니다."
      entries={LINUX_LOG_HELPER_ENTRIES}
      example={
        <p>
          장애 대응 시 `journalctl -u &lt;service&gt; -f`와 `grep -C`로 타임라인을 좁힌 뒤
          필요한 구간만 tar로 보관합니다.
        </p>
      }
    />
  );
}