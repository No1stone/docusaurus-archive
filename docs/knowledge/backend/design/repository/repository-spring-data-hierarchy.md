---
id: repository-spring-data-hierarchy
title: Spring Data Repository 계층
description: Repository CrudRepository PagingAndSortingRepository JpaRepository 상속과 원셋 선택을 정리합니다.
tags:
  - backend
  - spring-data
status: active
slug: "/knowledge/backend/repository/repository-spring-data-hierarchy"
---

# Spring Data Repository 인터페이스, 무엇을 상속하면 될까

호출 이력 저장소에 저장과 단건 조회만 필요한 경우부터 생각해 봅니다.<br />
화면에서 목록을 페이지로 읽기 시작하면 정렬과 페이지 기능이 추가로 필요합니다.<br />
JPA로 작업한다면 flush나 일괄 삭제처럼 JPA 저장소 전용 메서드도 만날 수 있습니다.

| 인터페이스 | 제공하는 기능 |
|---|---|
| `Repository<T, ID>` | 관리할 엔티티와 식별자 타입을 표현하는 기반 |
| `CrudRepository<T, ID>` | 저장, 단건 조회, 존재 확인, 삭제 |
| `PagingAndSortingRepository<T, ID>` | `Sort`와 `Pageable`을 받는 조회 |
| `JpaRepository<T, ID>` | CRUD와 페이지 기능에 JPA의 flush와 배치 메서드 추가 |

Spring Data 3.0부터 정렬 Repository는 CRUD Repository를 상속하지 않습니다.<br />
범용 인터페이스에서 두 기능이 모두 필요하면 둘을 함께 상속합니다.<br />
`JpaRepository`는 해당 기능을 이미 묶어서 제공합니다.

```java
interface ExampleItemRepository extends JpaRepository<ExampleItem, Long> {
}
```

이 선언으로 `findById`, `save`, `findAll(Pageable)` 등을 쓸 수 있습니다.<br />
화면 입력에 따라 WHERE 조건을 만들려면 원셋에서처럼 `JpaSpecificationExecutor`를 추가합니다.<br />
각 상속이 해결하는 문제는 [Repository를 구성하는 세 인터페이스](/docs/knowledge/backend/repository/repository-three-interfaces)에서 이어집니다.

## 참고 자료

- [Spring Data Repository 인터페이스 정의](https://docs.spring.io/spring-data/jpa/reference/data-commons/repositories/definition.html)
