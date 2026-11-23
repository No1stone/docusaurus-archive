---
format: "md"
id: "spring-jdbc-ibatis-and-mybatis"
title: "iBATIS와 MyBatis"
description: "iBATIS와 MyBatis의 관계, Mapper SQL과 파라미터 바인딩 및 Spring 트랜잭션 연결을 설명합니다."
slug: "/knowledge/backend/spring/jdbc/ibatis-and-mybatis"
sidebar_position: 4
status: "active"
tags:
  - "Spring"
keywords:
  - "iBATIS와 MyBatis"
  - "Spring"
  - "Spring JDBC"
  - "DataSource"
  - "JPA"
  - "Hibernate"
  - "MyBatis"
  - "Querydsl"
  - "jOOQ"
---
# iBATIS와 MyBatis

MyBatis는 SQL과 Java 메서드, 결과 객체를 연결하는 SQL 매퍼입니다.
레거시의 iBATIS에서 이어진 계열이지만 설정과 API가 같지는 않으므로 이름만 바꿔 전환하지 않습니다.
이 글은 MyBatis 3와 MyBatis-Spring을 기준으로 설명합니다.

## Mapper가 SQL 계약을 드러냅니다

```java
@Mapper
public interface CatalogMapper {
    List<CatalogItem> findByStatus(@Param("status") String status);
}
```

```xml
<mapper namespace="example.catalog.CatalogMapper">
    <select id="findByStatus" resultType="example.catalog.CatalogItem">
        select id, name
        from catalog
        where status = #{status}
        order by id
    </select>
</mapper>
```

Java 패키지, XML namespace와 메서드 이름을 일치시킵니다.
DTO는 조회 컬럼을 받을 수 있는 생성자 또는 접근자 매핑이 구성돼 있어야 합니다.
자동 매핑이 애매하면 resultMap으로 이름과 타입을 명시합니다.
XML 예제는 본문이며 실제 파일에는 사용하는 버전의 MyBatis mapper DTD 선언도 포함합니다.

## 값 바인딩과 문자열 치환

| 표기 | 동작 | 주의점 |
|---|---|---|
| `#{value}` | PreparedStatement 파라미터로 바인딩합니다. | 일반 입력값에 사용합니다. |
| `${value}` | SQL 문자열에 직접 치환합니다. | 외부 입력을 그대로 넣으면 SQL 주입 위험이 있습니다. |

정렬 열을 바꾸기 위해 `${sort}`를 요청값 그대로 사용하지 않습니다.
서버의 허용 목록이나 XML choose 분기로 안전한 SQL 조각을 선택합니다.
동적 조건은 if, where, foreach 등을 사용할 수 있지만 조건 누락으로 전체 테이블 갱신이 되지 않도록 검증합니다.

## Spring 트랜잭션에 연결합니다

MyBatis-Spring은 Spring 트랜잭션과 연결된 SqlSession을 관리합니다.
이 환경에서 세션에 직접 commit이나 rollback을 호출하는 구조를 섞지 않습니다.
트랜잭션 매니저와 SqlSessionFactory가 같은 DataSource를 사용해야 의도한 경계에 참여합니다.

Legacy의 [다중 DB 설정](/docs/knowledge/k-config)에는 `sqlSessionFactoryRef`와 Qualifier로 대상 DB를 연결한 코드가 있습니다.
그 구조를 재사용할 때 Mapper 탐색 범위가 다른 DB의 Mapper까지 포함하지 않게 확인합니다.
하나의 기본 후보만 지정하는 것과 모든 트랜잭션의 대상이 맞는 것은 별개입니다.

Mapper 단위 테스트라도 실제 SQL 문법과 XML 로딩은 DB를 연결해 확인해야 합니다.
결과 없음, null, 여러 행, 동적 조건 없음과 갱신 건수 초과를 포함합니다.
SQL 매핑 오류와 업무 시나리오 실패를 분리하면 유지보수가 쉬워집니다.

문법은 [MyBatis Mapper XML](https://mybatis.org/mybatis-3/sqlmap-xml.html), 연결은 [MyBatis-Spring 트랜잭션](https://mybatis.org/spring/transactions.html)을 참고합니다.

## 자주 묻는 질문

### JPA와 MyBatis 중 무엇을 고르나요?

도메인 중심 영속성과 연관 매핑이면 JPA, SQL 중심 제어면 MyBatis나 JDBC 계열이 맞는 경우가 많습니다.

### 커넥션 풀은 어디에 두나요?

DataSource 설정으로 풀을 두고, 타임아웃과 최대 연결 수를 트래픽에 맞게 맞춥니다.

