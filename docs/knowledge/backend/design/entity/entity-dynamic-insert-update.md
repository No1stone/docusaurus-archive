---
id: entity-dynamic-insert-update
title: DynamicInsert와 DynamicUpdate
description: Hibernate DynamicInsert와 DynamicUpdate가 SQL 컬럼과 DB 기본값에 미치는 영향을 설명합니다.
tags:
  - backend
  - jpa
status: active
slug: "/knowledge/backend/entity/entity-dynamic-insert-update"
---

# Hibernate DynamicInsert와 DynamicUpdate, SQL에서 빠지는 컬럼

호출 이력을 등록할 때 DB의 `DEFAULT 'PENDING'`으로 초기 상태를 채우고 싶다고 가정합니다.<br />
애플리케이션의 상태 필드가 `null`이라도, SQL이 컬럼을 포함하는지에 따라 DB의 결과는 달라집니다.

```sql
-- 상태 컬럼 생략, DB의 DEFAULT 적용
INSERT INTO example_item (url) VALUES ('/api/reservations');

-- 상태 컬럼에 NULL 명시
INSERT INTO example_item (url, status) VALUES ('/api/reservations', NULL);
```

두 번째 INSERT에서 컬럼이 `NOT NULL`이라면 DB가 거절할 수 있습니다.<br />
기본값을 쓰려면 DDL에 기본값을 정의하고, 해당 컬럼을 생략하는 INSERT가 나가는지 확인해야 합니다.

## INSERT에서 null인 필드 생략

Hibernate의 `@DynamicInsert`는 삽입할 때 필요한 컬럼으로 SQL을 만듭니다.<br />
예를 들어 nullable 필드가 아직 설정되지 않은 엔티티를 저장하면, 그 컬럼을 생략해 DB의 기본값을 적용할 수 있습니다.

```java
@Entity
@DynamicInsert
class ExampleItem {
    @Id
    private Long id;

    private String url;
    private String status;
}
```

매핑만 보여주는 예제입니다.<br />
DB에서 채운 기본값이 같은 Java 객체에 언제 보이는지도 따로 봐야 합니다.<br />
저장 직후 그 값이 필요하다면 생성값 매핑을 검토하거나, 다시 조회해서 실제 저장값을 확인합니다.

## UPDATE에서 변경 컬럼만 포함

`@DynamicUpdate`는 변경된 컬럼을 중심으로 UPDATE를 만듭니다.<br />
예를 들어 URL만 변경하면 일반적인 Hibernate 설정에서 URL 외의 수정 가능한 컬럼도 SQL에 포함될 수 있지만, 동적 UPDATE는 변경 컬럼을 중심으로 SQL을 생성합니다.

| 옵션 | 효과 | 확인할 점 |
|---|---|---|
| `@DynamicInsert` | INSERT에서 값이 없는 컬럼 생략 | DB 기본값과 저장 후 읽는 시점 |
| `@DynamicUpdate` | UPDATE에 변경된 컬럼 중심으로 포함 | SQL 형태 증가, 배치에 미치는 영향, 동시 수정 정책 |

두 애노테이션은 Hibernate 기능입니다.<br />
변경 컬럼이 적다고 해서 항상 성능이 좋아지는 것은 아니므로 SQL 형태와 실제 처리량을 보고 선택합니다.<br />
낙관적 동시성은 버전 필드와 함께 검토합니다.
[더티 체킹](/docs/knowledge/backend/entity/entity-dirty-checking) / [JPA 버전과 잠금](/docs/knowledge/backend/repository/repository-locking)

## 참고 자료

- [Hibernate ORM의 매핑 애노테이션 설명](https://docs.hibernate.org/orm/5.1/userguide/html_single/appendices/Annotations.html)
