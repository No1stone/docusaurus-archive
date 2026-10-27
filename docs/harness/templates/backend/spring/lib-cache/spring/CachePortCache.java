package com.example.template.cache.spring;

import com.example.template.cache.CachePort;
import org.springframework.cache.Cache;
import org.springframework.lang.Nullable;
import org.springframework.util.StringUtils;

import java.time.Duration;
import java.util.concurrent.Callable;

/**
 * Spring {@link Cache} → {@link CachePort}(Redis) 어댑터.
 * 값 직렬화는 {@link CacheValueCodec} 경계에 둔다.
 */
public class CachePortCache implements Cache {

    private final String name;
    private final CachePort cachePort;
    private final Duration ttl;
    private final CacheValueCodec codec;

    public CachePortCache(String name, CachePort cachePort, Duration ttl, CacheValueCodec codec) {
        this.name = name;
        this.cachePort = cachePort;
        this.ttl = ttl;
        this.codec = codec;
    }

    @Override
    public String getName() {
        return name;
    }

    @Override
    public Object getNativeCache() {
        return cachePort;
    }

    @Override
    @Nullable
    public ValueWrapper get(Object key) {
        Object value = lookup(key);
        return value != null ? () -> value : null;
    }

    @Override
    @Nullable
    @SuppressWarnings("unchecked")
    public <T> T get(Object key, @Nullable Class<T> type) {
        Object value = lookup(key);
        if (value != null && type != null && !type.isInstance(value)) {
            throw new IllegalStateException(
                    "Cached value is not of required type [" + type.getName() + "]: " + value);
        }
        return (T) value;
    }

    @Override
    @Nullable
    @SuppressWarnings("unchecked")
    public <T> T get(Object key, Callable<T> valueLoader) {
        ValueWrapper wrapper = get(key);
        if (wrapper != null) {
            return (T) wrapper.get();
        }
        try {
            T value = valueLoader.call();
            put(key, value);
            return value;
        } catch (Exception ex) {
            throw new ValueRetrievalException(key, valueLoader, ex);
        }
    }

    @Override
    public void put(Object key, @Nullable Object value) {
        if (value == null) {
            return;
        }
        cachePort.set(redisKey(key), codec.encode(value), ttl);
    }

    @Override
    @Nullable
    public ValueWrapper putIfAbsent(Object key, @Nullable Object value) {
        Object existing = lookup(key);
        if (existing != null) {
            return () -> existing;
        }
        put(key, value);
        return null;
    }

    @Override
    public void evict(Object key) {
        cachePort.delete(redisKey(key));
    }

    @Override
    public void clear() {
        cachePort.deleteByPrefix(name + "::");
    }

    @Nullable
    private Object lookup(Object key) {
        String encoded = cachePort.get(redisKey(key));
        if (!StringUtils.hasText(encoded)) {
            return null;
        }
        return codec.decode(encoded);
    }

    private String redisKey(Object key) {
        return name + "::" + key;
    }
}
