import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import AdSlot from '@site/src/components/AdSlot';

import styles from './index.module.css';

const sections = [
  {
    title: 'Backend',
    to: '/docs/knowledge/backend/',
    items: [
      {title: 'Controller Design', to: '/docs/knowledge/backend/controller/controller-design'},
      {title: 'Facade Design', to: '/docs/knowledge/backend/facade/facade-design'},
      {title: 'Service의 책임과 분리 가능한 데이터 접근 경계', to: '/docs/knowledge/backend/service/service-design'},
      {title: '테스트 기본 구조', to: '/docs/knowledge/backend/testing/test-structure'},
    ],
  },
  {
    title: 'Decisions',
    to: '/docs/decisions/',
    items: [
      {title: '원본은 Git 안의 Markdown으로 둡니다', to: '/docs/decisions/adr-0001'},
      {title: '아카이브 화면은 Docusaurus로 둡니다', to: '/docs/decisions/adr-0002'},
      {title: '블로킹 기반 업무 처리에 Spring MVC와 Virtual Threads를 선택한 이유', to: '/docs/decisions/adr-0004'},
    ],
  },
  {
    title: 'Harness',
    to: '/docs/harness/',
    items: [
      {title: '에이전트', to: '/docs/harness/agents/'},
      {title: '오케스트레이션', to: '/docs/harness/orchestrations/'},
      {title: '구현 흐름', to: '/docs/harness/workflows/implement'},
      {title: 'Spring 템플릿', to: '/docs/harness/templates/backend/spring/'},
    ],
  },
] as const;

function ArchiveHero(): ReactNode {
  return (
    <header className={styles.hero}>
      <div className="container">
        <p className={styles.kicker}>Personal Engineering Archive</p>
        <Heading as="h1" className={styles.title}>
          ORIGEMITE ARCHIVE
        </Heading>
        <p className={styles.tagline}>
          개발하며 쌓은 지식과 결정을 기록하고 필요한 Context로 조합해 다시
          개발에 사용합니다.
        </p>

        <div className={styles.purposeBox} role="region" aria-label="Archive purpose">
          <p className={styles.purposeLead}>Core Principles</p>
          <ul className={styles.purposeList}>
            <li>
              <strong>Knowledge</strong>
              <span>
                개발 과정에서 얻은 기술 지식과 구현 경험을 축적합니다.
              </span>
            </li>
            <li>
              <strong>Decisions</strong>
              <span>
                기술 선택과 아키텍처 결정의 이유를 ADR과 History로 남깁니다.
              </span>
            </li>
            <li>
              <strong>Single Source of Truth</strong>
              <span>
                지식과 기준, 템플릿을 Markdown과 Git으로 일관되게 관리합니다.
              </span>
            </li>
            <li>
              <strong>Context Engineering</strong>
              <span>
                Orchestration으로 필요한 Engineering Asset을 조합하고
                <br />
                필요한 Context만 Agent에 전달합니다.
              </span>
            </li>
          </ul>
        </div>

        <div className={styles.actions}>
          <Link className="button button--primary button--lg" to="/docs/">
            Explore Archive
          </Link>
          <Link
            className="button button--secondary button--lg"
            to="/docs/decisions/">
            Browse ADRs
          </Link>
        </div>
      </div>
    </header>
  );
}

function ArchiveSections(): ReactNode {
  return (
    <section className={styles.section}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>
          글
        </Heading>
        <div className={styles.docGroups}>
          {sections.map((section) => (
            <section key={section.title}>
              <Heading as="h3" className={styles.groupTitle}>
                <Link to={section.to}>{section.title}</Link>
              </Heading>
              <ul className={styles.recentList}>
                {section.items.map((item) => (
                  <li key={item.to}>
                    <Link to={item.to}>{item.title}</Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  return (
    <Layout
      title="Home"
      description="Origemite Archive — ADR, SSOT, and continuity for engineering knowledge in Markdown and Git.">
      <ArchiveHero />
      <main>
        <ArchiveSections />
        <AdSlot placement="home" />
      </main>
    </Layout>
  );
}
