---
format: "md"
id: "spring-spring-core-java-config-and-xml"
title: "Java Config와 XML 설정"
description: "XML과 Java Config의 조립 표현을 비교하고 proxyBeanMethods 및 ImportResource를 이용한 점진 전환을 설명합니다."
slug: "/knowledge/backend/spring/spring-core/java-config-and-xml"
sidebar_position: 7
status: "active"
tags:
  - "Spring"
keywords:
  - "Java Config와 XML 설정"
  - "Spring"
  - "Spring Core"
  - "IoC"
  - "DI"
  - "Bean"
  - "ApplicationContext"
  - "AOP"
  - "의존성 주입"
---
# Java Config와 XML 설정

XML과 Java Config는 객체를 조립하는 설정 방식입니다.
설정 문법이 달라도 컨테이너에 빈 정의를 등록한다는 목적은 같습니다.
레거시 XML을 본다고 곧바로 모든 업무 코드를 다시 작성해야 하는 것은 아닙니다.

## 같은 연결을 두 방식으로 표현합니다

```xml
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
       https://www.springframework.org/schema/beans/spring-beans.xsd">
    <bean id="clock" class="java.time.Clock" factory-method="systemUTC"/>
</beans>
```

```java
@Configuration(proxyBeanMethods = false)
class TimeConfiguration {
    @Bean
    Clock clock() {
        return Clock.systemUTC();
    }
}
```

위 예제는 시스템 UTC 시계를 등록합니다.
고정 시계로 교체하면 시간 기반 업무 코드를 재현하기 쉬워집니다.
설정을 Java로 표현하면 타입과 메서드 참조를 IDE가 추적할 수 있고, XML에서는 외부 설정 중심으로 연결을 볼 수 있습니다.

## Bean 메서드 호출은 설정에 따라 달라집니다

`@Configuration`의 기본 프록시 모드에서는 같은 설정 객체의 `@Bean` 메서드 호출도 컨테이너의 빈 참조로 처리됩니다.
`proxyBeanMethods = false`에서는 해당 메서드를 직접 호출하면 일반 Java 호출입니다.
아래처럼 매개변수로 의존성을 받으면 메서드 간 직접 호출에 의존하지 않을 수 있습니다.

```java
@Bean
ReportClock reportClock(Clock clock) {
    return new ReportClock(clock);
}
```

`ReportClock`은 Clock을 보관하는 예제 클래스입니다.
경량 설정 모드에서 `new`를 감싼 메서드를 여러 번 호출하면 객체도 여러 번 생성될 수 있습니다.
설정 프록시와 업무 AOP 프록시는 목적이 다르므로 같은 의미로 설명하지 않습니다.

## XML을 남기면서 옮기는 방법

```java
@Configuration(proxyBeanMethods = false)
@ImportResource("classpath:legacy-clients.xml")
class LegacyBridgeConfiguration { }
```

Java 설정에서 XML을 읽어 기존 기능을 유지할 수 있습니다.
다만 같은 빈을 XML과 컴포넌트 스캔 양쪽에서 등록하지 않도록 확인합니다.
별칭, 기본 후보, 초기화 메서드와 종료 메서드도 전환 대상입니다.

| 전환 전 확인 | 이유 |
|---|---|
| 빈 이름과 별칭 | 문자열로 참조하는 기존 코드가 있을 수 있습니다. |
| scope와 lazy 설정 | 생성 시점과 수명이 바뀔 수 있습니다. |
| init와 destroy 설정 | 자원 준비 및 종료 동작이 누락될 수 있습니다. |
| 참조 관계 | 설정을 옮겨도 같은 구현이 연결돼야 합니다. |

Legacy의 [다중 DataSource 설정](/docs/knowledge/k-config)은 빈 이름과 Qualifier로 연결을 명시한 사례입니다.
이를 옮길 때는 DataSource만이 아니라 SqlSessionFactory와 MapperScan의 연결까지 한 묶음으로 확인합니다.

검증은 XML을 지웠는지보다 같은 빈과 의존성이 유지되는지에 초점을 맞춥니다.
새 컨텍스트를 띄우고 이름별 타입과 대표 호출 결과를 비교하면 연결 누락을 찾기 쉽습니다.

설정 모드의 차이는 [Java 기반 설정](https://docs.spring.io/spring-framework/reference/6.2/core/beans/java/basic-concepts.html)과 [설정 조합](https://docs.spring.io/spring-framework/reference/6.2/core/beans/java/composing-configuration-classes.html)을 참고합니다.

## 자주 묻는 질문

### 생성자 주입을 기본으로 두는 이유는 무엇인가요?

필수 의존성이 생성 시점에 드러나고, 테스트에서 동일 생성자로 객체를 만들기 쉽기 때문입니다.

### 같은 타입 빈이 여러 개면 어떻게 고르나요?

@Primary, @Qualifier, 이름, 컬렉션 주입으로 선택 범위를 좁힙니다.

