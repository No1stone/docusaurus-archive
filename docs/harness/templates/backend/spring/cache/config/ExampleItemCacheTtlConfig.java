package com.example.template.exampleitem.config;

import com.example.template.exampleitem.facade.ExampleItemFacade;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;
import java.util.Map;

/**
 * 도메인(model)에서 캐시 이름별 TTL을 추가하는 예입니다.
 * 호스트에서는 lib-cache의 {@code CachePortTtlCustomizer}를 씁니다. (아래 View는 템플릿 가독용)
 * BFF/api 패키지에 두지 않습니다.
 */
@Configuration
public class ExampleItemCacheTtlConfig {

    @Bean
    public CachePortTtlCustomizerView exampleItemCacheTtlCustomizer() {
        return ttlByCacheName -> ttlByCacheName.put(
                ExampleItemFacade.CACHE_NAME,
                Duration.ofMinutes(30)
        );
    }

    /** 호스트: {@code com.origemite.lib.cache.spring.CachePortTtlCustomizer} */
    @FunctionalInterface
    public interface CachePortTtlCustomizerView {
        void customize(Map<String, Duration> ttlByCacheName);
    }
}
