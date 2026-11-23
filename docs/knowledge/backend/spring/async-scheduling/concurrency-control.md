---
format: "md"
id: "spring-async-scheduling-concurrency-control"
title: "동시 실행과 중복 실행 제어"
description: "스레드 풀과 분산 실행의 동시성 제어를 구분하고 락, DB 선점, 멱등성과 종료 복구의 관계를 설명합니다."
slug: "/knowledge/backend/spring/async-scheduling/concurrency-control"
sidebar_position: 3
status: "active"
tags:
  - "Spring"
keywords:
  - "동시 실행과 중복 실행 제어"
  - "Spring"
  - "@Async"
  - "TaskExecutor"
  - "@Scheduled"
  - "Concurrency"
  - "스케줄링"
---
# 동시 실행과 중복 실행 제어

서버 안의 동시 실행과 여러 서버 사이의 중복 실행은 다른 문제입니다.
스레드 풀을 하나로 제한해도 같은 앱이 두 대면 각각 실행됩니다.
반대로 분산 락을 사용해도 DB 정합성을 자동으로 보장하지는 않습니다.

## 제어할 범위를 먼저 정합니다

| 범위 | 예시 수단 | 한계 |
|---|---|---|
| 객체 내부 | synchronized, Lock | 다른 프로세스에는 적용되지 않습니다. |
| 프로세스 자원 | Executor와 Semaphore | 재시작 후 상태가 사라집니다. |
| 여러 인스턴스 | 분산 락, DB 선점 | 만료와 장애 복구를 설계해야 합니다. |
| 데이터 정합성 | 유니크, version, 조건부 갱신 | 업무 재시도 정책이 필요합니다. |

```java
private final Semaphore permits = new Semaphore(5);

public void invokePartner() {
    if (!permits.tryAcquire()) {
        throw new IllegalStateException("partner concurrency exceeded");
    }
    try {
        client.invoke();
    } finally {
        permits.release();
    }
}
```

동기 호출 한 프로세스에서 최대 다섯 개를 허용하는 부분 예제입니다.
호출이 비동기로 반환된다면 실제 완료 전에 permit을 반환하지 않도록 완료 경계에 맞춰야 합니다.
앱 두 대에서는 합쳐서 열 개가 될 수 있습니다.

## 락 획득과 업무 성공을 구분합니다

분산 락에는 획득 대기 시간과 보유 시간이 있습니다.
대기를 0으로 하면 경합 시 빠르게 포기할 수 있지만 작업을 누가 나중에 처리할지도 정해야 합니다.
보유 시간보다 작업이 길어지거나 갱신이 끊기면 다른 작업자가 같은 자원을 처리할 수 있습니다.

```mermaid
flowchart LR
    Receive[요청] --> Claim[작업 선점]
    Claim --> Execute[업무 실행]
    Execute --> Commit[정합성 확인과 커밋]
    Commit --> Finish[완료 기록과 해제]
```

락은 경합과 중복 시도를 줄이는 데 도움이 되지만 마지막 쓰기 단계의 정합성 수단을 대체하지 않습니다.
필요하면 fencing token, version이나 조건부 갱신으로 오래된 작업자의 쓰기를 거절합니다.
네트워크 단절 뒤 락 소유권이 여전히 유효한지 생각해야 합니다.

## 작업 테이블로 선점하는 경우

대기 상태를 실행 상태로 바꾸는 조건부 UPDATE의 영향받은 행 수로 선점을 판단할 수 있습니다.
하지만 선점 직후 프로세스가 죽으면 실행 상태가 남습니다.
만료 시간, heartbeat, 재선점과 최대 시도 횟수를 정해야 합니다.
작업 큐로 사용하는 테이블의 인덱스와 보관 정책도 필요합니다.

테스트는 성공 한 건만 보지 않고 경합, 처리 중 종료, 락 만료와 재처리를 포함합니다.
같은 결과를 두 번 적용해도 안전한지와 작업이 영원히 실행 중으로 남지 않는지 확인합니다.

프로세스 실행기는 [Spring 스케줄링](https://docs.spring.io/spring-framework/reference/6.2/integration/scheduling.html), 기본 동시성 도구는 [Java Semaphore](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/concurrent/Semaphore.html)를 참고합니다.

## 자주 묻는 질문

### @Async 기본 실행자는 무엇인가요?

별도 Executor를 지정하지 않으면 기본 단순 비동기 실행자를 씁니다. 운영에서는 이름 있는 TaskExecutor를 두는 편이 안전합니다.

### 스케줄 중복 실행을 막으려면?

단일 인스턴스 제한, 분산 락, 또는 스케줄러 설정의 동시 실행 정책을 확인합니다.

