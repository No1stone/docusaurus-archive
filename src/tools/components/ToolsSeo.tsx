import type {ReactNode} from 'react';
import Head from '@docusaurus/Head';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

import {
  absoluteUrl,
  organizationNode,
  serializeJsonLd,
  type JsonLd,
} from '@site/src/seo/schema';
import {TOOLS} from '../catalog';
import type {ToolFaq} from '../types';

type Props = {
  title: string;
  description: string;
  path: string;
  keywords: string[];
  faqs?: ToolFaq[];
  kind: 'collection' | 'tool';
};

function socialImageUrl(siteUrl: string, imagePath: string | undefined): string {
  const fallback = '/img/docusaurus-social-card.jpg';
  const raw = imagePath?.trim() || fallback;
  const path = raw.startsWith('/') ? raw : `/${raw}`;
  return absoluteUrl(siteUrl, path);
}

export default function ToolsSeo({
  title,
  description,
  path,
  keywords,
  faqs = [],
  kind,
}: Props): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  const canonicalPath = useBaseUrl(path);
  const url = absoluteUrl(siteConfig.url, canonicalPath);
  const toolsUrl = absoluteUrl(siteConfig.url, useBaseUrl('/tools'));
  const org = organizationNode(siteConfig.url, siteConfig.title);
  const image = socialImageUrl(
    siteConfig.url,
    typeof siteConfig.themeConfig?.image === 'string'
      ? siteConfig.themeConfig.image
      : undefined,
  );
  const keywordText = keywords.join(', ');
  const pageTitle = `${title} | ${siteConfig.title}`;

  const breadcrumb: JsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': `${url}#breadcrumb`,
    itemListElement:
      kind === 'collection'
        ? [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Tools',
              item: toolsUrl,
            },
          ]
        : [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Tools',
              item: toolsUrl,
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: title,
              item: url,
            },
          ],
  };

  const toolList: JsonLd = {
    '@type': 'ItemList',
    name: 'Origemite Tools',
    numberOfItems: TOOLS.length,
    itemListElement: TOOLS.map((tool, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: tool.title,
      url: `${toolsUrl.replace(/\/$/, '')}/${tool.slug}`,
      description: tool.description,
    })),
  };

  const pageNode: JsonLd =
    kind === 'collection'
      ? {
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          '@id': `${url}#collection`,
          name: title,
          description,
          url,
          inLanguage: 'ko',
          isPartOf: {'@id': `${siteConfig.url.replace(/\/$/, '')}/#website`},
          publisher: {'@id': org['@id'] as string},
          keywords,
          mainEntity: toolList,
        }
      : {
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          '@id': `${url}#app`,
          name: title,
          description,
          url,
          inLanguage: 'ko',
          applicationCategory: 'DeveloperApplication',
          operatingSystem: 'Any',
          browserRequirements: 'Requires JavaScript. Runs locally in the browser.',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'KRW',
          },
          isAccessibleForFree: true,
          keywords,
          isPartOf: {
            '@type': 'CollectionPage',
            '@id': `${toolsUrl}#collection`,
            name: 'Tools',
            url: toolsUrl,
          },
          publisher: {'@id': org['@id'] as string},
          mainEntityOfPage: {'@type': 'WebPage', '@id': url},
        };

  const faqNode: JsonLd | null =
    faqs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          '@id': `${url}#faq`,
          mainEntity: faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer,
            },
          })),
        }
      : null;

  const publisherNode: JsonLd = {
    '@context': 'https://schema.org',
    ...org,
  };

  return (
    <Head>
      <link rel="canonical" href={url} />
      <meta name="keywords" content={keywordText} />
      <meta name="robots" content="index, follow, max-image-preview:large" />
      <meta property="og:locale" content="ko_KR" />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={siteConfig.title} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <script type="application/ld+json" id="tools-seo-publisher">
        {serializeJsonLd(publisherNode)}
      </script>
      <script type="application/ld+json" id="tools-seo-page">
        {serializeJsonLd(pageNode)}
      </script>
      <script type="application/ld+json" id="tools-seo-breadcrumb">
        {serializeJsonLd(breadcrumb)}
      </script>
      {faqNode ? (
        <script type="application/ld+json" id="tools-seo-faq">
          {serializeJsonLd(faqNode)}
        </script>
      ) : null}
    </Head>
  );
}
