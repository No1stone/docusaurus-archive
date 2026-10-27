package com.example.template.cache.spring;

import org.springframework.core.serializer.support.SerializationFailedException;
import org.springframework.data.redis.serializer.RedisSerializer;
import org.springframework.util.StringUtils;

import java.nio.charset.StandardCharsets;

/**
 * JSON {@link CacheValueCodec}. {@link RedisSerializer#json()}으로 타입 정보를 포함해 복원한다.
 */
public class JsonCacheValueCodec implements CacheValueCodec {

    private final RedisSerializer<Object> serializer;

    public JsonCacheValueCodec() {
        this(RedisSerializer.json());
    }

    public JsonCacheValueCodec(RedisSerializer<Object> serializer) {
        this.serializer = serializer;
    }

    @Override
    public String encode(Object value) {
        try {
            byte[] bytes = serializer.serialize(value);
            if (bytes == null) {
                return null;
            }
            return new String(bytes, StandardCharsets.UTF_8);
        } catch (RuntimeException ex) {
            throw new SerializationFailedException("Failed to encode cache value as JSON", ex);
        }
    }

    @Override
    public Object decode(String encoded) {
        if (!StringUtils.hasText(encoded)) {
            return null;
        }
        try {
            return serializer.deserialize(encoded.getBytes(StandardCharsets.UTF_8));
        } catch (RuntimeException ex) {
            throw new SerializationFailedException("Failed to decode cache value from JSON", ex);
        }
    }
}
