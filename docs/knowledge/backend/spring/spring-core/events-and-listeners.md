---
format: "md"
id: "spring-spring-core-events-and-listeners"
title: "이벤트 발행과 리스너"
description: "ApplicationEventPublisher와 EventListener의 기본 동기 실행, 트랜잭션 이벤트 및 신뢰성 경계를 설명합니다."
slug: "/knowledge/backend/spring/spring-core/events-and-listeners"
sidebar_position: 9
status: "active"
tags:
  - "Spring"
keywords:
  - "이벤트 발행과 리스너"
  - "Spring"
  - "Spring Core"
  - "IoC"
  - "DI"
  - "Bean"
  - "ApplicationContext"
  - "AOP"
  - "의존성 주입"
---
# 이벤트 발행과 리스너

한 작업이 끝난 뒤 여러 후속 처리를 호출해야 할 때 이벤트로 연결을 느슨하게 만들 수 있습니다.
하지만 Spring 애플리케이션 이벤트를 발행했다고 메시지 브로커에 영구 저장되거나 별도 스레드에서 실행되는 것은 아닙니다.

## 기본 리스너는 같은 호출 흐름에 참여합니다

```java
record CatalogChanged(Long catalogId) { }

@Service
class CatalogEvents {
    private final ApplicationEventPublisher publisher;

    CatalogEvents(ApplicationEventPublisher publisher) {
        this.publisher = publisher;
    }

    void publish(Long id) {
        publisher.publishEvent(new CatalogChanged(id));
    }
}

@Component
class CatalogListener {
    @EventListener
    public void on(CatalogChanged event) {
        // 같은 프로세스의 후속 처리
    }
}
```

기본 이벤트 멀티캐스터와 일반 리스너는 발행자의 스레드에서 동기 실행됩니다.
리스너가 오래 걸리면 발행 호출도 지연됩니다.
리스너 예외가 호출자에게 전파될 수도 있으므로 보조 처리라고 해서 실패가 격리됐다고 가정하지 않습니다.

## 커밋 이후 실행해야 하는 경우

```java
@TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
public void afterCommit(CatalogChanged event) {
    // 커밋 성공 뒤 후속 처리
}
```

이 리스너는 이벤트가 트랜잭션 안에서 발행된 경우 해당 단계에 맞춰 실행됩니다.
기본적으로 트랜잭션이 없으면 호출되지 않습니다.
`fallbackExecution`을 켤지는 트랜잭션이 없는 호출에서도 실행해도 되는지 판단한 뒤 정합니다.

커밋 이후 리스너에서 기존 트랜잭션 자원이 보이더라도 새 변경이 자동으로 커밋되는 것은 아닙니다.
추가 DB 쓰기가 필요하면 별도 빈의 새 트랜잭션 경계를 검토합니다.
그 후속 작업의 실패가 이미 완료된 원래 커밋을 되돌리지는 못합니다.

| 요구사항 | 검토할 방식 |
|---|---|
| 같은 프로세스 안의 동기 후속 처리 | 일반 EventListener |
| 커밋 성공 이후 처리 | TransactionalEventListener |
| 요청 지연을 줄이는 비동기 처리 | Async와 실행기, 실패 수집 |
| 재시작 후에도 전달 보장 | Outbox 등 영속적 발행 기록과 전달 처리 |

## 이벤트만으로 신뢰성이 생기지는 않습니다

이벤트 발행 직후 프로세스가 종료되면 메모리에 있던 후속 작업이 사라질 수 있습니다.
`@Async`를 추가해도 영속성이 생기지는 않습니다.
결제 완료 통지나 외부 시스템 동기화처럼 누락을 복구해야 하는 작업은 재처리 기준을 별도로 둡니다.

테스트에서는 이벤트 발행 자체와 리스너의 업무 결과를 나눠 확인합니다.
커밋 이후 리스너는 테스트 메서드의 자동 롤백 때문에 호출되지 않을 수 있으므로 실제 커밋이 발생하는 경로로 검증해야 합니다.
스레드 이름, 리스너 예외, 롤백과 커밋 결과를 각각 관찰하면 경계를 확인하기 쉽습니다.

기본 이벤트 처리는 [ApplicationContext 이벤트](https://docs.spring.io/spring-framework/reference/6.2/core/beans/context-introduction.html), 커밋 단계는 [트랜잭션 이벤트](https://docs.spring.io/spring-framework/reference/6.2/data-access/transaction/event.html)를 참고합니다.

## 자주 묻는 질문

### 생성자 주입을 기본으로 두는 이유는 무엇인가요?

필수 의존성이 생성 시점에 드러나고, 테스트에서 동일 생성자로 객체를 만들기 쉽기 때문입니다.

### 같은 타입 빈이 여러 개면 어떻게 고르나요?

@Primary, @Qualifier, 이름, 컬렉션 주입으로 선택 범위를 좁힙니다.

