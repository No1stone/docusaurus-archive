import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

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

  // Large taxonomy move leaves some legacy relative links; warn until cleaned.
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  // Google AdSense auto ads — account script once in <head> (no manual units)
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
        },
        blog: {
          showReadingTime: true,
          blogTitle: 'Origemite Blog',
          blogDescription: '운영 후기, 업그레이드 경험, 장애 회고',
          postsPerPage: 10,
          blogSidebarCount: 'ALL',
          blogSidebarTitle: 'Recent posts',
          tagsBasePath: 'tags',
          onInlineTags: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    [
      '@docusaurus/plugin-client-redirects',
      {
        redirects: [
          {
            from: '/docs/knowledge/infrastructure/docker/nextcloud-php-security-upgrade-retrospective',
            to: '/blog/nextcloud-php-security-upgrade-retrospective',
          },
          {
            from: '/docs/knowledge/security',
            to: '/docs/security/',
          },
          {
            from: '/docs/knowledge/backend/index',
            to: '/docs/knowledge/backend/',
          },
          {
            from: '/docs/architecture/icomsys-msa-iam-portfolio',
            to: '/docs/postmortems/msa-iam-portfolio/overview',
          },
          {
            from: '/docs/architecture/icomsys-msa-iam-portfolio/icomsys-application-services',
            to: '/docs/postmortems/msa-iam-portfolio/application-services',
          },
          {
            from: '/docs/architecture/icomsys-msa-iam-portfolio/icomsys-aws-setting',
            to: '/docs/postmortems/msa-iam-portfolio/aws-setting',
          },
          {
            from: '/docs/architecture/icomsys-msa-iam-portfolio/icomsys-design-and-runtime',
            to: '/docs/postmortems/msa-iam-portfolio/design-and-runtime',
          },
          {
            from: '/docs/architecture/icomsys-msa-iam-portfolio/icomsys-development-environment',
            to: '/docs/postmortems/msa-iam-portfolio/development-environment',
          },
          {
            from: '/docs/architecture/icomsys-msa-iam-portfolio/icomsys-iam-and-menu-improvement',
            to: '/docs/postmortems/msa-iam-portfolio/iam-and-menu-improvement',
          },
          {
            from: '/docs/architecture/icomsys-msa-iam-portfolio/icomsys-msa-iam-portfolio-overview',
            to: '/docs/postmortems/msa-iam-portfolio/overview',
          },
          {
            from: '/docs/architecture/icomsys-msa-iam-portfolio/icomsys-runtime-data-path',
            to: '/docs/postmortems/msa-iam-portfolio/runtime-data-path',
          },

          {
            from: '/docs/postmortems/icomsys-msa-iam-portfolio',
            to: '/docs/postmortems/msa-iam-portfolio/overview',
          },
          {
            from: '/docs/postmortems/icomsys-msa-iam-portfolio/overview',
            to: '/docs/postmortems/msa-iam-portfolio/overview',
          },
          {
            from: '/docs/postmortems/icomsys-msa-iam-portfolio/application-services',
            to: '/docs/postmortems/msa-iam-portfolio/application-services',
          },
          {
            from: '/docs/postmortems/icomsys-msa-iam-portfolio/aws-setting',
            to: '/docs/postmortems/msa-iam-portfolio/aws-setting',
          },
          {
            from: '/docs/postmortems/icomsys-msa-iam-portfolio/design-and-runtime',
            to: '/docs/postmortems/msa-iam-portfolio/design-and-runtime',
          },
          {
            from: '/docs/postmortems/icomsys-msa-iam-portfolio/development-environment',
            to: '/docs/postmortems/msa-iam-portfolio/development-environment',
          },
          {
            from: '/docs/postmortems/icomsys-msa-iam-portfolio/iam-and-menu-improvement',
            to: '/docs/postmortems/msa-iam-portfolio/iam-and-menu-improvement',
          },
          {
            from: '/docs/postmortems/icomsys-msa-iam-portfolio/runtime-data-path',
            to: '/docs/postmortems/msa-iam-portfolio/runtime-data-path',
          },
          {
            from: '/docs/postmortems/mintit-improvement-cases',
            to: '/docs/postmortems/legacy-improvement-cases',
          },
          {
            from: '/docs/postmortems/index',
            to: '/docs/postmortems/',
          },

          {
            from: '/docs/patterns/addinterceptors',
            to: '/docs/knowledge/k-addinterceptors',
          },
          {
            from: '/docs/patterns/aws-eks',
            to: '/docs/knowledge/k-aws-eks',
          },
          {
            from: '/docs/patterns/gof-design-pattern',
            to: '/docs/patterns/pattern-gof-design-pattern',
          },
          {
            from: '/docs/patterns/gof/behavioral/방문자visitor-pattenr',
            to: '/docs/patterns/pattern-방문자visitor-pattenr',
          },
          {
            from: '/docs/patterns/gof/behavioral/스트래티지-패턴strategy-pattern',
            to: '/docs/patterns/pattern-스트래티지-패턴strategy-pattern',
          },
          {
            from: '/docs/patterns/gof/behavioral/템플릿메서드template-method',
            to: '/docs/patterns/pattern-템플릿메서드template-method',
          },
          {
            from: '/docs/patterns/gof/creational/factory-method',
            to: '/docs/patterns/factory-method',
          },
          {
            from: '/docs/patterns/gof/creational/빌드패턴1build-pattern',
            to: '/docs/patterns/pattern-빌드패턴1build-pattern',
          },
          {
            from: '/docs/patterns/gof/creational/싱글톤-패턴singletone-pattern',
            to: '/docs/patterns/pattern-싱글톤-패턴singletone-pattern',
          },
          {
            from: '/docs/patterns/gof/creational/추상팩토리abstract-factory',
            to: '/docs/patterns/pattern-추상팩토리abstract-factory',
          },
          {
            from: '/docs/patterns/gof/creational/프로토타입prototype-pattern',
            to: '/docs/patterns/pattern-프로토타입prototype-pattern',
          },
          {
            from: '/docs/patterns/gof/gof-design-pattern',
            to: '/docs/patterns/pattern-gof-design-pattern',
          },
          {
            from: '/docs/patterns/gof/structural/브릿지패턴bridge-patter',
            to: '/docs/patterns/pattern-브릿지패턴bridge-patter',
          },
          {
            from: '/docs/patterns/gof/structural/어탭터-패턴adapter-pattern',
            to: '/docs/patterns/pattern-어탭터-패턴adapter-pattern',
          },
          {
            from: '/docs/patterns/gof/structural/컴포지트composite-pattern',
            to: '/docs/patterns/pattern-컴포지트composite-pattern',
          },
          {
            from: '/docs/patterns/k-subscriber-7da2e1',
            to: '/docs/knowledge/k-subscriber-7da2e1',
          },
          {
            from: '/docs/patterns/localeresolver',
            to: '/docs/knowledge/k-localeresolver',
          },
          {
            from: '/docs/patterns/log4jdbc',
            to: '/docs/knowledge/k-log4jdbc',
          },
          {
            from: '/docs/patterns/maping',
            to: '/docs/knowledge/k-maping',
          },
          {
            from: '/docs/patterns/no1stone-start-page',
            to: '/docs/knowledge/k-no1stone-start-page',
          },
          {
            from: '/docs/patterns/pattern-addinterceptors',
            to: '/docs/knowledge/k-addinterceptors',
          },
          {
            from: '/docs/patterns/pattern-aws-eks',
            to: '/docs/knowledge/k-aws-eks',
          },
          {
            from: '/docs/patterns/pattern-localeresolver',
            to: '/docs/knowledge/k-localeresolver',
          },
          {
            from: '/docs/patterns/pattern-log4jdbc',
            to: '/docs/knowledge/k-log4jdbc',
          },
          {
            from: '/docs/patterns/pattern-maping',
            to: '/docs/knowledge/k-maping',
          },
          {
            from: '/docs/patterns/pattern-no1stone-start-page',
            to: '/docs/knowledge/k-no1stone-start-page',
          },
          {
            from: '/docs/patterns/pattern-subscriber',
            to: '/docs/knowledge/k-subscriber',
          },
          {
            from: '/docs/patterns/pattern-webflux-websocket',
            to: '/docs/knowledge/k-webflux-websocket',
          },
          {
            from: '/docs/patterns/pattern-연관관계',
            to: '/docs/knowledge/k-연관관계',
          },
          {
            from: '/docs/patterns/subscriber',
            to: '/docs/knowledge/k-subscriber',
          },
          {
            from: '/docs/patterns/subscriber-7da2e1',
            to: '/docs/knowledge/k-subscriber-7da2e1',
          },
          {
            from: '/docs/patterns/webflux-websocket',
            to: '/docs/knowledge/k-webflux-websocket',
          },
          {
            from: '/docs/patterns/연관관계',
            to: '/docs/knowledge/k-연관관계',
          },
          {
            from: '/docs/knowledge/infrastructure/aaa',
            to: '/docs/knowledge/k-aaa',
          },
          {
            from: '/docs/knowledge/backend/spring/addinterceptors',
            to: '/docs/knowledge/k-addinterceptors',
          },
          {
            from: '/docs/knowledge/backend/spring/web/addinterceptors',
            to: '/docs/knowledge/k-addinterceptors',
          },
          {
            from: '/docs/knowledge/networking/alb-nginx-error',
            to: '/docs/knowledge/k-alb-nginx-error',
          },
          {
            from: '/docs/knowledge/networking/proxy/alb-nginx-error',
            to: '/docs/knowledge/k-alb-nginx-error',
          },
          {
            from: '/docs/knowledge/infrastructure/aws/amazon-eks로-웹-애플리케이션-구축하기',
            to: '/docs/knowledge/k-amazon-eks로-웹-애플리케이션-구축하기',
          },
          {
            from: '/docs/knowledge/infrastructure/aws/compute/amazon-eks로-웹-애플리케이션-구축하기',
            to: '/docs/knowledge/k-amazon-eks로-웹-애플리케이션-구축하기',
          },
          {
            from: '/docs/knowledge/infrastructure/aws/amazon-s3-api-reference',
            to: '/docs/knowledge/amazon-s3-api-reference',
          },
          {
            from: '/docs/knowledge/infrastructure/aws/storage/amazon-s3-api-reference',
            to: '/docs/knowledge/amazon-s3-api-reference',
          },
          {
            from: '/docs/knowledge/infrastructure/aws/amazone-java-sdk-meven',
            to: '/docs/knowledge/k-amazone-java-sdk-meven',
          },
          {
            from: '/docs/knowledge/infrastructure/aws/amazone-linux',
            to: '/docs/knowledge/k-amazone-linux',
          },
          {
            from: '/docs/knowledge/infrastructure/aws/compute/amazone-linux',
            to: '/docs/knowledge/k-amazone-linux',
          },
          {
            from: '/docs/knowledge/backend/spring/aop',
            to: '/docs/knowledge/k-aop',
          },
          {
            from: '/docs/knowledge/backend/spring/core/aop',
            to: '/docs/knowledge/k-aop',
          },
          {
            from: '/docs/knowledge/backend/spring-cloud/api-gateway',
            to: '/docs/knowledge/k-api-gateway',
          },
          {
            from: '/docs/knowledge/backend/spring/application-properties',
            to: '/docs/knowledge/k-application-properties',
          },
          {
            from: '/docs/knowledge/backend/spring/config/application-properties',
            to: '/docs/knowledge/k-application-properties',
          },
          {
            from: '/docs/knowledge/backend/spring/configuration/application-properties',
            to: '/docs/knowledge/k-application-properties',
          },
          {
            from: '/docs/knowledge/backend/spring/application-properties-d3edd8',
            to: '/docs/knowledge/k-application-properties-d3edd8',
          },
          {
            from: '/docs/knowledge/backend/spring/config/application-properties-d3edd8',
            to: '/docs/knowledge/k-application-properties-d3edd8',
          },
          {
            from: '/docs/knowledge/backend/spring/configuration/application-properties-d3edd8',
            to: '/docs/knowledge/k-application-properties-d3edd8',
          },
          {
            from: '/docs/knowledge/backend/spring/application-yml-import',
            to: '/docs/knowledge/k-application-yml-import',
          },
          {
            from: '/docs/knowledge/backend/spring/config/application-yml-import',
            to: '/docs/knowledge/k-application-yml-import',
          },
          {
            from: '/docs/knowledge/backend/spring/configuration/application-yml-import',
            to: '/docs/knowledge/k-application-yml-import',
          },
          {
            from: '/docs/knowledge/infrastructure/linux/apt-list-update-관리',
            to: '/docs/knowledge/k-apt-list-update-관리',
          },
          {
            from: '/docs/knowledge/infrastructure/linux/distro/apt-list-update-관리',
            to: '/docs/knowledge/k-apt-list-update-관리',
          },
          {
            from: '/docs/knowledge/infrastructure/linux/apt-update-err',
            to: '/docs/knowledge/k-apt-update-err',
          },
          {
            from: '/docs/knowledge/infrastructure/linux/distro/apt-update-err',
            to: '/docs/knowledge/k-apt-update-err',
          },
          {
            from: '/docs/knowledge/backend/spring/auditing',
            to: '/docs/knowledge/k-auditing',
          },
          {
            from: '/docs/knowledge/backend/spring/data-access/auditing',
            to: '/docs/knowledge/k-auditing',
          },
          {
            from: '/docs/knowledge/security/auth256utils',
            to: '/docs/knowledge/k-auth256utils',
          },
          {
            from: '/docs/knowledge/security/authtokeninterceptor',
            to: '/docs/knowledge/k-authtokeninterceptor',
          },
          {
            from: '/docs/knowledge/infrastructure/aws/aws',
            to: '/docs/knowledge/k-aws',
          },
          {
            from: '/docs/knowledge/infrastructure/aws/aws-cloudfront',
            to: '/docs/knowledge/k-aws-cloudfront',
          },
          {
            from: '/docs/knowledge/infrastructure/aws/network/aws-cloudfront',
            to: '/docs/knowledge/k-aws-cloudfront',
          },
          {
            from: '/docs/knowledge/infrastructure/aws/aws-cloudfront-info-용어',
            to: '/docs/knowledge/k-aws-cloudfront-info-용어',
          },
          {
            from: '/docs/knowledge/infrastructure/aws/network/aws-cloudfront-info-용어',
            to: '/docs/knowledge/k-aws-cloudfront-info-용어',
          },
          {
            from: '/docs/knowledge/infrastructure/aws/aws-ec2',
            to: '/docs/knowledge/k-aws-ec2',
          },
          {
            from: '/docs/knowledge/infrastructure/aws/compute/aws-ec2',
            to: '/docs/knowledge/k-aws-ec2',
          },
          {
            from: '/docs/knowledge/infrastructure/aws/aws-ec2-docker-compose-경로',
            to: '/docs/knowledge/k-aws-ec2-docker-compose-경로',
          },
          {
            from: '/docs/knowledge/infrastructure/aws/compute/aws-ec2-docker-compose-경로',
            to: '/docs/knowledge/k-aws-ec2-docker-compose-경로',
          },
          {
            from: '/docs/knowledge/infrastructure/aws/aws-eks',
            to: '/docs/knowledge/k-aws-eks',
          },
          {
            from: '/docs/knowledge/infrastructure/aws/compute/aws-eks',
            to: '/docs/knowledge/k-aws-eks',
          },
          {
            from: '/docs/knowledge/infrastructure/aws/aws-kendra',
            to: '/docs/knowledge/k-aws-kendra',
          },
          {
            from: '/docs/knowledge/infrastructure/aws/aws-lambda-for-intelij',
            to: '/docs/knowledge/k-aws-lambda-for-intelij',
          },
          {
            from: '/docs/knowledge/infrastructure/aws/compute/aws-lambda-for-intelij',
            to: '/docs/knowledge/k-aws-lambda-for-intelij',
          },
          {
            from: '/docs/knowledge/infrastructure/aws/aws-operationsever',
            to: '/docs/knowledge/k-aws-operationsever',
          },
          {
            from: '/docs/knowledge/infrastructure/aws/compute/aws-operationsever',
            to: '/docs/knowledge/k-aws-operationsever',
          },
          {
            from: '/docs/knowledge/infrastructure/aws/aws-regexp-schedule',
            to: '/docs/knowledge/k-aws-regexp-schedule',
          },
          {
            from: '/docs/knowledge/infrastructure/aws/aws-s3',
            to: '/docs/knowledge/k-aws-s3',
          },
          {
            from: '/docs/knowledge/infrastructure/aws/storage/aws-s3',
            to: '/docs/knowledge/k-aws-s3',
          },
          {
            from: '/docs/knowledge/infrastructure/aws/aws-s3-구조',
            to: '/docs/knowledge/k-aws-s3-구조',
          },
          {
            from: '/docs/knowledge/infrastructure/aws/storage/aws-s3-구조',
            to: '/docs/knowledge/k-aws-s3-구조',
          },
          {
            from: '/docs/knowledge/infrastructure/aws/aws-s3simple-storage-service',
            to: '/docs/knowledge/k-aws-s3simple-storage-service',
          },
          {
            from: '/docs/knowledge/infrastructure/aws/storage/aws-s3simple-storage-service',
            to: '/docs/knowledge/k-aws-s3simple-storage-service',
          },
          {
            from: '/docs/knowledge/messaging/aws-ses',
            to: '/docs/knowledge/k-aws-ses',
          },
          {
            from: '/docs/knowledge/messaging/delivery/aws-ses',
            to: '/docs/knowledge/k-aws-ses',
          },
          {
            from: '/docs/knowledge/infrastructure/aws/aws-ses-info-용어',
            to: '/docs/knowledge/k-aws-ses-info-용어',
          },
          {
            from: '/docs/knowledge/backend/spring/bach',
            to: '/docs/knowledge/k-bach',
          },
          {
            from: '/docs/knowledge/backend/spring/scheduling/bach',
            to: '/docs/knowledge/k-bach',
          },
          {
            from: '/docs/knowledge/backend/spring/banner',
            to: '/docs/knowledge/k-banner',
          },
          {
            from: '/docs/knowledge/backend/spring/core/banner',
            to: '/docs/knowledge/k-banner',
          },
          {
            from: '/docs/knowledge/infrastructure/linux/bashrcalias',
            to: '/docs/knowledge/k-bashrcalias',
          },
          {
            from: '/docs/knowledge/infrastructure/linux/system/bashrcalias',
            to: '/docs/knowledge/k-bashrcalias',
          },
          {
            from: '/docs/knowledge/messaging/bot',
            to: '/docs/knowledge/k-bot',
          },
          {
            from: '/docs/knowledge/messaging/dialogflow/bot',
            to: '/docs/knowledge/k-bot',
          },
          {
            from: '/docs/knowledge/client/browser-guid',
            to: '/docs/knowledge/k-browser-guid',
          },
          {
            from: '/docs/knowledge/data/redis/caching-annotation',
            to: '/docs/knowledge/k-caching-annotation',
          },
          {
            from: '/docs/knowledge/data/redis/cashing',
            to: '/docs/knowledge/k-cashing',
          },
          {
            from: '/docs/knowledge/infrastructure/linux/centos',
            to: '/docs/knowledge/k-centos',
          },
          {
            from: '/docs/knowledge/infrastructure/linux/distro/centos',
            to: '/docs/knowledge/k-centos',
          },
          {
            from: '/docs/knowledge/networking/cidr-계산기',
            to: '/docs/knowledge/k-cidr-계산기',
          },
          {
            from: '/docs/knowledge/networking/transport/cidr-계산기',
            to: '/docs/knowledge/k-cidr-계산기',
          },
          {
            from: '/docs/knowledge/tooling/cli',
            to: '/docs/knowledge/k-cli',
          },
          {
            from: '/docs/knowledge/tooling/remote/cli',
            to: '/docs/knowledge/k-cli',
          },
          {
            from: '/docs/knowledge/tooling/client-server-struct',
            to: '/docs/knowledge/k-client-server-struct',
          },
          {
            from: '/docs/knowledge/tooling/common',
            to: '/docs/knowledge/k-common',
          },
          {
            from: '/docs/knowledge/backend/spring/config',
            to: '/docs/knowledge/k-config',
          },
          {
            from: '/docs/knowledge/backend/spring/config/config',
            to: '/docs/knowledge/k-config',
          },
          {
            from: '/docs/knowledge/backend/spring/configuration/config',
            to: '/docs/knowledge/k-config',
          },
          {
            from: '/docs/knowledge/backend/spring-cloud/config-server',
            to: '/docs/knowledge/k-config-server',
          },
          {
            from: '/docs/knowledge/backend/spring/configurecontentnegotiation',
            to: '/docs/knowledge/k-configurecontentnegotiation',
          },
          {
            from: '/docs/knowledge/backend/spring/web/configurecontentnegotiation',
            to: '/docs/knowledge/k-configurecontentnegotiation',
          },
          {
            from: '/docs/knowledge/networking/connetionless',
            to: '/docs/knowledge/k-connetionless',
          },
          {
            from: '/docs/knowledge/networking/transport/connetionless',
            to: '/docs/knowledge/k-connetionless',
          },
          {
            from: '/docs/knowledge/networking/content-mime-type',
            to: '/docs/knowledge/k-content-mime-type',
          },
          {
            from: '/docs/knowledge/networking/http-stack/content-mime-type',
            to: '/docs/knowledge/k-content-mime-type',
          },
          {
            from: '/docs/knowledge/networking/http/content-mime-type',
            to: '/docs/knowledge/k-content-mime-type',
          },
          {
            from: '/docs/knowledge/networking/corsregistry',
            to: '/docs/knowledge/k-corsregistry',
          },
          {
            from: '/docs/knowledge/networking/http-stack/corsregistry',
            to: '/docs/knowledge/k-corsregistry',
          },
          {
            from: '/docs/knowledge/networking/http/corsregistry',
            to: '/docs/knowledge/k-corsregistry',
          },
          {
            from: '/docs/knowledge/networking/croess-domain-cors',
            to: '/docs/knowledge/k-croess-domain-cors',
          },
          {
            from: '/docs/knowledge/networking/http-stack/croess-domain-cors',
            to: '/docs/knowledge/k-croess-domain-cors',
          },
          {
            from: '/docs/knowledge/networking/http/croess-domain-cors',
            to: '/docs/knowledge/k-croess-domain-cors',
          },
          {
            from: '/docs/knowledge/data/data-jpa-rerference',
            to: '/docs/knowledge/k-data-jpa-rerference',
          },
          {
            from: '/docs/knowledge/data/jpa/data-jpa-rerference',
            to: '/docs/knowledge/k-data-jpa-rerference',
          },
          {
            from: '/docs/knowledge/data/database',
            to: '/docs/knowledge/k-database',
          },
          {
            from: '/docs/knowledge/data/sql-ops/database',
            to: '/docs/knowledge/k-database',
          },
          {
            from: '/docs/knowledge/backend/java/dateutils',
            to: '/docs/knowledge/k-dateutils',
          },
          {
            from: '/docs/knowledge/data/dblink',
            to: '/docs/knowledge/k-dblink',
          },
          {
            from: '/docs/knowledge/data/sql-ops/dblink',
            to: '/docs/knowledge/k-dblink',
          },
          {
            from: '/docs/knowledge/messaging/brokers/debezium',
            to: '/docs/knowledge/k-debezium',
          },
          {
            from: '/docs/knowledge/messaging/debezium',
            to: '/docs/knowledge/k-debezium',
          },
          {
            from: '/docs/knowledge/messaging/dialogflow-setting',
            to: '/docs/knowledge/k-dialogflow-setting',
          },
          {
            from: '/docs/knowledge/messaging/dialogflow/dialogflow-setting',
            to: '/docs/knowledge/k-dialogflow-setting',
          },
          {
            from: '/docs/knowledge/messaging/dialogflow/dialogflowhandler',
            to: '/docs/knowledge/k-dialogflowhandler',
          },
          {
            from: '/docs/knowledge/messaging/dialogflowhandler',
            to: '/docs/knowledge/k-dialogflowhandler',
          },
          {
            from: '/docs/knowledge/infrastructure/docker/docker-compose',
            to: '/docs/knowledge/k-docker-compose',
          },
          {
            from: '/docs/knowledge/infrastructure/docker/docker-compose-yml',
            to: '/docs/knowledge/k-docker-compose-yml',
          },
          {
            from: '/docs/knowledge/infrastructure/docker/docker-create',
            to: '/docs/knowledge/k-docker-create',
          },
          {
            from: '/docs/knowledge/infrastructure/docker/docker-배포-로그',
            to: '/docs/knowledge/k-docker-배포-로그',
          },
          {
            from: '/docs/knowledge/infrastructure/docker/docker-설치',
            to: '/docs/knowledge/k-docker-설치',
          },
          {
            from: '/docs/knowledge/infrastructure/docker/dockerfile',
            to: '/docs/knowledge/k-dockerfile',
          },
          {
            from: '/docs/knowledge/data/dynamicquery',
            to: '/docs/knowledge/k-dynamicquery',
          },
          {
            from: '/docs/knowledge/data/jpa/dynamicquery',
            to: '/docs/knowledge/k-dynamicquery',
          },
          {
            from: '/docs/knowledge/infrastructure/aws/compute/ec2',
            to: '/docs/knowledge/k-ec2',
          },
          {
            from: '/docs/knowledge/infrastructure/aws/ec2',
            to: '/docs/knowledge/k-ec2',
          },
          {
            from: '/docs/knowledge/infrastructure/echo',
            to: '/docs/knowledge/k-echo',
          },
          {
            from: '/docs/knowledge/infrastructure/observability/elk',
            to: '/docs/knowledge/k-elk',
          },
          {
            from: '/docs/knowledge/infrastructure/observability/elk-log',
            to: '/docs/knowledge/k-elk-log',
          },
          {
            from: '/docs/knowledge/infrastructure/envvarialbe',
            to: '/docs/knowledge/k-envvarialbe',
          },
          {
            from: '/docs/knowledge/backend/spring-cloud/eureka',
            to: '/docs/knowledge/k-eureka',
          },
          {
            from: '/docs/knowledge/security/exame-bootsecurityjwtrestapi',
            to: '/docs/knowledge/k-exame-bootsecurityjwtrestapi',
          },
          {
            from: '/docs/knowledge/data/federated',
            to: '/docs/knowledge/k-federated',
          },
          {
            from: '/docs/knowledge/data/sql-ops/federated',
            to: '/docs/knowledge/k-federated',
          },
          {
            from: '/docs/knowledge/infrastructure/filename-date',
            to: '/docs/knowledge/k-filename-date',
          },
          {
            from: '/docs/knowledge/client/flutter',
            to: '/docs/knowledge/k-flutter',
          },
          {
            from: '/docs/knowledge/data/flyway',
            to: '/docs/knowledge/k-flyway',
          },
          {
            from: '/docs/knowledge/data/sql-ops/flyway',
            to: '/docs/knowledge/k-flyway',
          },
          {
            from: '/docs/knowledge/tooling/git/git',
            to: '/docs/knowledge/k-git',
          },
          {
            from: '/docs/knowledge/tooling/git/git-alias',
            to: '/docs/knowledge/k-git-alias',
          },
          {
            from: '/docs/knowledge/tooling/git/git-filterrepo',
            to: '/docs/knowledge/k-git-filterrepo',
          },
          {
            from: '/docs/knowledge/tooling/gitea',
            to: '/docs/knowledge/k-gitea',
          },
          {
            from: '/docs/knowledge/tooling/ci/github-actions-archive-deploy',
            to: '/docs/knowledge/k-github-actions-archive-deploy',
          },
          {
            from: '/docs/knowledge/tooling/github-actions-archive-deploy',
            to: '/docs/knowledge/k-github-actions-archive-deploy',
          },
          {
            from: '/docs/knowledge/messaging/dialogflow/googledialogflow',
            to: '/docs/knowledge/k-googledialogflow',
          },
          {
            from: '/docs/knowledge/messaging/googledialogflow',
            to: '/docs/knowledge/k-googledialogflow',
          },
          {
            from: '/docs/knowledge/data/grant',
            to: '/docs/knowledge/k-grant',
          },
          {
            from: '/docs/knowledge/data/sql-ops/grant',
            to: '/docs/knowledge/k-grant',
          },
          {
            from: '/docs/knowledge/infrastructure/linux/group-add',
            to: '/docs/knowledge/k-group-add',
          },
          {
            from: '/docs/knowledge/infrastructure/linux/system/group-add',
            to: '/docs/knowledge/k-group-add',
          },
          {
            from: '/docs/knowledge/backend/java/gson-to-json',
            to: '/docs/knowledge/k-gson-to-json',
          },
          {
            from: '/docs/knowledge/backend/java/json-utils/gson-to-json',
            to: '/docs/knowledge/k-gson-to-json',
          },
          {
            from: '/docs/knowledge/backend/java/json/gson-to-json',
            to: '/docs/knowledge/k-gson-to-json',
          },
          {
            from: '/docs/knowledge/backend/spring/handlerintercepter',
            to: '/docs/knowledge/k-handlerintercepter',
          },
          {
            from: '/docs/knowledge/backend/spring/web/handlerintercepter',
            to: '/docs/knowledge/k-handlerintercepter',
          },
          {
            from: '/docs/knowledge/infrastructure/hangul',
            to: '/docs/knowledge/k-hangul',
          },
          {
            from: '/docs/knowledge/infrastructure/docker/hooxiadmin-docker',
            to: '/docs/knowledge/k-hooxiadmin-docker',
          },
          {
            from: '/docs/knowledge/networking/http',
            to: '/docs/knowledge/k-http',
          },
          {
            from: '/docs/knowledge/networking/http-stack/http',
            to: '/docs/knowledge/k-http',
          },
          {
            from: '/docs/knowledge/networking/http/http',
            to: '/docs/knowledge/k-http',
          },
          {
            from: '/docs/knowledge/networking/http-basic',
            to: '/docs/knowledge/k-http-basic',
          },
          {
            from: '/docs/knowledge/networking/http-stack/http-basic',
            to: '/docs/knowledge/k-http-basic',
          },
          {
            from: '/docs/knowledge/networking/http/http-basic',
            to: '/docs/knowledge/k-http-basic',
          },
          {
            from: '/docs/knowledge/networking/http-is-all',
            to: '/docs/knowledge/k-http-is-all',
          },
          {
            from: '/docs/knowledge/networking/http-stack/http-is-all',
            to: '/docs/knowledge/k-http-is-all',
          },
          {
            from: '/docs/knowledge/networking/http/http-is-all',
            to: '/docs/knowledge/k-http-is-all',
          },
          {
            from: '/docs/knowledge/networking/http-message',
            to: '/docs/knowledge/k-http-message',
          },
          {
            from: '/docs/knowledge/networking/http-stack/http-message',
            to: '/docs/knowledge/k-http-message',
          },
          {
            from: '/docs/knowledge/networking/http/http-message',
            to: '/docs/knowledge/k-http-message',
          },
          {
            from: '/docs/knowledge/networking/http-request-method',
            to: '/docs/knowledge/k-http-request-method',
          },
          {
            from: '/docs/knowledge/networking/http-stack/http-request-method',
            to: '/docs/knowledge/k-http-request-method',
          },
          {
            from: '/docs/knowledge/networking/http/http-request-method',
            to: '/docs/knowledge/k-http-request-method',
          },
          {
            from: '/docs/knowledge/networking/https-on-alb-with-acm',
            to: '/docs/knowledge/https-on-alb-with-acm',
          },
          {
            from: '/docs/knowledge/networking/tls/https-on-alb-with-acm',
            to: '/docs/knowledge/https-on-alb-with-acm',
          },
          {
            from: '/docs/knowledge/networking/https-로그인-비밀번호-평문전송',
            to: '/docs/knowledge/k-https-로그인-비밀번호-평문전송',
          },
          {
            from: '/docs/knowledge/networking/tls/https-로그인-비밀번호-평문전송',
            to: '/docs/knowledge/k-https-로그인-비밀번호-평문전송',
          },
          {
            from: '/docs/knowledge/networking/http-stack/httputils',
            to: '/docs/knowledge/k-httputils',
          },
          {
            from: '/docs/knowledge/networking/http/httputils',
            to: '/docs/knowledge/k-httputils',
          },
          {
            from: '/docs/knowledge/networking/httputils',
            to: '/docs/knowledge/k-httputils',
          },
          {
            from: '/docs/knowledge/data/index-15fb78',
            to: '/docs/knowledge/k-index-15fb78',
          },
          {
            from: '/docs/knowledge/data/sql-ops/index-15fb78',
            to: '/docs/knowledge/k-index-15fb78',
          },
          {
            from: '/docs/knowledge/backend/spring/instance-schedule',
            to: '/docs/knowledge/k-instance-schedule',
          },
          {
            from: '/docs/knowledge/backend/spring/scheduling/instance-schedule',
            to: '/docs/knowledge/k-instance-schedule',
          },
          {
            from: '/docs/knowledge/networking/ip',
            to: '/docs/knowledge/k-ip',
          },
          {
            from: '/docs/knowledge/networking/transport/ip',
            to: '/docs/knowledge/k-ip',
          },
          {
            from: '/docs/knowledge/backend/java/java',
            to: '/docs/knowledge/k-java',
          },
          {
            from: '/docs/knowledge/backend/java/java-e63b2b',
            to: '/docs/knowledge/k-java-e63b2b',
          },
          {
            from: '/docs/knowledge/backend/java/java-time-add-opens',
            to: '/docs/knowledge/k-java-time-add-opens',
          },
          {
            from: '/docs/knowledge/tooling/ci/jenkins',
            to: '/docs/knowledge/k-jenkins',
          },
          {
            from: '/docs/knowledge/tooling/jenkins',
            to: '/docs/knowledge/k-jenkins',
          },
          {
            from: '/docs/knowledge/tooling/ci/jenkins-setting',
            to: '/docs/knowledge/k-jenkins-setting',
          },
          {
            from: '/docs/knowledge/tooling/jenkins-setting',
            to: '/docs/knowledge/k-jenkins-setting',
          },
          {
            from: '/docs/knowledge/data/jpa-core-concepts',
            to: '/docs/knowledge/k-jpa-core-concepts',
          },
          {
            from: '/docs/knowledge/data/jpa/jpa-core-concepts',
            to: '/docs/knowledge/k-jpa-core-concepts',
          },
          {
            from: '/docs/knowledge/backend/java/json',
            to: '/docs/knowledge/k-json',
          },
          {
            from: '/docs/knowledge/backend/java/json-utils/json',
            to: '/docs/knowledge/k-json',
          },
          {
            from: '/docs/knowledge/backend/java/json/json',
            to: '/docs/knowledge/k-json',
          },
          {
            from: '/docs/knowledge/backend/java/json-build-attachmentscard',
            to: '/docs/knowledge/k-json-build-attachmentscard',
          },
          {
            from: '/docs/knowledge/backend/java/json-utils/json-build-attachmentscard',
            to: '/docs/knowledge/k-json-build-attachmentscard',
          },
          {
            from: '/docs/knowledge/backend/java/json/json-build-attachmentscard',
            to: '/docs/knowledge/k-json-build-attachmentscard',
          },
          {
            from: '/docs/knowledge/messaging/dialogflow/jsonfile읽는법dialogflowauth',
            to: '/docs/knowledge/k-jsonfile읽는법dialogflowauth',
          },
          {
            from: '/docs/knowledge/messaging/jsonfile읽는법dialogflowauth',
            to: '/docs/knowledge/k-jsonfile읽는법dialogflowauth',
          },
          {
            from: '/docs/knowledge/backend/java/json-utils/jsonsimple',
            to: '/docs/knowledge/k-jsonsimple',
          },
          {
            from: '/docs/knowledge/backend/java/json/jsonsimple',
            to: '/docs/knowledge/k-jsonsimple',
          },
          {
            from: '/docs/knowledge/backend/java/jsonsimple',
            to: '/docs/knowledge/k-jsonsimple',
          },
          {
            from: '/docs/knowledge/security/jwt',
            to: '/docs/knowledge/k-jwt',
          },
          {
            from: '/docs/knowledge/messaging/brokers/kafka',
            to: '/docs/knowledge/k-kafka',
          },
          {
            from: '/docs/knowledge/messaging/kafka',
            to: '/docs/knowledge/k-kafka',
          },
          {
            from: '/docs/knowledge/infrastructure/aws/compute/kubernates-install',
            to: '/docs/knowledge/k-kubernates-install',
          },
          {
            from: '/docs/knowledge/infrastructure/aws/kubernates-install',
            to: '/docs/knowledge/k-kubernates-install',
          },
          {
            from: '/docs/knowledge/backend/spring/core/lazy',
            to: '/docs/knowledge/k-lazy',
          },
          {
            from: '/docs/knowledge/backend/spring/lazy',
            to: '/docs/knowledge/k-lazy',
          },
          {
            from: '/docs/knowledge/infrastructure/linux/distro/linux',
            to: '/docs/knowledge/k-linux',
          },
          {
            from: '/docs/knowledge/infrastructure/linux/linux',
            to: '/docs/knowledge/k-linux',
          },
          {
            from: '/docs/knowledge/networking/local-https-mkcert',
            to: '/docs/knowledge/k-local-https-mkcert',
          },
          {
            from: '/docs/knowledge/networking/tls/local-https-mkcert',
            to: '/docs/knowledge/k-local-https-mkcert',
          },
          {
            from: '/docs/knowledge/networking/local-nginx',
            to: '/docs/knowledge/k-local-nginx',
          },
          {
            from: '/docs/knowledge/networking/proxy/local-nginx',
            to: '/docs/knowledge/k-local-nginx',
          },
          {
            from: '/docs/knowledge/backend/spring/config/localeresolver',
            to: '/docs/knowledge/k-localeresolver',
          },
          {
            from: '/docs/knowledge/backend/spring/configuration/localeresolver',
            to: '/docs/knowledge/k-localeresolver',
          },
          {
            from: '/docs/knowledge/backend/spring/localeresolver',
            to: '/docs/knowledge/k-localeresolver',
          },
          {
            from: '/docs/knowledge/data/jpa/log4jdbc',
            to: '/docs/knowledge/k-log4jdbc',
          },
          {
            from: '/docs/knowledge/data/log4jdbc',
            to: '/docs/knowledge/k-log4jdbc',
          },
          {
            from: '/docs/knowledge/data/jpa/maping',
            to: '/docs/knowledge/k-maping',
          },
          {
            from: '/docs/knowledge/data/maping',
            to: '/docs/knowledge/k-maping',
          },
          {
            from: '/docs/knowledge/client/mdmmobile-device-managerment',
            to: '/docs/knowledge/k-mdmmobile-device-managerment',
          },
          {
            from: '/docs/knowledge/tooling/medium',
            to: '/docs/knowledge/k-medium',
          },
          {
            from: '/docs/knowledge/messaging/brokers/message',
            to: '/docs/knowledge/k-message',
          },
          {
            from: '/docs/knowledge/messaging/message',
            to: '/docs/knowledge/k-message',
          },
          {
            from: '/docs/knowledge/data/multidatabase',
            to: '/docs/knowledge/k-multidatabase',
          },
          {
            from: '/docs/knowledge/data/sql-ops/multidatabase',
            to: '/docs/knowledge/k-multidatabase',
          },
          {
            from: '/docs/knowledge/backend/spring/data-access/mybatis',
            to: '/docs/knowledge/k-mybatis',
          },
          {
            from: '/docs/knowledge/backend/spring/mybatis',
            to: '/docs/knowledge/k-mybatis',
          },
          {
            from: '/docs/knowledge/data/mysql/mysql-8-x',
            to: '/docs/knowledge/k-mysql-8-x',
          },
          {
            from: '/docs/knowledge/data/mysql/mysql-cli',
            to: '/docs/knowledge/k-mysql-cli',
          },
          {
            from: '/docs/knowledge/data/mysql/mysql-optimization',
            to: '/docs/knowledge/k-mysql-optimization',
          },
          {
            from: '/docs/knowledge/networking/network',
            to: '/docs/knowledge/k-network',
          },
          {
            from: '/docs/knowledge/networking/transport/network',
            to: '/docs/knowledge/k-network',
          },
          {
            from: '/docs/knowledge/networking/nginx',
            to: '/docs/knowledge/k-nginx',
          },
          {
            from: '/docs/knowledge/networking/proxy/nginx',
            to: '/docs/knowledge/k-nginx',
          },
          {
            from: '/docs/knowledge/networking/nginx-7dd0ec',
            to: '/docs/knowledge/k-nginx-7dd0ec',
          },
          {
            from: '/docs/knowledge/networking/proxy/nginx-7dd0ec',
            to: '/docs/knowledge/k-nginx-7dd0ec',
          },
          {
            from: '/docs/knowledge/networking/ngrok',
            to: '/docs/knowledge/k-ngrok',
          },
          {
            from: '/docs/knowledge/networking/transport/ngrok',
            to: '/docs/knowledge/k-ngrok',
          },
          {
            from: '/docs/knowledge/no1stone-start-page',
            to: '/docs/knowledge/k-no1stone-start-page',
          },
          {
            from: '/docs/knowledge/infrastructure/old-info',
            to: '/docs/knowledge/k-old-info',
          },
          {
            from: '/docs/knowledge/infrastructure/workspace/old-info',
            to: '/docs/knowledge/k-old-info',
          },
          {
            from: '/docs/knowledge/tooling/ollama',
            to: '/docs/knowledge/k-ollama',
          },
          {
            from: '/docs/knowledge/infrastructure/observability/open-search',
            to: '/docs/knowledge/k-open-search',
          },
          {
            from: '/docs/knowledge/backend/spring/openfeign',
            to: '/docs/knowledge/k-openfeign',
          },
          {
            from: '/docs/knowledge/backend/spring/web/openfeign',
            to: '/docs/knowledge/k-openfeign',
          },
          {
            from: '/docs/knowledge/security/openssl-base64',
            to: '/docs/knowledge/k-openssl-base64',
          },
          {
            from: '/docs/knowledge/data/oracle',
            to: '/docs/knowledge/k-oracle',
          },
          {
            from: '/docs/knowledge/data/sql-ops/oracle',
            to: '/docs/knowledge/k-oracle',
          },
          {
            from: '/docs/knowledge/data/partition',
            to: '/docs/knowledge/k-partition',
          },
          {
            from: '/docs/knowledge/data/sql-ops/partition',
            to: '/docs/knowledge/k-partition',
          },
          {
            from: '/docs/knowledge/data/partition-3b84e6',
            to: '/docs/knowledge/k-partition-3b84e6',
          },
          {
            from: '/docs/knowledge/data/sql-ops/partition-3b84e6',
            to: '/docs/knowledge/k-partition-3b84e6',
          },
          {
            from: '/docs/knowledge/infrastructure/pg-admin',
            to: '/docs/knowledge/k-pg-admin',
          },
          {
            from: '/docs/knowledge/tooling/plan',
            to: '/docs/knowledge/k-plan',
          },
          {
            from: '/docs/knowledge/networking/port',
            to: '/docs/knowledge/k-port',
          },
          {
            from: '/docs/knowledge/networking/transport/port',
            to: '/docs/knowledge/k-port',
          },
          {
            from: '/docs/knowledge/networking/port-a7e4b3',
            to: '/docs/knowledge/k-port-a7e4b3',
          },
          {
            from: '/docs/knowledge/networking/transport/port-a7e4b3',
            to: '/docs/knowledge/k-port-a7e4b3',
          },
          {
            from: '/docs/knowledge/backend/spring/core/postconstruct-predestroy-초기화-폐기',
            to: '/docs/knowledge/k-postconstruct-predestroy-초기화-폐기',
          },
          {
            from: '/docs/knowledge/backend/spring/postconstruct-predestroy-초기화-폐기',
            to: '/docs/knowledge/k-postconstruct-predestroy-초기화-폐기',
          },
          {
            from: '/docs/knowledge/data/postgresql/postgresql-datatype',
            to: '/docs/knowledge/k-postgresql-datatype',
          },
          {
            from: '/docs/knowledge/data/postgresql/postgresql-info',
            to: '/docs/knowledge/k-postgresql-info',
          },
          {
            from: '/docs/knowledge/backend/spring/printwriter',
            to: '/docs/knowledge/k-printwriter',
          },
          {
            from: '/docs/knowledge/backend/spring/web/printwriter',
            to: '/docs/knowledge/k-printwriter',
          },
          {
            from: '/docs/knowledge/messaging/brokers/pub',
            to: '/docs/knowledge/k-pub',
          },
          {
            from: '/docs/knowledge/messaging/pub',
            to: '/docs/knowledge/k-pub',
          },
          {
            from: '/docs/knowledge/messaging/brokers/pub-38b647',
            to: '/docs/knowledge/k-pub-38b647',
          },
          {
            from: '/docs/knowledge/messaging/pub-38b647',
            to: '/docs/knowledge/k-pub-38b647',
          },
          {
            from: '/docs/knowledge/messaging/brokers/pubsub',
            to: '/docs/knowledge/k-pubsub',
          },
          {
            from: '/docs/knowledge/messaging/pubsub',
            to: '/docs/knowledge/k-pubsub',
          },
          {
            from: '/docs/knowledge/messaging/brokers/pulsar',
            to: '/docs/knowledge/k-pulsar',
          },
          {
            from: '/docs/knowledge/messaging/pulsar',
            to: '/docs/knowledge/k-pulsar',
          },
          {
            from: '/docs/knowledge/data/jpa/querydsl-regexp',
            to: '/docs/knowledge/k-querydsl-regexp',
          },
          {
            from: '/docs/knowledge/data/querydsl-regexp',
            to: '/docs/knowledge/k-querydsl-regexp',
          },
          {
            from: '/docs/knowledge/data/r2dbc',
            to: '/docs/knowledge/k-r2dbc',
          },
          {
            from: '/docs/knowledge/data/r2dbc-stack/r2dbc',
            to: '/docs/knowledge/k-r2dbc',
          },
          {
            from: '/docs/knowledge/data/r2dbc/r2dbc',
            to: '/docs/knowledge/k-r2dbc',
          },
          {
            from: '/docs/knowledge/data/r2dbc-config',
            to: '/docs/knowledge/k-r2dbc-config',
          },
          {
            from: '/docs/knowledge/data/r2dbc-stack/r2dbc-config',
            to: '/docs/knowledge/k-r2dbc-config',
          },
          {
            from: '/docs/knowledge/data/r2dbc/r2dbc-config',
            to: '/docs/knowledge/k-r2dbc-config',
          },
          {
            from: '/docs/knowledge/data/r2dbc-mongodb',
            to: '/docs/knowledge/k-r2dbc-mongodb',
          },
          {
            from: '/docs/knowledge/data/r2dbc-stack/r2dbc-mongodb',
            to: '/docs/knowledge/k-r2dbc-mongodb',
          },
          {
            from: '/docs/knowledge/data/r2dbc/r2dbc-mongodb',
            to: '/docs/knowledge/k-r2dbc-mongodb',
          },
          {
            from: '/docs/knowledge/data/redis/r2dbc-redis',
            to: '/docs/knowledge/k-r2dbc-redis',
          },
          {
            from: '/docs/knowledge/data/r2dbc-stack/r2dbcservice',
            to: '/docs/knowledge/k-r2dbcservice',
          },
          {
            from: '/docs/knowledge/data/r2dbc/r2dbcservice',
            to: '/docs/knowledge/k-r2dbcservice',
          },
          {
            from: '/docs/knowledge/data/r2dbcservice',
            to: '/docs/knowledge/k-r2dbcservice',
          },
          {
            from: '/docs/knowledge/data/redis/redis',
            to: '/docs/knowledge/k-redis',
          },
          {
            from: '/docs/knowledge/messaging/brokers/redispubsub',
            to: '/docs/knowledge/k-redispubsub',
          },
          {
            from: '/docs/knowledge/messaging/redispubsub',
            to: '/docs/knowledge/k-redispubsub',
          },
          {
            from: '/docs/knowledge/data/replication',
            to: '/docs/knowledge/k-replication',
          },
          {
            from: '/docs/knowledge/data/sql-ops/replication',
            to: '/docs/knowledge/k-replication',
          },
          {
            from: '/docs/knowledge/backend/spring/requestmapping',
            to: '/docs/knowledge/k-requestmapping',
          },
          {
            from: '/docs/knowledge/backend/spring/web/requestmapping',
            to: '/docs/knowledge/k-requestmapping',
          },
          {
            from: '/docs/knowledge/backend/spring/core/required',
            to: '/docs/knowledge/k-required',
          },
          {
            from: '/docs/knowledge/backend/spring/required',
            to: '/docs/knowledge/k-required',
          },
          {
            from: '/docs/knowledge/backend/spring/config/resourcebundlemessagesource',
            to: '/docs/knowledge/k-resourcebundlemessagesource',
          },
          {
            from: '/docs/knowledge/backend/spring/configuration/resourcebundlemessagesource',
            to: '/docs/knowledge/k-resourcebundlemessagesource',
          },
          {
            from: '/docs/knowledge/backend/spring/resourcebundlemessagesource',
            to: '/docs/knowledge/k-resourcebundlemessagesource',
          },
          {
            from: '/docs/knowledge/backend/java/json-utils/responsebody-to-json',
            to: '/docs/knowledge/k-responsebody-to-json',
          },
          {
            from: '/docs/knowledge/backend/java/json/responsebody-to-json',
            to: '/docs/knowledge/k-responsebody-to-json',
          },
          {
            from: '/docs/knowledge/backend/java/responsebody-to-json',
            to: '/docs/knowledge/k-responsebody-to-json',
          },
          {
            from: '/docs/knowledge/backend/spring/rest-create',
            to: '/docs/knowledge/k-rest-create',
          },
          {
            from: '/docs/knowledge/backend/spring/web/rest-create',
            to: '/docs/knowledge/k-rest-create',
          },
          {
            from: '/docs/knowledge/messaging/delivery/restapi',
            to: '/docs/knowledge/k-restapi',
          },
          {
            from: '/docs/knowledge/messaging/restapi',
            to: '/docs/knowledge/k-restapi',
          },
          {
            from: '/docs/knowledge/backend/spring/restapi-9f6eac',
            to: '/docs/knowledge/k-restapi-9f6eac',
          },
          {
            from: '/docs/knowledge/backend/spring/web/restapi-9f6eac',
            to: '/docs/knowledge/k-restapi-9f6eac',
          },
          {
            from: '/docs/knowledge/backend/spring/resttemplate',
            to: '/docs/knowledge/k-resttemplate',
          },
          {
            from: '/docs/knowledge/backend/spring/web/resttemplate',
            to: '/docs/knowledge/k-resttemplate',
          },
          {
            from: '/docs/knowledge/networking/proxy/rewrite',
            to: '/docs/knowledge/k-rewrite',
          },
          {
            from: '/docs/knowledge/networking/rewrite',
            to: '/docs/knowledge/k-rewrite',
          },
          {
            from: '/docs/knowledge/backend/spring/reactive-web/router-functions-info',
            to: '/docs/knowledge/k-router-functions-info',
          },
          {
            from: '/docs/knowledge/backend/spring/router-functions-info',
            to: '/docs/knowledge/k-router-functions-info',
          },
          {
            from: '/docs/knowledge/backend/spring/webflux/router-functions-info',
            to: '/docs/knowledge/k-router-functions-info',
          },
          {
            from: '/docs/knowledge/infrastructure/sam',
            to: '/docs/knowledge/k-sam',
          },
          {
            from: '/docs/knowledge/backend/spring/schedule',
            to: '/docs/knowledge/k-schedule',
          },
          {
            from: '/docs/knowledge/backend/spring/scheduling/schedule',
            to: '/docs/knowledge/k-schedule',
          },
          {
            from: '/docs/knowledge/backend/spring/scheduled',
            to: '/docs/knowledge/k-scheduled',
          },
          {
            from: '/docs/knowledge/backend/spring/scheduling/scheduled',
            to: '/docs/knowledge/k-scheduled',
          },
          {
            from: '/docs/knowledge/tooling/remote/scp-file-down',
            to: '/docs/knowledge/k-scp-file-down',
          },
          {
            from: '/docs/knowledge/tooling/scp-file-down',
            to: '/docs/knowledge/k-scp-file-down',
          },
          {
            from: '/docs/knowledge/tooling/remote/sdkman',
            to: '/docs/knowledge/k-sdkman',
          },
          {
            from: '/docs/knowledge/tooling/sdkman',
            to: '/docs/knowledge/k-sdkman',
          },
          {
            from: '/docs/knowledge/security/security',
            to: '/docs/knowledge/k-security',
          },
          {
            from: '/docs/knowledge/security/security-info',
            to: '/docs/knowledge/k-security-info',
          },
          {
            from: '/docs/knowledge/infrastructure/aws/select-hibernate',
            to: '/docs/knowledge/k-select-hibernate',
          },
          {
            from: '/docs/knowledge/messaging/delivery/sending-emails-programmatically',
            to: '/docs/knowledge/k-sending-emails-programmatically',
          },
          {
            from: '/docs/knowledge/messaging/sending-emails-programmatically',
            to: '/docs/knowledge/k-sending-emails-programmatically',
          },
          {
            from: '/docs/knowledge/tooling/remote/sh',
            to: '/docs/knowledge/k-sh',
          },
          {
            from: '/docs/knowledge/tooling/sh',
            to: '/docs/knowledge/k-sh',
          },
          {
            from: '/docs/knowledge/backend/spring/core/spring',
            to: '/docs/knowledge/k-spring',
          },
          {
            from: '/docs/knowledge/backend/spring/spring',
            to: '/docs/knowledge/k-spring',
          },
          {
            from: '/docs/knowledge/backend/spring/core/spring-bean-scope',
            to: '/docs/knowledge/k-spring-bean-scope',
          },
          {
            from: '/docs/knowledge/backend/spring/spring-bean-scope',
            to: '/docs/knowledge/k-spring-bean-scope',
          },
          {
            from: '/docs/knowledge/backend/spring/core/spring-core',
            to: '/docs/knowledge/k-spring-core',
          },
          {
            from: '/docs/knowledge/backend/spring/spring-core',
            to: '/docs/knowledge/k-spring-core',
          },
          {
            from: '/docs/knowledge/data/jpa/spring-data-jpa',
            to: '/docs/knowledge/k-spring-data-jpa',
          },
          {
            from: '/docs/knowledge/data/spring-data-jpa',
            to: '/docs/knowledge/k-spring-data-jpa',
          },
          {
            from: '/docs/knowledge/tooling/git/spring-git',
            to: '/docs/knowledge/k-spring-git',
          },
          {
            from: '/docs/knowledge/backend/spring/spring-mvc',
            to: '/docs/knowledge/k-spring-mvc',
          },
          {
            from: '/docs/knowledge/backend/spring/web/spring-mvc',
            to: '/docs/knowledge/k-spring-mvc',
          },
          {
            from: '/docs/knowledge/backend/spring/spring-rest',
            to: '/docs/knowledge/k-spring-rest',
          },
          {
            from: '/docs/knowledge/backend/spring/web/spring-rest',
            to: '/docs/knowledge/k-spring-rest',
          },
          {
            from: '/docs/knowledge/infrastructure/observability/springboot-logstash',
            to: '/docs/knowledge/k-springboot-logstash',
          },
          {
            from: '/docs/knowledge/backend/spring/sseemitter',
            to: '/docs/knowledge/k-sseemitter',
          },
          {
            from: '/docs/knowledge/backend/spring/web/sseemitter',
            to: '/docs/knowledge/k-sseemitter',
          },
          {
            from: '/docs/knowledge/tooling/remote/ssh',
            to: '/docs/knowledge/k-ssh',
          },
          {
            from: '/docs/knowledge/tooling/ssh',
            to: '/docs/knowledge/k-ssh',
          },
          {
            from: '/docs/knowledge/tooling/remote/ssh-allow',
            to: '/docs/knowledge/k-ssh-allow',
          },
          {
            from: '/docs/knowledge/tooling/ssh-allow',
            to: '/docs/knowledge/k-ssh-allow',
          },
          {
            from: '/docs/knowledge/infrastructure/linux/static',
            to: '/docs/knowledge/k-static',
          },
          {
            from: '/docs/knowledge/infrastructure/linux/system/static',
            to: '/docs/knowledge/k-static',
          },
          {
            from: '/docs/knowledge/messaging/brokers/stomp',
            to: '/docs/knowledge/k-stomp',
          },
          {
            from: '/docs/knowledge/messaging/stomp',
            to: '/docs/knowledge/k-stomp',
          },
          {
            from: '/docs/knowledge/backend/spring/reactive-web/streams-api',
            to: '/docs/knowledge/k-streams-api',
          },
          {
            from: '/docs/knowledge/backend/spring/streams-api',
            to: '/docs/knowledge/k-streams-api',
          },
          {
            from: '/docs/knowledge/backend/spring/webflux/streams-api',
            to: '/docs/knowledge/k-streams-api',
          },
          {
            from: '/docs/knowledge/messaging/brokers/subscriber',
            to: '/docs/knowledge/k-subscriber',
          },
          {
            from: '/docs/knowledge/messaging/subscriber',
            to: '/docs/knowledge/k-subscriber',
          },
          {
            from: '/docs/knowledge/messaging/brokers/subscriber-7da2e1',
            to: '/docs/knowledge/k-subscriber-7da2e1',
          },
          {
            from: '/docs/knowledge/messaging/subscriber-7da2e1',
            to: '/docs/knowledge/k-subscriber-7da2e1',
          },
          {
            from: '/docs/knowledge/tooling/git/subtree',
            to: '/docs/knowledge/k-subtree',
          },
          {
            from: '/docs/knowledge/backend/java/sun-java',
            to: '/docs/knowledge/k-sun-java',
          },
          {
            from: '/docs/knowledge/infrastructure/linux/symbolic-link',
            to: '/docs/knowledge/k-symbolic-link',
          },
          {
            from: '/docs/knowledge/infrastructure/linux/system/symbolic-link',
            to: '/docs/knowledge/k-symbolic-link',
          },
          {
            from: '/docs/knowledge/infrastructure/linux/system/systemctl-release',
            to: '/docs/knowledge/k-systemctl-release',
          },
          {
            from: '/docs/knowledge/infrastructure/linux/systemctl-release',
            to: '/docs/knowledge/k-systemctl-release',
          },
          {
            from: '/docs/knowledge/networking/tcp',
            to: '/docs/knowledge/k-tcp',
          },
          {
            from: '/docs/knowledge/networking/transport/tcp',
            to: '/docs/knowledge/k-tcp',
          },
          {
            from: '/docs/knowledge/security/token',
            to: '/docs/knowledge/k-token',
          },
          {
            from: '/docs/knowledge/backend/spring/tree-meth-type-is-null',
            to: '/docs/knowledge/k-tree-meth-type-is-null',
          },
          {
            from: '/docs/knowledge/backend/spring/web/tree-meth-type-is-null',
            to: '/docs/knowledge/k-tree-meth-type-is-null',
          },
          {
            from: '/docs/knowledge/infrastructure/typeexception',
            to: '/docs/knowledge/k-typeexception',
          },
          {
            from: '/docs/knowledge/infrastructure/linux/distro/ubuntu',
            to: '/docs/knowledge/k-ubuntu',
          },
          {
            from: '/docs/knowledge/infrastructure/linux/ubuntu',
            to: '/docs/knowledge/k-ubuntu',
          },
          {
            from: '/docs/knowledge/infrastructure/linux/distro/ubuntu-d3b87a',
            to: '/docs/knowledge/k-ubuntu-d3b87a',
          },
          {
            from: '/docs/knowledge/infrastructure/linux/ubuntu-d3b87a',
            to: '/docs/knowledge/k-ubuntu-d3b87a',
          },
          {
            from: '/docs/knowledge/infrastructure/linux/distro/ubuntu-fire-wall',
            to: '/docs/knowledge/k-ubuntu-fire-wall',
          },
          {
            from: '/docs/knowledge/infrastructure/linux/ubuntu-fire-wall',
            to: '/docs/knowledge/k-ubuntu-fire-wall',
          },
          {
            from: '/docs/knowledge/infrastructure/linux/distro/ubuntu-package',
            to: '/docs/knowledge/k-ubuntu-package',
          },
          {
            from: '/docs/knowledge/infrastructure/linux/ubuntu-package',
            to: '/docs/knowledge/k-ubuntu-package',
          },
          {
            from: '/docs/knowledge/infrastructure/linux/distro/ubuntu-upgrade',
            to: '/docs/knowledge/k-ubuntu-upgrade',
          },
          {
            from: '/docs/knowledge/infrastructure/linux/ubuntu-upgrade',
            to: '/docs/knowledge/k-ubuntu-upgrade',
          },
          {
            from: '/docs/knowledge/data/sql-ops/union-all',
            to: '/docs/knowledge/k-union-all',
          },
          {
            from: '/docs/knowledge/data/union-all',
            to: '/docs/knowledge/k-union-all',
          },
          {
            from: '/docs/knowledge/networking/proxy/upstream',
            to: '/docs/knowledge/k-upstream',
          },
          {
            from: '/docs/knowledge/networking/upstream',
            to: '/docs/knowledge/k-upstream',
          },
          {
            from: '/docs/knowledge/networking/http-stack/uri',
            to: '/docs/knowledge/k-uri',
          },
          {
            from: '/docs/knowledge/networking/http/uri',
            to: '/docs/knowledge/k-uri',
          },
          {
            from: '/docs/knowledge/networking/uri',
            to: '/docs/knowledge/k-uri',
          },
          {
            from: '/docs/knowledge/networking/http-stack/uricomponent',
            to: '/docs/knowledge/k-uricomponent',
          },
          {
            from: '/docs/knowledge/networking/http/uricomponent',
            to: '/docs/knowledge/k-uricomponent',
          },
          {
            from: '/docs/knowledge/networking/uricomponent',
            to: '/docs/knowledge/k-uricomponent',
          },
          {
            from: '/docs/knowledge/networking/http-stack/uri브라우저-흐름',
            to: '/docs/knowledge/k-uri브라우저-흐름',
          },
          {
            from: '/docs/knowledge/networking/http/uri브라우저-흐름',
            to: '/docs/knowledge/k-uri브라우저-흐름',
          },
          {
            from: '/docs/knowledge/networking/uri브라우저-흐름',
            to: '/docs/knowledge/k-uri브라우저-흐름',
          },
          {
            from: '/docs/knowledge/infrastructure/user',
            to: '/docs/knowledge/k-user',
          },
          {
            from: '/docs/knowledge/infrastructure/linux/system/user-add',
            to: '/docs/knowledge/k-user-add',
          },
          {
            from: '/docs/knowledge/infrastructure/linux/user-add',
            to: '/docs/knowledge/k-user-add',
          },
          {
            from: '/docs/knowledge/tooling/util',
            to: '/docs/knowledge/k-util',
          },
          {
            from: '/docs/knowledge/infrastructure/aws/network/vpc',
            to: '/docs/knowledge/k-vpc',
          },
          {
            from: '/docs/knowledge/infrastructure/aws/vpc',
            to: '/docs/knowledge/k-vpc',
          },
          {
            from: '/docs/knowledge/client/web-browser-request-flow',
            to: '/docs/knowledge/k-web-browser-request-flow',
          },
          {
            from: '/docs/knowledge/messaging/webex',
            to: '/docs/knowledge/k-webex',
          },
          {
            from: '/docs/knowledge/messaging/webex-stack/webex',
            to: '/docs/knowledge/k-webex',
          },
          {
            from: '/docs/knowledge/messaging/webex/webex',
            to: '/docs/knowledge/k-webex',
          },
          {
            from: '/docs/knowledge/messaging/webex-ciscopark',
            to: '/docs/knowledge/k-webex-ciscopark',
          },
          {
            from: '/docs/knowledge/messaging/webex-stack/webex-ciscopark',
            to: '/docs/knowledge/k-webex-ciscopark',
          },
          {
            from: '/docs/knowledge/messaging/webex/webex-ciscopark',
            to: '/docs/knowledge/k-webex-ciscopark',
          },
          {
            from: '/docs/knowledge/messaging/webex-json-library-사용',
            to: '/docs/knowledge/k-webex-json-library-사용',
          },
          {
            from: '/docs/knowledge/messaging/webex-stack/webex-json-library-사용',
            to: '/docs/knowledge/k-webex-json-library-사용',
          },
          {
            from: '/docs/knowledge/messaging/webex/webex-json-library-사용',
            to: '/docs/knowledge/k-webex-json-library-사용',
          },
          {
            from: '/docs/knowledge/messaging/webex-restapi',
            to: '/docs/knowledge/k-webex-restapi',
          },
          {
            from: '/docs/knowledge/messaging/webex-stack/webex-restapi',
            to: '/docs/knowledge/k-webex-restapi',
          },
          {
            from: '/docs/knowledge/messaging/webex/webex-restapi',
            to: '/docs/knowledge/k-webex-restapi',
          },
          {
            from: '/docs/knowledge/backend/spring/reactive-web/webflux-97c022',
            to: '/docs/knowledge/k-webflux-97c022',
          },
          {
            from: '/docs/knowledge/backend/spring/webflux-97c022',
            to: '/docs/knowledge/k-webflux-97c022',
          },
          {
            from: '/docs/knowledge/backend/spring/webflux/webflux-97c022',
            to: '/docs/knowledge/k-webflux-97c022',
          },
          {
            from: '/docs/knowledge/backend/spring/reactive-web/webflux-exame',
            to: '/docs/knowledge/k-webflux-exame',
          },
          {
            from: '/docs/knowledge/backend/spring/webflux-exame',
            to: '/docs/knowledge/k-webflux-exame',
          },
          {
            from: '/docs/knowledge/backend/spring/webflux/webflux-exame',
            to: '/docs/knowledge/k-webflux-exame',
          },
          {
            from: '/docs/knowledge/backend/spring/reactive-web/webflux-router',
            to: '/docs/knowledge/k-webflux-router',
          },
          {
            from: '/docs/knowledge/backend/spring/webflux-router',
            to: '/docs/knowledge/k-webflux-router',
          },
          {
            from: '/docs/knowledge/backend/spring/webflux/webflux-router',
            to: '/docs/knowledge/k-webflux-router',
          },
          {
            from: '/docs/knowledge/backend/spring/reactive-web/webflux-thymeleaf-config',
            to: '/docs/knowledge/k-webflux-thymeleaf-config',
          },
          {
            from: '/docs/knowledge/backend/spring/webflux-thymeleaf-config',
            to: '/docs/knowledge/k-webflux-thymeleaf-config',
          },
          {
            from: '/docs/knowledge/backend/spring/webflux/webflux-thymeleaf-config',
            to: '/docs/knowledge/k-webflux-thymeleaf-config',
          },
          {
            from: '/docs/knowledge/messaging/delivery/webflux-websocket',
            to: '/docs/knowledge/k-webflux-websocket',
          },
          {
            from: '/docs/knowledge/messaging/webflux-websocket',
            to: '/docs/knowledge/k-webflux-websocket',
          },
          {
            from: '/docs/knowledge/backend/spring/reactive-web/webfluxhandler',
            to: '/docs/knowledge/k-webfluxhandler',
          },
          {
            from: '/docs/knowledge/backend/spring/webflux/webfluxhandler',
            to: '/docs/knowledge/k-webfluxhandler',
          },
          {
            from: '/docs/knowledge/backend/spring/webfluxhandler',
            to: '/docs/knowledge/k-webfluxhandler',
          },
          {
            from: '/docs/knowledge/security/webfluxsecurity',
            to: '/docs/knowledge/k-webfluxsecurity',
          },
          {
            from: '/docs/knowledge/client/webrtc',
            to: '/docs/knowledge/k-webrtc',
          },
          {
            from: '/docs/knowledge/client/webrtc-012ba8',
            to: '/docs/knowledge/k-webrtc-012ba8',
          },
          {
            from: '/docs/knowledge/tooling/wiki-js',
            to: '/docs/knowledge/k-wiki-js',
          },
          {
            from: '/docs/knowledge/infrastructure/work',
            to: '/docs/knowledge/k-work',
          },
          {
            from: '/docs/knowledge/infrastructure/workspace/work',
            to: '/docs/knowledge/k-work',
          },
          {
            from: '/docs/knowledge/infrastructure/work-space',
            to: '/docs/knowledge/k-work-space',
          },
          {
            from: '/docs/knowledge/infrastructure/workspace/work-space',
            to: '/docs/knowledge/k-work-space',
          },
          {
            from: '/docs/knowledge/infrastructure/deploy/로드밸런스-컨트롤만들기',
            to: '/docs/knowledge/k-로드밸런스-컨트롤만들기',
          },
          {
            from: '/docs/knowledge/infrastructure/로드밸런스-컨트롤만들기',
            to: '/docs/knowledge/k-로드밸런스-컨트롤만들기',
          },
          {
            from: '/docs/knowledge/infrastructure/deploy/배포-jarfile-생성',
            to: '/docs/knowledge/k-배포-jarfile-생성',
          },
          {
            from: '/docs/knowledge/infrastructure/배포-jarfile-생성',
            to: '/docs/knowledge/k-배포-jarfile-생성',
          },
          {
            from: '/docs/knowledge/infrastructure/deploy/배포만들기',
            to: '/docs/knowledge/k-배포만들기',
          },
          {
            from: '/docs/knowledge/infrastructure/배포만들기',
            to: '/docs/knowledge/k-배포만들기',
          },
          {
            from: '/docs/knowledge/infrastructure/deploy/배포전략',
            to: '/docs/knowledge/k-배포전략',
          },
          {
            from: '/docs/knowledge/infrastructure/배포전략',
            to: '/docs/knowledge/k-배포전략',
          },
          {
            from: '/docs/knowledge/infrastructure/deploy/변경사항-실시간-변경',
            to: '/docs/knowledge/k-변경사항-실시간-변경',
          },
          {
            from: '/docs/knowledge/infrastructure/변경사항-실시간-변경',
            to: '/docs/knowledge/k-변경사항-실시간-변경',
          },
          {
            from: '/docs/knowledge/infrastructure/linux/system/소유권-수정',
            to: '/docs/knowledge/k-소유권-수정',
          },
          {
            from: '/docs/knowledge/infrastructure/linux/소유권-수정',
            to: '/docs/knowledge/k-소유권-수정',
          },
          {
            from: '/docs/knowledge/backend/spring/core/스프링5-레시피4판',
            to: '/docs/knowledge/k-스프링5-레시피4판',
          },
          {
            from: '/docs/knowledge/backend/spring/스프링5-레시피4판',
            to: '/docs/knowledge/k-스프링5-레시피4판',
          },
          {
            from: '/docs/knowledge/data/jpa/연관관계',
            to: '/docs/knowledge/k-연관관계',
          },
          {
            from: '/docs/knowledge/data/연관관계',
            to: '/docs/knowledge/k-연관관계',
          },
          {
            from: '/docs/knowledge/backend/spring/config/외부-리소스',
            to: '/docs/knowledge/k-외부-리소스',
          },
          {
            from: '/docs/knowledge/backend/spring/configuration/외부-리소스',
            to: '/docs/knowledge/k-외부-리소스',
          },
          {
            from: '/docs/knowledge/backend/spring/외부-리소스',
            to: '/docs/knowledge/k-외부-리소스',
          },
          {
            from: '/docs/knowledge/infrastructure/workspace/유용한-링크',
            to: '/docs/knowledge/k-유용한-링크',
          },
          {
            from: '/docs/knowledge/infrastructure/유용한-링크',
            to: '/docs/knowledge/k-유용한-링크',
          },
          {
            from: '/docs/knowledge/infrastructure/workspace/자격증',
            to: '/docs/knowledge/k-자격증',
          },
          {
            from: '/docs/knowledge/infrastructure/자격증',
            to: '/docs/knowledge/k-자격증',
          },
          {
            from: '/docs/knowledge/infrastructure/aws/compute/작업-ec2',
            to: '/docs/knowledge/k-작업-ec2',
          },
          {
            from: '/docs/knowledge/infrastructure/aws/작업-ec2',
            to: '/docs/knowledge/k-작업-ec2',
          },
          {
            from: '/docs/knowledge/infrastructure/aws/compute/작업-ec2-2',
            to: '/docs/knowledge/k-작업-ec2-2',
          },
          {
            from: '/docs/knowledge/infrastructure/aws/작업-ec2-2',
            to: '/docs/knowledge/k-작업-ec2-2',
          },
          {
            from: '/docs/knowledge/infrastructure/workspace/작업-local',
            to: '/docs/knowledge/k-작업-local',
          },
          {
            from: '/docs/knowledge/infrastructure/작업-local',
            to: '/docs/knowledge/k-작업-local',
          },
          {
            from: '/docs/knowledge/data/postgresql/작업-postgresql',
            to: '/docs/knowledge/k-작업-postgresql',
          },
          {
            from: '/docs/knowledge/data/postgresql/작업-postgresql-3',
            to: '/docs/knowledge/k-작업-postgresql-3',
          },
          {
            from: '/docs/knowledge/data/postgresql/작업-postgresql-작업2',
            to: '/docs/knowledge/k-작업-postgresql-작업2',
          },
          {
            from: '/docs/knowledge/data/redis/작업-redis',
            to: '/docs/knowledge/k-작업-redis',
          },
          {
            from: '/docs/knowledge/backend/spring/core/작업-spring',
            to: '/docs/knowledge/k-작업-spring',
          },
          {
            from: '/docs/knowledge/backend/spring/작업-spring',
            to: '/docs/knowledge/k-작업-spring',
          },
          {
            from: '/docs/knowledge/infrastructure/linux/system/접속정보생성',
            to: '/docs/knowledge/k-접속정보생성',
          },
          {
            from: '/docs/knowledge/infrastructure/linux/접속정보생성',
            to: '/docs/knowledge/k-접속정보생성',
          },
          {
            from: '/docs/knowledge/backend/java/제네릭-타입-설명',
            to: '/docs/knowledge/k-제네릭-타입-설명',
          },
          {
            from: '/docs/knowledge/tooling/ci/젠킨스',
            to: '/docs/knowledge/k-젠킨스',
          },
          {
            from: '/docs/knowledge/tooling/젠킨스',
            to: '/docs/knowledge/k-젠킨스',
          },
          {
            from: '/docs/knowledge/tooling/ci/젠킨스-이클립스-에디터',
            to: '/docs/knowledge/k-젠킨스-이클립스-에디터',
          },
          {
            from: '/docs/knowledge/tooling/젠킨스-이클립스-에디터',
            to: '/docs/knowledge/k-젠킨스-이클립스-에디터',
          },
          {
            from: '/docs/knowledge/infrastructure/docker/컨테이너-라이징-만들기',
            to: '/docs/knowledge/k-컨테이너-라이징-만들기',
          },
        ],
      },
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
        {to: '/blog', label: 'Blog', position: 'left'},
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
            {label: 'Architecture', to: '/docs/architecture/'},
            {label: 'Patterns', to: '/docs/patterns/index'},
            {label: 'Decisions', to: '/docs/decisions/'},
            {label: 'Postmortems', to: '/docs/postmortems/'},
            {label: 'Blog', to: '/blog'},
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
