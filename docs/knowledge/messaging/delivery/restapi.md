---
format: md
id: k-restapi
title: "RestAPI"
description: "메시징·봇 연동에서 쓰는 REST 호출 메모입니다. Webex Bot 문서로 이어집니다."
tags:
  - HTTP
status: active
slug: /knowledge/k-restapi
---
# RestAPI

## 개요

메시징 영역의 RestAPI 메모는 Webex Bot·REST 호출을 묶어 둔 진입점입니다.
Spring 쪽 일반 HTTP 클라이언트는 [Knowledge RestAPI](../../backend/spring/web/restapi-9f6eac.md)를 보고, Webex API 세부는 webex-stack 글을 봅니다.

팜프로의 파트너 웹훅 호출은 `RestClient` 빈으로 목록·생성·삭제를 합니다.

```java
exchange.get(restClient, "/partner/v1/webhooks", null);
exchange.post(restClient, "/partner/v1/webhooks", body);
```

<details>
<summary>참고 자료</summary>

- [Webex Bots](https://developer.webex.com/docs/bots)
- [Webex for Developers](https://developer.webex.com/)
</details>
