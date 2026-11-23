---
format: "md"
id: "spring-transaction-propagation-and-isolation"
title: "전파와 격리 수준"
description: "REQUIRED, REQUIRES_NEW와 NESTED의 물리 트랜잭션 차이, 격리 수준과 잠금의 역할을 설명합니다."
slug: "/knowledge/backend/spring/transaction/propagation-and-isolation"
sidebar_position: 2
status: "active"
tags:
  - "Spring"
keywords:
  - "전파와 격리 수준"
  - "Spring"
  - "@Transactional"
  - "Propagation"
  - "Isolation"
  - "Rollback"
  - "TransactionManager"
  - "트랜잭션"
---
# 전파와 격리 수준

전파는 호출된 기능이 기존 트랜잭션과 어떤 관계를 맺을지 정합니다.
격리는 동시에 진행되는 다른 트랜잭션의 변경을 어떻게 볼지에 관한 기준입니다.
이 두 설정을 모두 높이면 안전해진다는 식으로 접근하면 연결 대기와 잠금 비용이 커질 수 있습니다.

## 전파와 연결 사용

| 전파 | 기존 트랜잭션이 있을 때 | 주의점 |
|---|---|---|
| REQUIRED | 기존 트랜잭션에 참여합니다. | 내부 롤백 상태가 전체 결과에 영향을 줍니다. |
| REQUIRES_NEW | 기존 것을 보류하고 새로 시작합니다. | 별도 연결이 필요할 수 있습니다. |
| NESTED | 지원되는 경우 savepoint를 사용합니다. | 매니저와 DB 지원을 확인합니다. |
| MANDATORY | 기존 트랜잭션이 있어야 합니다. | 호출 계약을 강제합니다. |
| NOT_SUPPORTED | 기존 트랜잭션을 보류합니다. | 원자적 묶음에서 빠집니다. |

REQUIRES_NEW가 반환한 커밋은 이후 바깥 트랜잭션이 롤백돼도 자동 취소되지 않습니다.
감사 기록을 독립 보관하려는 목적에는 맞을 수 있지만, 업무 데이터의 절반만 남는 결과도 만들 수 있습니다.
동시에 여러 바깥 트랜잭션이 연결을 보유하고 새 연결을 기다리면 작은 풀에서 자원 고갈이 생길 수 있습니다.

```java
@Service
class AuditWriter {
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void record(String action) {
        // 독립 트랜잭션으로 기록
    }
}
```

별도 빈을 프록시로 호출하는 부분 예제입니다.
같은 객체 안의 메서드에 붙이고 직접 호출하면 기대한 새 경계가 생기지 않을 수 있습니다.
NESTED는 별도 커밋을 갖는 REQUIRES_NEW와 다르며 JPA 환경에서 범용으로 보장되는 기능도 아닙니다.

## 격리는 DB의 동시 읽기 규칙입니다

READ_COMMITTED, REPEATABLE_READ와 SERIALIZABLE의 실제 동작은 DB의 MVCC 및 잠금 구현과 함께 봅니다.
Spring의 DEFAULT는 트랜잭션 매니저와 DB의 기본값을 사용합니다.
기존 REQUIRED 트랜잭션에 참여하면 안쪽 선언만으로 바깥의 격리 수준이 새로 바뀌지는 않습니다.

```java
@Transactional(isolation = Isolation.READ_COMMITTED)
public CatalogItem read(Long id) {
    return query.find(id);
}
```

특정 격리를 선택하는 선언 예제이며 모든 조회에 권장하는 값은 아닙니다.
읽은 뒤 변경하는 업무에서 발생할 수 있는 중복과 갱신 유실을 어떤 수단으로 막을지 별도로 정합니다.

## 불변 조건을 지키는 수단

유니크 제약, 낙관적 잠금, 비관적 잠금과 원자적 조건부 갱신은 서로 다른 역할을 합니다.
예를 들어 version 충돌을 재시도할 때는 전체 업무를 다시 읽고 판단해야 할 수 있습니다.
격리 수준만 올려 모든 중복 요청을 처리하려고 하지 않습니다.

테스트에서는 연결 두 개와 트랜잭션 두 개를 사용해 실행 순서를 통제합니다.
동시에 읽기, 갱신과 커밋을 시도하고 실제 DB에서 결과와 잠금 대기를 확인합니다.
스레드 하나의 순차 테스트로 동시성 안전성을 증명할 수는 없습니다.

전파의 물리 자원 차이는 [Spring 공식 문서](https://docs.spring.io/spring-framework/reference/6.2/data-access/transaction/declarative/tx-propagation.html), DB 세부 규칙은 해당 DB의 격리 문서를 함께 참고합니다.

## 자주 묻는 질문

### self-invocation에서 트랜잭션이 안 먹는 이유는?

같은 객체 내부 호출은 프록시를 우회할 수 있습니다. 별도 빈 호출이나 관점 재배치가 필요합니다.

### checked 예외는 기본 롤백되나요?

기본적으로 RuntimeException과 Error만 롤백합니다. checked는 rollbackFor로 지정합니다.

