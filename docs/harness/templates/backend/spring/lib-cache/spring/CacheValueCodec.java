package com.example.template.cache.spring;

/**
 * CachePort(String 값)에 넣을 객체 ↔ 문자열 변환.
 * Spring Cache 어댑터와 Redis 저장 사이의 직렬화 경계이다.
 */
public interface CacheValueCodec {

    String encode(Object value);

    Object decode(String encoded);
}
