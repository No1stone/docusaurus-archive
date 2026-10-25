---
format: md
id: k-log4jdbc
title: "Log4Jdbc"
description: "Log4Jdbc"
tags:
  - AWS
  - HTTP
  - Spring
status: active
slug: /knowledge/k-log4jdbc
---
# Log4Jdbc

## 개요

Log4Jdbc에 대한 메모입니다.

log4jdbc.log4j2.properties
logback.xml
Lazy proxy

## Querydsl 설정

팜프로(partner-gateway)와 부트베이스 api-auth 모두 `JPAQueryFactory` 빈을 둡니다.

```java
@Configuration
public class QuerydslConfig {
    @PersistenceContext
    private EntityManager entityManager;

    @Bean
    public JPAQueryFactory jpaQueryFactory() {
        return new JPAQueryFactory(entityManager);
    }
}
```

![log4jdbc-1.png](/img/log4jdbc/log4jdbc-1.png)
![log4jdbc-2.png](/img/log4jdbc/log4jdbc-2.png)

## 예제·코드

```xml
<!-- Log4j -->
<dependency>
    <groupId>org.bgee.log4jdbc-log4j2</groupId>
    <artifactId>log4jdbc-log4j2-jdbc4</artifactId>
    <version>1.16</version>
</dependency>
```

```xml
log4jdbc.spylogdelegator.name=net.sf.log4jdbc.log.slf4j.Slf4jSpyLogDelegator
log4jdbc.dump.sql.maxlinelength=0
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
	<appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
		<encoder>
			<pattern>%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] %-3level %logger{5} - %msg %n</pattern>
		</encoder>
	</appender>

	<logger name="jdbc" level="OFF" />
	<logger name="jdbc.sqlonly" level="OFF" />
	<logger name="jdbc.sqltiming" level="DEBUG" />
	<logger name="jdbc.audit" level="OFF" />
	<logger name="jdbc.resultset" level="OFF" />
	<logger name="jdbc.resultsettable" level="DEBUG" />
	<logger name="jdbc.connection" level="OFF" />

	<root level="INFO">
		<appender-ref ref="STDOUT" />
	</root>

</configuration>
```

<details>
<summary>참고 자료</summary>

- [https://log4jdbc.brunorozendo.com/](https://log4jdbc.brunorozendo.com/)
- [https://stackoverflow.com/questions/35709219/configuration-jooq-in-jhipster](https://stackoverflow.com/questions/35709219/configuration-jooq-in-jhipster)
</details>
