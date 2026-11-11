---
id: patterns
title: Patterns
description: "Patterns(Patterns) 하위 문서 목차와 학습·실무 진입 경로를 제공합니다."
unlisted: true
slug: "/patterns/index"
---

# Patterns

:::info[노션에서 옮겨 온 글을 다듬고 있습니다]

이곳의 일부 글은 기존 노션 자료를 AI로 일괄 이전한 기록입니다.<br />
이전 과정에서 문장이나 구성이 어색해진 글은 제가 하나씩 읽으며 표현과 예제를 다듬고 있습니다.

:::

비슷한 문제가 여러 프로젝트에서 반복되면, 이전에 쓴 해법부터 살펴봅니다.<br />
예를 들어 Outbox는 업무 데이터를 저장할 때 발행할 메시지도 함께 기록해, 나중에 발행을 이어갈 수 있게 하는 방법입니다.

여기서는 패턴이 풀어 주는 문제와 적용 조건을 다룹니다.<br />
기술별 설정과 명령은 [Knowledge](/docs/knowledge/)에서, 실제로 어떤 구조를 골랐는지는 [Decisions](/docs/decisions/)에서 읽을 수 있습니다.

## GoF 디자인 패턴

객체를 어떻게 만들지, 어떻게 연결할지, 동작을 어떻게 나눌지에 따라 찾아볼 수 있습니다.

- [GoF 목록](/docs/patterns/pattern-gof-design-pattern)
- [생성 패턴](/docs/patterns/factory-method) — Factory Method, Abstract Factory, Builder, Prototype, Singleton
- [구조 패턴](/docs/patterns/pattern-어탭터-패턴adapter-pattern) — Adapter, Bridge, Composite
- [행위 패턴](/docs/patterns/pattern-스트래티지-패턴strategy-pattern) — Strategy, Template Method, Visitor

## 아키텍처 패턴

저장과 메시지 발행을 어떻게 맞출지, 한 이벤트를 여러 곳에 어떻게 전달할지처럼 시스템을 연결할 때 반복해서 만나는 문제를 다룹니다.

- [아키텍처 패턴 목록](/docs/patterns/architecture-patterns)
- [Outbox와 Inbox](/docs/patterns/architecture-patterns/outbox-and-inbox)
- [Saga](/docs/patterns/architecture-patterns/saga)
- [CDC](/docs/patterns/architecture-patterns/cdc)
- [Fan-out](/docs/patterns/architecture-patterns/fan-out)
- [CQRS](/docs/patterns/architecture-patterns/cqrs)
- [분산 락](/docs/patterns/architecture-patterns/distributed-lock)
- [Gateway 권한 라우팅](/docs/patterns/architecture-patterns/gateway-authorization-routing)
- [트레이스 전파 (W3C)](/docs/patterns/architecture-patterns/trace-propagation-w3c)
- [RestClient와 Istio 재시도](/docs/patterns/architecture-patterns/restclient-vs-istio-retries)
- MSA와 IAM 사례: [Postmortems](/docs/postmortems/msa-iam-portfolio/overview)

목록은 [Notion 이전 문서 목록](../harness/history/notion-import-catalog.md)의 patterns 절을 봅니다.

## 함께 읽기

- [Architecture](../architecture/)
- [Knowledge](../knowledge/)
- [Decisions](../decisions/)
- [Postmortems](/docs/postmortems/)
