---
format: md
id: k-auditing
title: "Auditing"
description: "Auditing"
tags:
  - JPA
  - Java
  - Spring
status: active
slug: /knowledge/k-auditing
---
# Auditing

입력자동화

```java
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.Column;
import javax.persistence.EntityListeners;
import javax.persistence.MappedSuperclass;
import java.time.LocalDateTime;

@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public class BaseEntity {
    @Column(name = "reg_usr", updatable = false)
    //first registrant
    @CreatedBy
    private Long regUsr;

    @Column(name = "reg_dt", updatable = false)
    @CreatedDate//serverTime
    //@CreationTimestamp//dbtime
    private LocalDateTime regDt;

    @Column(name = "mod_usr")
    @LastModifiedBy
    private Long modUsr;

    @Column(name = "mod_dt")
    @LastModifiedDate//serverTime
    //@UpdateTimestamp//dbtime
    private LocalDateTime modDt;
}
```

사용하는쪽은

상속만 받으면 끝

```java
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.Size;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "tb_profile_attribute")
public class ProfileAttribute extends BaseEntity {

    @Id
    @Column(name = "profile_id")
    private Long profileId;

    @Column(name = "attr_type", nullable = true)
    @Size(max = 20, message = "type of attribute max length = 20 /GERNE, MOOD, ROLE, THEME, TERRTORY")
    private String attrType;

    @Column(name = "attr_cd", nullable = true)
    @Size(max = 100, message = "attribute code max length = 100 /interested in genre code about song cd_type='GENR', 'MOOD', 'ROLE', 'THEM', 'TERR'")
    private String attrCd;

    @Builder
    ProfileAttribute(
            Long profileId,
            String attrType,
            String attrCd
    ) {
        this.profileId = profileId;
        this.attrType = attrType;
        this.attrCd = attrCd;
    }

    @OneToOne(mappedBy = "profileAttribute")
    private Profile profile;
}
```

빈도 추가해줘야함.

```java
@Resource
    private TokenBodyDTO tb;

    @Bean
    public AuditorAware<Long> auditorAware(HttpServletRequest req){
        //TokenBodyDTO tb = (TokenBodyDTO) req.getAttribute("TokenBody");
        //   return () -> Optional.of(account.getAccntId());
//        if(req.getHeader("AccountId").isEmpty() || req.getHeader("AccountId")==null){
//            return ()-> Optional.of(0L);
//        }
        return () -> Optional.of(Long.parseLong(req.getHeader("AccountId")));
//        return () -> Optional.of(tb.getUserId());
    }
```
