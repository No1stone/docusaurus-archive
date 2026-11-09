---
id: repository-locking
title: Repository — Locking
description: "같은 예약을 두 관리자가 수정할 때 @Version 낙관적 락과 비관적 락이 어디서 충돌이나 대기를 만드는지 사례로 설명합니다."
tags:
  - backend
  - jpa
  - locking
status: active
slug: "/knowledge/backend/repository/repository-locking"
---
# JPA 낙관적 락과 비관적 락, 같은 예약을 두 사람이 수정한다면

관리자 두 명이 방문 예약 42번을 열었습니다.

둘 다 방문 시간이 오후 2시인 화면을 봤습니다.<br />
먼저 저장한 관리자는 오후 3시로 변경했고, 나중에 저장한 관리자는 오후 4시로 변경했습니다.

두 번째 저장을 그대로 받아들이면 첫 번째 관리자의 변경이 덮어써집니다.<br />
이때 필요한 것은 **화면을 열었을 때 본 예약과 지금 저장하려는 예약이 같은 버전인지 확인하는 것**입니다.

## 화면을 열어 둔 동안 생긴 변경을 감지하기

JPA 엔티티에 `@Version` 필드를 두면, 영속성 제공자가 엔티티를 읽을 때 버전을 기억하고 변경을 반영할 때 그 버전을 검사합니다.

```java
@Version
private Long version;
```

두 트랜잭션이 모두 버전 7을 읽었다고 가정해 봅니다.<br />
첫 번째 트랜잭션이 먼저 반영하면 DB의 버전은 8이 됩니다.<br />
두 번째 트랜잭션은 여전히 버전 7을 조건으로 수정하므로 변경할 행을 찾지 못합니다.

![예약 수정 요청의 버전 충돌](/img/backend-design/reservation-version-conflict.svg)

실제 SQL은 매핑과 구현체에 따라 달라집니다.<br />
버전 검사에 필요한 부분만 남기면 다음과 같습니다.

```sql
UPDATE reservation
SET visit_hour = 15, version = 8
WHERE id = 42 AND version = 7;
```

충돌은 보통 변경을 DB로 보내는 flush에서 드러납니다.<br />
커밋 과정에서 flush한다면 서비스 메서드가 반환된 뒤, 트랜잭션을 닫는 과정에서 예외가 드러날 수도 있습니다.

**화면 조회와 저장이 별도 HTTP 요청이면 한 가지가 더 필요합니다.**
저장 요청에도 화면이 처음 받은 버전 7을 보내야 합니다.<br />
서버가 저장 요청을 받을 때 최신 엔티티를 다시 읽기만 하면, 버전 8을 읽은 다음 변경을 적용하므로 화면이 오래됐다는 사실을 알 수 없습니다.

```java
@Transactional
public void changeVisitHour(Long id, Long expectedVersion, int visitHour) {
    Reservation reservation = reservations.findById(id).orElseThrow();
    if (!Objects.equals(expectedVersion, reservation.getVersion())) {
        throw new StaleReservationException(id);
    }
    reservation.changeVisitHour(visitHour);
}
```

예제의 `StaleReservationException`은 애플리케이션에서 정의하는 충돌 예외입니다.<br />
명시적인 비교는 화면을 연 뒤 이미 바뀐 예약을 걸러냅니다.<br />
비교 직후 다른 요청이 먼저 커밋하는 경우는 JPA의 버전 검사가 잡습니다.<br />
HTTP에서 어떤 상태와 본문을 돌려줄지는 [오류 응답 설계](/docs/knowledge/backend/controller/advice-http-status-and-envelope)에 이어집니다.

## 조회한 상태를 기준으로 바로 변경해야 할 때

같은 예약에 입차 처리를 한다고 가정해 봅니다.<br />
요청이 들어오면 현재 상태를 읽고, 입차 가능한지 확인하고, 곧바로 상태를 변경합니다.

이처럼 한 트랜잭션 안에서 읽고 판단하고 쓰는 작업은 `PESSIMISTIC_WRITE`로 경쟁하는 변경을 조회 시점부터 조율할 수 있습니다.

```java
public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select r from Reservation r where r.id = :id")
    Optional<Reservation> findForUpdate(@Param("id") Long id);
}
```

```java
@Transactional
public void admit(Long id) {
    Reservation reservation = reservations.findForUpdate(id).orElseThrow();
    reservation.admit();
}
```

`admit()`은 예약의 현재 상태가 입차를 허용하는지 확인하고 상태를 바꾸는 업무 메서드입니다.<br />
조회와 상태 변경을 같은 DB 트랜잭션에 두므로 두 번째 요청은 락을 얻은 뒤 바뀐 상태를 기준으로 판단할 수 있습니다.

![예약 입차 처리의 쓰기 락](/img/backend-design/reservation-write-lock.svg)

DB와 격리 수준에 따라 경쟁 요청은 기다리거나 타임아웃, 교착 또는 직렬화 실패로 끝날 수 있습니다.<br />
아래 SQL은 흔히 볼 수 있는 잠금 조회의 예입니다.

```sql
SELECT id, visit_hour, status, version
FROM reservation
WHERE id = 42
FOR UPDATE;
```

잠금을 잡은 상태에서 외부 API 응답까지 기다리면 다음 요청의 대기도 길어집니다.<br />
잠금이 필요한 구간에는 상태 확인과 변경만 두고, 여러 행을 잠그는 경로에서는 같은 순서로 접근할 수 있는지 확인합니다.

## 잠금 모드를 고를 때

`@Version`은 엔티티의 버전 정보를 관리하는 표시입니다.<br />
Spring Data의 `@Lock`은 해당 Repository 메서드에 JPA 잠금 모드를 지정합니다.<br />
같은 모드를 `EntityManager.find`, `lock`, `refresh`나 `Query.setLockMode`에서도 지정할 수 있습니다.

| 모드 | 적용할 상황 |
|---|---|
| `NONE` | 명시적인 잠금 모드가 필요 없는 조회 |
| `OPTIMISTIC` | 변경하지 않고 읽은 버전 엔티티에도 낙관적 검사를 명시 |
| `OPTIMISTIC_FORCE_INCREMENT` | 자식 변경을 부모 버전에도 반영하는 등 버전 증가를 명시 |
| `PESSIMISTIC_READ` | 트랜잭션이 끝날 때까지 다른 트랜잭션의 변경을 막는 읽기 |
| `PESSIMISTIC_WRITE` | 같은 행을 변경하는 트랜잭션의 경합을 조회부터 조율 |
| `PESSIMISTIC_FORCE_INCREMENT` | 버전이 있는 엔티티를 비관적으로 잠그면서 버전도 증가 |

`READ`와 `WRITE`는 각각 `OPTIMISTIC`, `OPTIMISTIC_FORCE_INCREMENT`의 별칭입니다.<br />
버전 없는 엔티티의 낙관적 잠금은 구현체 간 이식성을 보장하기 어렵습니다.<br />
`PESSIMISTIC_READ`와 `PESSIMISTIC_WRITE`는 버전 없는 엔티티에도 사용할 수 있습니다.

예약 수정 화면은 오래된 저장을 감지해야 하고, 입차 처리는 같은 행의 상태 전이를 순서대로 적용해야 합니다.<br />
두 경로가 같은 엔티티를 쓰면 **버전 필드를 둔 채 입차 메서드에서만 비관적 락을 지정**할 수 있습니다.

## 원셋에서는 어디에 두나요?

원셋의 [UpdatedEntity](/docs/harness/templates/backend/spring/support/)는 수정 감사 필드와 함께 `@Version`을 제공합니다.<br />
수정 충돌을 감지해야 하는 마스터 데이터에 이 상위 타입을 사용하고, 생성 이력을 쌓는 테이블은 `CreatedEntity`를 사용합니다.

비관적 락이 필요하면 도메인 Facade가 변경의 트랜잭션을 열고, Adapter가 그 안에서 잠금 조회와 변경을 수행합니다.<br />
조회만 하는 목록 경로는 기존 조회 흐름을 사용합니다.
[Facade의 작업 경계](/docs/knowledge/backend/facade/facade-app-unit-and-transactions) / [Adapter의 트랜잭션 참여](/docs/knowledge/backend/service/service-tx-join-facade) / [Repository 설계](/docs/knowledge/backend/repository/repository-design)

## 실제로 두 번째 요청이 막히는 위치를 검증하기

낙관적 락을 검증할 때는 독립된 두 트랜잭션으로 같은 버전을 읽고, 첫 번째를 커밋한 뒤 두 번째 변경을 flush합니다.<br />
같은 영속성 컨텍스트에서 객체 하나를 두 번 수정하면 이 상황을 재현할 수 없습니다.

![잠금 테스트에서 두 요청의 순서를 제어하는 흐름](/img/backend-design/jpa-lock-integration-test.svg)

비관적 락 테스트는 첫 요청이 락을 획득한 뒤 두 번째를 시작하게 순서를 제어합니다.<br />
먼저 첫 트랜잭션이 끝나기 전까지 두 번째가 변경을 완료하지 않는지 보고, 락을 해제한 뒤에는 어떤 결과가 반환되는지 확인합니다.<br />
고정된 대기 시간에 의존하기보다 두 요청의 시작과 진행을 테스트에서 조율합니다.

실제 서비스에서 사용하는 DB와 격리 수준에 따라 락 대기와 예외가 달라질 수 있습니다.<br />
테스트의 기대 결과도 운영에 쓰는 조합을 기준으로 정합니다.

## 참고 자료

- [Spring Data JPA의 Repository 잠금 설정](https://docs.spring.io/spring-data/jpa/reference/jpa/locking.html)
- [Jakarta Persistence 3.2의 버전 필드와 잠금 모드](https://jakarta.ee/specifications/persistence/3.2/jakarta-persistence-spec-3.2)
