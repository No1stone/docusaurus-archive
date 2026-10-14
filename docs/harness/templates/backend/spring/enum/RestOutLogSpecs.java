package com.example.template.restoutlog.spec;

import com.example.template.restoutlog.enums.EnHttpMethod;
import com.example.template.support.CreatedEntity;
import com.example.template.support.PredicateBuilder;
import com.example.template.restoutlog.dto.RestOutLogReq;
import com.example.template.restoutlog.entity.RestOutLog;
import org.springframework.data.jpa.domain.Specification;

public class RestOutLogSpecs {

    public static Specification<RestOutLog> of(RestOutLogReq.Filter filter) {
        return (root, query, builder) -> {

            PredicateBuilder predicateBuilder = new PredicateBuilder(builder, root);

            predicateBuilder.equal(RestOutLog.Fields.id, filter.getId());
            predicateBuilder.in(RestOutLog.Fields.id, filter.getIds());
            predicateBuilder.goe(CreatedEntity.Fields.createdAt, filter.getStartAt());
            predicateBuilder.loe(CreatedEntity.Fields.createdAt, filter.getEndAt());
            predicateBuilder.equal(RestOutLog.Fields.httpMethod, EnHttpMethod.ofNullable(filter.getHttpMethod()));
            predicateBuilder.equal(RestOutLog.Fields.url, filter.getUrl());
            predicateBuilder.equal(RestOutLog.Fields.parameter, filter.getParameter());
            predicateBuilder.equal(RestOutLog.Fields.payload, filter.getPayload());
            predicateBuilder.equal(RestOutLog.Fields.responseHttpStatus, filter.getResponseHttpStatus());
            predicateBuilder.equal(RestOutLog.Fields.response, filter.getResponse());
            return predicateBuilder.build();
        };
    }
}
