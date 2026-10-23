---
id: patterns
title: Patterns
description: Reusable engineering patterns
unlisted: true
---
# Patterns

> **개요:** 재사용 가능한 엔지니어링 패턴입니다.
> 기술(Kafka)과 패턴(Outbox)과 아키텍처(EDA)를 구분합니다.

이 영역의 일부 글은 기존 노션 자료를 AI의 도움으로 일괄 이전·정리했습니다.
표현이 어색하거나 설명이 충분하지 않은 부분은 직접 확인하며 순차적으로 다듬고 있습니다.

## 구분

| Kind | Example | 위치 |
|------|---------|------|
| Technology | Kafka, Log4Jdbc | [Knowledge](../knowledge/) |
| Pattern (GoF) | Factory Method, Strategy | [GoF 디자인 패턴](./gof/gof-design-pattern.md) |
| Architecture pattern | Outbox, Fan-out | [아키텍처 패턴](./architecture-patterns/) |
| Architecture (설계) | MSA 경계, 계층 구조 | [Architecture](../architecture/) |
| Decision | 왜 Kafka + Outbox를 골랐는지 | [Decisions](../decisions/) |

## GoF 디자인 패턴

생성, 구조, 행위로 나눕니다.

- [GoF 목록](./gof/gof-design-pattern.md)
- [생성 패턴](./gof/creational/factory-method.md) — Factory Method, Abstract Factory, Builder, Prototype, Singleton
- [구조 패턴](./gof/structural/어탭터-패턴adapter-pattern.md) — Adapter, Bridge, Composite
- [행위 패턴](./gof/behavioral/스트래티지-패턴strategy-pattern.md) — Strategy, Template Method, Visitor

## 아키텍처 패턴

재사용 해법 중심 묶음입니다.
설계 서술과 사례 묶음은 Architecture, Postmortems를 봅니다.

- [아키텍처 패턴 목록](./architecture-patterns/)
- [Outbox와 Inbox](./architecture-patterns/outbox-and-inbox.md)
- [Saga](./architecture-patterns/saga.md)
- [CDC](./architecture-patterns/cdc.md)
- [Fan-out](./architecture-patterns/fan-out.md)
- [CQRS](./architecture-patterns/cqrs.md)
- [분산 락](./architecture-patterns/distributed-lock.md)
- [Gateway 권한 라우팅](./architecture-patterns/gateway-authorization-routing.md)
- 아이컴시스 MSA·IAM 사례: [Postmortems](../postmortems/icomsys-msa-iam-portfolio/overview.md)

목록은 [Notion 이전 문서 목록](../harness/history/notion-import-catalog.md)의 patterns 절을 봅니다.

## Related

- [Architecture](../architecture/)
- [Knowledge](../knowledge/)
- [Decisions](../decisions/)
- [Postmortems](../postmortems/)
