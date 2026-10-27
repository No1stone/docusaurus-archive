---
sidebar_position: 1
format: md
id: t-spring-lib-distributed-lock
title: "lib-distributed-lock (LockPort / Redisson)"
description: "분산 락 공유 모듈. Redisson. 도메인 코드 없음."
tags:
  - Spring
  - Redis
  - Redisson
  - Lock
status: active
---

# lib-distributed-lock (LockPort / Redisson)

도메인·ExampleItem과 무관한 **공유 라이브러리**입니다.
캐시([lib-cache](../lib-cache/), Lettuce)와 분리합니다. 락만 Redisson입니다.
패키지 예: `….lib.lock` (모듈명과 패키지 short name은 달라도 됨).

```text
lib-distributed-lock/  ← 호스트 1회
lib-cache/             ← 캐시(Lettuce) — 별도
```

## 계약

| 항목 | 규칙 |
|------|------|
| 기본 유지 | **watchdog** (자동 연장). `tryWithLock(key, wait, action)` |
| 고정 lease | `tryWithLock(key, wait, lease, action)` 별도 제공 |
| 대기 | `wait` 안에 못 얻으면 콜백 **미실행**, `LockResult.missed()` |
| 반환 | `LockResult<T>(acquired, value)` — 획득과 결과 분리. null value 허용 |
| 트랜잭션 | 라이브러리는 락만. DB는 콜백 안에서 **커밋까지** 끝낸 뒤 반환 |
| 예외 | 작업 예외 시에도 보유 중이면 해제 후 예외 전파 |

수동 `lock`/`unlock`은 노출하지 않습니다.

## 키 규칙

| 형식 | 예 |
|------|-----|
| `lock:{영역}:{리소스}` | `lock:member:save` |
| `lock:{영역}:{리소스}:{id}` | `lock:member:save:42` |

`LockKeys.of(...)`로만 만듭니다. 세그먼트에 `:` 금지.
캐시(`name::id`)·수동 KV와 접두를 섞지 않습니다.

## 의존 (Gradle 예)

```gradle
dependencies {
    api 'org.redisson:redisson:3.45.1'
    implementation 'org.springframework:spring-context'
    implementation 'org.springframework.boot:spring-boot-autoconfigure'
}
```

## 복사할 때

1. 패키지를 호스트에 맞게 바꿉니다. (`com.example.template.lock` → 예: `….lib.lock`)
2. 모노리포면 모듈 이름 예: `lib-distributed-lock`. 락이 필요한 앱만 의존합니다.
3. 컴포넌트 스캔에 `….lib.lock`(또는 호스트 패키지)을 넣습니다.

## 다음에 (적용)

이 모듈만으로는 유스케이스가 없다. 호스트에 올린 뒤 **구현체**에 `LockPort`를 주입한다.

→ [lock/](../lock/) — 라이브러리 + JWT sync 구현체를 붙이는 복사 순서·체크리스트·예제 클래스.
ExampleItem 락 원셋 실구현은 없다.

## 파일

- [`LockPort.java`](./LockPort.java)
- [`LockResult.java`](./LockResult.java)
- [`LockKeys.java`](./LockKeys.java)
- [`redis/RedissonLockAdapter.java`](./redis/RedissonLockAdapter.java)
- [`redis/RedissonConfig.java`](./redis/RedissonConfig.java)
