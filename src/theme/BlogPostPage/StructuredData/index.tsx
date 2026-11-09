import React, {type ReactNode} from 'react';
import Head from '@docusaurus/Head';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useBlogPostStructuredData} from '@docusaurus/plugin-content-blog/client';
import {
  organizationNode,
  serializeJsonLd,
  type JsonLd,
} from '@site/src/seo/schema';

/**
 * Keeps Docusaurus default BlogPosting fields and adds Organization publisher.
 */
export default function BlogPostStructuredData(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  const base = useBlogPostStructuredData() as unknown as JsonLd;
  const org = organizationNode(siteConfig.url, siteConfig.title);

  const structuredData: JsonLd = {
    ...base,
    publisher: {'@id': org['@id'] as string},
    inLanguage: base.inLanguage ?? 'ko',
  };

  return (
    <Head>
      <script type="application/ld+json" id="origemite-blog-publisher">
        {serializeJsonLd({'@context': 'https://schema.org', ...org})}
      </script>
      <script type="application/ld+json" id="origemite-blog-posting">
        {serializeJsonLd(structuredData)}
      </script>
    </Head>
  );
}
