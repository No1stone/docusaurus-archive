---
id: service-port-adapter-role
title: Service — Port와 Adapter 역할
description: "예약 조회 Port와 JPA Adapter를 나누면 조건·매핑이 어디에 남는지 설명합니다. 레거시 *Service 이름과의 차이도 짚습니다."
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

## 저장소를 바꾸지 않아도 경계가 도움이 되는 순간

Partner Gateway는 DB 조회 대신 Mopl Partner API를 호출하는 경로가 있습니다.<br />
세대별 차량 조회에서 HT가 보낸 `dong`과 `ho`를 Mopl의 `building`과 `unit`으로 바꿉니다.<br />
연동 유즈케이스는 인증과 입력을 먼저 확인하고, 변환된 요청을 외부 호출 경계로 넘깁니다.

예를 들어 Mopl API의 HTTP 클라이언트 설정이 달라지면 외부 호출 쪽을 봅니다.<br />
반면 인증 실패 때 호출을 생략할지, 세대 조회가 어떤 오류로 끝날지는 연동 유즈케이스와 오류 매핑에서 확인합니다.

| 바꾸려는 동작 | 검증할 내용 |
|---|---|
| Mopl 요청 형식이 변경됨 | 외부 서버로 나간 메서드, 경로, 쿼리 |
| HT 입력 검증을 보강함 | 거절하는 조건과 외부 호출 횟수 0회 |
| Mopl 오류에 대한 HT 매핑이 바뀜 | 같은 외부 오류를 받았을 때 반환하는 HTTP 상태와 결과 코드 |

이는 실제 Partner Gateway의 조회 경로를 역할별로 정리한 사례입니다.<br />
모든 호출 경로에서 같은 패키지나 클래스 이름을 쓴다는 의미는 아닙니다.
[Spring RestClient의 응답 오류 처리](https://docs.spring.io/spring-framework/reference/integration/rest-clients.html)
