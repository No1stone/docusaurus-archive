---
id: controller-design
title: Controller Design
description: "예약 등록 요청이 Controller에서 DTO로 묶여 Facade 유즈케이스로 넘어가고, 응답과 테스트 경계가 어디서 갈리는지 설명합니다."
tags:
  - backend
  - api
status: active
slug: "/knowledge/backend/controller/controller-design"
---
# Controller에서 HTTP 요청을 유즈케이스로 넘기는 방법

방문 예약 등록 요청을 받는 Controller를 열었을 때, 어떤 URL이 어떤 유즈케이스를 부르는지 바로 보여야 합니다.<br />
예약할 수 있는 차량인지 판단하는 로직과 JPA 조회 조건까지 같이 들어가면, 요청 규격을 바꾸려는 사람도 저장 흐름을 읽어야 합니다.

원셋의 Controller는 요청을 바인딩하고, 공개된 애플리케이션 진입점을 호출하고, 정해진 응답 형식으로 결과를 반환합니다.

![HTTP 요청이 애플리케이션 유즈케이스로 전달되는 과정](/img/backend-design/controller-use-case.svg)

```java
@PostMapping
public CommonResponse<ReservationReceipt> reserve(@Valid @RequestBody ReserveVisit request) {
    return CommonResponseUtils.responseSuccess(reservationFacade.reserve(request));
}
```

예제는 방문 예약 요청 DTO와 공개 Facade가 준비돼 있다고 가정합니다.<br />
URL, HTTP 메서드, 바인딩 방식, 응답 형태를 Controller에서 확인할 수 있습니다.<br />
예약 가능 여부와 처리 순서는 Facade에서 판단합니다.

## 화면용 API와 도메인 API의 연결

| 진입 방식 | 원셋의 연결 예시 |
|---|---|
| 도메인 HTTP API, gRPC 수신 | 도메인 Facade 호출 |
| 화면용 HTTP API, GraphQL Resolver | BFF Facade 호출 |
| 원셋의 테이블 단위 점검 API | `ExampleItemController`의 도메인 진입 호출 |

원셋의 테이블 단위 Controller는 `@Hidden`으로 두며 기동과 기본 동작 확인에 사용할 수 있습니다.<br />
기존 원셋을 복사할 때는 단건, 목록, 일괄 저장과 삭제 같은 메서드가 누락되지 않았는지 확인합니다.<br />
제품 화면에서 여러 기능을 조합한다면 그 흐름을 공개 BFF 메서드에 둡니다.

## 실패 응답과 테스트

요청 형식이 잘못됐거나 예약 규칙에 걸리면, 해당 예외를 Controller Advice가 HTTP 상태와 본문으로 변환합니다.<br />
Controller마다 같은 오류를 변환하지 않아도 호출부가 공통 응답의 `code`, `message`, `data`를 읽을 수 있습니다.

HTTP 테스트는 경로, 바인딩, 응답 형식, 오류 상태를 확인합니다.<br />
예약 정책은 Facade 테스트에서, 실제 저장 결과는 Adapter를 포함한 테스트에서 확인합니다.
[Controller Advice와 메시지](/docs/knowledge/backend/controller/controller-advice-and-messages) / [Facade 테스트](/docs/knowledge/backend/facade/facade-testing-and-failures) / [Controller 템플릿](/docs/harness/templates/backend/spring/exampleitem/controller/) / [Spring 원셋](/docs/harness/templates/backend/spring/ONESET)

## 실제 연동 API에서는 어느 지점까지 Controller에서 볼까

Partner Gateway의 세대별 차량 조회는 `GET /parking/car`를 받아 Mopl의 `GET /partner/v1/vehicles`를 호출합니다.<br />
HT에서 받는 HTTP 헤더와 검색 입력은 Controller 경계에서 확인할 수 있고, 인증과 검색 조건, 외부 호출 흐름은 연동 유즈케이스를 따라갑니다.

| 확인할 질문 | 코드나 테스트에서 찾아볼 위치 |
|---|---|
| 어느 URL과 메서드가 요청을 받나 | Controller의 매핑 |
| 동과 호수가 빠졌을 때 Mopl을 호출하나 | 연동 유즈케이스의 입력 실패 테스트 |
| Mopl이 세대를 찾지 못하면 어떤 HT 응답을 받나 | 오류 매핑과 HTTP E2E |

HTTP 테스트에서 상태 코드만 비교하면, 입력을 거절하기 전에 외부 요청을 보낸 경우를 놓칠 수 있습니다.<br />
외부 호출이 없어야 하는 조건은 호출 횟수까지 확인하고, 정상 조건은 상대가 받은 요청과 최종 응답을 함께 봅니다.
[HTTP 오류 응답 설계](/docs/knowledge/backend/controller/advice-http-status-and-envelope)

## 참고 자료

- [Spring MVC의 애노테이션 기반 Controller](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller.html)
