import React, {type ReactNode} from 'react';
import Head from '@docusaurus/Head';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import OriginalMetadata from '@theme-original/DocItem/Metadata';

export default function DocItemMetadata(): ReactNode {
  const {metadata, frontMatter} = useDoc();
  const {siteConfig} = useDocusaurusContext();

  if (!metadata.source.startsWith('@site/docs/knowledge/data/mysql/')) {
    return <OriginalMetadata />;
  }

  const url = new URL(metadata.permalink, siteConfig.url).href;
  const collectionUrl = new URL('/docs/knowledge/data/mysql', siteConfig.url).href;
  const isCollection = url === collectionUrl;
  const referenceValue = (frontMatter as typeof frontMatter & {references?: unknown}).references;
  const references = Array.isArray(referenceValue)
    ? referenceValue.filter((value: unknown): value is string => typeof value === 'string')
    : [];
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': isCollection ? 'CollectionPage' : 'TechArticle',
    '@id': `${url}#${isCollection ? 'collection' : 'article'}`,
    ...(isCollection ? {name: metadata.title} : {headline: metadata.title}),
    description: metadata.description,
    url,
    inLanguage: 'ko',
    mainEntityOfPage: {'@type': 'WebPage', '@id': url},
    ...(isCollection ? {} : {isPartOf: {'@type': 'CollectionPage', '@id': `${collectionUrl}#collection`}}),
    ...(frontMatter.keywords?.length ? {keywords: frontMatter.keywords} : {}),
    ...(references.length ? {citation: references} : {}),
  };

  return (
    <>
      <OriginalMetadata />
      <Head>
        <html lang="ko" />
        <meta property="og:locale" content="ko_KR" />
        <script type="application/ld+json" id="mysql-technical-document">
          {JSON.stringify(structuredData).replace(/</g, '\\u003c')}
        </script>
      </Head>
    </>
  );
}
