---
format: md
id: k-schedule
title: "Schedule"
description: "Spring TaskScheduler로 스케줄을 런타임에 등록하고 취소하는 메모입니다."
tags:
  - Spring
status: active
slug: /knowledge/k-schedule
---
# Schedule

## 개요

고정 cron만으로는 부족한 경우, `TaskScheduler`가 돌려 준 `ScheduledFuture`를 Map에 보관했다가 `cancel`하면 동적 등록·중단이 됩니다.
원본 메모의 “이중화 Schedule” 키워드는 클러스터 이중화 자체를 다루지 않습니다.
인스턴스마다 스케줄이 겹치면 분산 락이나 리더 선출을 별도로 둡니다.
선언적 주기 작업은 [＠Scheduled](/docs/knowledge/k-scheduled)를 봅니다.

## 동적 등록과 취소

```java
@Service
public class SchedulerService {
    private final Map<String, ScheduledFuture<?>> scheduledTasks = new ConcurrentHashMap<>();
    private final TaskScheduler taskScheduler;

    public void register(String scheduleId) {
        ScheduledFuture<?> task = taskScheduler.scheduleAtFixedRate(
                () -> { /* 주기 작업 */ },
                Duration.ofSeconds(2));
        scheduledTasks.put(scheduleId, task);
    }

    public void remove(String scheduleId) {
        ScheduledFuture<?> future = scheduledTasks.remove(scheduleId);
        if (future != null) {
            future.cancel(true);
        }
    }
}
```

## period 예외 완화

`ThreadPoolTaskScheduler`는 주기가 0 이하일 때 실행 중 예외로 이어질 수 있습니다.
비활성 주기를 표현하려면 커스텀 스케줄러에서 `period <= 0`이면 등록하지 않거나 `null`을 반환하도록 막는 방법이 있습니다.

<details>
<summary>참고 자료</summary>

- [[SpringBoot] Scheduler 동적으로 사용/중단하기](https://m.blog.naver.com/adamdoha/222056799681)
</details>
