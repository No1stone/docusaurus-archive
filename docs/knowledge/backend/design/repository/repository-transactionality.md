---
id: repository-transactionality
title: Repository — Transactionality
description: 예약과 이력 저장을 예로 Spring Data JPA 트랜잭션 기본값과 Facade의 경계를 설명합니다.
tags:
  - backend
  - jpa
  - transaction
status: active
slug: "/knowledge/backend/repository/repository-transactionality"
---

# Spring Data JPA에서 트랜잭션은 어디서 시작할까

방문 예약을 저장하면서 예약 이력도 남기는 기능을 만든다고 가정합니다.<br />
예약과 이력을 같은 DB에 저장하고, 이력 저장에 실패하면 예약도 함께 롤백해야 합니다.

두 Repository에 각각 트랜잭션 기본값이 있어도, 연달아 호출한 두 메서드가 같은 작업으로 묶이는지는 호출하는 쪽에서 결정합니다.<br />
이 차이를 알면 Repository의 기본 설정과 Facade의 역할을 구분하기 쉽습니다.

## 상속한 메서드와 직접 선언한 메서드

Spring Data JPA가 기본 구현을 제공하는 CRUD 메서드는 `SimpleJpaRepository`의 트랜잭션 설정을 따릅니다.<br />
인터페이스에 직접 선언한 쿼리 메서드에는 같은 기본값이 자동으로 붙지 않습니다.

| 호출 | 바깥 트랜잭션이 없을 때 |
|---|---|
| 상속한 `findById`, `findAll` | 기본 읽기 전용 트랜잭션 |
| 상속한 `save`, `delete` | 기본 쓰기 트랜잭션 |
| 직접 선언한 파생 쿼리, `@Query`, default 메서드 | 별도 선언이 없으면 Repository 트랜잭션 설정을 자동 적용하지 않음 |
| Custom Repository 프래그먼트 | 구현 메서드에 선언한 설정 적용 |

예를 들어 예약 상태를 직접 변경하는 쿼리를 Repository에 직접 선언했다면, 쓰기 트랜잭션이 필요합니다.

```java
public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    @Transactional(readOnly = true)
    @Query("select r from Reservation r where r.householdId = :householdId")
    List<Reservation> findForHousehold(@Param("householdId") Long householdId);

    @Modifying
    @Transactional
    @Query("update Reservation r set r.status = :cancelled where r.id = :id")
    int cancel(@Param("id") Long id, @Param("cancelled") ReservationStatus cancelled);
}
```

예제는 메서드의 트랜잭션 설정을 보여주기 위해 단순화했습니다.<br />
운영에서 상태 전이 규칙과 감사 필드를 함께 적용해야 한다면, 위 벌크 쿼리의 조건과 갱신 필드를 별도로 검토해야 합니다.

`readOnly = true`는 조회 경로의 의도를 나타내며 드라이버나 JPA 구현체의 최적화에 쓰입니다.<br />
쓰기 시도가 항상 차단된다고 가정할 수는 없습니다.<br />
이미 읽기 전용 트랜잭션에 참여 중이라면 안쪽 쓰기 메서드에 애노테이션을 붙였다고 해서 바깥 설정이 바뀌지는 않습니다.

## 예약과 이력을 같은 작업으로 묶기

원셋에서는 도메인 Facade가 예약 등록이라는 작업 단위를 소유합니다.<br />
Adapter는 Facade가 연 트랜잭션에서 저장을 수행합니다.

```java
@Transactional
public ReservationReceipt reserve(ReserveVisit command) {
    ReservationReceipt receipt = reservationPort.create(command);
    reservationHistoryPort.recordCreated(receipt.id());
    return receipt;
}
```

두 Port의 구현이 같은 DB와 트랜잭션 관리자를 사용하고 기존 트랜잭션에 참여한다는 가정입니다.<br />
이력 저장에서 롤백 대상 예외가 전파되면 예약도 함께 롤백됩니다.

```text
Facade 트랜잭션 시작
  ├─ 예약 INSERT
  ├─ 예약 이력 INSERT
  └─ 두 작업을 커밋하거나 함께 롤백
```

이력 저장에 `REQUIRES_NEW`를 붙이면 별도 트랜잭션에서 먼저 커밋될 수 있습니다.<br />
그러면 바깥 예약이 롤백되더라도 이력만 남는 흐름이 생깁니다.<br />
이력의 독립 저장이 의도된 정책이라면, 그 결과를 테스트에 드러내야 합니다.

## Jakarta TxType과 Spring Propagation

Spring의 `org.springframework.transaction.annotation.Transactional`은 `propagation` 속성으로 전파 방식을 정합니다.<br />
`jakarta.transaction.Transactional`은 `TxType`을 `value`에 지정합니다.

| 전파 방식 | 기존 트랜잭션 없음 | 기존 트랜잭션 있음 |
|---|---|---|
| `REQUIRED` | 새 트랜잭션 시작 | 기존 트랜잭션 참여 |
| `REQUIRES_NEW` | 새 트랜잭션 시작 | 기존 트랜잭션을 보류하고 새로 시작 |
| `MANDATORY` | 예외 | 기존 트랜잭션 참여 |
| `SUPPORTS` | 트랜잭션 없이 실행 | 기존 트랜잭션 참여 |
| `NOT_SUPPORTED` | 트랜잭션 없이 실행 | 기존 트랜잭션을 보류하고 실행 |
| `NEVER` | 트랜잭션 없이 실행 | 예외 |

원셋은 읽기 전용 여부와 전파 방식을 함께 표현할 수 있는 Spring 애노테이션을 사용합니다.<br />
Spring에는 트랜잭션 관리자의 지원을 전제로 저장점을 활용할 수 있는 `NESTED`도 있습니다.
[Facade의 작업 단위](/docs/knowledge/backend/facade/facade-app-unit-and-transactions) / [Adapter의 트랜잭션 참여](/docs/knowledge/backend/service/service-tx-join-facade) / [잠금 조회](/docs/knowledge/backend/repository/repository-locking) / [쿼리 메서드](/docs/knowledge/backend/repository/repository-query-methods)

## 테스트에서 바깥 트랜잭션을 확인하는 이유

예약과 이력을 함께 쓰는 테스트 메서드 자체에 트랜잭션이 걸려 있으면, 제품 코드에서 Facade의 트랜잭션이 빠져도 두 쓰기가 테스트의 트랜잭션에 참여할 수 있습니다.<br />
이 경우 테스트는 통과하지만 실제 요청은 Repository 메서드별로 따로 완료될 수 있습니다.

![예약과 이력의 롤백을 검증하는 순서](/img/backend-design/facade-rollback-test.svg)

경계가 중요한 시나리오는 테스트 메서드 바깥에서 유즈케이스를 호출하고, 실패한 뒤 새 조회로 DB 상태를 확인합니다.<br />
예약과 이력이 함께 반영되거나 함께 사라지는지 보면 Repository의 기본값과 업무 단위의 설정을 구분할 수 있습니다.

## 참고 자료

- [Spring Data JPA의 Repository 트랜잭션 기본값](https://docs.spring.io/spring-data/jpa/reference/jpa/transactions.html)
- [Spring Framework의 트랜잭션 전파](https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/tx-propagation.html)
