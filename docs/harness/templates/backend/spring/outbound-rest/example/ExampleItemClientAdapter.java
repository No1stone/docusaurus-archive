package com.example.template.outbound.exampleitem;

import com.example.template.exampleitem.dto.ExampleItemReq;
import com.example.template.exampleitem.dto.ExampleItemRes;
import com.example.template.support.CommonResponse;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.web.client.RestClient;

import java.util.List;

/**
 * {@link ExampleItemClientPort} RestClient 어댑터.
 * 타임아웃·로그는 같은 예제의 {@code OutboundRestClientCustomizer}가 Builder에 붙인다.
 */
public class ExampleItemClientAdapter implements ExampleItemClientPort {

    private final RestClient restClient;

    public ExampleItemClientAdapter(RestClient restClient) {
        this.restClient = restClient;
    }

    @Override
    public ExampleItemRes.Item findById(Long id) {
        CommonResponse<ExampleItemRes.Item> body = restClient.get()
                .uri("/example-items/{id}", id)
                .retrieve()
                .body(new ParameterizedTypeReference<>() {});
        return body == null ? null : body.getData();
    }

    @Override
    public ExampleItemRes.Id save(ExampleItemReq.Create create) {
        CommonResponse<ExampleItemRes.Id> body = restClient.post()
                .uri("/example-items")
                .body(create)
                .retrieve()
                .body(new ParameterizedTypeReference<>() {});
        return body == null ? null : body.getData();
    }

    @Override
    public List<ExampleItemRes.Id> saveAll(List<ExampleItemReq.Create> createList) {
        CommonResponse<List<ExampleItemRes.Id>> body = restClient.post()
                .uri("/example-items/save-all")
                .body(createList)
                .retrieve()
                .body(new ParameterizedTypeReference<>() {});
        return body == null ? null : body.getData();
    }
}
