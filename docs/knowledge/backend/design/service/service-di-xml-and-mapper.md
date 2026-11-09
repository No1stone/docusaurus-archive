---
id: service-di-xml-and-mapper
title: Service — XML·매퍼 주입
description: XML bean과 MyBatis mapper를 Service에 넣던 시절에서 어노테이션·JPA Repository 주입으로 온 흐름을 정리합니다.
tags:
  - backend
  - spring
  - di
status: active
slug: "/knowledge/backend/service/service-di-xml-and-mapper"
---

# XML에서 Service와 매퍼를 연결하던 방식

예전 Spring 프로젝트에서 방문 예약을 조회하는 코드를 찾으면, 서비스의 메서드 호출만으로 어떤 SQL이 실행되는지 바로 보이지 않는 경우가 있었습니다.<br />
빈 설정에서 어떤 매퍼가 주입되는지 확인한 뒤 매퍼 인터페이스와 SQL 파일로 이동했습니다.

```xml
<bean id="reservationService" class="example.ReservationService">
    <constructor-arg ref="reservationMapper"/>
</bean>
```

이 코드는 `reservationMapper` 빈이 이미 등록돼 있다고 가정합니다.<br />
MyBatis에서는 매퍼 스캔으로 해당 인터페이스의 프록시를 등록할 수 있습니다.<br />
Spring의 조립 설정과 MyBatis의 SQL 매핑 파일은 역할이 다릅니다.

## 같은 조회를 원셋에서 찾는 위치

| 찾는 정보 | XML 매퍼를 사용하는 경우 | JPA 원셋 |
|---|---|---|
| 조회를 호출하는 곳 | Service의 매퍼 메서드 호출 | JPA Adapter의 Repository 호출 |
| 조회 조건 | SQL 매퍼 또는 매퍼 애노테이션 | `Specs.of(filter)` 또는 Custom 구현 |
| 어떤 구현을 사용하는지 | Spring XML 또는 매퍼 스캔 | 생성자 주입과 빈 구성 |

복잡한 SQL을 직접 읽는 장점은 JPA로 옮긴 뒤에도 남길 수 있습니다.<br />
집계나 전용 조회가 커지면 Custom Repository에서 쿼리를 명시하고, Facade의 업무 흐름은 그대로 둡니다.
[DI 방식 비교](/docs/knowledge/backend/service/service-di-evolution) / [Custom Repository](/docs/knowledge/backend/repository/repository-custom)

## 참고 자료

- [MyBatis-Spring의 매퍼 등록](https://mybatis.org/spring/mappers.html)
