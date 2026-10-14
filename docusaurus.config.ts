import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

import {remarkAdPlacement} from './src/remark/adPlacement';

const config: Config = {
  title: 'Origemite Archive',
  tagline: 'ADR, SSOT, and continuity — engineering archive in Markdown and Git.',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://origemite.com',
  baseUrl: '/',

  organizationName: 'No1stone',
  projectName: 'docusaurus-archive',

  onBrokenLinks: 'throw',

  // Google AdSense — injected into <head> of every page
  scripts: [
    {
      src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7928208116313519',
      async: true,
      crossorigin: 'anonymous',
    },
  ],

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: 'docs',
          remarkPlugins: [remarkAdPlacement],
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Origemite Archive',
      logo: {
        alt: 'Origemite Archive',
        src: 'img/logo.svg',
      },
      items: [
        {to: '/about', label: 'About', position: 'left'},
        {
          type: 'docSidebar',
          sidebarId: 'archiveSidebar',
          position: 'left',
          label: 'Archive',
        },
        {
          href: 'https://github.com/No1stone',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Archive',
          items: [
            {label: 'Home', to: '/docs/'},
            {label: 'Knowledge', to: '/docs/knowledge/'},
            {label: 'Decisions', to: '/docs/decisions/'},
            {label: 'Harness', to: '/docs/harness/'},
          ],
        },
        {
          title: 'More',
          items: [
            {label: 'About', to: '/about'},
            {label: '개인정보처리방침', to: '/privacy'},
            {
              label: 'GitHub',
              href: 'https://github.com/No1stone',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Origemite. Engineering archive in Markdown & Git.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
