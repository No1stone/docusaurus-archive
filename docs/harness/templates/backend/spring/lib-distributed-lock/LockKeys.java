package com.example.template.lock;

import org.springframework.util.Assert;
import org.springframework.util.StringUtils;

/**
 * 분산 락 Redis 키 규칙.
 * {@code lock:{영역}:{리소스}} 또는 {@code lock:{영역}:{리소스}:{id}}.
 * 캐시({@code name::id})·수동 KV({@code access:} 등)와 접두를 섞지 않는다.
 */
public final class LockKeys {

    public static final String PREFIX = "lock";

    private LockKeys() {
    }

    public static String of(String area, String resource) {
        requireSegment("area", area);
        requireSegment("resource", resource);
        return PREFIX + ":" + area + ":" + resource;
    }

    public static String of(String area, String resource, Object id) {
        requireSegment("area", area);
        requireSegment("resource", resource);
        Assert.notNull(id, "id must not be null");
        String idPart = String.valueOf(id);
        Assert.hasText(idPart, "id must not be blank");
        return PREFIX + ":" + area + ":" + resource + ":" + idPart;
    }

    private static void requireSegment(String name, String value) {
        Assert.isTrue(StringUtils.hasText(value), name + " must not be blank");
        Assert.isTrue(!value.contains(":"), name + " must not contain ':'");
    }
}
