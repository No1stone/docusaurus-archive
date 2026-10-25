---
format: md
id: k-select-hibernate
title: "Select hibernate"
description: "Hibernate 연관 조회 시 엔티티 대신 DTO와 ModelMapper를 쓰는 메모입니다."
tags:
  - JPA
  - Java
  - Spring
status: active
slug: /knowledge/k-select-hibernate
---
# Select hibernate

## 개요

Hibernate로 조회할 때 연관 엔티티까지 한꺼번에 끌려오는 문제를 줄이기 위한 메모입니다.
조회 결과를 DTO로 받아 ModelMapper로 변환하는 방식을 남겼습니다.

## 메모

연관관계는 쿼리를 날리면 매핑되어 있는 모든 엔티티를 조회합니다.
실제 조회 부하는 조회한 클래스를 사용할 때 발생하므로, DTO로 받아서 사용하는 편이 낫습니다.
ModelMapper를 이용해 쿼리 결과를 받습니다.

## 예제

```java
public List<AccountBaseDTO> AccountSelectService(Long accntId) {
        return accountRepository.findById(accntId).stream()
                .map(e -> modelMapper.map(e, AccountBaseDTO.class))
                .collect(Collectors.toList());
    }
```
