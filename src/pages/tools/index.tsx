import {useMemo, useState, type ReactNode} from 'react';
import Link from '@docusaurus/Link';

import ToolsLayout from '@site/src/tools/components/ToolsLayout';
import ToolFaqs from '@site/src/tools/components/ToolFaqs';
import {
  TOOL_CATEGORIES,
  TOOLS_HOME_DESCRIPTION,
  TOOLS_HOME_FAQS,
  TOOLS_HOME_KEYWORDS,
  filterTools,
} from '@site/src/tools/catalog';
import styles from '@site/src/tools/styles.module.css';

export default function ToolsHomePage(): ReactNode {
  const [query, setQuery] = useState('');
  const tools = useMemo(() => filterTools(query), [query]);

  return (
    <ToolsLayout
      title="Tools"
      description={TOOLS_HOME_DESCRIPTION}
      path="/tools"
      keywords={TOOLS_HOME_KEYWORDS}
      faqs={TOOLS_HOME_FAQS}
      kind="collection">
      <header className={styles.toolHeader}>
        <h1 className={styles.toolTitle}>Tools</h1>
        <p className={styles.toolSummary}>{TOOLS_HOME_DESCRIPTION}</p>
      </header>

      <input
        className={styles.homeSearch}
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="도구 검색 (예: uuid, jwt, hash)"
        aria-label="도구 검색"
      />

      {TOOL_CATEGORIES.map((category) => {
        const items = tools.filter(
          (tool) => tool.categoryId === category.id && tool.id !== 'sha-hash',
        );
        if (items.length === 0) {
          return null;
        }
        return (
          <section key={category.id} className={styles.homeSection}>
            <h2>{category.label}</h2>
            <div className={styles.homeGrid}>
              {items.map((tool) => (
                <Link
                  key={tool.id}
                  className={styles.homeCard}
                  to={`/tools/${tool.slug}`}>
                  <p className={styles.homeCardTitle}>{tool.title}</p>
                  <p className={styles.homeCardSummary}>{tool.summary}</p>
                </Link>
              ))}
            </div>
          </section>
        );
      })}

      {tools.length === 0 ? (
        <p className={styles.hint}>검색어와 맞는 도구가 없습니다.</p>
      ) : null}

      <ToolFaqs faqs={TOOLS_HOME_FAQS} />
    </ToolsLayout>
  );
}
