---
format: md
id: k-replication
title: "Replication"
description: "MySQL·DB 복제(소스/레플리카)와 Spring에서 읽기·쓰기를 나누는 메모입니다."
tags:
  - Spring
status: active
slug: /knowledge/k-replication
---
# Replication

## 개요

복제(Replication)는 소스(마스터) DB의 변경을 하나 이상의 레플리카(슬레이브)에 자동으로 맞추는 구성입니다.
쓰기는 소스, 읽기는 레플리카로 나누면 select 부하를 분산할 수 있습니다.
레플리카는 지연이 있을 수 있어, 쓰기 직후 읽기 일관성이 필요하면 소스에서 읽거나 세션 정책을 둡니다.

## Spring에서 읽기 라우팅

앱에서는 라우팅 DataSource로 `@Transactional(readOnly = true)`일 때 레플리카를 보게 하는 패턴이 흔합니다.
추상 라우팅 키(lookup key)로 master/slave를 고르고, 트랜잭션 동기화와 커넥션 획득 순서를 맞춥니다.
복제 자체(바이너리 로그·GTID) 설정과 앱 라우팅은 층을 나눠 봅니다.

<details>
<summary>참고 자료</summary>

- [escapefromcoding — MySQL Replication](https://escapefromcoding.tistory.com/710)
- [velog — DB Spring Replication](https://velog.io/@max9106/DB-Spring-Replication)
- [dev-chung — Replication](https://dev-chung.tistory.com/33)
</details>
