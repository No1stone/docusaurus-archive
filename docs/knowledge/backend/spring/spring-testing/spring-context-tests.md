---
format: "md"
id: "spring-spring-testing-spring-context-tests"
title: "Spring Context 테스트"
description: "SpringBootTest와 작은 컨텍스트 테스트의 목적, 빈 연결과 설정 검증 및 캐시와 테스트 격리를 설명합니다."
slug: "/knowledge/backend/spring/spring-testing/spring-context-tests"
sidebar_position: 2
status: "active"
tags:
  - "Spring"
keywords:
  - "Spring Context 테스트"
  - "Spring"
  - "Spring Test"
  - "@SpringBootTest"
  - "Testcontainers"
  - "@WebMvcTest"
  - "단위 테스트"
---
# Spring Context 테스트

업무 객체를 직접 생성한 테스트는 로직을 확인하지만 실제 Spring 조립 결과까지 확인하지는 않습니다.
컨텍스트 테스트는 빈 선택, 설정 바인딩, 프록시와 자동 설정이 의도대로 연결되는지 검증합니다.
무조건 전체 서버를 띄우기보다 필요한 범위를 선택합니다.

## 기본 SpringBootTest는 실제 포트 서버가 아닙니다

```java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
class ConfigurationSmokeTest {
    @Autowired
    ApplicationContext context;

    @Test
    void hasRequiredClock() {
        assertThat(context.getBean(Clock.class)).isNotNull();
    }
}
```

애플리케이션에 Clock 빈을 등록한 경우의 예제입니다.
이런 smoke test는 기동 연결 오류를 찾지만 업무 결과와 API 계약을 충분히 검증하지는 않습니다.
외부 인프라 자동 설정도 로딩될 수 있어 테스트용 설정과 의존성을 준비해야 합니다.

| 방식 | 범위 | 확인할 목적 |
|---|---|---|
| SpringJUnitConfig | 지정한 설정 클래스 | 작은 빈 조합과 프록시 |
| ApplicationContextRunner | 구성과 속성을 코드로 선택 | 조건부 빈과 설정 바인딩 |
| SpringBootTest NONE | Boot 구성, 웹 서버 없음 | 앱의 빈 조립 |
| SpringBootTest RANDOM_PORT | 실제 웹 서버 | HTTP 호출 경계 |

## 설정 조건은 작게 시험합니다

```java
new ApplicationContextRunner()
    .withUserConfiguration(ClientConfiguration.class)
    .withPropertyValues("app.client.base-url=https://api.example.invalid",
                        "app.client.timeout=2s", "app.client.max-attempts=2")
    .run(context -> assertThat(context).hasSingleBean(ClientProperties.class));
```

[설정 속성 예제](../settings/value-and-configuration-properties.md)의 클래스가 있는 경우입니다.
빈이 하나 있는지와 각 값이 기대대로 변환됐는지를 함께 확인합니다.
잘못된 속성을 넣어 실패하는 테스트도 추가하면 검증 애너테이션 누락을 찾기 쉽습니다.

## 컨텍스트 캐시는 성능과 격리에 영향을 줍니다

Spring Test는 같은 구성의 컨텍스트를 재사용할 수 있습니다.
테스트마다 프로필, 속성과 mock 구성을 다르게 만들면 캐시 재사용이 줄어 기동 비용이 늘어납니다.
`@DirtiesContext`는 실제 컨텍스트 상태를 바꿔 재사용하면 안 되는 경우에 사용하고 테스트 정리의 기본 수단으로 남용하지 않습니다.

공유 싱글턴의 메모리 상태와 DB 데이터는 별도로 초기화합니다.
테스트에서 mock으로 바꾼 빈 때문에 실제 설정 오류가 가려지는지도 확인합니다.
프록시를 검증할 때는 컨텍스트의 빈을 호출해야 하며 대상 객체를 직접 만들면 다른 경계입니다.

검증 결과에는 실제 포트를 열었는지, DB를 연결했는지와 외부 클라이언트를 대체했는지 기록합니다.
컨텍스트가 떴다는 한 줄을 전체 시스템 연동 성공으로 표현하지 않습니다.

범위와 환경은 [Boot 애플리케이션 테스트](https://docs.spring.io/spring-boot/3.5/reference/testing/spring-boot-applications.html), 재사용은 [컨텍스트 캐시](https://docs.spring.io/spring-framework/reference/6.2/testing/testcontext-framework/ctx-management/caching.html)를 참고합니다.

## 자주 묻는 질문

### 슬라이스 테스트는 언제 쓰나요?

웹이나 JPA 등 계층만 빠르게 검증할 때 씁니다. 전체 맥락이 필요하면 @SpringBootTest로 올립니다.

### Testcontainers는 무엇에 쓰나요?

실제 DB나 브로커에 가까운 통합 검증에 사용합니다.

