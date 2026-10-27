---
sidebar_position: 1
format: md
id: t-spring-lock-apply
title: "분산 락 적용 예 (JWT 키 sync)"
description: "lib-distributed-lock 적용 짧은 예. ExampleItem 도메인 실구현은 두지 않음."
tags:
  - Spring
  - Redisson
  - Lock
status: active
---

# 분산 락 적용 예

공유 모듈은 [lib-distributed-lock/](../lib-distributed-lock/)입니다. (도메인 없음, 라이브러리째)

이넘·캐시처럼 **ExampleItem 전체 원셋 변형은 두지 않습니다.**
도메인 CRUD에 락을 얹는 실구현 샘플은 보류하고, **짧은 적용 예**만 둡니다.

## 언제 쓰나

여러 인스턴스가 같은 Redis/외부 상태를 **짧게 직렬화**해야 할 때.
예: JWT 서명 키를 캐시에 밀어 넣는 sync.

## 실무 예 (JWT 키 sync)

키: `LockKeys.of("auth-sig", "sync")` → `lock:auth-sig:sync`  
기본 **watchdog**. wait 내 미획득이면 sync 스킵.

```java
// 개념 발췌. 호스트 패키지·빈 이름은 맞출 것.
private static final String SYNC_LOCK_KEY = LockKeys.of("auth-sig", "sync");
private static final Duration SYNC_LOCK_WAIT = Duration.ofSeconds(3);

private final LockPort lockPort;

public void syncAuthJwtKeys() {
    LockResult<Void> result = lockPort.tryWithLock(
            SYNC_LOCK_KEY, SYNC_LOCK_WAIT, this::writeSigningKeysToCache);
    if (!result.acquired()) {
        // 다른 인스턴스가 동기화 중 — 미실행이 정상
        return;
    }
}

private void writeSigningKeysToCache() {
    // TokenPort 로드 → CachePort set/hashPut …
}
```

골격 파일: [`example/SigningKeySyncLockExample.java`](./example/SigningKeySyncLockExample.java)

## 호출 규약

- 라이브러리는 락만. DB가 있으면 콜백 안에서 **커밋까지** 끝낸 뒤 반환.
- 캐시 KV만 건드리는 sync(위 예)는 TX 이슈 없음.
- 수동 `lock`/`unlock` 금지. `LockResult`로 획득 여부 확인.

## ExampleItem?

캐시 변형(`cache/`)처럼 Facade에 락을 심은 ExampleItem **실구현은 없음**.
나중에 도메인 임계구역이 필요하면 이 JWT 패턴을 복사해 `LockKeys.of("exampleItem", "save", id)` 정도로 맞춘다.
