package com.example.template.outbound;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.http.HttpRequest;
import org.springframework.http.client.ClientHttpRequestExecution;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.http.client.ClientHttpResponse;

import java.io.IOException;

/**
 * outbound 한 줄 로그. traceId는 Micrometer Tracing MDC(W3C)에서 읽는다.
 */
public class OutboundRestClientLoggingInterceptor implements ClientHttpRequestInterceptor {

    private static final Logger log = LoggerFactory.getLogger(OutboundRestClientLoggingInterceptor.class);

    @Override
    public ClientHttpResponse intercept(HttpRequest request, byte[] body, ClientHttpRequestExecution execution)
            throws IOException {
        long start = System.nanoTime();
        ClientHttpResponse response = execution.execute(request, body);
        long elapsedMs = (System.nanoTime() - start) / 1_000_000L;
        String traceId = MDC.get("traceId");
        log.info("outbound {} {} → {} ({}ms) traceId={}",
                request.getMethod(),
                request.getURI(),
                response.getStatusCode().value(),
                elapsedMs,
                traceId != null ? traceId : "-");
        return response;
    }
}
