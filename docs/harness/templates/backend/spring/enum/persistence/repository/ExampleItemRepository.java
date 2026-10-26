package com.example.template.exampleitem.persistence.repository;

import com.example.template.exampleitem.persistence.entity.ExampleItem;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

/**
 * ExampleItem Repository
 */
public interface ExampleItemRepository extends JpaRepository<ExampleItem, Long>, ExampleItemCustomRepository, JpaSpecificationExecutor<ExampleItem> {
}

@Repository
interface ExampleItemCustomRepository {
}

@RequiredArgsConstructor
class ExampleItemCustomRepositoryImpl implements ExampleItemCustomRepository {
    private final JPAQueryFactory queryFactory;
}
