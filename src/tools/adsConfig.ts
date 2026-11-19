/**
 * Tools 전용 AdSense 디스플레이 단위 설정.
 * 슬롯 ID가 비어 있으면 광고 열을 렌더하지 않고 본문 폭을 씁니다.
 * 문서·블로그 자동 광고(AdSenseLoader)와 별개입니다.
 */
export type ToolsAdSenseConfig = {
  clientId: string;
  /** 반응형 디스플레이 광고 단위 ID. 비우면 슬롯 숨김. */
  displaySlotId: string;
};

export const TOOLS_ADS_BREAKPOINT_PX = 1200;

export function resolveToolsAdSense(
  customFields: unknown,
): ToolsAdSenseConfig {
  const raw =
    customFields &&
    typeof customFields === 'object' &&
    'toolsAdSense' in customFields
      ? (customFields as {toolsAdSense?: Partial<ToolsAdSenseConfig>})
          .toolsAdSense
      : undefined;
  return {
    clientId: (raw?.clientId ?? '').trim(),
    displaySlotId: (raw?.displaySlotId ?? '').trim(),
  };
}

export function isToolsAdConfigured(config: ToolsAdSenseConfig): boolean {
  return Boolean(config.clientId && config.displaySlotId);
}

/** Sandboxed iframe 문서 — 부모 DOM(도구 입력)에 접근할 수 없음. */
export function buildToolsAdSrcDoc(config: ToolsAdSenseConfig): string {
  const client = config.clientId;
  const slot = config.displaySlotId;
  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<style>
  html,body{margin:0;padding:0;background:transparent;}
  .wrap{display:flex;justify-content:center;align-items:flex-start;min-height:100px;}
</style>
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}" crossorigin="anonymous"></script>
</head>
<body>
<div class="wrap">
  <ins class="adsbygoogle"
       style="display:block;width:100%;min-height:250px"
       data-ad-client="${client}"
       data-ad-slot="${slot}"
       data-ad-format="auto"
       data-full-width-responsive="true"></ins>
</div>
<script>
  try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) {}
</script>
</body>
</html>`;
}
