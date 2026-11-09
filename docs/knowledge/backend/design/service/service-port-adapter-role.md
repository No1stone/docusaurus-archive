---
id: service-port-adapter-role
title: Service — Port와 Adapter 역할
description: Port 계약, Adapter 구현, 레거시 *Service 하위 호환을 정리합니다.
tags:
  - backend
  - port
  - adapter
status: active
slug: "/knowledge/backend/service/service-port-adapter-role"
---

# Port와 Adapter를 나누면 조회 코드가 어디에 남을까

방문 예약 목록에서 조회 가능 범위를 먼저 정하고, 그 안에서 시간순으로 결과를 보여준다고 가정합니다.<br />
예약 가능 범위를 판단하는 이유와 DB가 그 범위를 검색하는 방식은 따로 바뀔 수 있습니다.

원셋은 Facade에서 업무 범위를 결정하고, Port로 어떤 데이터가 필요한지 표현합니다.<br />
JPA Adapter는 요청받은 범위에 해당하는 쿼리를 실행합니다.

![업무 판단과 조회 구현의 경계](/img/backend-design/reservation-port-adapter.svg)

```java
interface ReservationPort {
    ReservationPage find(ReservationFilter filter);
}
```

이 인터페이스는 예시입니다.<br />
JPA 구현은 `ReservationFilter`를 Specification과 Pageable로 변환하고, 읽은 엔티티를 결과 모델로 바꿉니다.<br />
Facade에서는 같은 조건으로 어떤 결과를 돌려줘야 하는지 Port 대역을 사용해 검증할 수 있습니다.

| 질문 | 확인할 위치 |
|---|---|
| 사용자에게 어느 세대까지 보여줄까 | Facade의 업무 판단 |
| 시간 범위를 어떤 조건으로 검색할까 | Adapter와 Specification |
| 어떤 값이 호출부로 돌아갈까 | Port의 결과 모델과 Facade의 응답 조립 |

기존 프로젝트에 `Service`라는 이름으로 저장 접근을 감싼 클래스가 있다면, 이름보다 실제 책임을 먼저 확인합니다.<br />
외부 API 연동도 Port로 요구 기능을 표현하고, Adapter에서 HTTP 요청과 응답을 해당 기능의 타입으로 변환할 수 있습니다.
[조회 조건 구성](/docs/knowledge/backend/repository/repository-spec-and-filter) / [Provider와 조회 분리](/docs/knowledge/backend/service/service-provider-and-cqrs)
