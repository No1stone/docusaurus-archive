import React, {type ReactNode} from 'react';
import Head from '@docusaurus/Head';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {
  useBlogPost,
  useBlogPostStructuredData,
} from '@docusaurus/plugin-content-blog/client';
import {
  organizationNode,
  serializeJsonLd,
  type JsonLd,
} from '@site/src/seo/schema';

const FALLBACK_AUTHOR: JsonLd = {
  '@type': 'Person',
  name: '장원석',
  description: 'Backend Developer',
  url: 'https://github.com/No1stone',
};

function asStringList(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0);
}

function hasAuthor(author: unknown): boolean {
  if (!author) {
    return false;
  }
  if (Array.isArray(author)) {
    return author.length > 0;
  }
  return typeof author === 'object';
}

/**
 * Keeps Docusaurus BlogPosting fields and adds publisher, keywords, about, author, locale.
 */
export default function BlogPostStructuredData(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  const {metadata, frontMatter} = useBlogPost();
  const base = useBlogPostStructuredData() as unknown as JsonLd;
  const org = organizationNode(siteConfig.url, siteConfig.title);

  const fmKeywords = asStringList((frontMatter as {keywords?: unknown}).keywords);
  const tagKeywords = (metadata.tags ?? [])
    .map((tag) => tag.label)
    .filter((label): label is string => Boolean(label));
  const keywords = [...new Set([...fmKeywords, ...tagKeywords])];

  const author = hasAuthor(base.author) ? base.author : FALLBACK_AUTHOR;
  const about = keywords.slice(0, 10).map((name) => ({
    '@type': 'Thing',
    name,
  }));

  const pageUrl =
    typeof base.url === 'string'
      ? base.url
      : `${siteConfig.url}${metadata.permalink}`;

  const structuredData: JsonLd = {
    ...base,
    publisher: {'@id': org['@id'] as string},
    inLanguage: 'ko',
    author,
    ...(keywords.length ? {keywords} : {}),
    ...(about.length ? {about} : {}),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': pageUrl,
    },
  };

  return (
    <Head>
      <meta property="og:locale" content="ko_KR" />
      <meta property="og:type" content="article" />
      {typeof structuredData.datePublished === 'string' ? (
        <meta
          property="article:published_time"
          content={structuredData.datePublished}
        />
      ) : null}
      {keywords.map((keyword) => (
        <meta property="article:tag" content={keyword} key={keyword} />
      ))}
      <script type="application/ld+json" id="origemite-blog-publisher">
        {serializeJsonLd({'@context': 'https://schema.org', ...org})}
      </script>
      <script type="application/ld+json" id="origemite-blog-posting">
        {serializeJsonLd(structuredData)}
      </script>
    </Head>
  );
}
