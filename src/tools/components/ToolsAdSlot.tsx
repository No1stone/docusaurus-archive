import {useMemo, type ReactNode} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

import {
  buildToolsAdSrcDoc,
  isToolsAdConfigured,
  resolveToolsAdSense,
} from '../adsConfig';
import styles from '../styles.module.css';

type Props = {
  placement: 'side' | 'bottom';
};

/**
 * Tools 레이아웃 전용 디스플레이 광고 1칸.
 * srcdoc + sandbox(allow-same-origin 없음)로 부모 문서(입력·결과)와 격리합니다.
 * 도구 데이터는 postMessage로 넘기지 않습니다.
 */
export default function ToolsAdSlot({placement}: Props): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  const config = useMemo(
    () => resolveToolsAdSense(siteConfig.customFields),
    [siteConfig.customFields],
  );

  if (!isToolsAdConfigured(config)) {
    return null;
  }

  const srcDoc = buildToolsAdSrcDoc(config);

  return (
    <aside
      className={placement === 'side' ? styles.adRail : styles.adBottom}
      aria-label="광고"
      data-tools-ad-slot={placement}>
      <iframe
        title="Tools display advertisement"
        className={styles.adFrame}
        sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
        srcDoc={srcDoc}
        loading="lazy"
      />
    </aside>
  );
}

export function useToolsAdEnabled(): boolean {
  const {siteConfig} = useDocusaurusContext();
  return isToolsAdConfigured(resolveToolsAdSense(siteConfig.customFields));
}
