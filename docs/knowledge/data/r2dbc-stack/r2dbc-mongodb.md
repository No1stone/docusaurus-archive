---
format: md
id: k-r2dbc-mongodb
title: "r2dbc mongoDb"
description: "Spring Data MongoDB 연결과 테스트용 embed mongo 의존성 메모입니다."
tags:
  - Spring
status: active
slug: /knowledge/k-r2dbc-mongodb
---
# r2dbc mongoDb

## 개요

MongoDB를 Spring에서 쓸 때 남긴 연결 설정과 테스트용 embed mongo 의존성 메모입니다.
파일 제목은 r2dbc로 되어 있으나, 본문 설정은 `spring.data.mongodb`입니다.

## 설정

```properties
spring.data.mongodb.uri=mongodb://localhost:27017/testdb1
spring.data.mongodb.database=testdb1
server.port=8012
```

## 테스트 의존성

```xml
<dependency>
    <groupId>de.flapdoodle.embed</groupId>
    <artifactId>de.flapdoodle.embed.mongo</artifactId>
    <scope>test</scope>
</dependency>
```
