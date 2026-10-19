/** Whitespace-separated tokens, same idea as `wc -w`. */
export const AD_MIN_WORDS = 400;

/** Long docs get one more unit at the end, and only on narrow screens. */
export const AD_LONG_WORDS = 1500;

export const AD_CLIENT = 'ca-pub-7928208116313519';

export type AdPlacement = 'home' | 'inArticle' | 'rail' | 'end';

export type AdSlotIds = {
  inArticle: string;
  rail: string;
};

export function slotForPlacement(placement: AdPlacement, slots: AdSlotIds): string {
  const id = placement === 'rail' || placement === 'end' ? slots.rail : slots.inArticle;
  return id.trim();
}

export function isHarnessDoc(filePath: string): boolean {
  return filePath.split(/[/\\]/).includes('harness') && filePath.includes('docs');
}

export function isArchiveDoc(filePath: string): boolean {
  const parts = filePath.split(/[/\\]/);
  const docsAt = parts.lastIndexOf('docs');
  return docsAt >= 0 && parts[docsAt - 1] !== 'src';
}
