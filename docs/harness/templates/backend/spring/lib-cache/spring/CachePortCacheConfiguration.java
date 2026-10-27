package com.example.template.cache.spring;

import com.example.template.cache.CachePort;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

/**
 * {@code @Cacheable} → {@link CachePort}(Redis).
 * default TTL만 제공하고, 이름별 TTL은 {@link CachePortTtlCustomizer}로 도메인이 추가한다.
 */
@Configuration
@EnableCaching
public class CachePortCacheConfiguration {

    public static final Duration DEFAULT_TTL = Duration.ofMinutes(1);

    @Bean
    public CacheValueCodec cacheValueCodec() {
        return new JsonCacheValueCodec();
    }

    @Bean
    @Primary
    public CacheManager cacheManager(
            CachePort cachePort,
            CacheValueCodec cacheValueCodec,
            ObjectProvider<CachePortTtlCustomizer> ttlCustomizers
    ) {
        Map<String, Duration> ttlByCacheName = new HashMap<>();
        ttlCustomizers.orderedStream().forEach(customizer -> customizer.customize(ttlByCacheName));
        return new CachePortCacheManager(cachePort, DEFAULT_TTL, ttlByCacheName, cacheValueCodec);
    }
}
