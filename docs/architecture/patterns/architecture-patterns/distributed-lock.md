---
id: pattern-distributed-lock
title: 분산 락
description: Redis·Redisson으로 여러 인스턴스의 동시 작업 경합을 줄이는 패턴. Outbox·Inbox와 역할을 구분합니다.
tags:
  - patterns
  - Redis
  - Spring
status: active
slug: /patterns/architecture-patterns/distributed-lock
---
# 분산 락

> **개요:** 분산 락은 여러 프로세스나 인스턴스가 같은 임계 구역에 동시에 들어가지 않도록 짧게 排他합니다.
> 메시지 유실 방지(Outbox)나 수신 중복 제거(Inbox)를 대체하지 않습니다.

## 적용 상황

- 스케줄러·배치가 여러 노드에서 떠 있어도 한 번에 한 워커만 같은 작업을 돌리고 싶을 때
- 같은 리소스 ID에 대한 갱신을 짧게 직렬화하고 싶을 때

쓰지 않는 편이 나은 경우:

- 긴 업무 트랜잭션 전체를 락으로 감싸는 경우 (장애 시 락 장기 점유)
- “락을 잡았으니 이벤트가 한 번만 간다”고 가정하는 경우

참조 저장소(`boot-base`, `partner-gateway`)에서는 Redisson 분산 락 사용 코드를 확인하지 못했습니다.
아래는 설명용 예제입니다.

## 동작 흐름

```text
작업 시작
  → tryLock(key, wait, lease)
  → 성공 시 임계 작업 수행
  → finally 에서 unlock (소유한 경우만)
  → 실패 시 건너뛰거나 짧게 재시도
```

lease(자동 만료)를 두면 프로세스가 죽어도 락이 영구히 남지 않게 할 수 있습니다.
만료보다 작업이 길면 다른 워커가 들어갈 수 있으므로, watchdog 연장이나 작업 시간 설계가 필요합니다.

## 설명용 예제 (Redis·Redisson)

예제 가정: Spring Boot 3.x, Java 17, Redisson.
실행 검증한 프로젝트 코드가 아닙니다.

```java
@Component
@RequiredArgsConstructor
public class ReportJob {

    private final RedissonClient redisson;

    public void runDaily() {
        RLock lock = redisson.getLock("lock:report:daily");
        boolean acquired = false;
        try {
            acquired = lock.tryLock(1, 30, TimeUnit.SECONDS);
            if (!acquired) {
                return; // 다른 인스턴스가 수행 중
            }
            generateReport();
        } catch (InterruptedException interrupted) {
            Thread.currentThread().interrupt();
        } finally {
            if (acquired && lock.isHeldByCurrentThread()) {
                lock.unlock();
            }
        }
    }

    private void generateReport() {
        // 임계 작업
    }
}
```

Spring Data Redis의 `SET key value NX EX seconds`만으로도 단순한 락을 만들 수 있습니다.
소유권 토큰 없이 unlock하면 다른 인스턴스의 락을 지울 위험이 있습니다.

## Outbox·Inbox와의 구분

| 관심사 | 분산 락 | Outbox | Inbox |
|--------|---------|--------|-------|
| 동시 실행 제한 | 주 목적 | 아님 | 아님 |
| DB와 브로커 원자성 | 보장하지 않음 | 주 목적 | 아님 |
| 수신 중복 | 보장하지 않음 | 아님 | 주 목적 |

락으로 전달 워커를 하나만 켜도, 프로세스 재시작·타임아웃·at-least-once 재전달이 있으면 중복 발행이 남을 수 있습니다.
중복은 Inbox나 멱등 키로 다루는 편이 맞습니다.

## 실패 처리와 주의점

- 락 획득 실패를 오류로 볼지, 정상 스킵으로 볼지 정책을 정합니다.
- lease보다 긴 작업은 연장 전략 없이 위험합니다.
- Redis 장애 시 락을 못 잡으면 전체 작업이 멈출 수 있습니다. 타임아웃과 알림을 둡니다.

## 관련 글

- [Outbox와 Inbox](/docs/patterns/architecture-patterns/outbox-and-inbox)
- [Saga](/docs/patterns/architecture-patterns/saga)

## 참고

- [Redisson — Locks and Synchronizers](https://github.com/redisson/redisson/wiki/8.-Locks-and-Synchronizers)
- [Redis SET NX EX](https://redis.io/commands/set/)
