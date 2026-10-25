---
format: md
id: k-flyway
title: "flyway"
description: "Spring Boot에서 Flyway로 스키마 마이그레이션을 적용하는 메모입니다."
tags:
  - Flyway
  - Spring
status: active
slug: /knowledge/k-flyway
---
# flyway

## 개요

Flyway는 `V1__description.sql` 같은 버전 스크립트를 순서대로 적용해 DB 스키마를 맞춥니다.
Spring Boot는 `spring-boot-starter-jdbc`와 함께 Flyway를 쓰면 기동 시 자동 마이그레이션할 수 있습니다.
드라이버는 대상 DB에 맞게 MySQL/MariaDB 또는 PostgreSQL JDBC를 고릅니다.

![Flyway 관련 화면 1](/img/flyway/flyway-1.png)

![MySQL, Maria JDBC 선택](/img/flyway/flyway-2.png)

![PostgreSQL 선택](/img/flyway/flyway-3.png)

## Boot 설정 예

```yaml
spring:
  flyway:
    enabled: true
    locations: classpath:db/migration
    baseline-on-migrate: true
  datasource:
    url: jdbc:postgresql://localhost:5432/app
    username: app
    password: secret
```

스크립트는 `src/main/resources/db/migration`에 두고, 버전 번호는 되돌리지 않는 것이 안전합니다.
팀에서 네이밍·리뷰·운영 DB 적용 순서를 정해 둡니다.
이미 있는 DB에 처음 붙일 때는 `baseline-on-migrate` 또는 baseline 버전을 검토합니다.

<details>
<summary>참고 자료</summary>

- [Flyway — Spring Boot](https://flywaydb.org/documentation/usage/plugins/springboot)
- [Spring Boot application properties](https://docs.spring.io/spring-boot/docs/current/reference/html/application-properties.html)
- [Flyway — configure resource providers](https://flywaydb.org/blog/configure-resource-providers)
</details>
