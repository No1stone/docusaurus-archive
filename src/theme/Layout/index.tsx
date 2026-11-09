import React, {type ReactNode} from 'react';
import Head from '@docusaurus/Head';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme-original/Layout';
import type LayoutType from '@theme/Layout';
import type {WrapperProps} from '@docusaurus/types';
import {serializeJsonLd, siteGraph} from '@site/src/seo/schema';

type Props = WrapperProps<typeof LayoutType>;

export default function LayoutWrapper(props: Props): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  const graph = siteGraph(
    siteConfig.url,
    siteConfig.title,
    typeof siteConfig.tagline === 'string' ? siteConfig.tagline : undefined,
  );

  return (
    <>
      <Head>
        <script type="application/ld+json" id="origemite-site-jsonld">
          {serializeJsonLd(graph)}
        </script>
      </Head>
      <Layout {...props} />
    </>
  );
}
