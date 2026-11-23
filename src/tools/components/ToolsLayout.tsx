import {useEffect, useState, type ReactNode} from 'react';
import Layout from '@theme/Layout';

import {TOOLS_ADS_BREAKPOINT_PX} from '../adsConfig';
import type {ToolFaq, ToolId} from '../types';
import ToolsAdSlot, {useToolsAdEnabled} from './ToolsAdSlot';
import ToolsSeo from './ToolsSeo';
import ToolsSidebar from './ToolsSidebar';
import styles from '../styles.module.css';

/** Legacy key from removed i18n JSON translator (OpenRouter). */
const LEGACY_OPENROUTER_KEY = 'origemite-tools-openrouter-api-key';

type Props = {
  title: string;
  description: string;
  path: string;
  keywords: string[];
  faqs?: ToolFaq[];
  kind?: 'collection' | 'tool';
  activeToolId?: ToolId;
  children: ReactNode;
};

export default function ToolsLayout({
  title,
  description,
  path,
  keywords,
  faqs = [],
  kind = 'tool',
  activeToolId,
  children,
}: Props): ReactNode {
  const [menuOpen, setMenuOpen] = useState(false);
  const [adPlacement, setAdPlacement] = useState<'side' | 'bottom'>('side');
  const adEnabled = useToolsAdEnabled();

  useEffect(() => {
    try {
      window.localStorage.removeItem(LEGACY_OPENROUTER_KEY);
    } catch {
      // ignore quota / private mode
    }
  }, []);

  useEffect(() => {
    const mq = window.matchMedia(
      `(min-width: ${TOOLS_ADS_BREAKPOINT_PX}px)`,
    );
    const sync = () => setAdPlacement(mq.matches ? 'side' : 'bottom');
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  return (
    <Layout title={title} description={description}>
      <ToolsSeo
        title={title}
        description={description}
        path={path}
        keywords={keywords}
        faqs={faqs}
        kind={kind}
      />
      <div
        className={styles.page}
        data-tools-ad={adEnabled ? adPlacement : 'off'}>
        {menuOpen ? (
          <button
            type="button"
            className={styles.backdrop}
            aria-label="메뉴 닫기"
            onClick={() => setMenuOpen(false)}
          />
        ) : null}
        <ToolsSidebar
          activeToolId={activeToolId}
          open={menuOpen}
          onNavigate={() => setMenuOpen(false)}
        />
        <div className={styles.workbench}>
          <div className={styles.main}>
            <div className={styles.mobileBar}>
              <button
                type="button"
                className={styles.menuButton}
                onClick={() => setMenuOpen(true)}>
                도구 메뉴
              </button>
              <span>{title}</span>
            </div>
            {children}
            {adEnabled && adPlacement === 'bottom' ? (
              <ToolsAdSlot placement="bottom" />
            ) : null}
          </div>
          {adEnabled && adPlacement === 'side' ? (
            <ToolsAdSlot placement="side" />
          ) : null}
        </div>
      </div>
    </Layout>
  );
}
