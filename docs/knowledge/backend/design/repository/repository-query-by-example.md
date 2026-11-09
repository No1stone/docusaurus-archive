---
id: repository-query-by-example
title: Repository — Query by Example
description: URL과 HTTP 메서드 검색을 예로 Query by Example의 매칭과 적용 범위를 설명합니다.
tags:
  - backend
  - spring-data
  - jpa
status: active
slug: "/knowledge/backend/repository/repository-query-by-example"
---

# Query by Example, 채운 필드만 검색 조건으로 쓰기

호출 이력 화면에서 URL을 정확히 아는 운영자가 기록을 찾는다고 가정합니다.<br />
URL만 채우면 그 URL을 검색하고, 메서드도 채우면 두 조건을 모두 적용합니다.

Query by Example에서는 이런 조건을 **값이 들어 있는 예시 객체**로 표현합니다.<br />
Spring Data는 예시 객체와 매칭 규칙을 보고 쿼리를 만듭니다.

## 예시 객체에서 조회 조건이 만들어지는 과정

```java
ExampleItem probe = new ExampleItem();
probe.setUrl("/api/reservations");
probe.setHttpMethod("GET");

ExampleMatcher matcher = ExampleMatcher.matchingAll()
    .withIgnoreNullValues()
    .withIgnorePaths("id")
    .withMatcher("url", ExampleMatcher.GenericPropertyMatchers.exact());

Example<ExampleItem> example = Example.of(probe, matcher);
Page<ExampleItem> result = repository.findAll(example, pageable);
```

여기서는 설명을 위해 수정 가능한 프로브를 가정했습니다.<br />
실제 원셋에 QBE를 도입한다면 Adapter에서 예시 객체를 만드는 코드가 필요합니다.

| 구성 요소 | 예제에서 맡는 일 |
|---|---|
| Probe | URL과 HTTP 메서드에 어떤 값을 찾는지 표현 |
| `ExampleMatcher` | 모든 조건을 만족해야 하는지, 어떤 필드를 무시할지 결정 |
| `Example` | Probe와 매칭 규칙을 묶어 Repository에 전달 |
| `QueryByExampleExecutor` | 예시와 일치하는 결과 조회. `JpaRepository`에 포함 |

프로브를 만들 때 초기값을 확인해야 합니다.<br />
원시 타입 `boolean`의 기본값은 `false`라서 값을 직접 넣지 않아도 조건으로 포함될 수 있습니다.<br />
검색에 관여시키지 않을 필드는 `withIgnorePaths`로 명시합니다.

## 발생 기간이나 ID 목록이 들어오면

같은 화면에 **오늘 발생한 기록**을 찾는 조건이 추가됐다고 가정합니다.<br />
시작 시각과 종료 시각을 두 값으로 받은 뒤 범위 조건을 만들어야 합니다.<br />
선택한 기록만 다시 읽는 화면이라면 `id IN (...)`도 필요합니다.

QBE는 값 일치나 문자열 패턴이 중심일 때 간결합니다.<br />
기간 범위, ID 목록, 괄호를 포함한 조건 조합은 Specification으로 표현하기 쉽습니다.

| 요구사항 | 표현하기 쉬운 도구 |
|---|---|
| URL 정확히 일치, 메서드 일치 | QBE의 프로브와 매처 |
| 발생 시각 범위, ID 목록 | Specification의 범위 조건과 `in` |
| 여러 테이블을 조인해 화면 전용 결과 구성 | QueryDSL 또는 SQL을 사용하는 별도 조회 구현 |

원셋에서는 화면 입력을 Filter로 받고, 조회 조건은 `Specs.of(filter)`에서 만듭니다.<br />
현재 목록은 날짜 구간과 ID 목록까지 다루므로 이 방식이 적용돼 있습니다.<br />
동등 비교가 대부분인 작은 검색에서 QBE를 검토하더라도, 프로브는 HTTP 요청 객체와 분리해 저장 접근 경계에서 구성합니다.
[Specification과 Filter](/docs/knowledge/backend/repository/repository-spec-and-filter) / [쿼리 메서드](/docs/knowledge/backend/repository/repository-query-methods)

## 기본값이 검색 조건으로 들어가는 경우

실패 여부를 나타내는 원시 `boolean` 필드가 있는 호출 이력 엔티티를 가정합니다.<br />
URL만 검색하려고 프로브를 만들었는데 `failed`를 무시하지 않으면 기본값인 `false`가 검색에 포함될 수 있습니다.

```java
ExampleMatcher matcher = ExampleMatcher.matchingAll()
    .withIgnorePaths("id", "failed");
```

같은 URL의 성공 로그와 실패 로그를 한 건씩 넣고, URL만 검색했을 때 둘 다 나오는지 확인합니다.<br />
이후 실패 로그만 보겠다는 입력을 별도로 추가하려면 입력의 생략과 `false`가 구별되도록 타입과 매처를 정합니다.

## 참고 자료

- [Spring Data JPA Query by Example의 매처와 제한](https://docs.spring.io/spring-data/jpa/reference/repositories/query-by-example.html)
