package com.example.template.lock.redis;

import com.example.template.lock.LockPort;
import com.example.template.lock.LockResult;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.redisson.api.RLock;
import org.redisson.api.RedissonClient;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.concurrent.TimeUnit;
import java.util.function.Supplier;

@Component
@RequiredArgsConstructor
@Slf4j
public class RedissonLockAdapter implements LockPort {

    private final RedissonClient redissonClient;

    @Override
    public <T> LockResult<T> tryWithLock(String key, Duration wait, Supplier<T> action) {
        return doTry(key, wait, null, action);
    }

    @Override
    public LockResult<Void> tryWithLock(String key, Duration wait, Runnable action) {
        return tryWithLock(key, wait, () -> {
            action.run();
            return null;
        });
    }

    @Override
    public <T> LockResult<T> tryWithLock(String key, Duration wait, Duration lease, Supplier<T> action) {
        return doTry(key, wait, lease, action);
    }

    @Override
    public LockResult<Void> tryWithLock(String key, Duration wait, Duration lease, Runnable action) {
        return tryWithLock(key, wait, lease, () -> {
            action.run();
            return null;
        });
    }

    private <T> LockResult<T> doTry(String key, Duration wait, Duration lease, Supplier<T> action) {
        RLock lock = redissonClient.getLock(key);
        boolean acquired = false;
        try {
            if (lease == null) {
                acquired = lock.tryLock(wait.toMillis(), TimeUnit.MILLISECONDS);
            } else {
                acquired = lock.tryLock(wait.toMillis(), lease.toMillis(), TimeUnit.MILLISECONDS);
            }
            if (!acquired) {
                return LockResult.missed();
            }
            return LockResult.hit(action.get());
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            log.warn("Interrupted while waiting for lock key={}", key);
            return LockResult.missed();
        } finally {
            if (acquired && lock.isHeldByCurrentThread()) {
                lock.unlock();
            }
        }
    }
}
