---
id: entity-dirty-checking
title: 더티 체킹
description: 방문 예약 수정 예제로 JPA 더티 체킹과 flush, 커밋의 차이를 설명합니다.
tags:
  - backend
  - jpa
status: active
slug: "/knowledge/backend/entity/entity-dirty-checking"
---

# JPA 더티 체킹, save를 호출하지 않아도 UPDATE가 나가는 이유

예약 상세 화면에서 방문 시간을 오후 2시에서 오후 3시로 바꿉니다.<br />
코드에는 예약을 읽고 시간을 바꾸는 메서드만 있습니다.

```java
@Transactional
public void reschedule(Long id, int visitHour) {
    Reservation reservation = repository.findById(id).orElseThrow();
    reservation.changeVisitHour(visitHour);
}
```

조회한 객체가 현재 영속성 컨텍스트에 관리되고 있다면, JPA 구현체는 변경된 상태를 flush할 때 DB에 반영합니다.<br />
이 과정이 더티 체킹입니다.<br />
여기서 `changeVisitHour`는 예시 엔티티의 변경 메서드입니다.

![관리 중인 예약의 변경이 SQL로 반영되는 과정](/img/backend-design/jpa-dirty-checking.svg)

## UPDATE를 보내는 시점과 확정하는 시점

flush는 영속성 컨텍스트의 변경을 SQL로 반영하는 과정입니다.<br />
트랜잭션이 커밋될 때 주로 일어나지만, 실행할 쿼리나 flush 모드에 따라 더 일찍 일어날 수도 있습니다.<br />
flush 뒤에 트랜잭션을 롤백하면 해당 UPDATE도 함께 취소됩니다.

| 객체 상태 | 필드를 바꾼 뒤의 동작 |
|---|---|
| 현재 영속성 컨텍스트가 관리 중 | flush 과정에서 변경 확인 |
| 컨텍스트에서 분리됨 | 그 객체를 바꾸는 것만으로 DB에 반영되지 않음 |
| DTO | 조회 결과나 요청 데이터만 보관 |

## 원셋에서 부분 수정을 검증하는 방법

Facade는 어떤 변경이 허용되는지 판단합니다.<br />
Adapter는 Port가 받은 변경 정보를 관리 중인 엔티티에 적용합니다.<br />
요청에서 빠진 필드를 기존 값으로 유지하는 정책은 그 수정 흐름에서 명시합니다.

테스트에서는 방문 시간만 변경한 뒤 flush하고 영속성 컨텍스트를 비운 다음 DB에서 다시 읽습니다.<br />
변경한 시간과 유지돼야 할 다른 컬럼을 함께 확인하면, 메모리에서만 객체가 바뀐 경우와 실제 반영을 구별할 수 있습니다.

업데이트 SQL에 어떤 컬럼이 포함되는지는 더티 체킹과 별도로 확인합니다.
[Hibernate의 DynamicInsert와 DynamicUpdate](/docs/knowledge/backend/entity/entity-dynamic-insert-update) / [Repository의 트랜잭션 기본값](/docs/knowledge/backend/repository/repository-transactionality)

## flush 전 메모리와 flush 후 DB를 구분하는 테스트

테스트에서 `reservation.changeVisitHour(15)`를 호출한 직후 같은 객체를 검사하면 15가 보입니다.<br />
그 결과는 Java 객체의 변경을 보여줍니다.

```java
entityManager.flush();
entityManager.clear();
Reservation reloaded = entityManager.find(Reservation.class, id);
assertThat(reloaded.getVisitHour()).isEqualTo(15);
```

위 코드는 변경 결과가 SQL을 거쳐 다시 읽히는지 확인하는 테스트의 일부입니다.<br />
커밋까지 확인하려면 쓰기 트랜잭션을 끝낸 뒤 새 트랜잭션에서 조회합니다.<br />
롤백이 필요한 테스트에서는 변경된 값이 새 트랜잭션에서 보이지 않는지 확인합니다.

## 참고 자료

- [Jakarta Persistence의 엔티티 상태와 DB 동기화](https://jakarta.ee/specifications/persistence/3.2/jakarta-persistence-spec-3.2)
