package com.example.template.lock;

import java.time.Duration;
import java.util.function.Supplier;

/**
 * 분산 락 능력 계약.
 * 제품(Redisson 등) 이름은 Port에 두지 않는다.
 * 키는 {@link LockKeys} 규칙을 따른다.
 * <p>
 * 기본은 watchdog(자동 연장). 고정 lease는 오버로드로 제공한다.
 * wait 안에 획득하지 못하면 콜백을 실행하지 않고 {@link LockResult#missed()}를 반환한다.
 * DB 트랜잭션은 라이브러리 밖이다. 콜백 안에서 커밋까지 끝내고 나오도록 사용한다.
 */
public interface LockPort {

    /** watchdog. wait 내 미획득 시 미실행. */
    <T> LockResult<T> tryWithLock(String key, Duration wait, Supplier<T> action);

    /** watchdog. */
    LockResult<Void> tryWithLock(String key, Duration wait, Runnable action);

    /** 고정 lease. 작업이 lease보다 길면 락이 먼저 풀릴 수 있다. */
    <T> LockResult<T> tryWithLock(String key, Duration wait, Duration lease, Supplier<T> action);

    /** 고정 lease. */
    LockResult<Void> tryWithLock(String key, Duration wait, Duration lease, Runnable action);
}
