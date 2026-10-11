import {useEffect, useRef, useState, type ReactNode} from 'react';

import {AD_CLIENT, slotForPlacement, type AdPlacement} from '../lib/adPolicy';

import styles from './AdSlot.module.css';

declare global {
  interface Window {
    adsbygoogle?: Record<string, unknown>[];
  }
}

const DESKTOP = '(min-width: 997px)';

type Props = {
  placement?: AdPlacement;
};

/**
 * One responsive display unit. The account script is loaded from
 * docusaurus.config.ts. Rail and end wait until the viewport is known so a
 * page never requests both, and never requests the rail slot twice.
 */
export default function AdSlot({placement = 'home'}: Props): ReactNode {
  const immediate = placement === 'home' || placement === 'inArticle';
  const [visible, setVisible] = useState(immediate);
  const pushed = useRef(false);

  useEffect(() => {
    if (immediate) {
      return;
    }
    const desktop = window.matchMedia(DESKTOP).matches;
    setVisible(placement === 'rail' ? desktop : !desktop);
  }, [immediate, placement]);

  useEffect(() => {
    if (!visible || pushed.current) {
      return;
    }
    pushed.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      pushed.current = false;
    }
  }, [visible]);

  if (!visible) {
    return null;
  }

  const slot = slotForPlacement(placement);
  return (
    <aside className={styles[placement]} aria-label="Advertisement">
      <ins
        className="adsbygoogle"
        style={{display: 'block'}}
        data-ad-client={AD_CLIENT}
        data-ad-format="auto"
        data-full-width-responsive="true"
        {...(slot ? {'data-ad-slot': slot} : {})}
      />
    </aside>
  );
}
