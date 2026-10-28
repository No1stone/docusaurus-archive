package com.example.template.outbound.exampleitem;

import com.example.template.outbound.OutboundRestClientCustomizer;
import com.example.template.outbound.OutboundRestClientLoggingInterceptor;
import com.example.template.outbound.OutboundRestClientProperties;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

/**
 * Boot 자동구성 {@link RestClient.Builder}를 주입해야 W3C traceparent 전파·스팬이 붙는다.
 */
@Configuration
@EnableConfigurationProperties(OutboundRestClientProperties.class)
public class ExampleItemClientConfig {

    @Bean
    ExampleItemClientPort exampleItemClientPort(
            RestClient.Builder restClientBuilder,
            OutboundRestClientProperties properties,
            @Value("${origemite.example-item.client.base-url:http://localhost:8080}") String baseUrl
    ) {
        RestClient.Builder builder = restClientBuilder.baseUrl(baseUrl);
        new OutboundRestClientCustomizer(properties, new OutboundRestClientLoggingInterceptor())
                .customize(builder);
        return new ExampleItemClientAdapter(builder.build());
    }
}
