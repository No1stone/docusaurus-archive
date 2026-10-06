import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

const categories = [
  {label: 'Backend', to: '/docs/knowledge/backend/'},
  {label: 'Frontend', to: '/docs/knowledge/'},
  {label: 'Data', to: '/docs/knowledge/'},
  {label: 'Messaging', to: '/docs/knowledge/'},
  {label: 'Infrastructure', to: '/docs/knowledge/'},
  {label: 'CI/CD', to: '/docs/knowledge/'},
  {label: 'Observability', to: '/docs/knowledge/'},
  {label: 'Architecture', to: '/docs/architecture/'},
  {label: 'Patterns', to: '/docs/patterns/'},
  {label: 'Decisions', to: '/docs/decisions/'},
  {label: 'AI / Harness', to: '/docs/harness/'},
] as const;

const recentDocuments = [
  {
    title: 'Controller Design',
    to: '/docs/knowledge/backend/controller/controller-design',
  },
  {
    title: 'ADR-0001 — Markdown & Git as source of truth',
    to: '/docs/decisions/adr-0001',
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
              <strong>Source of Truth</strong>
              <span>
                지식과 기준, 템플릿을 Markdown과 Git으로 일관되게 관리합니다.
              </span>
            </li>
            <li>
              <strong>Context Engineering</strong>
              <span>
                Orchestration으로 필요한 Engineering Asset을 조합하고 필요한
                Context만 Agent에 전달합니다.
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

function ArchiveCategories(): ReactNode {
  return (
    <section className={styles.section}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>
          Explore Archive
        </Heading>
        <ul className={styles.categoryGrid}>
          {categories.map((item) => (
            <li key={item.label}>
              <Link className={styles.categoryLink} to={item.to}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function RecentDocuments(): ReactNode {
  return (
    <section className={clsx(styles.section, styles.sectionMuted)}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>
          Recently Updated
        </Heading>
        <ul className={styles.recentList}>
          {recentDocuments.map((doc) => (
            <li key={doc.to}>
              <Link to={doc.to}>{doc.title}</Link>
            </li>
          ))}
        </ul>
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
        <ArchiveCategories />
        <RecentDocuments />
      </main>
    </Layout>
  );
}
