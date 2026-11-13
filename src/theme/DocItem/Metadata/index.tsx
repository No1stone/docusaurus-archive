import React, {type ReactNode} from 'react';
import Head from '@docusaurus/Head';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import OriginalMetadata from '@theme-original/DocItem/Metadata';
import {
  absoluteUrl,
  organizationNode,
  serializeJsonLd,
  type JsonLd,
} from '@site/src/seo/schema';

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

function knowledgeCollectionUrl(
  permalink: string,
  siteUrl: string,
): string | undefined {
  if (!permalink.startsWith('/docs/knowledge/')) {
    return undefined;
  }
  return absoluteUrl(siteUrl, '/docs/knowledge/');
}

export default function DocItemMetadata(): ReactNode {
  const {metadata, frontMatter} = useDoc();
  const {siteConfig} = useDocusaurusContext();
  const fm = frontMatter as typeof frontMatter & DocFrontMatter;
  const database = resolveDatabase(metadata.source);

  const url = absoluteUrl(siteConfig.url, metadata.permalink);
  const collectionUrl = database
    ? absoluteUrl(siteConfig.url, `/docs/knowledge/data/${database}`)
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

  const org = organizationNode(siteConfig.url, siteConfig.title);
  const lastUpdatedAt = (metadata as {lastUpdatedAt?: number | null}).lastUpdatedAt;

  const structuredData: JsonLd = {
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
    publisher: {'@id': org['@id'] as string},
    ...(typeof lastUpdatedAt === 'number'
      ? {dateModified: new Date(lastUpdatedAt).toISOString()}
      : {}),
  };

  if (database && collectionUrl) {
    if (isCollection) {
      if (database === 'mariadb') {
        structuredData.isPartOf = {
          '@type': 'CollectionPage',
          '@id': `${absoluteUrl(siteConfig.url, '/docs/knowledge/data/mysql')}#collection`,
        };
      }
    } else {
      structuredData.isPartOf = {
        '@type': 'CollectionPage',
        '@id': `${collectionUrl}#collection`,
      };
    }
    if (references.length) {
      structuredData.citation = references;
    }
  } else {
    const knowledgeHub = knowledgeCollectionUrl(metadata.permalink, siteConfig.url);
    if (knowledgeHub && url !== knowledgeHub) {
      structuredData.isPartOf = {
        '@type': 'CollectionPage',
        '@id': `${knowledgeHub}#collection`,
        name: 'Knowledge',
      };
    }
  }

  if (fm.keywords?.length) {
    structuredData.keywords = fm.keywords;
  }

  const scriptId = database
    ? `${database}-technical-document`
    : 'archive-doc-jsonld';

  // Compact Organization node referenced by publisher @id (site Layout also emits full graph).
  const publisherNode: JsonLd = {
    '@context': 'https://schema.org',
    ...org,
  };

  return (
    <>
      <OriginalMetadata />
      <Head>
        <meta property="og:locale" content="ko_KR" />
        {fm.keywords?.length ? (
          <meta name="keywords" content={fm.keywords.join(', ')} />
        ) : null}
        <script type="application/ld+json" id={`${scriptId}-publisher`}>
          {serializeJsonLd(publisherNode)}
        </script>
        <script type="application/ld+json" id={scriptId}>
          {serializeJsonLd(structuredData)}
        </script>
      </Head>
    </>
  );
}
