/**
 * AdSense slot ids for the Node build only.
 * Home and in-article share the first slot.
 * The rail and the long-page mobile end share the second, because they never
 * render on the same page.
 * An empty value means that unit is not rendered.
 * Do not import this file from browser code. `process` is not defined there.
 */
function readEnv(name: 'AD_SLOT_IN_ARTICLE' | 'AD_SLOT_RAIL'): string {
  const value = process.env[name];
  return typeof value === 'string' ? value.trim() : '';
}

export const AD_SLOT_IN_ARTICLE = readEnv('AD_SLOT_IN_ARTICLE');
export const AD_SLOT_RAIL = readEnv('AD_SLOT_RAIL');
