---
sidebar_position: 1
format: md
id: t-spring-lock-apply
title: "분산 락 적용 예 (JWT 키 sync)"
description: "lib-distributed-lock을 호스트에 두고 JWT sync 구현체에 LockPort를 붙이는 예"
tags:
  - Spring
  - Redisson
  - Lock
status: active
---

# 분산 락 적용 예

캐시 변형([cache/](../cache/) = `lib-cache` + Facade)과 같은 **두 층**입니다.

1. **라이브러리** [lib-distributed-lock/](../lib-distributed-lock/) — `LockPort` · `LockResult` · `LockKeys` · Redisson 어댑터 (도메인 없음, 호스트 1회)
2. **구현체** 이 폴더 — 라이브러리 Port를 **주입**해 쓰는 짧은 예 (JWT 서명 키 → 캐시 sync)

ExampleItem 도메인 CRUD에 락을 심은 **원셋 실구현은 두지 않습니다.**  
도메인에 넣을 때도 아래 JWT 패턴을 복사하면 됩니다.

```text
lib-distributed-lock/     ← 먼저 (공유 모듈)
        │
        │  LockPort 빈 (RedissonLockAdapter)
        ▼
lock/example/             ← 적용 구현체 (이 폴더)
  SigningKeySyncLockExample
        │
        └─ tryWithLock(LockKeys…, wait, callback)
```

> **개요:** 호스트가 `lib-distributed-lock`에 의존·스캔한 뒤, sync 같은 유스케이스에 `LockPort`만 주입한다.
> 기본은 **watchdog**. 미획득이면 콜백 미실행.

## 복사할 때 (라이브러리 → 구현체)

1. [lib-distributed-lock/](../lib-distributed-lock/)가 호스트에 없으면 **먼저** 복사한다. 있으면 재사용.
2. 앱 `build.gradle`에 `implementation project(':lib-distributed-lock')` (또는 동등).
3. `@SpringBootApplication(scanBasePackages = { …, "….lib.lock" })` 등으로 어댑터·`RedissonConfig`가 뜨게 한다.
4. 아래 **호스트 체크리스트**를 확인한다.
5. [example/SigningKeySyncLockExample.java](./example/SigningKeySyncLockExample.java)를 앱 패키지로 옮기거나, 기존 sync 클래스에 같은 패턴을 붙인다.
6. 콜백 안에서 실제 쓰기(캐시·DB)를 채운다. DB면 **커밋까지** 콜백 안에서 끝낸다.

## 호스트 체크리스트

- [ ] `lib-distributed-lock` 의존 + 컴포넌트 스캔
- [ ] `spring.db.redis.host` / `port` → `RedissonClient` 빈
- [ ] 구현체가 `LockPort`를 생성자 주입 (Redisson 타입 직접 주입 금지)
- [ ] 키는 `LockKeys.of(...)`만 (`lock:영역:리소스[:id]`)
- [ ] `LockResult.acquired()`로 미획득 분기 (null 결과와 혼동 금지)

## 구현체 예 (JWT 키 sync)

| | |
|--|--|
| 락 키 | `LockKeys.of("auth-sig", "sync")` → `lock:auth-sig:sync` |
| 대기 | `Duration.ofSeconds(3)` (watchdog) |
| 미획득 | sync 스킵 (다른 인스턴스가 쓰는 중) |
| 콜백 | Token/Vault 로드 → CachePort set/hashPut |

전체 골격: [`example/SigningKeySyncLockExample.java`](./example/SigningKeySyncLockExample.java)

```java
// lib-distributed-lock 이 제공하는 것
import ….lock.LockKeys;
import ….lock.LockPort;
import ….lock.LockResult;

private final LockPort lockPort;           // ← 라이브러리 빈
private final CachePort cachePort;         // ← 호스트/lib-cache (콜백 안에서만)

public void syncAuthJwtKeys() {
    LockResult<Void> result = lockPort.tryWithLock(
            LockKeys.of("auth-sig", "sync"),
            Duration.ofSeconds(3),
            this::writeSigningKeysToCache);
    if (!result.acquired()) {
        return; // 미실행이 정상
    }
}

private void writeSigningKeysToCache() {
    // 여기부터가 "구현체" 본문 — 락 밖에서 CachePort를 쓰지 않도록 안에 둔다
}
```

## 호출 규약

- 라이브러리는 **락만**. Redisson API를 구현체에 노출하지 않는다.
- 수동 `lock` / `unlock` 금지.
- DB 작업은 콜백 안 트랜잭션 **커밋까지**. 캐시 KV만이면 TX 없음.

## ExampleItem?

`cache/`처럼 Facade에 락을 넣은 ExampleItem **실구현 파일은 없음**.  
필요하면 이 예의 `tryWithLock` + `LockKeys.of("exampleItem", "save", id)`만 맞춘다.
