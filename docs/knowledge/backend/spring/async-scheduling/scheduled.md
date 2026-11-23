---
format: "md"
id: "spring-async-scheduling-scheduled"
title: "Scheduled"
description: "Scheduled의 cron, fixedRate와 fixedDelay를 비교하고 동적 등록과 시간대 및 이중화 시 실행을 설명합니다."
slug: "/knowledge/backend/spring/async-scheduling/scheduled"
sidebar_position: 2
status: "active"
tags:
  - "Spring"
keywords:
  - "Scheduled"
  - "Spring"
  - "@Async"
  - "TaskExecutor"
  - "@Scheduled"
  - "Concurrency"
  - "스케줄링"
---
# Scheduled

스케줄러는 언제 작업을 시작할지 정합니다.
작업이 한 번만 실행되거나 재시작 뒤 누락 없이 복구되는 보장까지 자동으로 제공하지는 않습니다.
먼저 시간 기준과 실행 중첩, 다중 인스턴스의 의미를 나눠 봅니다.

## 실행 기준을 선택합니다

| 설정 | 기준 | 적합한 예 |
|---|---|---|
| fixedDelay | 이전 실행 완료 뒤 간격 | 완료 후 일정 시간 쉬는 폴링 |
| fixedRate | 일정한 시작 간격 | 주기적인 상태 수집 |
| cron | 달력과 시간대 | 매주 금요일 새벽 작업 |

```java
@Configuration(proxyBeanMethods = false)
@EnableScheduling
class SchedulingConfiguration { }

@Component
class SummarySchedule {
    @Scheduled(cron = "0 0 3 * * FRI", zone = "Asia/Seoul")
    public void runWeekly() {
        // 매주 금요일 03:00 KST에 시작할 작업
    }
}
```

Spring cron은 초를 포함하는 여섯 필드를 사용합니다.
일반적인 Linux crontab의 다섯 필드와 혼동하지 않습니다.
서버 기본 시간대에 의존하지 않으려면 zone을 명시합니다.
국제화 서비스에서는 실행 시각의 시간대와 집계 대상 날짜의 시간대를 따로 정합니다.

## 실행기가 실제 실행 시점을 결정합니다

스케줄된 시간은 시작 목표입니다.
사용 가능한 스레드가 없으면 실제 시작이 늦어질 수 있습니다.
같은 태스크의 실행과 여러 스케줄 메서드의 동시 실행도 구분합니다.
`@Async`를 결합하면 원래 기다리던 실행이 위임으로 바뀌어 작업이 겹칠 수 있습니다.

Boot 자동 설정의 스케줄러와 직접 만든 TaskScheduler의 기본값은 따로 확인합니다.
가상 스레드 기반 SimpleAsyncTaskScheduler는 fixedDelay 처리 방식이 다르므로 사용하는 구현의 설명을 읽습니다.

## 런타임 등록과 취소

```java
ScheduledFuture<?> future = taskScheduler.scheduleAtFixedRate(
        task, Duration.ofSeconds(10));
// 더 이상 필요하지 않을 때
future.cancel(false);
```

Legacy의 [동적 스케줄 예제](/docs/knowledge/k-schedule)를 간단히 정리한 부분 코드입니다.
실제로는 ID별 Future를 보관하고 같은 ID 재등록 시 이전 작업을 정리해야 합니다.
`cancel(false)`는 이미 실행 중인 작업을 강제로 멈추지 않습니다.
`cancel(true)`도 인터럽트를 무시하는 코드의 강제 종료를 보장하지는 않습니다.

## 두 대면 두 번 실행됩니다

같은 앱을 두 대 띄우면 일반적인 Scheduled 작업도 각 프로세스에서 실행됩니다.
중복을 허용할지, DB 선점이나 분산 락으로 한 대만 실행할지 정합니다.
중복 방지와 장애 후 재실행은 다른 문제이며, 작업 자체의 멱등성도 필요합니다.

검증은 다음 실행 시간, 긴 작업의 지연, 중복 실행과 프로세스 재시작을 나눠 수행합니다.
스케줄 시간을 기다리기보다 작업 로직은 직접 호출하고 시간 표현식은 별도 검증합니다.

실행 모델은 [공식 스케줄링 문서](https://docs.spring.io/spring-framework/reference/6.2/integration/scheduling.html), 과거 예시는 [Scheduled 메모](/docs/knowledge/k-scheduled)를 참고합니다.

## 자주 묻는 질문

### @Async 기본 실행자는 무엇인가요?

별도 Executor를 지정하지 않으면 기본 단순 비동기 실행자를 씁니다. 운영에서는 이름 있는 TaskExecutor를 두는 편이 안전합니다.

### 스케줄 중복 실행을 막으려면?

단일 인스턴스 제한, 분산 락, 또는 스케줄러 설정의 동시 실행 정책을 확인합니다.

