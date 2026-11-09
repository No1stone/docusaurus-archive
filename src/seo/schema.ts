/** Shared JSON-LD helpers for site-wide schema.org markup. */

export type JsonLd = Record<string, unknown>;

export function absoluteUrl(siteUrl: string, pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) {
    return pathOrUrl;
  }
  const base = siteUrl.replace(/\/$/, '');
  const path = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
  return `${base}${path}`;
}

export function organizationNode(siteUrl: string, name: string): JsonLd {
  const url = siteUrl.replace(/\/$/, '');
  return {
    '@type': 'Organization',
    '@id': `${url}/#organization`,
    name,
    url,
  };
}

export function webSiteNode(siteUrl: string, name: string, description?: string): JsonLd {
  const url = siteUrl.replace(/\/$/, '');
  const orgId = `${url}/#organization`;
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${url}/#website`,
    name,
    url,
    ...(description ? {description} : {}),
    inLanguage: 'ko',
    publisher: {'@id': orgId},
  };
}

/** Site-level graph: Organization + WebSite in one script. */
export function siteGraph(siteUrl: string, name: string, description?: string): JsonLd {
  const url = siteUrl.replace(/\/$/, '');
  return {
    '@context': 'https://schema.org',
    '@graph': [
      organizationNode(url, name),
      {
        '@type': 'WebSite',
        '@id': `${url}/#website`,
        name,
        url,
        ...(description ? {description} : {}),
        inLanguage: 'ko',
        publisher: {'@id': `${url}/#organization`},
      },
    ],
  };
}

export function serializeJsonLd(data: JsonLd): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
