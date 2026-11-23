---
format: "md"
id: "spring-spring-web-controller-and-mapping"
title: "Controller와 요청 매핑"
description: "요청 경로, HTTP 메서드와 미디어 타입 조건을 설계하고 DTO를 통해 입력과 응답 계약을 표현하는 방법을 설명합니다."
slug: "/knowledge/backend/spring/spring-web/controller-and-mapping"
sidebar_position: 2
status: "active"
tags:
  - "Spring"
keywords:
  - "Controller와 요청 매핑"
  - "Spring"
  - "Spring MVC"
  - "Controller"
  - "WebFlux"
  - "Interceptor"
  - "Validation"
  - "Virtual Threads"
---
# Controller와 요청 매핑

Controller의 매핑은 경로 문자열뿐 아니라 HTTP 메서드, 소비하는 본문 형식과 반환 형식을 포함한 계약입니다.
같은 URL이라도 GET과 POST는 다른 요청으로 처리할 수 있습니다.
기본 동작을 넓게 허용하기보다 지원하는 조합을 드러냅니다.

## 클래스와 메서드의 경로를 조합합니다

```java
@RestController
@RequestMapping("/api/notices")
class NoticeController {
    private final NoticeService service;

    NoticeController(NoticeService service) { this.service = service; }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE,
                 produces = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<CreatedNotice> create(@Valid @RequestBody CreateNotice request) {
        Long id = service.create(request.title());
        return ResponseEntity.created(URI.create("/api/notices/" + id))
                .body(new CreatedNotice(id));
    }

    record CreateNotice(@NotBlank @Size(max = 100) String title) { }
    record CreatedNotice(Long id) { }
}
```

`NoticeService`의 저장 구현은 생략한 예제입니다.
중첩 DTO는 관련 계약을 같은 파일에서 읽기 위한 선택이며, 일반 클래스 DTO를 사용해도 됩니다.
생성 API의 상태와 Location 헤더는 서비스 계약에 맞춰 정합니다.

| 입력 | 애너테이션 | 예시 |
|---|---|---|
| 리소스 경로 | PathVariable | /notices/10 |
| 검색 조건 | RequestParam 또는 ModelAttribute | ?status=OPEN |
| JSON 본문 | RequestBody | 생성과 변경 DTO |
| 요청 헤더 | RequestHeader | 조건부 요청과 계약 헤더 |

## 서로 다른 오류를 구분합니다

경로가 없으면 보통 404, 경로는 있으나 지원하지 않는 메서드이면 405가 됩니다.
본문의 Content-Type을 지원하지 않으면 415, Accept 조건을 충족하지 못하면 406이 될 수 있습니다.
필터와 별도 예외 처리 정책에 따라 최종 응답은 달라질 수 있어 실제 애플리케이션에서 검증합니다.

Legacy의 [RequestMapping 메모](/docs/knowledge/k-requestmapping)는 경로 변수와 다중 경로의 출발점으로 볼 수 있습니다.
다만 삭제 동작을 GET에 연결한 예제와 잘못된 타입 표기는 현재 API 예제로 재사용하지 않습니다.
조회는 재시도나 링크 접근으로 실행될 수 있으므로 상태 변경 계약과 분리합니다.

## 단순한 진입점으로 유지합니다

Controller가 외부 API 호출과 DB 반복 조회를 직접 조합하면 HTTP 계약과 업무 흐름을 따로 시험하기 어려워집니다.
요청을 DTO로 받고 유즈케이스에 전달하는 경계를 둡니다.
Facade나 BFF의 구체적인 배치는 프로젝트 설계 기준을 따릅니다.

테스트는 정상 요청 외에도 잘못된 메서드, 본문 누락, 미디어 타입 오류와 검증 실패를 포함합니다.
메서드를 직접 호출하는 단위 테스트만으로는 이런 매핑 조건을 검증할 수 없습니다.

조건 조합과 경로 패턴은 [Request Mapping 공식 문서](https://docs.spring.io/spring-framework/reference/6.2/web/webmvc/mvc-controller/ann-requestmapping.html)를 참고합니다.

## 자주 묻는 질문

### MVC와 WebFlux는 같이 쓰나요?

보통 한 애플리케이션의 주 스택을 정합니다. 블로킹 JDBC와 WebFlux를 섞을 때는 스레드 모델을 따로 설계합니다.

### Interceptor와 Filter 차이는 무엇인가요?

Filter는 서블릿 단, Interceptor는 Spring MVC 핸들러 단에서 동작합니다.

