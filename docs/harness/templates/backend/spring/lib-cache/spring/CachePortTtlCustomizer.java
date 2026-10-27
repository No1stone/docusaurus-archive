package com.example.template.cache.spring;

import java.time.Duration;
import java.util.Map;

/**
 * 캐시 이름별 TTL을 사용처(도메인)에서 추가한다.
 * 없으면 {@link CachePortCacheConfiguration}의 default TTL만 적용된다.
 */
@FunctionalInterface
public interface CachePortTtlCustomizer {

    void customize(Map<String, Duration> ttlByCacheName);
}
