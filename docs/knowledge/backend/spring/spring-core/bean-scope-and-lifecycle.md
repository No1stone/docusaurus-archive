---
format: "md"
id: "spring-spring-core-bean-scope-and-lifecycle"
title: "Bean Scope와 생명주기"
description: "싱글턴과 요청 스코프의 수명, prototype의 정리 책임, PostConstruct와 PreDestroy의 실행 범위를 설명합니다."
slug: "/knowledge/backend/spring/spring-core/bean-scope-and-lifecycle"
sidebar_position: 5
status: "active"
tags:
  - "Spring"
keywords:
  - "Bean Scope와 생명주기"
  - "Spring"
  - "Spring Core"
  - "IoC"
  - "DI"
  - "Bean"
  - "ApplicationContext"
  - "AOP"
  - "의존성 주입"
---
# Bean Scope와 생명주기

빈 스코프는 객체를 몇 개 만들고 어떤 범위에서 재사용할지 정합니다.
생명주기 콜백은 그 객체가 준비되거나 종료될 때 필요한 작업을 수행합니다.
둘을 함께 이해해야 요청 데이터가 공유되거나 자원이 정리되지 않는 문제를 피할 수 있습니다.

## 싱글턴은 상태 공유도 함께 만듭니다

| 스코프 | 재사용 범위 | 주의점 |
|---|---|---|
| singleton | 컨테이너의 해당 빈 정의 | 여러 요청이 같은 필드에 접근할 수 있습니다. |
| prototype | 컨테이너에 생성 요청할 때마다 | 생성 이후 정리를 호출자가 관리합니다. |
| request | HTTP 요청 | 웹 컨텍스트와 요청 범위가 필요합니다. |
| session | HTTP 세션 | 메모리 사용량과 세션 수명을 고려합니다. |

기본 싱글턴 서비스의 필드에 현재 사용자 ID나 요청 DTO를 저장하면 다른 요청과 섞일 수 있습니다.
요청 정보는 매개변수나 적절한 요청 컨텍스트로 전달합니다.
상태 없는 서비스도 공유 자원에 접근할 수 있으므로 싱글턴이라는 사실만으로 스레드 안전성이 보장되지는 않습니다.

## 생성 뒤 초기화, 종료 전 정리

```java
@Component
class LocalRegistry {
    private final Map<String, String> entries = new ConcurrentHashMap<>();

    @jakarta.annotation.PostConstruct
    void initialize() {
        entries.put("default", "ready");
    }

    @jakarta.annotation.PreDestroy
    void clear() {
        entries.clear();
    }
}
```

Spring Boot 3와 Framework 6 계열에서는 Jakarta 패키지를 사용합니다.
초기화 콜백은 주입 뒤 실행되지만, 이 시점의 메서드 호출에 트랜잭션 프록시가 적용된다고 기대해서는 안 됩니다.
별도 트랜잭션 빈이나 시작 단계 처리가 필요한 작업은 목적에 맞는 경계로 분리합니다.

`@PreDestroy`는 정상적인 컨텍스트 종료 경로에서 수행됩니다.
강제 종료나 프로세스 손상에서도 반드시 실행되는 보장은 없습니다.
또한 정리 콜백이 끝났다고 JVM이 그 객체의 메모리를 즉시 반환하는 것은 아닙니다.
Legacy의 [초기화와 폐기 메모](/docs/knowledge/k-postconstruct-predestroy-초기화-폐기)는 이 구분을 보완해서 읽습니다.

## prototype을 주입하면 매번 새 객체일까요

싱글턴 생성자에 prototype을 한 번 주입하면 그때 받은 객체를 계속 보유합니다.
매 호출마다 새 객체가 필요하다면 `ObjectProvider.getObject()` 또는 스코프 프록시 같은 별도 조회 방식이 필요합니다.
prototype 빈의 파괴 콜백은 컨테이너가 일반 싱글턴처럼 추적해서 자동 호출하지 않습니다.

```mermaid
flowchart LR
    Create[객체 생성] --> Inject[의존성 주입]
    Inject --> Init[초기화 콜백]
    Init --> Use[사용]
    Use --> Destroy[관리 범위 종료와 정리]
```

이 흐름은 관리되는 빈의 개념적인 순서입니다.
후처리기와 프록시 생성 등 세부 과정이 추가되며, 모든 스코프가 같은 종료 처리를 갖지는 않습니다.

테스트에서는 같은 빈을 두 번 조회해 인스턴스를 비교하고, 별도 컨텍스트를 만들었을 때는 다른 객체임을 확인합니다.
종료 콜백은 `close()`를 호출하는 테스트로 확인하되 강제 종료 복구까지 증명한 것으로 기록하지 않습니다.

지원 스코프는 [Bean Scopes](https://docs.spring.io/spring-framework/reference/6.2/core/beans/factory-scopes.html), 콜백은 [라이프사이클](https://docs.spring.io/spring-framework/reference/6.2/core/beans/factory-nature.html)을 참고합니다.

## 자주 묻는 질문

### 생성자 주입을 기본으로 두는 이유는 무엇인가요?

필수 의존성이 생성 시점에 드러나고, 테스트에서 동일 생성자로 객체를 만들기 쉽기 때문입니다.

### 같은 타입 빈이 여러 개면 어떻게 고르나요?

@Primary, @Qualifier, 이름, 컬렉션 주입으로 선택 범위를 좁힙니다.

