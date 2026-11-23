---
format: "md"
id: "spring-spring-core-dependency-injection"
title: "의존성 주입과 주입 대상 선택"
description: "생성자, 필드, 설정 메서드 주입의 차이와 Primary, Qualifier, 컬렉션 및 Provider를 이용한 빈 선택을 설명합니다."
slug: "/knowledge/backend/spring/spring-core/dependency-injection"
sidebar_position: 4
status: "active"
tags:
  - "Spring"
keywords:
  - "의존성 주입과 주입 대상 선택"
  - "Spring"
  - "Spring Core"
  - "IoC"
  - "DI"
  - "Bean"
  - "ApplicationContext"
  - "AOP"
  - "의존성 주입"
---
# 의존성 주입과 주입 대상 선택

주입 방식은 문법 취향만의 문제가 아닙니다.
필수 의존성을 언제 확보하는지, 테스트에서 어떻게 객체를 만드는지, 같은 타입의 구현이 여러 개일 때 무엇을 선택하는지가 달라집니다.

## 필수 의존성은 생성자에서 드러냅니다

```java
@Service
class DeliveryService {
    private final DeliveryClient client;

    DeliveryService(@Qualifier("partnerDeliveryClient") DeliveryClient client) {
        this.client = client;
    }
}
```

Spring Framework 4.3 이후에는 생성자가 하나뿐이면 `@Autowired`를 생략할 수 있습니다.
생성자를 통해 필수 의존성을 받은 객체는 필드가 비어 있는 중간 상태로 사용되기 어렵습니다.
테스트도 동일한 생성자를 호출할 수 있습니다.

| 방식 | 특징 | 고려할 점 |
|---|---|---|
| 생성자 | 생성 시 의존성을 받습니다. | 순환 의존성이 구조 문제로 드러납니다. |
| 설정 메서드 | 생성 뒤 값을 전달합니다. | 호출 전 상태와 교체 가능성을 고려합니다. |
| 필드 | 컨테이너가 필드에 값을 넣습니다. | 직접 생성한 테스트 객체에는 자동 주입되지 않습니다. |

설정 메서드가 언제나 잘못된 것은 아닙니다.
선택적인 협력 객체나 프레임워크 확장 지점에서는 의미가 있습니다.
필수 의존성인지, 나중에 바뀌어도 되는 값인지 먼저 판단합니다.

## 같은 타입이 둘 이상인 경우

`@Primary`는 단일 주입 지점에서 기본 후보를 정하고, `@Qualifier`는 해당 지점의 후보를 좁힙니다.
서로 다른 클라이언트가 우연히 같은 타입이라는 이유로 자동 선택되게 두지 않습니다.

```java
@Bean
@Primary
DeliveryClient defaultClient() { return new DefaultDeliveryClient(); }

@Bean("partnerDeliveryClient")
DeliveryClient partnerClient() { return new PartnerDeliveryClient(); }
```

위 구현 클래스는 예제용이며 실제 전송 코드는 생략했습니다.
`List<DeliveryClient>`로 주입하면 후보 전체를 받을 수 있습니다.
이때 `@Primary`는 목록을 한 개로 제한하지 않습니다.
플러그인 목록을 구성한다면 순서와 선택 정책까지 정의해야 합니다.

## 선택과 지연은 별개입니다

```java
@Component
class ReportService {
    private final ObjectProvider<ReportExporter> exporters;

    ReportService(ObjectProvider<ReportExporter> exporters) {
        this.exporters = exporters;
    }

    void export() {
        ReportExporter exporter = exporters.getIfAvailable();
        if (exporter != null) exporter.export();
    }
}
```

`ObjectProvider`는 조회 시점에 후보를 구하는 통로입니다.
선택 빈이 없을 때의 처리를 표현할 수 있지만, 후보가 여러 개인 모호성까지 무조건 해결하지는 않습니다.
호출할 때마다 새 객체가 필요한 경우에도 스코프와 함께 검토합니다.
싱글턴을 Provider로 조회한다고 매번 새 인스턴스가 생기지는 않습니다.

## 순환 참조를 발견했을 때

A의 생성자에 B가 필요하고 B의 생성자에 A가 필요하다면 조립 순서를 정할 수 없습니다.
`@Lazy`로 기동을 우회하기 전에 두 객체가 같은 책임을 나눠 가진 것은 아닌지 살펴봅니다.
공통 판단을 세 번째 객체로 옮기거나, 상위 유즈케이스가 두 기능을 조합하도록 바꾸는 방법을 검토합니다.

확인은 두 단계로 나눕니다.
직접 생성한 단위 테스트에서는 업무 동작을, 작은 컨텍스트 테스트에서는 후보 선택을 확인합니다.
필수 후보 누락, 후보 두 개, 명시적 Qualifier 적용을 각각 시험하면 설정 오류를 재현하기 쉽습니다.

자세한 선택 규칙은 [Autowired 사용](https://docs.spring.io/spring-framework/reference/6.2/core/beans/annotation-config/autowired.html)과 [Qualifier](https://docs.spring.io/spring-framework/reference/6.2/core/beans/annotation-config/autowired-qualifiers.html)를 참고합니다.

## 자주 묻는 질문

### 생성자 주입을 기본으로 두는 이유는 무엇인가요?

필수 의존성이 생성 시점에 드러나고, 테스트에서 동일 생성자로 객체를 만들기 쉽기 때문입니다.

### 같은 타입 빈이 여러 개면 어떻게 고르나요?

@Primary, @Qualifier, 이름, 컬렉션 주입으로 선택 범위를 좁힙니다.

