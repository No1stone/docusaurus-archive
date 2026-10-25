---
format: md
id: k-webhook
title: "Webhook"
description: "Webex Webhook에서 Message와 attachmentActions 리소스를 다루는 메모입니다."
tags:
  - HTTP
status: active
draft: true
slug: /knowledge/k-webhook
---
# Webhook

## 개요

Webex Webhook API 메모입니다.
Message와 attachmentActions 리소스를 구독해 봇 액션을 받는 흐름을 남겨 두었습니다.

## 참고

[https://developer.webex.com/docs/api/v1/webhooks](https://developer.webex.com/docs/api/v1/webhooks)

![webhook-1.png](/img/webhook/webhook-1.png)

사용하고 있는 웹훅들입니다.

![webhook-2.png](/img/webhook/webhook-2.png)

## resource: Message

메시지 타입의 JSON을 웹훅으로 받습니다.

## resource: attachmentActions

메시지 봇의 action이 작동하면(submit) `attachmentActions`로 전달됩니다.

![webhook-3.png](/img/webhook/webhook-3.png)

이곳으로 저장되며 별도의 설정은 필요 없고, submit 속성만 주면 됩니다.
저장되면서 웹훅이 작동합니다.
받은 JSON에는 AttachmentAction을 조회할 수 있는 정보가 있습니다.
