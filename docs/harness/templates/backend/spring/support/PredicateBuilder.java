package com.example.template.support;

import jakarta.persistence.criteria.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

public class PredicateBuilder {

    private CriteriaBuilder criteriaBuilder;
    private Root<?> root;
    private final List<Predicate> predicates = new ArrayList<>();

    public PredicateBuilder(CriteriaBuilder criteriaBuilder, Root<?> root) {
        this.criteriaBuilder = criteriaBuilder;
        this.root = root;
    }

    public static PredicateBuilder builder(CriteriaBuilder criteriaBuilder, Root<?> root) {
        return new PredicateBuilder(criteriaBuilder, root);
    }

    public PredicateBuilder equal(String property, Object value) {
        if (value != null) {
            predicates.add(criteriaBuilder.equal(root.get(property), value));
        }
        return this;
    }

    public PredicateBuilder isNotNull(String property) {
        predicates.add(criteriaBuilder.isNotNull(root.get(property)));
        return this;
    }

    public PredicateBuilder like(String property, String value) {
        if (value != null && !value.isEmpty()) {
            predicates.add(criteriaBuilder.like(root.get(property), "%" + value + "%"));
        }
        return this;
    }

    public PredicateBuilder in(String property, Collection<?> values) {
        if (values != null && !values.isEmpty()) {
            predicates.add(root.get(property).in(values));
        }
        return this;
    }

    public PredicateBuilder notIn(String property, Collection<?> values) {
        if (values != null && !values.isEmpty()) {
            predicates.add(criteriaBuilder.not(root.get(property).in(values)));
        }
        return this;
    }

    public PredicateBuilder bitAnd(String property, Integer value) {
        if (value != null) {
            Path<Integer> path = root.get(property);
            Expression<Integer> expression = criteriaBuilder.function("bitand", Integer.class, path, criteriaBuilder.literal(value));
            predicates.add(criteriaBuilder.equal(expression, value));
        }
        return this;
    }

    public PredicateBuilder bitOr(String property, Integer value) {
        if (value != null) {
            Path<Integer> path = root.get(property);
            Expression<Integer> expression = criteriaBuilder.function("bitor", Integer.class, path, criteriaBuilder.literal(value));
            predicates.add(criteriaBuilder.equal(expression, value));
        }
        return this;
    }

    public PredicateBuilder bitXor(String property, Integer value) {
        if (value != null) {
            Path<Integer> path = root.get(property);
            Expression<Integer> expression = criteriaBuilder.function("bitxor", Integer.class, path, criteriaBuilder.literal(value));
            predicates.add(criteriaBuilder.equal(expression, value));
        }
        return this;
    }

    public PredicateBuilder endWidth(String property, String value) {
        if (value != null && !value.isEmpty()) {
            predicates.add(criteriaBuilder.like(root.get(property), "%" + value ));
        }
        return this;
    }

    public PredicateBuilder startWidth(String property, String value) {
        if (value != null && !value.isEmpty()) {
            predicates.add(criteriaBuilder.like(root.get(property), value + "%"));
        }
        return this;
    }

    public PredicateBuilder or(Predicate... predicate) {
        if (predicate != null) {
            predicates.add(criteriaBuilder.or(predicate));
        }
        return this;
    }

    public PredicateBuilder regex(String property, String regex) {
        if (regex != null && !regex.isEmpty()) {
            Expression<Boolean> regexExpression = criteriaBuilder.function("regexp", Boolean.class, root.get(property), criteriaBuilder.literal(regex));
            predicates.add(criteriaBuilder.isTrue(regexExpression));
        }
        return this;
    }

    public PredicateBuilder loe(String property, LocalDateTime value) {
        if (value != null) {
            predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get(property), value));
        }
        return this;
    }

    public PredicateBuilder goe(String property, LocalDateTime value) {
        if (value != null) {
            predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get(property), value));
        }
        return this;
    }


    public PredicateBuilder loe(String property, String value) {
        if (value != null) {
            predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get(property), value));
        }
        return this;
    }

    public PredicateBuilder goe(String property, String value) {
        if (value != null) {
            predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get(property), value));
        }
        return this;
    }

    //gt
    public PredicateBuilder gt(String property, Integer value) {
        if (value != null) {
            predicates.add(criteriaBuilder.greaterThan(root.get(property), value));
        }
        return this;
    }


    public Predicate build() {
        if (predicates.isEmpty()) {
            return criteriaBuilder.conjunction();
        }
        return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
    }
}
