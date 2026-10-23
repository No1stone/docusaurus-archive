---
format: md
id: k-streams-api
title: "Streams API"
description: "서버 푸시와 스트림을 구현하는 Spring 방식 목록입니다. PrintWriter부터 Redis Pub/Sub까지."
tags:
  - Java
  - Redis
  - Spring
status: active
slug: /knowledge/k-streams-api
---
# Streams API

## 개요

서버에서 스트림으로 데이터를 밀어 줄 때 선택할 수 있는 구현 방식 목록입니다.
Spring MVC, WebFlux, Socket, 서드파티 Pub/Sub을 비교해 두었습니다.

## 구현 방법

1. Spring MVC Response Writer / PrintWriter
2. Spring MVC Pub Sub / Java Pub Sub
3. Spring Mvc SseEmitter
4. RX JAVA
5. Spring Webflux PubSub
6. Socket (Spring Stomp)
7. 써드파티 PubSub

## 관련 메모

- [PrintWriter](../web/printwriter.md)
- [SseEmitter](../web/sseemitter.md)
- [Stomp](../../../messaging/brokers/stomp.md)
- [RedisPubSub](../../../messaging/brokers/redispubsub.md)

Webflux 허브 글은 작성자 검토로 게시 보류 중이라 여기서 연결하지 않습니다.
