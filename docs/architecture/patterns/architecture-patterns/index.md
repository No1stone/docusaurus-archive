---
id: architecture-patterns
title: 아키텍처 패턴
description: 재사용 가능한 아키텍처 패턴. 설계 원리 중심의 Architecture 문서와 구분합니다.
slug: /patterns/architecture-patterns
unlisted: true
---
# 아키텍처 패턴

> **개요:** 시스템 경계를 넘는 재사용 가능한 해결 방식을 모읍니다.
> 설계 원리·구성·사례 서술은 Architecture·Postmortems에 둡니다.

## Architecture와의 구분

| 위치 | 중심 |
|------|------|
| Architecture | 구조와 경계, 왜 그렇게 나누는지 |
| Patterns / 아키텍처 패턴 | 같은 문제를 풀 때 다시 쓰는 해결 방식 |

## 문제별 글

빈 하위 분류 폴더는 만들지 않았습니다.
글이 생긴 주제만 둡니다.

### 메시지·전달 신뢰성

- [Outbox와 Inbox](/docs/patterns/architecture-patterns/outbox-and-inbox)
- [CDC](/docs/patterns/architecture-patterns/cdc)
- [Fan-out](/docs/patterns/architecture-patterns/fan-out)

### 분산 업무·동시성

- [Saga](/docs/patterns/architecture-patterns/saga)
- [분산 락](/docs/patterns/architecture-patterns/distributed-lock)

### 읽기·쓰기 경계

- [CQRS](/docs/patterns/architecture-patterns/cqrs)

### 입구·권한

- [Gateway 권한 라우팅](/docs/patterns/architecture-patterns/gateway-authorization-routing)

## 사례

- [아이컴시스 MSA·IAM 포트폴리오](../../architecture/postmortems/icomsys-msa-iam-portfolio/overview.md)

## Related

- [Patterns](/docs/patterns/index)
- [GoF 디자인 패턴](/docs/patterns/pattern-gof-design-pattern)
- [Architecture](../../architecture/index.md)
- [Knowledge / Messaging](../../development/messaging/index.md)
