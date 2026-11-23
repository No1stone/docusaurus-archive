---
format: "md"
id: "spring-transaction-index"
title: "트랜잭션"
description: "@Transactional 경계, 전파, 격리, 롤백과 프로그래밍 방식 트랜잭션을 다루는 입구입니다."
slug: "/knowledge/backend/spring/transaction"
sidebar_position: 0
status: "active"
tags:
  - "Spring"
keywords:
  - "트랜잭션"
  - "Spring"
  - "@Transactional"
  - "Propagation"
  - "Isolation"
  - "Rollback"
  - "TransactionManager"
---
# 트랜잭션

업무 변경을 함께 확정하는 범위와 실패 시 되돌리는 기준을 다룹니다.
프록시, 전파와 롤백을 분리해 이해하면 저장 결과와 HTTP 응답이 다른 상황을 설명할 수 있습니다.

## 읽는 순서

적용 경계에서 시작해 전파와 격리를 읽고, 예외가 실제 커밋에 주는 영향을 확인합니다.
메서드 경계가 맞지 않는 경우에는 명시적인 TransactionTemplate도 비교합니다.

| 글 | 다루는 내용 |
|---|---|
| [Transactional과 적용 경계](./transactional-boundary.md) | Transactional 프록시의 시작과 종료, 업무 경계와 외부 자원 및 readOnly의 한계를 설명합니다. |
| [전파와 격리 수준](./propagation-and-isolation.md) | REQUIRED, REQUIRES_NEW와 NESTED의 물리 트랜잭션 차이, 격리 수준과 잠금의 역할을 설명합니다. |
| [롤백과 예외 처리](./rollback-and-exceptions.md) | 기본 롤백 규칙, checked 예외와 예외를 잡는 경우 및 rollback-only로 인한 UnexpectedRollbackException을 설명합니다. |
| [프로그래밍 방식의 트랜잭션](./programmatic-transactions.md) | TransactionTemplate으로 명시적인 DB 처리 범위를 만들고 원격 호출과 롤백 및 재시도 경계를 나누는 방법을 설명합니다. |

## 예제의 기준

기본 설명은 Spring Boot 3.5와 Framework 6.2입니다.
다른 버전이 필요한 기능은 해당 글에서 구분합니다.
별도 언급이 없는 코드 조각은 import와 프로젝트 설정을 생략한 설명용이며, 필요한 협력 객체와 전제는 본문에 적었습니다.

이전 메모는 [Legacy](../legacy/index.md)에 보존합니다.
새 글에서 재사용한 예제는 현재 API와 주의점을 함께 설명합니다.

## 자주 묻는 질문

### self-invocation에서 트랜잭션이 안 먹는 이유는?

같은 객체 내부 호출은 프록시를 우회할 수 있습니다. 별도 빈 호출이나 관점 재배치가 필요합니다.

### checked 예외는 기본 롤백되나요?

기본적으로 RuntimeException과 Error만 롤백합니다. checked는 rollbackFor로 지정합니다.

