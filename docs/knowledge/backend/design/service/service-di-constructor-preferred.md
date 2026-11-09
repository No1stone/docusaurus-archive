---
id: service-di-constructor-preferred
title: Service — 생성자 주입이 기본인 이유
description: 필수 의존에 생성자(또는 RequiredArgsConstructor)를 쓰는 이유와 필드 Autowired 함정을 정리합니다.
tags:
  - backend
  - spring
  - di
status: active
slug: "/knowledge/backend/service/service-di-constructor-preferred"
---

# Spring 생성자 주입을 기본으로 쓰는 이유

예약 유즈케이스를 테스트할 때 DB나 Spring 컨텍스트를 띄우기 전에, 저장 Port를 테스트 대역으로 바꿔서 정책을 확인하고 싶었습니다.<br />
생성자가 의존성을 받으면 그 조립을 테스트 코드에서 바로 표현할 수 있습니다.

```java
class ReservationFacade {
    private final ReservationPort reservations;

    ReservationFacade(ReservationPort reservations) {
        this.reservations = reservations;
    }
}
```

Spring에서 빈의 생성자가 하나라면 보통 `@Autowired`를 생략합니다.<br />
의존 필드는 `final`로 둘 수 있고, 코드에서 필수 협력자가 무엇인지 바로 보입니다.<br />
단위 테스트에서는 `new ReservationFacade(reservationStub)`로 조립합니다.

## Lombok은 같은 생성자를 줄여 씁니다

| 애노테이션 | 생성자에 들어가는 필드 |
|---|---|
| `@RequiredArgsConstructor` | 초기화하지 않은 `final`과 필요한 `@NonNull` 필드 |
| `@AllArgsConstructor` | 클래스의 인스턴스 필드 전체 |

원셋은 주입받는 협력자에 `final`을 붙이고 `@RequiredArgsConstructor`를 사용합니다.<br />
설정값의 검증이나 구현 선택을 생성 시 드러내야 한다면 명시적인 생성자를 써도 됩니다.<br />
생성자에 협력자가 계속 늘어난다면 주입 방식을 바꾸기 전에 역할이 한 클래스에 모였는지 확인합니다.
[주입할 대상을 계층별로 고르기](/docs/knowledge/backend/service/service-di-injection-points)

## 생성자만 보고 테스트의 준비물을 정하기

예약 Facade가 조회 Port 하나를 생성자로 받으면, 예약 불가 상태를 반환하는 대역을 넣어 바로 정책을 테스트할 수 있습니다.<br />
표시 이름 조립이 추가돼 Resolver도 받아야 한다면, 생성자에서 두 협력자가 드러납니다.

| 테스트하고 싶은 것 | 생성자에 넣을 값 |
|---|---|
| 예약을 거절하고 저장을 건너뛰는지 | 예약 불가 상태를 반환하는 Port |
| 조회 결과에 표시 이름이 붙는지 | 예약 결과와 이름을 각각 돌려주는 대역 |

Spring 컨텍스트를 띄우지 않는 테스트에서는 직접 객체를 만들고, 빈 선택이나 트랜잭션 프록시는 통합 테스트에서 확인합니다.

## 참고 자료

- [Spring Framework의 생성자 기반 의존성 주입](https://docs.spring.io/spring-framework/reference/core/beans/dependencies/factory-collaborators.html)
