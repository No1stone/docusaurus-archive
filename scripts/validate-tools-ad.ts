import {
  TOOLS_ADS_BREAKPOINT_PX,
  buildToolsAdSrcDoc,
  isToolsAdConfigured,
  resolveToolsAdSense,
} from '../src/tools/adsConfig';

function assert(cond: boolean, msg: string): void {
  if (!cond) {
    throw new Error(msg);
  }
}

function main(): void {
  assert(TOOLS_ADS_BREAKPOINT_PX === 1200, 'breakpoint');

  const empty = resolveToolsAdSense({
    toolsAdSense: {clientId: 'ca-pub-1', displaySlotId: ''},
  });
  assert(!isToolsAdConfigured(empty), 'empty slot hides ad');

  const missing = resolveToolsAdSense({});
  assert(!isToolsAdConfigured(missing), 'missing config');

  const ok = resolveToolsAdSense({
    toolsAdSense: {
      clientId: 'ca-pub-7928208116313519',
      displaySlotId: '1234567890',
    },
  });
  assert(isToolsAdConfigured(ok), 'configured');
  const src = buildToolsAdSrcDoc(ok);
  assert(src.includes('data-ad-slot="1234567890"'), 'slot in srcdoc');
  assert(src.includes('ca-pub-7928208116313519'), 'client in srcdoc');
  assert(!src.includes('postMessage'), 'no postMessage bridge');

  console.log('OK tools ad config');
}

main();
