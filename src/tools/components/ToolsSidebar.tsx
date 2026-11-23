import {useMemo, useState, type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import clsx from 'clsx';

import {TOOL_CATEGORIES, TOOLS} from '../catalog';
import type {ToolCategoryId, ToolId} from '../types';
import styles from '../styles.module.css';

type Props = {
  activeToolId?: ToolId;
  open: boolean;
  onNavigate?: () => void;
};

export default function ToolsSidebar({
  activeToolId,
  open,
  onNavigate,
}: Props): ReactNode {
  const initialOpen = useMemo(() => {
    const map = Object.fromEntries(
      TOOL_CATEGORIES.map((category) => [category.id, true]),
    ) as Record<ToolCategoryId, boolean>;
    return map;
  }, []);
  const [expanded, setExpanded] = useState(initialOpen);

  return (
    <aside
      className={clsx(styles.sidebar, open && styles.sidebarOpen)}
      aria-label="도구 메뉴">
      {TOOL_CATEGORIES.map((category) => {
        const tools = TOOLS.filter(
          (tool) => tool.categoryId === category.id && tool.id !== 'sha-hash',
        );
        const isOpen = expanded[category.id];
        return (
          <div key={category.id} className={styles.category}>
            <button
              type="button"
              className={styles.categoryToggle}
              aria-expanded={isOpen}
              onClick={() =>
                setExpanded((prev) => ({
                  ...prev,
                  [category.id]: !prev[category.id],
                }))
              }>
              <span>{category.label}</span>
              <span aria-hidden="true">{isOpen ? '▾' : '▸'}</span>
            </button>
            {isOpen ? (
              <ul className={styles.toolList}>
                {tools.map((tool) => (
                  <li key={tool.id}>
                    <Link
                      className={clsx(
                        styles.toolLink,
                        activeToolId === tool.id && styles.toolLinkActive,
                      )}
                      to={`/tools/${tool.slug}`}
                      onClick={onNavigate}>
                      {tool.title}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        );
      })}
    </aside>
  );
}
