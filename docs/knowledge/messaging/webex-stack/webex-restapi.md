---
format: md
id: k-webex-restapi
title: "Webex RestAPI"
description: "Webex for Developers 포털의 Token, Bot, Webhook, Message 등 API 진입점"
tags:
  - Webex
  - HTTP
status: active
slug: /knowledge/k-webex-restapi
---
# Webex RestAPI

## 개요

Webex for Developers 포털의 Token, Bot, Webhook, Message 등 API 진입점입니다.

> 원본에 적어 둔 키워드 범위를 벗어나지 않습니다.
에서 앱을 만들고, 샌드박스와 가이드, REST API 레퍼런스로 이동합니다.
원본 메모가 짚은 항목은 다음과 같습니다.
원본에 깨져 있던 `(attachmentsCard)%20bba671e...md)` 조각은 Notion 내부 링크 잔여로 보이며, 카드 JSON은 Developer의 Buttons and Cards Designer와 가이드를 사용합니다.
1. 포털에 로그인하고 Bot 또는 Integration을 만듭니다.
2. access token을 안전한 저장소에 둡니다.
3. 필요하면 Webhook을 등록해 이벤트를 받습니다.
4. Messages API로 응답하거나 카드를 보냅니다.
세부 제약(그룹에서 멘션 필요 등)은 Bot 문서를 따릅니다.

## RestClient

팜프로는 `RestClient.Builder`로 빈을 만들고 파트너 API 호출에 씁니다.

```java
@Bean("moplRestClient")
RestClient moplRestClient(RestClient.Builder builder) {
    return builder.build();
}
```

| 항목 | 역할 |
|------|------|
| Token | Bot 또는 Integration access token으로 API 인증 |
| Bot | 스페이스에 참여해 메시지와 카드로 자동화 |
| RestAPI | Rooms, Messages, People, Webhooks 등 HTTP API |
| Webhook | 메시지 생성 등 이벤트를 내 URL로 수신 |
| Message | 텍스트, 마크다운, 파일, 카드 전송 |
| Json Build (attachmentsCard) | Buttons and Cards용 JSON 페이로드 구성 |

<details>
<summary>참고 자료</summary>

- [developer.webex.com](https://developer.webex.com/) — Build the future of business collaboration with Webex! Learn more about the Webex API and SDKs to create the next great collaboration app on the Webex Platform.
- [Bots](https://developer.webex.com/docs/bots) — Give Webex users access to outside services right from their Webex spaces. Bots help users automate tasks, bring external content into the discussion, and gain efficiencies.
</details>
