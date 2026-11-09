---
id: facade-app-unit-and-transactions
title: Facade — 앱 동작 단위와 트랜잭션
description: 예약 저장과 확인 화면의 부분 실패를 예로 BFF Facade와 도메인 Facade의 트랜잭션 경계를 설명합니다.
tags:
  - backend
  - facade
  - transaction
status: active
slug: "/knowledge/backend/facade/facade-app-unit-and-transactions"
---

# BFF Facade와 도메인 Facade의 트랜잭션 경계

방문 예약을 등록한 뒤 확인 화면에 세대 이름과 방문 가능 시간을 함께 보여주는 화면을 생각해 봅니다.

예약이 저장된 직후 세대 이름을 조회하는 API가 타임아웃되면, 화면에는 오류가 보일 수 있습니다.<br />
그때 예약까지 취소됐다고 가정하고 같은 요청을 다시 보내면 예약이 중복될 수 있습니다.

이 사례에서 화면이 끝났는지와 예약이 DB에 반영됐는지는 서로 다른 질문입니다.<br />
이 아카이브에서 BFF Facade와 도메인 Facade를 나눈 이유가 여기에 있습니다.

## 예약 등록과 확인 화면은 완료 시점이 다릅니다

도메인 Facade는 예약이 가능한지 판단하고 예약을 저장합니다.<br />
이 작업이 DB에서 성공하거나 실패하는 경계는 도메인 Facade가 엽니다.<br />
JPA Adapter는 그 트랜잭션에 참여합니다.

BFF Facade는 예약 등록 결과를 받은 뒤 화면에 필요한 정보를 조회합니다.<br />
세대 이름 조회에 실패했을 때 예약 ID를 그대로 돌려줄지, 부가 정보만 다시 불러오게 할지는 화면의 정책입니다.

![예약 커밋 이후 확인 화면의 부분 실패](/img/backend-design/reservation-confirmation.svg)

```java
public ReservationConfirmation confirm(ReserveVisit command) {
    ReservationReceipt receipt = reservationFacade.reserve(command);

    try {
        HouseholdView household = householdFacade.find(receipt.householdId());
        return ReservationConfirmation.complete(receipt, household);
    } catch (HouseholdLookupUnavailableException e) {
        return ReservationConfirmation.withoutHouseholdName(receipt);
    }
}
```

화면 응답의 조립만 보여주는 예시입니다.<br />
이 예제는 예약을 먼저 확정하고, 세대 이름을 불러오지 못하면 그 필드만 비워서 응답하도록 정한 경우입니다.<br />
예약 실패는 이 예외 처리의 대상에 포함되지 않습니다.

## 화면 요청 전체에 트랜잭션을 걸면 달라지는 점

같은 DB와 트랜잭션 관리자를 쓰는 BFF가 트랜잭션을 열면, 기본 전파 방식인 `REQUIRED`로 실행되는 도메인 Facade는 그 트랜잭션에 참여합니다.<br />
이 경우 도메인 Facade가 반환되는 시점과 예약이 커밋되는 시점이 달라집니다.

같은 트랜잭션에 참여한 안쪽 메서드가 롤백 전용 상태를 남기면, 바깥에서 예외를 처리해도 커밋할 때 롤백될 수 있습니다.<br />
화면용 외부 API를 부르는 동안 DB 트랜잭션이 계속 열린다는 점도 고려해야 합니다.

| 실패 지점 | 이 예제에서의 결과 |
|---|---|
| 예약 저장 중 실패 | 예약 변경 롤백, 등록 실패 응답 |
| 예약 커밋 후 세대 이름 조회 실패 | 예약 유지, 예약 ID와 부분 응답 반환 |
| 응답을 받기 전에 연결이 끊김 | 서버의 저장 여부 확인 후 재요청 여부 결정 |

프로세스 밖의 여러 서비스에서 변경이 이어지고, 업무상 이전 변경을 되돌려야 한다면 보상 흐름을 따로 설계합니다.<br />
어떤 작업을 완료로 간주하고 무엇을 되돌릴지는 [Saga 패턴](/docs/patterns/architecture-patterns/saga)에서 다룹니다.

## 원셋에서 확인할 경계

BFF는 각 도메인의 공개 진입점을 호출합니다.<br />
예약의 검증이나 저장을 직접 맡지 않으므로 예약 정책을 고칠 때 화면 조합 코드까지 찾을 필요가 줄어듭니다.

도메인 Facade는 앱 동작 단위에 맞춰 DB 트랜잭션을 열고, Adapter는 같은 경계에 참여합니다.
[Adapter의 트랜잭션 참여](/docs/knowledge/backend/service/service-tx-join-facade) / [Spring 원셋](/docs/harness/templates/backend/spring/ONESET)

이 예제를 테스트할 때는 예약 저장 실패와 저장 후 조회 실패를 나눕니다.<br />
첫 번째 케이스는 저장이 롤백됐는지, 두 번째 케이스는 예약 ID가 응답에 남고 예약도 유지됐는지 확인합니다.
[Facade 테스트와 실패 처리](/docs/knowledge/backend/facade/facade-testing-and-failures)

## 참고 자료

- [Spring Framework의 트랜잭션 전파 규칙](https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/tx-propagation.html)
