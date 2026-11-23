---
format: "md"
id: "spring-spring-core-bean-factory-and-application-context"
title: "BeanFactory와 ApplicationContext"
description: "BeanFactory와 ApplicationContext의 관계, 빈 정의와 실제 인스턴스, 컨텍스트 계층 및 종료의 의미를 설명합니다."
slug: "/knowledge/backend/spring/spring-core/bean-factory-and-application-context"
sidebar_position: 2
status: "active"
tags:
  - "Spring"
keywords:
  - "BeanFactory와 ApplicationContext"
  - "Spring"
  - "Spring Core"
  - "IoC"
  - "DI"
  - "Bean"
  - "ApplicationContext"
  - "AOP"
  - "의존성 주입"
---
# BeanFactory와 ApplicationContext

Spring의 빈은 컨테이너가 관리하는 객체입니다.
클래스에 애너테이션이 붙어 있다는 사실만으로 관리가 시작되지는 않습니다.
스캔이나 설정으로 빈 정의가 등록되고 컨텍스트가 그 정의를 처리해야 합니다.

## 정의, 생성, 조회를 구분합니다

| 용어 | 의미 |
|---|---|
| BeanDefinition | 어떤 타입을 어떤 이름과 스코프로 만들지 설명하는 메타데이터입니다. |
| BeanFactory | 빈 생성과 조회, 의존성 연결의 기본 계약입니다. |
| ApplicationContext | BeanFactory 기능에 이벤트, 메시지, 리소스 처리 등을 더한 컨테이너입니다. |

일반적인 Spring 애플리케이션에서는 `ApplicationContext`를 사용합니다.
기본 BeanFactory를 직접 구성하는 경우에는 후처리기 등록과 초기화 방법까지 직접 고려해야 합니다.
따라서 두 컨테이너의 차이를 단순히 가벼움과 무거움으로만 고르기는 어렵습니다.

## 작은 컨텍스트로 생명주기를 관찰합니다

```java
@Configuration(proxyBeanMethods = false)
class SampleConfig {
    @Bean
    String serviceName() {
        System.out.println("creating serviceName");
        return "catalog";
    }
}

try (var context = new AnnotationConfigApplicationContext(SampleConfig.class)) {
    String first = context.getBean("serviceName", String.class);
    String second = context.getBean("serviceName", String.class);
    System.out.println(first == second);
}
```

이 예에서는 컨텍스트 초기화 중 싱글턴이 생성되고 두 조회는 같은 객체를 반환합니다.
단, 지연 초기화나 다른 스코프를 지정하면 생성 시점과 인스턴스 수가 달라집니다.
기본 BeanFactory가 모든 빈을 즉시 만든다고 일반화해서는 안 됩니다.

```mermaid
flowchart LR
    Definition[빈 정의 등록] --> Refresh[컨텍스트 refresh]
    Refresh --> Process[후처리와 객체 연결]
    Process --> Ready[조회와 실행]
    Ready --> Close[컨텍스트 종료]
```

## 부모와 자식 컨텍스트

컨텍스트는 계층을 가질 수 있습니다.
자식은 부모의 빈을 조회할 수 있지만 부모가 자식의 빈을 자동으로 조회하는 구조는 아닙니다.
전통적인 Servlet 구성에서 루트 컨텍스트와 DispatcherServlet 컨텍스트를 나눴던 이유를 이해할 때 도움이 됩니다.
Boot 애플리케이션에 같은 구조를 무조건 복제할 필요는 없습니다.

동일 클래스가 서로 다른 컨텍스트에 등록되면 각 컨텍스트가 별도 인스턴스를 가질 수 있습니다.
따라서 Spring 싱글턴은 JVM 전체에서 유일하다는 의미가 아닙니다.
테스트 컨텍스트가 달라져서 초기화 로그가 반복되는 현상도 이런 관점에서 봅니다.

## 조회보다 조립에 집중합니다

모든 서비스가 ApplicationContext를 주입받고 필요한 객체를 직접 찾으면 컨테이너 의존성이 업무 코드로 퍼집니다.
일반적인 협력 관계는 생성자로 표현하고, 컨테이너 조회는 확장 기능을 조립하는 경계에 제한하는 편이 추적하기 쉽습니다.

예제를 실행할 때 생성 로그가 첫 조회 이전에 나타나는지 확인합니다.
이후 `@Lazy`를 적용하고 로그 시점을 비교하면 빈 정의 등록과 객체 생성의 차이를 관찰할 수 있습니다.
종료 콜백은 컨텍스트를 닫을 때 호출되며, 객체 메모리를 즉시 회수한다는 뜻은 아닙니다.

컨테이너 기능은 [BeanFactory와 ApplicationContext](https://docs.spring.io/spring-framework/reference/6.2/core/beans/beanfactory.html), 계층과 확장 기능은 [ApplicationContext 기능](https://docs.spring.io/spring-framework/reference/6.2/core/beans/context-introduction.html)을 참고합니다.

## 자주 묻는 질문

### 생성자 주입을 기본으로 두는 이유는 무엇인가요?

필수 의존성이 생성 시점에 드러나고, 테스트에서 동일 생성자로 객체를 만들기 쉽기 때문입니다.

### 같은 타입 빈이 여러 개면 어떻게 고르나요?

@Primary, @Qualifier, 이름, 컬렉션 주입으로 선택 범위를 좁힙니다.

