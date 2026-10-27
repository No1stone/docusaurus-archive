package com.example.template.lock.example;

import com.example.template.lock.LockKeys;
import com.example.template.lock.LockPort;
import com.example.template.lock.LockResult;

import java.time.Duration;
import java.util.Map;
import java.util.function.Supplier;

/**
 * lib-distributed-lock({@link LockPort})을 가져다 쓰는 적용 구현체 예.
 * <p>
 * 전제: 호스트에 lib-distributed-lock이 있고 {@code RedissonLockAdapter}가 {@link LockPort} 빈이다.
 * ExampleItem 도메인 원셋이 아니다. JWT 서명 키 → 캐시 sync 패턴.
 * <p>
 * 호스트 이식 시: 패키지·{@code CachePort}/{@code TokenPort} 타입만 맞추면 된다.
 */
public class SigningKeySyncLockExample {

    /** {@link LockKeys#of(String, String)} → {@code lock:auth-sig:sync} */
    public static final String SYNC_LOCK_KEY = LockKeys.of("auth-sig", "sync");

    private static final Duration SYNC_LOCK_WAIT = Duration.ofSeconds(3);

    /** lib-distributed-lock이 제공하는 빈 */
    private final LockPort lockPort;

    /** 호스트(또는 lib-cache) — 락 콜백 안에서만 호출 */
    private final CacheWriter cacheWriter;

    /** 호스트 — 서명 키 재료 로드 */
    private final Supplier<SigningKeysSnapshot> loadSigningKeys;

    public SigningKeySyncLockExample(
            LockPort lockPort,
            CacheWriter cacheWriter,
            Supplier<SigningKeysSnapshot> loadSigningKeys
    ) {
        this.lockPort = lockPort;
        this.cacheWriter = cacheWriter;
        this.loadSigningKeys = loadSigningKeys;
    }

    /**
     * 다중 인스턴스에서 sync를 직렬화한다.
     * 미획득이면 콜백을 실행하지 않는다 (다른 노드가 sync 중).
     */
    public void syncAuthJwtKeys() {
        LockResult<Void> result = lockPort.tryWithLock(
                SYNC_LOCK_KEY,
                SYNC_LOCK_WAIT,
                this::writeSigningKeysToCache
        );
        if (!result.acquired()) {
            // missed — 정상 스킵
        }
    }

    /** 락을 잡은 뒤에만 실행. 라이브러리 밖 "구현체" 본문. */
    private void writeSigningKeysToCache() {
        SigningKeysSnapshot keys = loadSigningKeys.get();
        keys.publicKeysByVersion().forEach(cacheWriter::setPublicKey);
        cacheWriter.setLatestVersion(keys.latestVersion());
        cacheWriter.setPreviousVersion(keys.previousVersion());
    }

    /** 템플릿용 얇은 쓰기 면. 호스트에서는 CachePort 등으로 교체. */
    public interface CacheWriter {
        void setPublicKey(String version, String publicKey);

        void setLatestVersion(String version);

        void setPreviousVersion(String version);
    }

    /** 템플릿용 스냅샷. 호스트에서는 TokenSigningKeys 등으로 교체. */
    public record SigningKeysSnapshot(
            String latestVersion,
            String previousVersion,
            Map<String, String> publicKeysByVersion
    ) {
    }
}
