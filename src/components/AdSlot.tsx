import {useEffect, useRef, useState, type ReactNode} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useLocation} from '@docusaurus/router';

import {AD_CLIENT, slotForPlacement, type AdPlacement, type AdSlotIds} from '../lib/adPolicy';

import styles from './AdSlot.module.css';

declare global {
  interface Window {
    adsbygoogle?: Record<string, unknown>[];
  }
}

const DESKTOP = '(min-width: 997px)';
const SCRIPT_SRC = 'pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';

type Props = {
  placement?: AdPlacement;
};

type UnitProps = {
  placement: AdPlacement;
  slot: string;
};

function slotIds(fields: {[key: string]: unknown} | undefined): AdSlotIds {
  return {
    inArticle: typeof fields?.adSlotInArticle === 'string' ? fields.adSlotInArticle : '',
    rail: typeof fields?.adSlotRail === 'string' ? fields.adSlotRail : '',
  };
}

function alreadyRequested(ins: HTMLElement): boolean {
  return Boolean(ins.getAttribute('data-adsbygoogle-status') || ins.getAttribute('data-ad-status'));
}

/**
 * One responsive display unit. The account script in docusaurus.config.ts
 * stays the only AdSense script. This component requests a manual unit
 * only when that placement has a slot id.
 * Rail and end wait until the viewport is known so a page never requests both.
 */
function AdUnit({placement, slot}: UnitProps): ReactNode {
  const immediate = placement === 'home' || placement === 'inArticle';
  const [visible, setVisible] = useState(immediate);
  const [unfilled, setUnfilled] = useState(false);
  const insRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (immediate) {
      return;
    }
    const desktop = window.matchMedia(DESKTOP).matches;
    setVisible(placement === 'rail' ? desktop : !desktop);
  }, [immediate, placement]);

  useEffect(() => {
    if (!visible) {
      return;
    }
    const ins = insRef.current;
    if (!ins || pushed.current || alreadyRequested(ins)) {
      return;
    }
    const script = document.querySelector(`script[src*="${SCRIPT_SRC}"]`);
    if (!script) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('AdSense account script is missing; manual unit was not requested.');
      }
      return;
    }

    pushed.current = true;
    if (!ins.isConnected) {
      return;
    }
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error(error);
      }
    }
  }, [visible]);

  useEffect(() => {
    const ins = insRef.current;
    if (!ins || !visible) {
      return;
    }
    const mark = () => {
      if (ins.getAttribute('data-ad-status') === 'unfilled') {
        setUnfilled(true);
      }
    };
    mark();
    const observer = new MutationObserver(mark);
    observer.observe(ins, {attributes: true, attributeFilter: ['data-ad-status']});
    return () => observer.disconnect();
  }, [visible]);

  if (!visible) {
    return null;
  }

  return (
    <aside
      className={`${styles[placement]} ${unfilled ? styles.unfilled : ''}`}
      aria-label="Advertisement">
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{display: 'block'}}
        data-ad-client={AD_CLIENT}
        data-ad-format="auto"
        data-full-width-responsive="true"
        data-ad-slot={slot}
      />
    </aside>
  );
}

export default function AdSlot({placement = 'home'}: Props): ReactNode {
  const {pathname} = useLocation();
  const {siteConfig} = useDocusaurusContext();
  const slot = slotForPlacement(placement, slotIds(siteConfig.customFields)).trim();
  if (slot === '') {
    return null;
  }
  return <AdUnit key={`${pathname}:${placement}`} placement={placement} slot={slot} />;
}
