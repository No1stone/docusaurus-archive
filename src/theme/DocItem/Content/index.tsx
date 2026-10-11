import type {ReactNode} from 'react';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import Content from '@theme-original/DocItem/Content';
import type {Props} from '@theme/DocItem/Content';

import AdSlot from '@site/src/components/AdSlot';

type AdFrontMatter = {
  adEnd?: boolean;
};

/** End unit is mobile-only; AdSlot hides it on desktop. */
export default function DocItemContentWrapper(props: Props): ReactNode {
  const {frontMatter} = useDoc();
  const showEnd = (frontMatter as AdFrontMatter).adEnd === true;
  return (
    <>
      <Content {...props} />
      {showEnd && <AdSlot placement="end" />}
    </>
  );
}
