package com.example.template.exampleitem.persistence.spec;

import com.example.template.support.CreatedEntity;
import com.example.template.support.PredicateBuilder;
import com.example.template.exampleitem.dto.ExampleItemReq;
import com.example.template.exampleitem.persistence.entity.ExampleItem;
import org.springframework.data.jpa.domain.Specification;

public class ExampleItemSpecs {

    public static Specification<ExampleItem> of(ExampleItemReq.Filter filter) {
        return (root, query, builder) -> {

            PredicateBuilder predicateBuilder = new PredicateBuilder(builder, root);

            predicateBuilder.equal(ExampleItem.Fields.id, filter.getId());
            predicateBuilder.in(ExampleItem.Fields.id, filter.getIds());
            predicateBuilder.goe(CreatedEntity.Fields.createdAt, filter.getStartAt());
            predicateBuilder.loe(CreatedEntity.Fields.createdAt, filter.getEndAt());
            predicateBuilder.equal(ExampleItem.Fields.httpMethod, filter.getHttpMethod());
            predicateBuilder.equal(ExampleItem.Fields.url, filter.getUrl());
            predicateBuilder.equal(ExampleItem.Fields.parameter, filter.getParameter());
            predicateBuilder.equal(ExampleItem.Fields.payload, filter.getPayload());
            predicateBuilder.equal(ExampleItem.Fields.responseHttpStatus, filter.getResponseHttpStatus());
            predicateBuilder.equal(ExampleItem.Fields.response, filter.getResponse());
            return predicateBuilder.build();
        };
    }
}
