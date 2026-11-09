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

# Spring Data Repository 계층

> **개요:** 스프링 데이터가 주는 인터페이스 계단입니다.
> 원셋은 `JpaRepository`를 고릅니다.

```mermaid
flowchart TD
  r[Repository]
  crud[CrudRepository]
  page[PagingAndSortingRepository]
  jpa[JpaRepository]
  r --> crud
  crud --> page
  page --> jpa
```

| 인터페이스 | 여는 것 |
|------------|---------|
| `Repository` | 마커·쿼리 메서드 기반 |
| `CrudRepository` | save, findById, delete, … |
| `PagingAndSortingRepository` | Pageable·Sort |
| `JpaRepository` | JPA flush, batch, `List` 반환 등 |

원셋 ExampleItem은 `JpaRepository` + Spec + Custom을 함께 붙입니다 → [세 인터페이스](/docs/knowledge/backend/repository/repository-three-interfaces).

---

## 관련

- [커스텀 리포](/docs/knowledge/backend/repository/repository-custom)
