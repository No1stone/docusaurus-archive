---
format: md
id: k-dynamicquery
title: "DynamicQuery"
description: "DynamicQuery"
tags:
  - GoF
  - JPA
  - Java
  - QueryDSL
  - Spring
status: active
slug: /knowledge/k-dynamicquery
---
# DynamicQuery

다이나믹 쿼리

수동으로 트랜잭셔널 처리를해줘야해서

AOP처리를 해줘야함

(트랜잭션위치는 쿼리단위로 하던 인터페이스단위로하던...)

클래스 다중상속이 안되니

인터페이스 다중상속하고

클래스 별로 구현

```java
import com.ui.sparwk.dto.AccountBaseDTO;
import org.springframework.transaction.annotation.Transactional;

public interface AccountRepositoryDynamic {
    @Transactional
    void AccountDynamicUpdate(AccountBaseDTO entity);
}
```

업데이트 동적쿼리

```java
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.querydsl.jpa.impl.JPAUpdateClause;
import com.ui.sparwk.dto.AccountBaseDTO;
import com.ui.sparwk.entity.QAccount;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.persistence.EntityManager;

@Aspect
public class AccountRepositoryDynamicImpl implements AccountRepositoryDynamic {

    private EntityManager em;
    private JPAQueryFactory queryFactory;
    private final Logger logger = LoggerFactory.getLogger(AccountRepositoryDynamicImpl.class);
    private QAccount qAccount = QAccount.account;

    private AccountRepositoryDynamicImpl(EntityManager em) {
        this.em = em;
        this.queryFactory = new JPAQueryFactory(em);
    }

    @Override
    public void AccountDynamicUpdate(AccountBaseDTO entity) {
        JPAUpdateClause jpaUpdateClause = new JPAUpdateClause(em, qAccount);

        if (!entity.getAccntType().isEmpty()) {
            jpaUpdateClause.set(qAccount.accntType, entity.getAccntType());
        }
        if (!entity.getSnsAccntType().isEmpty()) {
            jpaUpdateClause.set(qAccount.snsAccntType, entity.getSnsAccntType());
        }
        if (!entity.getAccntLoginActiveYn().isEmpty()) {
            jpaUpdateClause.set(qAccount.accntLoginActiveYn, entity.getAccntLoginActiveYn());
        }
        if (!entity.getAccntEmail().isEmpty()) {
            jpaUpdateClause.set(qAccount.accntEmail, entity.getAccntEmail());
        }
        if (!entity.getAccntPwd().isEmpty()) {
            jpaUpdateClause.set(qAccount.accntPwd, entity.getAccntPwd());
        }
        if (!entity.getSparwkAccssTkn().isEmpty()) {
            jpaUpdateClause.set(qAccount.sparwkAccssTkn, entity.getSparwkAccssTkn());
        }
        if (entity.getSparwkAccssTknDt() != null) {
            jpaUpdateClause.set(qAccount.sparwkAccssTknDt, entity.getSparwkAccssTknDt());
        }
        if (!entity.getSparwkRefshTkn().isEmpty()) {
            jpaUpdateClause.set(qAccount.sparwkRefshTkn, entity.getSparwkRefshTkn());
        }
        if (entity.getSparwkRefshTknDt() != null) {
            jpaUpdateClause.set(qAccount.sparwkRefshTknDt, entity.getSparwkRefshTknDt());
        }
        if (!entity.getAccssTkn().isEmpty()) {
            jpaUpdateClause.set(qAccount.accssTkn, entity.getAccssTkn());
        }
        if (entity.getAccssTknDt() != null) {
            jpaUpdateClause.set(qAccount.accssTknDt, entity.getAccssTknDt());
        }
        if (!entity.getRefshTkn().isEmpty()) {
            jpaUpdateClause.set(qAccount.refshTkn, entity.getRefshTkn());
        }
        if (entity.getRefshTknDt() != null) {
            jpaUpdateClause.set(qAccount.refshTknDt, entity.getRefshTknDt());
        }
        if (!entity.getTerr().isEmpty()) {
            jpaUpdateClause.set(qAccount.terr, entity.getTerr());
        }
        if (!entity.getRepresIdYn().isEmpty()) {
            jpaUpdateClause.set(qAccount.represIdYn, entity.getRepresIdYn());
        }
        if (!entity.getSnsLoginUseYn().isEmpty()) {
            jpaUpdateClause.set(qAccount.snsLoginUseYn, entity.getSnsLoginUseYn());
        }
        if (!entity.getVerifyYn().isEmpty()) {
            jpaUpdateClause.set(qAccount.verifyYn, entity.getVerifyYn());
        }
        if (!entity.getUseYn().isEmpty()) {
            jpaUpdateClause.set(qAccount.useYn, entity.getUseYn());
        }
        if (entity.getAccntId() != null) {
            jpaUpdateClause.where(qAccount.accntId.eq(entity.getAccntId()));
        }
        if (entity.getAccntMasterId() != null) {
            jpaUpdateClause.where(qAccount.accntMasterId.eq(entity.getAccntMasterId()));
        }
        jpaUpdateClause.execute();
        em.flush();
        em.clear();
    }
}
```
