---
id: facade-testing-and-failures
title: Facade — 테스트와 실패 정책
description: 예약 정책 위반과 화면의 부분 실패를 예로 Facade 단위 테스트와 트랜잭션 검증 범위를 설명합니다.
tags:
  - backend
  - facade
  - testing
status: active
slug: "/knowledge/backend/facade/facade-testing-and-failures"
---

# Facade 테스트에서 업무 판단과 실패 경계 확인하기

예약 등록에는 저장 성공뿐 아니라 예약이 불가능할 때의 판단도 들어갑니다.<br />
확인 화면까지 이어지는 요청이라면, 예약이 저장된 다음 부가 정보 조회가 실패하는 경우도 있습니다.

두 실패는 결과가 다릅니다.<br />
첫 번째는 예약을 생성하지 않아야 하고, 두 번째는 등록된 예약을 유지한 채 화면의 실패 정책을 적용할 수 있습니다.<br />
테스트를 나눌 때도 이 차이를 먼저 잡습니다.

## 도메인 Facade는 Port를 대체해 업무 규칙을 확인합니다

예를 들어 현재 상태에서는 예약을 받을 수 없다고 가정합니다.<br />
Facade 단위 테스트에서는 Port가 그 상태를 반환하게 한 뒤, 예외와 저장 호출 여부를 확인합니다.

```java
@Test
void rejectsVisitWhenReservationIsClosed() {
    given(reservationPort.findState(42L)).willReturn(ReservationState.CLOSED);

    assertThatThrownBy(() -> facade.reserve(42L))
        .isInstanceOf(ReservationClosedException.class);

    then(reservationPort).should(never()).create(42L);
}
```

업무 판단을 보여주기 위해 메서드와 모델을 단순화한 예시입니다.<br />
Facade의 협력자인 Port만 대체하면 저장소 API를 몰라도 검증할 수 있습니다.<br />
조회 조건과 DB 매핑은 Adapter 테스트에서 별도로 확인합니다.

## BFF는 도메인 결과가 달라질 때의 응답을 확인합니다

[예약 확인 화면 예제](/docs/knowledge/backend/facade/facade-app-unit-and-transactions)에서는 예약 ID를 받은 다음 세대 이름을 조회합니다.
BFF 테스트는 공개 Facade를 대체해 어떤 단계에서 실패하는지 제어할 수 있습니다.

| 조건 | 기대 결과 |
|---|---|
| 예약 등록과 세대 조회 성공 | 예약 ID와 세대 이름을 포함한 응답 |
| 예약 등록 실패 | 등록 실패 반환, 세대 조회 미호출 |
| 예약 등록 성공 뒤 세대 조회 타임아웃 | 예약 ID 유지, 세대 이름은 부분 응답 정책에 따라 처리 |

예약 등록 뒤의 타임아웃을 포괄적인 예외 처리로 모두 묶으면, 등록 실패인지 부가 정보 조회 실패인지 구분하기 어려워집니다.<br />
테스트에서도 두 경우의 응답과 호출 횟수를 각각 확인합니다.

## 롤백은 DB를 포함한 검증에서 확인합니다

Facade 단위 테스트에서 저장 Port의 메서드가 호출됐다는 사실은 확인할 수 있습니다.<br />
예약과 이력이 실제로 함께 롤백됐는지는 같은 트랜잭션 관리자와 DB가 있는 테스트에서 확인해야 합니다.

예약 저장 후 이력 저장에서 실패하도록 만들고, 실패한 트랜잭션이 끝난 다음 별도로 조회합니다.<br />
예약 행과 이력 행이 모두 남지 않았는지 검증하면 트랜잭션 경계가 드러납니다.

| 검증 위치 | 확인하는 결과 |
|---|---|
| 도메인 Facade 단위 테스트 | 정책에 맞는 예외, 후속 저장 호출 여부 |
| BFF 단위 테스트 | 도메인 결과 조합, 부분 실패 응답 |
| Adapter 통합 테스트 | 필터가 만든 조회 결과, DB 컬럼 매핑 |
| 업무 시나리오 통합 테스트 | 여러 저장이 함께 커밋되거나 롤백되는지 확인 |

서비스가 분리된 뒤 여러 원격 변경을 되돌려야 한다면 보상 순서와 보상 실패도 별도 시나리오로 다룹니다.
[테스트 기본 구조](/docs/knowledge/backend/testing/test-structure) / [Saga 패턴](/docs/patterns/architecture-patterns/saga)

## 부분 실패에서 어떤 예외까지 잡을지 테스트하기

예약 저장 뒤 세대 조회가 타임아웃되면 부분 응답으로 바꾸기로 했더라도, 모든 예외에 같은 정책을 적용할 필요는 없습니다.<br />
예를 들어 응답 매핑이 잘못돼 예상하지 못한 예외가 나면 운영자가 결함을 발견할 수 있어야 합니다.

| 대체 객체의 동작 | 검증할 결과 |
|---|---|
| 예약 Facade가 저장 실패를 반환 | 세대 조회 호출 0회, 등록 실패 응답 |
| 예약 ID 반환 뒤 세대 조회 타임아웃 | 예약 ID가 들어 있는 부분 응답 |
| 예약 ID 반환 뒤 예상 밖 오류 | 정해진 예외 처리 경로로 전파 |

같은 예약 ID를 모든 케이스에 사용하면 실패 지점 외의 조건을 고정할 수 있습니다.<br />
여기서 확인하는 것은 BFF의 선택입니다.<br />
저장 커밋 여부는 DB를 포함하는 테스트에서 확인합니다.
