---
id: repository-three-interfaces
title: Repository 세 인터페이스 조립
description: JpaRepository JpaSpecificationExecutor Custom을 한 리포에 붙이는 원셋 조립을 정리합니다.
keywords:
  - JpaSpecificationExecutor
  - CustomRepository
  - 인터페이스 조립
tags:
  - backend
  - spring-data
status: active
slug: "/knowledge/backend/repository/repository-three-interfaces"
---

# Spring 원셋이 Repository를 세 인터페이스로 구성하는 이유

호출 이력을 다루다 보면 저장이나 PK 조회, 화면 검색, 화면 전용 집계가 각각 필요합니다.<br />
세 가지가 같은 엔티티를 읽더라도 조건을 표현하는 방식과 반환하는 결과가 다릅니다.

원셋의 저장소는 그 차이를 인터페이스로 드러냅니다.

```java
public interface ExampleItemRepository
        extends JpaRepository<ExampleItem, Long>,
                JpaSpecificationExecutor<ExampleItem>,
                ExampleItemCustomRepository {
}
```

| 상황 | 사용하는 인터페이스 |
|---|---|
| 호출 이력 저장, ID 한 건 조회 | `JpaRepository` |
| URL, 메서드, 기간으로 페이지 조회 | `JpaSpecificationExecutor` |
| URL별 실패 건수를 묶어 화면 전용 결과 반환 | Custom Repository의 명시적인 메서드 |

예를 들어 목록에 기간 필터를 추가하면 검색 요청의 Filter와 `Specs.of(filter)`를 함께 고칩니다.<br />
화면 전용 집계를 추가할 때는 그룹별 결과 DTO를 반환하는 메서드를 Custom 쪽에 둡니다.<br />
집계 메서드가 생기더라도 기존 목록을 읽는 경로는 그대로 사용할 수 있습니다.

Facade가 이 Repository를 직접 조율하지 않도록, 원셋은 Adapter에서 어느 저장소 메서드를 호출할지 결정합니다.<br />
Custom은 확장 예시이며 단순 조회에 빈 메서드를 추가할 이유는 없습니다.
[Spring Data 인터페이스](/docs/knowledge/backend/repository/repository-spring-data-hierarchy) / [Specification](/docs/knowledge/backend/repository/repository-spec-and-filter) / [커스텀 Repository](/docs/knowledge/backend/repository/repository-custom)

## 필터 하나와 집계 하나가 동시에 추가된다면

호출 이력 목록에 응답 상태 필터를 붙이고, 별도 화면에는 URL별 오류 건수를 보여준다고 가정합니다.<br />
상태 필터는 기존 목록의 결과 모양을 바꾸지 않습니다.<br />
같은 Filter와 Specification에 조건을 추가하면 됩니다.

집계는 결과 한 행의 의미가 달라지므로 Custom Repository의 메서드로 분리할 수 있습니다.<br />
목록 테스트는 상태별 기록의 포함 여부를, 집계 테스트는 그룹과 건수를 확인합니다.<br />
두 기능을 같은 저장소에 두더라도 통과 조건을 나누면 어디가 바뀌었는지 읽기 쉽습니다.
