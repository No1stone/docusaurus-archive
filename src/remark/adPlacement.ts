import type {VFile} from 'vfile';

import {AD_LONG_WORDS, AD_MIN_WORDS, isArchiveDoc, isHarnessDoc} from '../lib/adPolicy';

type MdNode = {
  type: string;
  depth?: number;
  value?: string;
  children?: MdNode[];
};

type FrontMatter = {
  unlisted?: boolean;
  ads?: boolean;
  adWords?: number;
  adRail?: boolean;
  adEnd?: boolean;
};

/**
 * Render-time placement for ADR-0003. Does not edit the Markdown file.
 * Records word count on the front-matter object the loader later exports,
 * and inserts <AdSlot placement="inArticle" /> after the first h2 section.
 */
export function remarkAdPlacement() {
  return (tree: MdNode, file: VFile) => {
    const frontMatter = (file.data as {frontMatter?: FrontMatter}).frontMatter;
    const filePath = file.path ?? '';
    if (!frontMatter || !isArchiveDoc(filePath)) {
      return;
    }

    const words = countWords(tree);
    frontMatter.adWords = words;

    const blocked =
      isHarnessDoc(filePath) ||
      frontMatter.unlisted === true ||
      frontMatter.ads === false ||
      words < AD_MIN_WORDS;

    frontMatter.adRail = !blocked;
    const children = tree.children ?? [];
    const last = children[children.length - 1];
    frontMatter.adEnd =
      !blocked && words >= AD_LONG_WORDS && !!last && !isSkipBoundary(last);

    if (blocked) {
      return;
    }

    const insertAt = inArticleIndex(children);
    if (insertAt === null) {
      return;
    }
    children.splice(insertAt, 0, adElement('inArticle'));
  };
}

function adElement(placement: 'inArticle'): MdNode {
  return {
    type: 'mdxJsxFlowElement',
    name: 'AdSlot',
    attributes: [
      {type: 'mdxJsxAttribute', name: 'placement', value: placement},
    ],
    children: [],
  } as MdNode;
}

function inArticleIndex(nodes: MdNode[]): number | null {
  const h2 = nodes.findIndex((node) => node.type === 'heading' && node.depth === 2);
  if (h2 < 0) {
    return null;
  }
  let next = nodes.length;
  for (let i = h2 + 1; i < nodes.length; i += 1) {
    const node = nodes[i];
    if (node.type === 'heading' && (node.depth ?? 6) <= 2) {
      next = i;
      break;
    }
  }
  const before = nodes[next - 1];
  if (!before || !isSkipBoundary(before)) {
    return next;
  }
  for (let i = next; i < nodes.length; i += 1) {
    const node = nodes[i];
    if (node.type === 'heading') {
      return null;
    }
    if (!isSkipBoundary(node)) {
      return i + 1;
    }
  }
  return null;
}

function isSkipBoundary(node: MdNode): boolean {
  return node.type === 'code' || node.type === 'table' || node.type === 'list';
}

function countWords(node: MdNode): number {
  if (node.type === 'code' || node.type === 'inlineCode' || node.type === 'yaml') {
    return 0;
  }
  if (node.type === 'text') {
    return (node.value ?? '').split(/\s+/).filter(Boolean).length;
  }
  return (node.children ?? []).reduce((sum, child) => sum + countWords(child), 0);
}
