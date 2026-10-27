package com.example.template.cache.spring;

import com.example.template.cache.CachePort;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;

import java.time.Duration;
import java.util.Collection;
import java.util.Collections;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

/**
 * {@link CachePort} 기반 Spring {@link CacheManager}.
 */
public class CachePortCacheManager implements CacheManager {

    private final CachePort cachePort;
    private final Duration defaultTtl;
    private final Map<String, Duration> ttlByCacheName;
    private final CacheValueCodec codec;
    private final ConcurrentMap<String, Cache> caches = new ConcurrentHashMap<>();

    public CachePortCacheManager(
            CachePort cachePort,
            Duration defaultTtl,
            Map<String, Duration> ttlByCacheName,
            CacheValueCodec codec
    ) {
        this.cachePort = cachePort;
        this.defaultTtl = defaultTtl;
        this.ttlByCacheName = ttlByCacheName != null ? ttlByCacheName : Map.of();
        this.codec = codec;
    }

    @Override
    public Cache getCache(String name) {
        return caches.computeIfAbsent(name, this::createCache);
    }

    @Override
    public Collection<String> getCacheNames() {
        return Collections.unmodifiableSet(caches.keySet());
    }

    private Cache createCache(String name) {
        Duration ttl = ttlByCacheName.getOrDefault(name, defaultTtl);
        return new CachePortCache(name, cachePort, ttl, codec);
    }
}
