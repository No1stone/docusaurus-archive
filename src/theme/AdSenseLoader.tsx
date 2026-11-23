import {useEffect, type ReactNode} from 'react';
import {useLocation} from '@docusaurus/router';

const ADSENSE_SRC =
  'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7928208116313519';
const SCRIPT_ID = 'origemite-adsense';

/**
 * 문서·블로그용 페이지 수준 AdSense(자동 광고).
 * /tools 에서는 부모 문서 스크립트를 제거하고, Tools 전용 슬롯은
 * sandboxed iframe(ToolsAdSlot)만 사용한다.
 */
export default function AdSenseLoader(): ReactNode {
  const {pathname} = useLocation();
  const isTools = pathname === '/tools' || pathname.startsWith('/tools/');

  useEffect(() => {
    const existing = document.getElementById(SCRIPT_ID);

    if (isTools) {
      existing?.remove();
      // 문서→Tools 이동 시 남은 자동광고 ins 제거(부모 DOM 격리)
      document
        .querySelectorAll('ins.adsbygoogle:not([data-tools-ad-ins])')
        .forEach((node) => node.remove());
      return;
    }

    if (existing) {
      return;
    }

    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.src = ADSENSE_SRC;
    script.async = true;
    script.crossOrigin = 'anonymous';
    document.head.appendChild(script);
  }, [isTools]);

  return null;
}
