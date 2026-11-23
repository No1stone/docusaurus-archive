---
format: "md"
id: "spring-spring-core-bean-registration-and-component-scan"
title: "Bean 등록과 컴포넌트 스캔"
description: "Component Scan과 Bean 등록의 차이, 탐색 범위, 충돌 및 외부 모듈 등록 실패를 예제로 설명합니다."
slug: "/knowledge/backend/spring/spring-core/bean-registration-and-component-scan"
sidebar_position: 3
status: "active"
tags:
  - "Spring"
keywords:
  - "Bean 등록과 컴포넌트 스캔"
  - "Spring"
  - "Spring Core"
  - "IoC"
  - "DI"
  - "Bean"
  - "ApplicationContext"
  - "AOP"
  - "의존성 주입"
---
# Bean 등록과 컴포넌트 스캔

서비스 클래스가 존재하는 것과 Spring이 그 클래스를 빈으로 발견하는 것은 다릅니다.
멀티 모듈에서 클래스는 컴파일되는데 주입이 실패한다면 의존성 누락과 탐색 범위를 나눠 확인해야 합니다.

## 등록 방법을 구분합니다

| 방법 | 적합한 대상 | 결정하는 위치 |
|---|---|---|
| `@Component`, `@Service` | 직접 관리하는 애플리케이션 클래스 | 클래스와 스캔 설정 |
| `@Bean` | 외부 라이브러리 객체와 명시적 조립 | 설정 클래스 |
| `@Import` | 필요한 설정이나 컴포넌트의 명시적 포함 | 사용하는 애플리케이션 |

`@Service`는 업무 계층을 표현하는 스테레오타입입니다.
그 애너테이션 하나가 트랜잭션이나 원격 호출을 자동으로 만들어 주지는 않습니다.

```java
package example.catalog;

@SpringBootApplication
public class CatalogApplication {
    public static void main(String[] args) {
        SpringApplication.run(CatalogApplication.class, args);
    }
}
```

기본 컴포넌트 스캔은 이 클래스의 패키지 아래를 대상으로 합니다.
`example.catalog.service`는 포함되지만 형제인 `example.shared`는 기본 범위 밖입니다.
기본 패키지에 실행 클래스를 놓고 모든 의존성을 광범위하게 스캔하는 방식은 피합니다.

## 모듈을 가져오는 방법

```java
@Configuration(proxyBeanMethods = false)
class SharedClientConfiguration {
    @Bean
    Clock applicationClock() {
        return Clock.systemUTC();
    }
}

@Configuration(proxyBeanMethods = false)
@Import(SharedClientConfiguration.class)
class CatalogConfiguration { }
```

공통 기능을 사용할 앱에서 명시적으로 가져오면 등록 경로를 찾기 쉽습니다.
컴포넌트 스캔이 필요하다면 문자열보다 마커 클래스를 사용할 수도 있습니다.

```java
@ComponentScan(basePackageClasses = {CatalogMarker.class, SharedMarker.class})
```

이 코드는 스캔 선언의 부분 예제입니다.
사용하는 구성에 따라 Boot 기본 스캔과 중복되지 않게 배치합니다.
JPA 엔티티 스캔과 Repository 스캔은 컴포넌트 스캔과 동일한 기능이 아니므로 별도로 확인합니다.

## 빈 이름과 타입 충돌

기본 이름은 일반적으로 클래스명이나 `@Bean` 메서드명에서 나옵니다.
다른 패키지에 이름이 같은 컴포넌트가 있으면 충돌할 수 있습니다.
이를 해결하려고 빈 덮어쓰기를 허용하면 의도하지 않은 구현이 선택될 가능성이 있습니다.
역할이 다른 빈에는 이름을 주고 주입 지점에서 선택을 명확하게 합니다.

클래스가 발견되지 않는 경우에는 런타임 의존성 포함, 패키지 경로, 조건부 설정을 차례로 봅니다.
등록은 됐는데 주입이 안 되는 경우에는 타입, Qualifier, 후보 개수를 봅니다.
기동 로그에 나온 마지막 예외만 읽기보다 어떤 의존성이 어떤 후보를 요구했는지 연결해서 확인합니다.

작은 컨텍스트 테스트에서 `containsBean`과 `getBeansOfType`으로 등록 결과를 확인할 수 있습니다.
단, 운영 코드에서 조회를 늘리기 위한 용도와는 구분합니다.

스캔 필터와 기본 스테레오타입은 [클래스패스 스캔 공식 문서](https://docs.spring.io/spring-framework/reference/6.2/core/beans/classpath-scanning.html)를 참고합니다.

## 자주 묻는 질문

### 생성자 주입을 기본으로 두는 이유는 무엇인가요?

필수 의존성이 생성 시점에 드러나고, 테스트에서 동일 생성자로 객체를 만들기 쉽기 때문입니다.

### 같은 타입 빈이 여러 개면 어떻게 고르나요?

@Primary, @Qualifier, 이름, 컬렉션 주입으로 선택 범위를 좁힙니다.

