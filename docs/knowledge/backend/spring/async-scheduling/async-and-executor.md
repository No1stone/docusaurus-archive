---
format: "md"
id: "spring-async-scheduling-async-and-executor"
title: "Async와 Executor"
description: "Async의 프록시 실행, 실행기와 큐의 한도, 예외 수집 및 스레드 컨텍스트 전파를 설명합니다."
slug: "/knowledge/backend/spring/async-scheduling/async-and-executor"
sidebar_position: 1
status: "active"
tags:
  - "Spring"
keywords:
  - "Async와 Executor"
  - "Spring"
  - "@Async"
  - "TaskExecutor"
  - "@Scheduled"
  - "Concurrency"
  - "스케줄링"
---
# Async와 Executor

`@Async`는 메서드 실행을 실행기에 위임하는 기능입니다.
요청이 빨리 반환될 수 있지만, 처리 자체가 사라지거나 영속적인 큐에 저장되는 것은 아닙니다.
작업이 어디에서 대기하고 실패가 어디로 전달되는지 함께 설계합니다.

## 실행기를 명시합니다

```java
@Configuration(proxyBeanMethods = false)
@EnableAsync
class AsyncConfiguration {
    @Bean("noticeExecutor")
    ThreadPoolTaskExecutor noticeExecutor() {
        var executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(2);
        executor.setMaxPoolSize(4);
        executor.setQueueCapacity(50);
        executor.setThreadNamePrefix("notice-");
        return executor;
    }
}
```

```java
@Service
class NoticeWorker {
    @Async("noticeExecutor")
    public CompletableFuture<String> send(String message) {
        return CompletableFuture.completedFuture(message);
    }
}
```

전송 구현 대신 결과만 돌려주는 실행 모델 예제입니다.
컨테이너가 관리하는 ThreadPoolTaskExecutor는 생명주기에서 초기화합니다.
별도 빈을 외부에서 호출해야 기본 프록시 방식의 Async가 적용됩니다.
자기 호출이나 직접 생성한 객체는 별도로 확인합니다.

## 큐가 있으면 최대 스레드를 바로 만들지 않습니다

ThreadPoolTaskExecutor는 코어 스레드가 찬 뒤 큐에 넣고, 큐까지 찼을 때 최대 스레드 확장을 시도합니다.
큐가 무제한이면 최대 스레드 수를 크게 잡아도 기대대로 확장되지 않을 수 있습니다.
큐 길이와 작업 크기를 함께 고려합니다.

| 설정 및 상황 | 처리할 문제 |
|---|---|
| 작업 유입이 처리량보다 큼 | 큐 증가와 지연 |
| 큐와 최대 스레드가 모두 참 | 거절 정책과 호출자 응답 |
| void 메서드의 예외 | AsyncUncaughtExceptionHandler 또는 별도 실패 기록 |
| Future 결과의 예외 | 호출자가 결과를 확인하는 경로 |

## 요청 컨텍스트는 자동 전달되지 않습니다

호출자의 트랜잭션은 일반적인 새 스레드 작업으로 전파되지 않습니다.
MDC, 인증 정보와 감사용 사용자 ID도 전파 방식을 확인해야 합니다.
필요한 값을 명시적인 작업 데이터로 넘기거나 TaskDecorator 등 목적에 맞는 전달 수단을 사용합니다.
사용이 끝나면 스레드 로컬 값을 정리합니다.

메서드가 Future를 반환해도 호출자가 즉시 join하면 요청 경로는 다시 기다리게 됩니다.
응답을 먼저 보낼 경우에는 접수와 완료를 구분할 상태 조회 또는 통지 계약이 필요합니다.
프로세스가 종료되면 메모리 큐의 작업은 유실될 수 있으므로 중요한 처리는 영속 큐나 작업 테이블을 검토합니다.

검증은 정상 결과, 예외, 큐 포화와 종료 중 작업을 나눠 수행합니다.
임의 sleep으로 완료를 추정하기보다 Future, latch나 제한 시간이 있는 조건 대기를 사용합니다.

프록시와 실행기 정책은 [Spring Task Execution 문서](https://docs.spring.io/spring-framework/reference/6.2/integration/scheduling.html)를 참고합니다.

## 자주 묻는 질문

### @Async 기본 실행자는 무엇인가요?

별도 Executor를 지정하지 않으면 기본 단순 비동기 실행자를 씁니다. 운영에서는 이름 있는 TaskExecutor를 두는 편이 안전합니다.

### 스케줄 중복 실행을 막으려면?

단일 인스턴스 제한, 분산 락, 또는 스케줄러 설정의 동시 실행 정책을 확인합니다.

