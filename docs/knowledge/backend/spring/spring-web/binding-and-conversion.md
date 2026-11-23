---
format: "md"
id: "spring-spring-web-binding-and-conversion"
title: "요청 바인딩과 응답 변환"
description: "쿼리 문자열과 JSON 바인딩의 차이, Converter와 Formatter 및 과도한 필드 바인딩 방지를 설명합니다."
slug: "/knowledge/backend/spring/spring-web/binding-and-conversion"
sidebar_position: 3
status: "active"
tags:
  - "Spring"
keywords:
  - "요청 바인딩과 응답 변환"
  - "Spring"
  - "Spring MVC"
  - "Controller"
  - "WebFlux"
  - "Interceptor"
  - "Validation"
  - "Virtual Threads"
---
# 요청 바인딩과 응답 변환

HTTP 입력은 문자열과 바이트로 전달되지만 Controller에서는 숫자, 날짜와 DTO로 사용합니다.
이 변환은 요청 위치에 따라 경로가 다릅니다.
쿼리 파라미터 변환기를 추가했다고 JSON 본문의 변환까지 같은 방식으로 바뀌지는 않습니다.

## 검색 조건을 DTO로 모읍니다

```java
public class CatalogSearch {
    private String keyword;
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate from;
    @Min(1) @Max(100)
    private int size = 20;
    // 표준 getter와 setter를 구현합니다.
}

@GetMapping
List<CatalogItem> search(@Valid @ModelAttribute CatalogSearch search) {
    return service.search(search);
}
```

표준 접근자와 서비스 구현을 생략한 부분 예제입니다.
`?from=2026-01-01&size=10`을 검색 객체로 모읍니다.
엔티티를 직접 받으면 사용자가 변경하면 안 되는 필드까지 바인딩될 수 있으므로 전용 요청 DTO를 둡니다.

## 변환 경로를 나눠 봅니다

| 입력 위치 | 대표 처리 경로 |
|---|---|
| 경로와 쿼리 | ConversionService와 Formatter |
| 폼 객체 | WebDataBinder와 검증 |
| JSON 본문 | HttpMessageConverter와 JSON 매퍼 |

```java
class CatalogStatusConverter implements Converter<String, CatalogStatus> {
    public CatalogStatus convert(String source) {
        return CatalogStatus.valueOf(source.toUpperCase(Locale.ROOT));
    }
}
```

직접 만든 enum 변환기 예제입니다.
`WebMvcConfigurer.addFormatters` 등으로 등록하고, 지원하지 않는 값과 대소문자 정책을 테스트합니다.
공통코드의 저장 값이 enum 이름과 다르면 `valueOf` 대신 명시적인 코드 조회를 사용합니다.
변환 실패를 조용히 기본 상태로 바꾸면 잘못된 요청이 정상 조회로 실행될 수 있습니다.

## 바인딩과 검증의 순서

문자열을 날짜로 바꾸지 못하면 먼저 변환 오류가 발생합니다.
변환에 성공한 뒤에도 시작일이 종료일보다 뒤라면 조합 검증이 필요합니다.
타입 변환, 단일 필드 제약과 업무 정책을 한 처리기에 모두 섞지 않습니다.

`@InitBinder`로 허용 필드를 제한할 수 있지만, 가장 먼저 요청 DTO에 필요한 필드만 두는 방법을 검토합니다.
JSON 입력의 알려지지 않은 필드 허용 여부는 JSON 매퍼 정책과 함께 확인합니다.

확인은 정상 날짜, 잘못된 날짜, 빈 문자열, 누락, 지원하지 않는 코드와 최대 페이지 크기를 포함합니다.
DTO 객체를 직접 만들어 서비스에 넘기는 테스트와 실제 요청 바인딩 테스트를 나누면 실패 지점을 찾기 쉽습니다.

변환은 [Type Conversion](https://docs.spring.io/spring-framework/reference/6.2/core/validation/convert.html), 허용 필드는 [InitBinder](https://docs.spring.io/spring-framework/reference/6.2/web/webmvc/mvc-controller/ann-initbinder.html)를 참고합니다.

## 자주 묻는 질문

### MVC와 WebFlux는 같이 쓰나요?

보통 한 애플리케이션의 주 스택을 정합니다. 블로킹 JDBC와 WebFlux를 섞을 때는 스레드 모델을 따로 설계합니다.

### Interceptor와 Filter 차이는 무엇인가요?

Filter는 서블릿 단, Interceptor는 Spring MVC 핸들러 단에서 동작합니다.

