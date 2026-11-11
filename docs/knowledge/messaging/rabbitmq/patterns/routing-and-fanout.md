---
id: rabbitmq-pattern-routing-fanout
title: "라우팅과 Fan-out — 대상에 따라 큐로 전달"
description: "routing key와 Fanout Exchange로 대상 큐에 메시지를 전달하는 패턴을 정리합니다."
slug: /knowledge/messaging/rabbitmq/patterns/routing-and-fanout
sidebar_position: 2
tags: [RabbitMQ, Messaging]
---
# 라우팅과 Fan-out — 대상에 따라 큐로 전달

> **개요:** Direct/Topic은 키로 고르고, Fanout은 바인딩된 모든 큐에 복사합니다.

## 상황

주문 이벤트는 알림과 집계에, 메일 작업만 메일 큐에 보내고 싶을 때 씁니다.

| 방식 | 언제 |
|---|---|
| Topic/Direct Binding | 키, 패턴으로 큐를 고를 때 |
| Fanout | 구독 큐 전부에 동일 복사본이 필요할 때 |

상세 Binding 예는 [Exchange와 Binding](/docs/knowledge/messaging/brokers/spring-amqp-exchange-routing)을 봅니다.<br />
패턴 개념은 [Fan-out](/docs/patterns/architecture-patterns/fan-out)을 봅니다.
