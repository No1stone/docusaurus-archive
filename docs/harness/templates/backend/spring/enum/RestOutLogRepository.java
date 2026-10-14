package com.example.template.restoutlog.repository;

import com.example.template.restoutlog.entity.RestOutLog;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

/**
 * RestOutLog Repository
 */
public interface RestOutLogRepository extends JpaRepository<RestOutLog, Long>, RestOutLogCustomRepository, JpaSpecificationExecutor<RestOutLog> {
}

@Repository
interface RestOutLogCustomRepository {
}

@RequiredArgsConstructor
class RestOutLogCustomRepositoryImpl implements RestOutLogCustomRepository {
    private final JPAQueryFactory queryFactory;
}
