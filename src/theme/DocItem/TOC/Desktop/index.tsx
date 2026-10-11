import type {ReactNode} from 'react';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import TOC from '@theme-original/DocItem/TOC/Desktop';

import AdSlot from '@site/src/components/AdSlot';
import styles from './styles.module.css';

type AdFrontMatter = {
  adRail?: boolean;
};

/** Desktop only. The theme unmounts this column below 997px. */
export default function DocItemTOCDesktopWrapper(): ReactNode {
  const {frontMatter} = useDoc();
  const showRail = (frontMatter as AdFrontMatter).adRail === true;

  return (
    <div className={styles.rail}>
      <TOC />
      {showRail && <AdSlot placement="rail" />}
    </div>
  );
}
