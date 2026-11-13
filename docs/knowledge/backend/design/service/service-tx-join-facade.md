---
id: service-tx-join-facade
title: Service — Facade DB TX에 join
description: "Adapter의 Transactional이 도메인 Facade 트랜잭션에 참여하는 규칙과 readOnly·쓰기 오버라이드를 정리합니다."
keywords:
  - "@Transactional"
  - Facade TX
  - readOnly
tags:
  - backend
  - transaction
status: active
slug: "/knowledge/backend/service/service-tx-join-facade"
---

# JPA Adapter가 Facade의 트랜잭션에 참여하는 이유

방문 예약을 등록하면서 이력도 남긴다고 가정합니다.<br />
업무 규칙이 두 저장을 함께 완료하도록 요구하면, Facade가 두 호출의 바깥에서 트랜잭션을 엽니다.

```java
@Transactional
public ReservationReceipt reserve(ReserveVisit command) {
    ReservationReceipt receipt = reservationPort.create(command);
    historyPort.recordCreated(receipt.id());
    return receipt;
}
```

두 Adapter가 같은 트랜잭션 관리자를 사용하고 `REQUIRED`로 실행되면, 각각 호출돼도 같은 트랜잭션에 참여합니다.<br />
이력 저장 중 롤백 대상 예외가 전파되면 예약 변경도 롤백됩니다.

## 읽기에서 쓰기로 넘어갈 때

원셋에서는 조회용 클래스에 읽기 전용 기본값을 둘 수 있고, 쓰기 진입 메서드에는 쓰기 트랜잭션을 명시합니다.<br />
이미 바깥에서 읽기 전용 트랜잭션이 열린 상태라면, 안쪽 Adapter 메서드의 쓰기 설정만으로 이를 바꿀 수 없습니다.<br />
쓰기 유즈케이스가 시작되는 Facade의 설정을 먼저 봅니다.

| 검증할 조건 | 예상 결과 |
|---|---|
| 예약과 이력 모두 성공 | 두 변경 커밋 |
| 이력 저장에서 예외 전파 | 같은 트랜잭션의 예약과 이력 롤백 |
| 이력에 `REQUIRES_NEW` 적용 | 독립적으로 커밋될 수 있으므로 별도 정책 필요 |

Controller는 요청을 해석해 Facade를 호출합니다.<br />
외부 API 호출이나 화면 조합까지 트랜잭션으로 묶기 전에 어느 저장 작업이 함께 커밋되어야 하는지 정합니다.
[Facade의 업무 경계](/docs/knowledge/backend/facade/facade-app-unit-and-transactions) / [Repository 트랜잭션](/docs/knowledge/backend/repository/repository-transactionality)

## 어노테이션을 추가했는데 독립 커밋이 보이지 않는 경우

같은 Facade 안에서 다른 메서드를 직접 호출하면, 기본 프록시 기반 설정에서는 그 내부 호출이 프록시를 통과하지 않습니다.<br />
내부 메서드에 붙인 전파 설정이 새 트랜잭션을 여는 것으로 가정하면 실제 동작과 어긋날 수 있습니다.

독립 커밋이 요구되는 작업이라면 해당 정책을 별도 빈이나 명시적 트랜잭션 경계에서 표현하고, 바깥 실패 이후 어느 행이 남는지 테스트합니다.<br />
기존 원셋의 기본 경로는 Facade와 Adapter가 같은 작업을 함께 커밋하는 형태입니다.
[Spring의 선언적 트랜잭션과 프록시 호출](https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/annotations.html)

## 참고 자료

- [Spring Framework의 REQUIRED와 REQUIRES_NEW](https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/tx-propagation.html)
