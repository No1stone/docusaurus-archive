# Persistence template

> **개요:** 엔티티, 리포지토리, 스펙입니다.

리포지토리에 파생 조회 메서드를 두지 않습니다.
단건은 `JpaRepository.findById` 입니다.
커스텀 리포지토리 본문은 비어 있습니다.
스펙은 `of(Filter)` 하나이고, `id` 다음 `ids`에 `in`, `createdAt`에 `goe` / `loe` 입니다.
`delete()` 본문은 비어 있습니다.
소프트 삭제 컬럼이 생기기 전에는 물리 삭제를 넣지 않습니다.
이 예제의 `httpMethod`는 문자열입니다.
열거형으로 바꿀 때는 [enum 템플릿](../enum/)을 따릅니다.

## Files

- [`RestOutLog.java`](./RestOutLog.java)
- [`RestOutLogRepository.java`](./RestOutLogRepository.java)
- [`RestOutLogSpecs.java`](./RestOutLogSpecs.java)

## Source

### `RestOutLog.java`

```java
package com.example.template.restoutlog.entity;

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
 * REST outbound 호출 로그. {@code createdAt}/{@code createdBy}는 {@link CreatedEntity} 상속.
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
@Table(name = "le_rest_out_log", indexes = {
        @Index(name = "ix_le_rest_out_log_response_http_status", columnList = "response_http_status"),
        @Index(name = "ix_le_rest_out_log_url", columnList = "url")
})
@DynamicInsert
public class RestOutLog extends CreatedEntity {

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

### `RestOutLogRepository.java`

```java
package com.example.template.restoutlog.repository;

import com.example.template.restoutlog.entity.RestOutLog;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

/**
 * RestOutLog Repository
 */
public interface RestOutLogRepository extends JpaRepository<RestOutLog, Long>, RestOutLogCustomRepository, JpaSpecificationExecutor<RestOutLog> {
}

@Repository
interface RestOutLogCustomRepository {
}

@RequiredArgsConstructor
class RestOutLogCustomRepositoryImpl implements RestOutLogCustomRepository {
    private final JPAQueryFactory queryFactory;
}
```

### `RestOutLogSpecs.java`

```java
package com.example.template.restoutlog.spec;

import com.example.template.support.CreatedEntity;
import com.example.template.support.PredicateBuilder;
import com.example.template.restoutlog.dto.RestOutLogReq;
import com.example.template.restoutlog.entity.RestOutLog;
import org.springframework.data.jpa.domain.Specification;

public class RestOutLogSpecs {

    public static Specification<RestOutLog> of(RestOutLogReq.Filter filter) {
        return (root, query, builder) -> {

            PredicateBuilder predicateBuilder = new PredicateBuilder(builder, root);

            predicateBuilder.equal(RestOutLog.Fields.id, filter.getId());
            predicateBuilder.in(RestOutLog.Fields.id, filter.getIds());
            predicateBuilder.goe(CreatedEntity.Fields.createdAt, filter.getStartAt());
            predicateBuilder.loe(CreatedEntity.Fields.createdAt, filter.getEndAt());
            predicateBuilder.equal(RestOutLog.Fields.httpMethod, filter.getHttpMethod());
            predicateBuilder.equal(RestOutLog.Fields.url, filter.getUrl());
            predicateBuilder.equal(RestOutLog.Fields.parameter, filter.getParameter());
            predicateBuilder.equal(RestOutLog.Fields.payload, filter.getPayload());
            predicateBuilder.equal(RestOutLog.Fields.responseHttpStatus, filter.getResponseHttpStatus());
            predicateBuilder.equal(RestOutLog.Fields.response, filter.getResponse());
            return predicateBuilder.build();
        };
    }
}
```
