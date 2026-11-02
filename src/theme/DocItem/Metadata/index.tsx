import React, {type ReactNode} from 'react';
import Head from '@docusaurus/Head';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import OriginalMetadata from '@theme-original/DocItem/Metadata';

type DocFrontMatter = {
  keywords?: string[];
  references?: unknown;
  status?: string;
};

function isDraftishDescription(description: string | undefined): boolean {
  if (!description?.trim()) {
    return true;
  }
  const value = description.trim();
  return (
    value.includes('작성 예정') ||
    value.endsWith('(작성 예정)') ||
    /^draft$/i.test(value)
  );
}

function resolveDatabase(source: string): 'mysql' | 'mariadb' | undefined {
  return [
    {name: 'mariadb' as const, source: '@site/docs/knowledge/data/mysql/mariadb/'},
    {name: 'mysql' as const, source: '@site/docs/knowledge/data/mysql/'},
  ].find(({source: prefix}) => source.startsWith(prefix))?.name;
}

export default function DocItemMetadata(): ReactNode {
  const {metadata, frontMatter} = useDoc();
  const {siteConfig} = useDocusaurusContext();
  const fm = frontMatter as typeof frontMatter & DocFrontMatter;
  const database = resolveDatabase(metadata.source);

  const url = new URL(metadata.permalink, siteConfig.url).href;
  const collectionUrl = database
    ? new URL(`/docs/knowledge/data/${database}`, siteConfig.url).href
    : undefined;
  const isCollection = Boolean(collectionUrl && url === collectionUrl);
  const draftish =
    fm.status === 'draft' || isDraftishDescription(metadata.description);

  let schemaType: 'CollectionPage' | 'TechArticle' | 'WebPage';
  let idFragment: 'collection' | 'article' | 'webpage';
  if (isCollection) {
    schemaType = 'CollectionPage';
    idFragment = 'collection';
  } else if (draftish) {
    schemaType = 'WebPage';
    idFragment = 'webpage';
  } else {
    schemaType = 'TechArticle';
    idFragment = 'article';
  }

  // Preserve MySQL/MariaDB @id fragments used previously (#collection / #article).
  if (database && !draftish) {
    idFragment = isCollection ? 'collection' : 'article';
    schemaType = isCollection ? 'CollectionPage' : 'TechArticle';
  }

  const referenceValue = fm.references;
  const references = Array.isArray(referenceValue)
    ? referenceValue.filter((value: unknown): value is string => typeof value === 'string')
    : [];

  const structuredData: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': schemaType,
    '@id': `${url}#${idFragment}`,
    ...(schemaType === 'CollectionPage' || schemaType === 'WebPage'
      ? {name: metadata.title}
      : {headline: metadata.title}),
    ...(metadata.description ? {description: metadata.description} : {}),
    url,
    inLanguage: 'ko',
    mainEntityOfPage: {'@type': 'WebPage', '@id': url},
  };

  if (database && collectionUrl) {
    if (isCollection) {
      if (database === 'mariadb') {
        structuredData.isPartOf = {
          '@type': 'CollectionPage',
          '@id': `${new URL('/docs/knowledge/data/mysql', siteConfig.url).href}#collection`,
        };
      }
    } else {
      structuredData.isPartOf = {
        '@type': 'CollectionPage',
        '@id': `${collectionUrl}#collection`,
      };
    }
    if (fm.keywords?.length) {
      structuredData.keywords = fm.keywords;
    }
    if (references.length) {
      structuredData.citation = references;
    }
  }

  const scriptId = database
    ? `${database}-technical-document`
    : 'archive-doc-jsonld';

  return (
    <>
      <OriginalMetadata />
      <Head>
        <meta property="og:locale" content="ko_KR" />
        <script type="application/ld+json" id={scriptId}>
          {JSON.stringify(structuredData).replace(/</g, '\\u003c')}
        </script>
      </Head>
    </>
  );
}
