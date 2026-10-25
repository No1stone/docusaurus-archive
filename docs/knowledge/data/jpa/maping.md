---
format: md
id: k-maping
title: "Maping"
description: "Maping"
tags:
  - GoF
  - JPA
  - Java
  - Spring
status: active
slug: /knowledge/k-maping
---
# Maping

매핑

```java
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.Size;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "tb_profile")
public class Profile extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "profile_id")
    private Long profileId;

    @Column(name = "accnt_id")
    private Long accntId;

    @Column(name = "profile_type", nullable = true)
    @Size(max = 20, message = "profile type max length 20 / person / company / group")
    private String profileType;

    @Column(name = "verify_yn", nullable = true)
    @Size(max = 1, message = "profile verified status max length = 1")
    private String verifyYn;

    @Column(name = "privacy_visible_yn", nullable = true)
    @Size(max = 1, message = "privacy visible yes or no max length = 1")
    private String privacyVisibleYn;

    @Column(name = "permis_yn", nullable = true)
    @Size(max = 1, message = "whether permit to access the profile yes or no max length = 1")
    private String permisYn;

    @Column(name = "use_yn", nullable = true)
    @Size(max = 1, message = "whether use the profile yes or no max length = 1")
    private String useYn;

    @Column(name = "data_mig", nullable = true)
    @Size(max = 1, message = "data migration type max length = 1")
    private String dataMig;

    @Builder
    Profile(
            Long profileId,
            Long accntId,
            String profileType,
            String verifyYn,
            String privacyVisibleYn,
            String permisYn,
            String useYn,
            String dataMig) {
        this.profileId = profileId;
        this.accntId = accntId;
        this.profileType = profileType;
        this.verifyYn = verifyYn;
        this.privacyVisibleYn = privacyVisibleYn;
        this.permisYn = permisYn;
        this.useYn = useYn;
        this.dataMig = dataMig;
    }

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY, targetEntity = ProfileAttribute.class)
    @JoinColumn(name = "profile_id", referencedColumnName = "profile_id")
    private ProfileAttribute profileAttribute;

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY, targetEntity = ProfileCareer.class)
    @JoinColumn(name = "profile_id", referencedColumnName = "profile_id")
    private ProfileCareer profileCareer;

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY, targetEntity = ProfileEdu.class)
    @JoinColumn(name = "profile_id", referencedColumnName = "profile_id")
    private ProfileEdu profileEdu;

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY, targetEntity = ProfileSkill.class)
    @JoinColumn(name = "profile_id", referencedColumnName = "profile_id")
    private ProfileSkill profileSkill;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, targetEntity = ProfileCompany.class)
    @JoinColumn(name = "profile_id", referencedColumnName = "profile_id")
    private List<ProfileCompany> profileCompany;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, targetEntity = ProfileGroup.class)
    @JoinColumn(name = "profile_id", referencedColumnName = "profile_id")
    private List<ProfileGroup> profileGroup;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, targetEntity = ProfilePerson.class)
    @JoinColumn(name = "profile_id", referencedColumnName = "profile_id")
    private List<ProfilePerson> profilePerson;
```

반대쪽 에 원투원 달아주면 양방향 삭제하면 단방향

```java
@OneToOne(mappedBy = "profileAttribute")
    private Profile profile;
```
