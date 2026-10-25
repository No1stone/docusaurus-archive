---
id: pattern-fan-out
title: Fan-out
description: 하나의 메시지를 여러 소비자에게 전달하는 메시징 패턴. 네트워크 broadcast·multicast와 구분합니다.
tags:
  - patterns
  - messaging
  - AWS
status: active
slug: /patterns/architecture-patterns/fan-out
---
# Fan-out

> **개요:** Fan-out은 발행자가 메시지를 한 번 넣으면, 구독하는 여러 소비자(또는 큐)가 각자 복사본을 받아 처리하는 메시징 전달 방식입니다.
> IP 네트워크의 broadcast·multicast와 같은 계층의 개념이 아닙니다.

## 적용 상황

- 한 도메인 이벤트를 알림, 검색 색인, 통계 등 여러 下游가 각자 처리해야 할 때
- 발행자가 소비자 목록을 직접 호출하지 않고 중개자(토픽·버스)에 맡기고 싶을 때

## 메시징 Fan-out과 네트워크 전송의 구분

| 구분 | 의미 |
|------|------|
| 메시징 Fan-out | 브로커·버스가 구독자에게 메시지를 복제·전달 |
| 유니캐스트 | 한 송신자 → 한 수신자 (일반 TCP 요청 등) |
| 브로드캐스트 / 멀티캐스트 | L2/L3 네트워크 범위의 전송 방식 |

아카이브의 [cast(uni,broad,multi)](../../architecture/castunibroadmulti.md) 메모는 전달 범위를 짧게 구분해 둔 학습 메모입니다.
그 글에서 연결한 AWS SNS Fan-out 글은 **학습 예제**로 봅니다.
이 아카이브 사례에 SNS Fan-out을 운영 적용했다는 근거로 쓰지 않습니다.

## 동작 흐름

```text
발행자
  → 토픽 / 이벤트 버스에 메시지 1건 발행
  → 구독 A 큐/서비스
  → 구독 B 큐/서비스
  → 구독 C 큐/서비스
```

각 소비자는 실패·재시도를 독립적으로 가질 수 있습니다.
한 소비자의 실패가 다른 소비자 전달을 막지 않게 설계하는 경우가 많습니다.

## 학습 예제: Amazon SNS

AWS 문서·블로그에서 흔히 쓰는 학습 구성입니다.

```text
이벤트 발행
  → Amazon SNS 토픽
  → SQS 큐 A / 큐 B / Lambda / HTTP 구독 등
```

공식 소개: [Messaging Fanout Pattern for Serverless Architectures using Amazon SNS](https://aws.amazon.com/blogs/compute/messaging-fanout-pattern-for-serverless-architectures-using-amazon-sns/)

Kafka라면 한 토픽을 여러 컨슈머 그룹이 구독하는 형태로 비슷한 목적을 달성할 수 있습니다.
토픽·파티션·오프셋 모델은 SNS와 다르므로 구현 세부 사항을 섞어 쓰지 않습니다.

## 실패 처리와 주의점

- Fan-out은 전달 토폴로지입니다. 발행 원자성은 [Outbox](/docs/patterns/architecture-patterns/outbox-and-inbox) 등으로 따로 다룹니다.
- 소비자마다 처리 속도가 다르면 백프레셔·DLQ 정책을 구독 단위로 둡니다.
- “브로드캐스트했다”는 말만으로 모든 구독이 정확히 한 번 처리했다고 보지 않습니다.

## 관련 글

- [cast(uni,broad,multi)](../../architecture/castunibroadmulti.md) — 학습 메모
- [CDC](/docs/patterns/architecture-patterns/cdc) — 변경 캡처 후 토픽으로 보낼 때 Fan-out과 이어질 수 있음
- [Outbox와 Inbox](/docs/patterns/architecture-patterns/outbox-and-inbox)

## 참고

- [AWS Architecture Blog — Messaging Fanout with SNS](https://aws.amazon.com/blogs/compute/messaging-fanout-pattern-for-serverless-architectures-using-amazon-sns/)
- [Amazon SNS 개발자 가이드](https://docs.aws.amazon.com/sns/latest/dg/welcome.html)
