---
format: md
id: t-spring-displayname
title: "DisplayNameResolver"
description: "감사·FK PK를 Name 조회로 표시명에 치환하는 규칙"
tags:
  - Spring
  - Facade
status: active
---

# DisplayNameResolver

> **개요:** 도메인 조회 직후 감사·FK에 저장된 PK를 표시명으로 바꿉니다.
> 모노리포에서는 model에 두고, BFF는 이미 치환된 결과만 조합합니다.

## 규칙

- 클래스 이름은 `DisplayNameResolver`로 통일합니다. 도메인 접두 Facade는 두지 않습니다.
- Name 맵은 Port **`findAllName` + `Filter.ids`(IN 조회)** 로만 채웁니다.
- **Item / `findByIds`로 대체하지 않습니다.** 연관과 무거운 컬럼이 끌려옵니다.
- Spec의 `ids` IN(`PredicateBuilder.in`)과 맞춥니다.

## 캐시와의 관계

IN으로 묶은 Name 목록 전체를 캐시하기는 어렵습니다. (키 조합 폭증, 무효화)
표시명용 IN은 그대로 두고, 단건 조회 캐시는 [캐시 적용 변형](../../../cache/)의 `@Cacheable(findById)`과 별개입니다.
부하가 커지면 나중에 id 단건 캐시 후 for로 조립하는 최적화를 검토합니다.

## 파일

- [`DisplayNameResolver.java`](./DisplayNameResolver.java)
