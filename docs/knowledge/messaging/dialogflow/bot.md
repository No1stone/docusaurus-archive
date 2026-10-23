---
format: md
id: k-bot
title: "Bot"
description: "Webex Bot 개념, 생성, 웹훅과 메시지 접근 차이를 정리한 공식 문서 요약"
tags:
  - Webex
  - HTTP
status: active
slug: /knowledge/k-bot
---
# Bot

## 개요

Webex Bot 개념, 생성, 웹훅과 메시지 접근 차이를 정리한 공식 문서 요약입니다.

Bot은 Webex 사용자와 비슷하게 1:1과 그룹 스페이스에 참여할 수 있습니다.
아바타에 봇 배지가 붙어 사람과 구분됩니다.
그룹 스페이스에서는 봇이 @멘션된 메시지에만 접근하는 것이 기본 모델입니다.
1:1에서는 상대 메시지를 모두 볼 수 있습니다.
사용자 계정으로 Webex 작업을 대신 수행해야 하면 Bot이 아니라 Integration을 검토합니다.
유형 예시로는 외부 이벤트를 올리는 Notifier, 명령으로 외부 시스템을 조작하는 Controller, 자연어 보조 Assistant가 있습니다.
Developer 포털에서 My Webex Apps → Create a Bot으로 만듭니다.
이름, username, 아이콘을 넣은 뒤 발급되는 access token으로 REST API를 인증합니다.
토큰은 한 번만 보이므로 안전한 곳에 보관하고, 분실 시 재발급합니다.
이벤트에 반응하려면 웹훅을 구성합니다.
카드(Buttons and Cards)로 스페이스 안에서 상호작용 UI를 줄 수 있습니다.
그룹에서 봇이 멘션된 메시지만 목록으로 보려면 `mentionedPeople=me` 쿼리가 필요합니다.

![bot-1](../../img/bot/bot-1.png)

## 예제·코드

```http
GET /messages?mentionedPeople=me&roomId=SOME_INTERESTING_ROOM
Authorization: Bearer THE_BOTS_ACCESS_TOKEN
```

<details>
<summary>참고 자료</summary>

- [Webex for Developers — Bots](https://developer.webex.com/docs/bots) — Give Webex users access to outside services right from their Webex spaces. Bots help users automate tasks, bring external content into the discussion, and gain efficiencies.
</details>
