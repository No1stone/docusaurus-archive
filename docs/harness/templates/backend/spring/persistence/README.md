# Persistence template

> **개요:** 엔티티, 리포지토리, 스펙입니다.

리포지토리에 파생 조회 메서드를 두지 않습니다.
단건은 `JpaRepository.findById` 입니다.
커스텀 리포지토리 본문은 비어 있습니다.
스펙은 `of(Filter)` 하나이고, `id` 다음 `ids`에 `in`, `createdAt`에 `goe` / `loe` 입니다.
`delete()` 본문은 비어 있습니다.
하드 삭제·소프트 삭제 등 저장소 정책을 채우는 확장 지점입니다.
이 예제의 `httpMethod`는 문자열입니다.
열거형으로 바꿀 때는 [enum 템플릿](../enum/)을 따릅니다.

## Files

- [`ExampleItem.java`](./ExampleItem.java)
- [`ExampleItemRepository.java`](./ExampleItemRepository.java)
- [`ExampleItemSpecs.java`](./ExampleItemSpecs.java)

## Source

### `ExampleItem.java`

```java
package com.example.template.exampleitem.entity;

import com.example.template.support.CreatedEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldNameConstants;
import org.hibernate.annotations.DynamicInsert;

import static lombok.AccessLevel.PROTECTED;

/**
 * 샘플 엔티티입니다. 클래스명 ExampleItem은 치환 토큰이고 컬럼은 샘플입니다. {@code createdAt}/{@code createdBy}는 {@link CreatedEntity} 상속.
 *
 * @see db/init/01_init.sql
 */
@Builder
@NoArgsConstructor(access = PROTECTED)
@AllArgsConstructor
@Getter
@Setter
@Entity
@FieldNameConstants
@Table(name = "le_example_item", indexes = {
        @Index(name = "ix_le_example_item_response_http_status", columnList = "response_http_status"),
        @Index(name = "ix_le_example_item_url", columnList = "url")
})
@DynamicInsert
public class ExampleItem extends CreatedEntity {

    @Id
    @Column(name = "id", updatable = false, nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "http_method", nullable = false, length = 10)
    private String httpMethod;

    @Column(name = "url", nullable = false, length = 255)
    private String url;

    @JdbcTypeCode(SqlTypes.LONGVARCHAR)
    @Column(name = "parameter")
    private String parameter;

    @JdbcTypeCode(SqlTypes.LONGVARCHAR)
    @Column(name = "payload")
    private String payload;

    @Column(name = "response_http_status", nullable = false, length = 3)
    private String responseHttpStatus;

    @JdbcTypeCode(SqlTypes.LONGVARCHAR)
    @Column(name = "response")
    private String response;

    public void delete() {
    }
}
```

### `ExampleItemRepository.java`

```java
package com.example.template.exampleitem.repository;

import com.example.template.exampleitem.entity.ExampleItem;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

/**
 * ExampleItem Repository
 */
public interface ExampleItemRepository extends JpaRepository<ExampleItem, Long>, ExampleItemCustomRepository, JpaSpecificationExecutor<ExampleItem> {
}

@Repository
interface ExampleItemCustomRepository {
}

@RequiredArgsConstructor
class ExampleItemCustomRepositoryImpl implements ExampleItemCustomRepository {
    private final JPAQueryFactory queryFactory;
}
```

### `ExampleItemSpecs.java`

```java
package com.example.template.exampleitem.spec;

import com.example.template.support.CreatedEntity;
import com.example.template.support.PredicateBuilder;
import com.example.template.exampleitem.dto.ExampleItemReq;
import com.example.template.exampleitem.entity.ExampleItem;
import org.springframework.data.jpa.domain.Specification;

public class ExampleItemSpecs {

    public static Specification<ExampleItem> of(ExampleItemReq.Filter filter) {
        return (root, query, builder) -> {

            PredicateBuilder predicateBuilder = new PredicateBuilder(builder, root);

            predicateBuilder.equal(ExampleItem.Fields.id, filter.getId());
            predicateBuilder.in(ExampleItem.Fields.id, filter.getIds());
            predicateBuilder.goe(CreatedEntity.Fields.createdAt, filter.getStartAt());
            predicateBuilder.loe(CreatedEntity.Fields.createdAt, filter.getEndAt());
            predicateBuilder.equal(ExampleItem.Fields.httpMethod, filter.getHttpMethod());
            predicateBuilder.equal(ExampleItem.Fields.url, filter.getUrl());
            predicateBuilder.equal(ExampleItem.Fields.parameter, filter.getParameter());
            predicateBuilder.equal(ExampleItem.Fields.payload, filter.getPayload());
            predicateBuilder.equal(ExampleItem.Fields.responseHttpStatus, filter.getResponseHttpStatus());
            predicateBuilder.equal(ExampleItem.Fields.response, filter.getResponse());
            return predicateBuilder.build();
        };
    }
}
```
