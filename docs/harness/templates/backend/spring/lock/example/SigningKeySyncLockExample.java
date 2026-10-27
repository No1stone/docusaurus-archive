package com.example.template.lock.example;

import com.example.template.lock.LockKeys;
import com.example.template.lock.LockPort;
import com.example.template.lock.LockResult;

import java.time.Duration;

/**
 * JWT 서명 키 → 캐시 sync에 분산 락을 거는 짧은 예.
 * ExampleItem 도메인 실구현이 아니다. 호스트에 맞게 패키지·의존을 바꾼다.
 */
public class SigningKeySyncLockExample {

    public static final String SYNC_LOCK_KEY = LockKeys.of("auth-sig", "sync");

    private static final Duration SYNC_LOCK_WAIT = Duration.ofSeconds(3);

    private final LockPort lockPort;
    private final Runnable writeSigningKeysToCache;

    public SigningKeySyncLockExample(LockPort lockPort, Runnable writeSigningKeysToCache) {
        this.lockPort = lockPort;
        this.writeSigningKeysToCache = writeSigningKeysToCache;
    }

    public void syncAuthJwtKeys() {
        LockResult<Void> result = lockPort.tryWithLock(SYNC_LOCK_KEY, SYNC_LOCK_WAIT, writeSigningKeysToCache);
        if (!result.acquired()) {
            // 다른 인스턴스가 sync 중 — 콜백 미실행
        }
    }
}
