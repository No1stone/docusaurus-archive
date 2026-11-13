---
id: repository-custom
title: 커스텀 Repository
description: "집계처럼 Spec만으로 부족한 조회를 CustomRepository와 Impl에 붙이는 방법을 설명합니다. QueryDSL 자리와도 이어집니다."
keywords:
  - CustomRepository
  - Impl
  - 집계 쿼리
tags:
  - backend
  - spring-data
status: active
slug: "/knowledge/backend/repository/repository-custom"
---
# Spring Data JPA Custom Repository에 집계 조회 붙이기

호출 이력의 단건 조회나 필터 목록은 Spring Data JPA가 제공하는 메서드로 처리할 수 있습니다.<br />
URL별 실패 건수를 그룹으로 묶어 보여주는 화면이라면, 반환 타입과 조회 흐름을 직접 정의하는 편이 읽기 쉽습니다.

## 메서드를 정의하고 구현을 붙입니다

```java
interface ExampleItemCustomRepository {
    List<FailureCount> countFailures(Instant from, Instant to);
}
```

`ExampleItemCustomRepositoryImpl`에서 이 인터페이스를 구현하고, `ExampleItemRepository`가 프래그먼트 인터페이스를 상속합니다.<br />
Spring Data가 Repository 프록시에 해당 구현을 합성하므로 호출부는 같은 저장소에서 메서드를 사용할 수 있습니다.

```text
ExampleItemAdapter
  → ExampleItemRepository.countFailures
  → ExampleItemCustomRepositoryImpl
  → 그룹별 건수 쿼리 실행
```

구현 이름의 기본 접미사는 `Impl`입니다.<br />
프래그먼트 인터페이스의 이름을 기준으로 이름을 붙이고, 검색 위치와 기존 호스트 설정도 확인합니다.

## 조회 경로를 분리하는 기준

검색 조건 몇 개를 조합하는 목록은 기존 Specification에 조건을 추가하는 것으로 충분할 수 있습니다.<br />
그룹 집계나 별도 프로젝션처럼 결과 모양부터 달라지면 전용 메서드를 만들고, 그 구현 안에서 JPQL이나 QueryDSL을 선택합니다.
[QueryDSL로 커스텀 조회 구현하기](/docs/knowledge/backend/repository/repository-querydsl-custom) / [세 인터페이스 구성](/docs/knowledge/backend/repository/repository-three-interfaces)

## 집계 결과의 단위를 메서드에 드러내기

URL별 실패 건수 조회에서 화면이 필요한 것은 개별 호출 로그가 아니라 URL과 건수입니다.<br />
예를 들어 동일한 URL에 실패가 4건, 다른 URL에 2건 있다면 결과는 호출 이력 6행이 아니라 그룹 2행입니다.

```java
record FailureCount(String url, long count) {}
```

프래그먼트의 반환 타입이 이 결과를 표현하면 호출부가 엔티티를 다시 순회해 그룹을 만들 필요가 줄어듭니다.<br />
테스트에는 성공 응답과 기간 밖 로그를 섞고, 두 경우가 집계에서 제외되는지 확인합니다.<br />
페이지가 필요하면 총건수가 그룹 수인지도 별도로 확인합니다.

## 참고 자료

- [Spring Data JPA의 Repository 프래그먼트](https://docs.spring.io/spring-data/jpa/reference/repositories/custom-implementations.html)
