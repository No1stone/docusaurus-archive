package com.example.template.outbound;

import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestClient;

/**
 * RestClient.Builder에 connect/read 타임아웃·한 줄 로그.
 * 호스트에 복사하는 예제 코드 (공유 라이브러리 아님).
 */
public class OutboundRestClientCustomizer {

    private final OutboundRestClientProperties properties;
    private final OutboundRestClientLoggingInterceptor loggingInterceptor;

    public OutboundRestClientCustomizer(
            OutboundRestClientProperties properties,
            OutboundRestClientLoggingInterceptor loggingInterceptor
    ) {
        this.properties = properties;
        this.loggingInterceptor = loggingInterceptor;
    }

    public void customize(RestClient.Builder builder) {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(properties.getConnectTimeout());
        factory.setReadTimeout(properties.getReadTimeout());
        builder.requestFactory(factory);
        if (properties.isLoggingEnabled()) {
            builder.requestInterceptor(loggingInterceptor);
        }
    }
}
