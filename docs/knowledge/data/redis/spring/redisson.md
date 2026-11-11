---
id: redis-redisson
title: "Redisson — RLock과 분산 락"
description: "Redisson RLock의 tryLock, watchdog, 고정 lease와 Spring LockPort 어댑터를 정리합니다."
slug: /knowledge/data/redis/spring/redisson
sidebar_position: 4
tags: [Redis, Spring]
---

# Redisson으로 여러 서버의 같은 작업을 한 번에 하나씩 처리하기

예약 42번을 처리하는 요청이 서버 A와 서버 B에 거의 동시에 들어왔다고 가정합니다.<br />
두 서버가 각각 예약 상태를 읽고 변경하면, 둘 다 같은 이전 상태를 기준으로 처리할 수 있습니다.

Java의 `synchronized`는 한 JVM 안에서만 동작합니다.<br />
서버 두 대에서 같은 예약의 처리를 조율하려면 두 서버가 공통으로 확인할 수 있는 기준이 필요합니다.<br />
Redisson의 `RLock`은 Redis를 통해 **같은 이름의 락을 요청하는 실행 주체들**을 조율합니다. [Redisson 락 공식 문서](https://redisson.pro/docs/data-and-services/locks-and-synchronizers/)

## 먼저 무엇을 한 번에 하나씩 처리할지 정합니다

예약마다 처리 순서를 조율하려면 락 키에 예약 ID를 넣습니다.<br />
boot-base의 `LockKeys.of("parking", "reservation", 42L)`은 `lock:parking:reservation:42`를 만듭니다.

| 서버 A가 처리하는 예약 | 서버 B가 요청한 예약 | 결과 |
|---|---|---|
| 42번 | 42번 | 같은 락을 요청하므로 B는 획득을 기다림 |
| 42번 | 43번 | 서로 다른 락을 요청하므로 B도 처리 가능 |

예약 ID를 빼고 공통 키 하나를 쓰면 서로 관계없는 예약도 같은 락을 기다리게 됩니다.<br />
반대로 같은 예약을 수정하는 두 경로가 서로 다른 키를 쓰면 락으로 두 경로를 조율할 수 없습니다.

## 200ms는 락을 기다리는 시간입니다

`tryLock`에서 **대기 시간**은 락을 얻기 전까지 기다릴 한도입니다.<br />
**lease**는 락을 얻은 뒤 정해진 시간이 지나면 자동으로 풀리도록 지정하는 시간입니다.

| 호출 | 락을 기다리는 시간 | 획득 뒤 만료 관리 |
|---|---:|---|
| `tryLock(200, TimeUnit.MILLISECONDS)` | 최대 200ms | 고정 lease를 지정하지 않아 watchdog이 만료를 갱신 |
| `tryLock(200, 2000, TimeUnit.MILLISECONDS)` | 최대 200ms | 획득 뒤 2초가 지나면 자동 해제 |

예를 들어 서버 A가 락을 잡은 채 3초 동안 처리하고 있다면, 서버 B는 200ms 안에 락을 얻지 못하고 돌아올 수 있습니다.<br />
A가 **고정 lease를 2초로 지정**했다면 A의 작업이 계속돼도 락은 2초 뒤에 풀릴 수 있습니다.<br />
그 사이 B가 락을 얻으면 두 작업이 겹칩니다.

watchdog 방식에서는 Redisson이 락의 만료를 주기적으로 연장합니다.<br />
연장이 끊기면 마지막으로 갱신한 만료 시각이 지난 뒤 키가 만료될 수 있습니다.<br />
boot-base는 작업 시간이 달라질 수 있는 호출에 watchdog을 기본으로 두고, 고정 lease는 별도 오버로드로 제공합니다. [Redisson watchdog 설정](https://redisson.pro/docs/configuration/#lockwatchdogtimeout)

## boot-base에서는 락을 얻었을 때만 콜백을 실행합니다

아래는 **실제 `LockPort` 호출 형식**에 방문 예약을 적용한 예시입니다.<br />
`reservationWriter`는 예약 변경을 수행하는 예시 컴포넌트입니다.

```java
String key = LockKeys.of("parking", "reservation", reservationId);

LockResult<ReservationReceipt> result = lockPort.tryWithLock(
    key,
    Duration.ofMillis(200),
    () -> reservationWriter.confirm(reservationId)
);

if (!result.acquired()) {
    throw new ReservationBusyException(reservationId);
}

return result.value();
```

`RedissonLockAdapter`는 락을 얻지 못하면 콜백을 호출하지 않고 `missed()`를 반환합니다.<br />
콜백이 정상 종료하면 `hit(value)`로 결과를 전달합니다.<br />
반환값이 `null`인 작업도 정상 실행될 수 있으므로, 실행 여부는 `value()` 대신 `acquired()`로 확인합니다.

콜백이 예외를 던져도 Adapter는 `finally`에서 현재 스레드가 여전히 소유한 락을 해제합니다.<br />
락을 기다리다 인터럽트가 발생하면 인터럽트 상태를 복구하고 미획득 결과를 반환합니다.<br />
boot-base의 단위 테스트는 획득 실패 시 콜백을 건너뛰는지, 콜백 예외가 발생해도 락을 해제하는지 확인합니다. [boot-base 분산 락 모듈](https://github.com/No1stone/boot-base/tree/main/lib-distributed-lock)

## DB 커밋까지 락 안에서 마칩니다

락을 쓰는 이유가 **같은 예약의 DB 변경이 겹치지 않게 하는 것**이라면, 다음 요청은 앞선 변경이 커밋된 뒤에 예약 상태를 읽어야 합니다.

```text
락 획득
  → 콜백에서 DB 트랜잭션 시작
  → 현재 상태 조회 및 변경
  → 커밋 또는 롤백
  → 락 해제
```

위 예제에서는 호출부가 바깥 트랜잭션을 열지 않고, 콜백 안에서 별도 Spring 빈의 트랜잭션 메서드를 호출하는 구성을 가정했습니다.<br />
호출부에 이미 트랜잭션이 있고 그 트랜잭션에 참여하면, 콜백이 끝났을 때 아직 커밋되지 않았을 수 있습니다.<br />
이때는 Adapter가 락을 먼저 해제할 수 있으므로, 애노테이션 유무와 함께 **실제로 어디에서 커밋되는지** 확인합니다. [Spring 트랜잭션 전파](https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/tx-propagation.html)

같은 예약 요청이 첫 번째 작업 **이후**에 다시 들어오면 락을 얻을 수 있습니다.<br />
이미 처리된 요청까지 구분해야 한다면 콜백 안에서 저장된 상태나 요청 식별자를 확인합니다.

[boot-base의 분산 락 라이브러리](/docs/knowledge/data/redis/boot-base/lib-distributed-lock) / [분산 락 패턴](/docs/knowledge/data/redis/patterns/distributed-lock)
