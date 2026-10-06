package com.example.template.exampleitem.persistence;

import com.example.template.exampleitem.dto.ExampleItemReq;
import com.example.template.support.EnStatus;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

public final class ExampleItemSpecs {

    private ExampleItemSpecs() {}

    public static Specification<ExampleItem> forWebList(ExampleItemReq.WebListQuery query) {
        if (query == null) {
            return forWebList(null, null);
        }
        return forWebList(query.getKeyword(), query.getStatus());
    }

    /**
     * Web list — keyword on name (LIKE), status all|A|D.
     */
    public static Specification<ExampleItem> forWebList(String keyword, String status) {
        return (root, q, cb) -> {
            var predicates = cb.conjunction();

            if (StringUtils.hasText(status) && !"all".equalsIgnoreCase(status.trim())) {
                predicates = cb.and(predicates,
                        cb.equal(root.get("status"), EnStatus.of(status.trim())));
            }
            if (StringUtils.hasText(keyword)) {
                predicates = cb.and(predicates,
                        cb.like(cb.lower(root.get("name")), "%" + keyword.trim().toLowerCase() + "%"));
            }
            return predicates;
        };
    }
}
