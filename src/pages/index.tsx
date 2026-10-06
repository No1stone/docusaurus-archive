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
        <p className={styles.kicker}>Engineering Archive</p>
        <Heading as="h1" className={styles.title}>
          ORIGEMITE ARCHIVE
        </Heading>
        <p className={styles.tagline}>
          Engineering knowledge accumulated through building things.
        </p>

        <div className={styles.searchSlot} role="note">
          <span className={styles.searchPlaceholder}>
            Search the archive…
          </span>
          <span className={styles.searchHint}>
            Search integration pending — browse the archive for now.
          </span>
        </div>

        <div className={styles.actions}>
          <Link className="button button--primary button--lg" to="/docs/">
            Explore Archive
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
      description="Origemite Archive — personal engineering knowledge in Markdown and Git.">
      <ArchiveHero />
      <main>
        <ArchiveCategories />
        <RecentDocuments />
      </main>
    </Layout>
  );
}
