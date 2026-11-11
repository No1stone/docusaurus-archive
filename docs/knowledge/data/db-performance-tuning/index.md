---
id: data-db-performance-tuning
title: "DB 성능 튜닝"
description: "병목 진단부터 인덱스 튜닝, 조회 모델 설계, 파티션과 샤딩, 쓰기 동시성까지 DB 성능 튜닝 목차와 들어갈 하위 글 주제를 정리합니다."
sidebar_label: "DB 성능 튜닝"
slug: "/knowledge/data/db-performance-tuning"
tags:
  - Database
  - Performance
status: active
---
# DB 성능 튜닝

> **개요:** DB에서 시간이 어디로 새는지 보고, 쿼리, 조회 모델, 데이터 배치, 쓰기 범위를 나누어 다루는 글 목차입니다.
> SQL만의 주제가 아니라 진단, 인덱스, 조회 모델, 파티션과 샤딩, 동시성을 아우릅니다.
> 아래 표의 「들어갈 글」은 아직 채울 하위 주제 큐입니다.
> 할 일 목록과 같은 표는 [집 이어서 — 다음 작업](/docs/harness/history/home-continue-next)에도 둡니다.

이 페이지는 완성된 튜닝 레시피가 아닙니다.
큰 목차와 들어갈 글 제목만 먼저 고정하고, 하위 글은 이 폴더 아래에 하나씩 이어서 씁니다.
SQL / Ops, MySQL, JPA 등 인접 영역 글과도 연결합니다.

## 큰 목차

| 큰 목차 | 무엇을 바꾸나 | 들어갈 글 |
|---|---|---|
| **병목 진단** | 어디서 시간이 걸리는지 확인 | 슬로우 쿼리, 실행 계획, 락 대기, 커넥션 풀 대기 |
| **쿼리와 인덱스 튜닝** | 같은 데이터를 읽고 쓰는 방법 | 복합 인덱스 순서, 검색 조건과 정렬, N+1과 일괄 조회, 다중 조인 벌크 갱신 |
| **조회 모델 설계** | 조회 시 조합할 데이터와 미리 저장할 데이터의 경계 | `UNION ALL`을 View로 묶은 경험, 역정규화 테이블로 조회를 단순화한 경험 |
| **데이터 배치와 분산** | 데이터가 쌓이고 조회되는 단위 | 월별 파티셔닝, `pmax`와 보관 정책, 팜프로 테이블 샤딩, DB 샤딩 |
| **쓰기와 동시성 튜닝** | 한 번에 처리할 작업량과 트랜잭션 범위 | 대량 갱신 분할, 락 범위, 배치 실패와 재처리 |

## 이미 있는 글과의 연결

하위 글이 생기기 전에 참고할 수 있는 문서입니다.

| 큰 목차 | 연결 |
|---|---|
| 병목 진단 | [MySQL 진단](/docs/knowledge/data/mysql/operations/diagnostics), [인덱스와 실행 계획](/docs/knowledge/k-mysql-optimization) |
| 쿼리와 인덱스 튜닝 | [카디널리티와 복합 인덱스 순서](/docs/knowledge/data/mysql/indexes/cardinality-and-column-order), [왼쪽부터 사용하는 규칙](/docs/knowledge/data/mysql/indexes/leftmost-prefix) |
| 조회 모델 설계 | [Union All](/docs/knowledge/k-union-all) (View로 묶은 사례). 이후 역정규화 테이블로 이어 쓸 주제는 할 일 큐에 둡니다. |
| 데이터 배치와 분산 | [PARTITION](/docs/knowledge/k-partition), [파티셔닝과 pmax](/docs/knowledge/data/mysql/operations/partitioning), [Spring JPA와 시계열 파티션](/docs/knowledge/data/mysql/operations/spring-jpa-partitioned-tables) |
| 쓰기와 동시성 튜닝 | Repository 락, 배치, 알림 재발송 등 운영 글과 겹치면 그쪽에서 교차 링크합니다. |

## 읽을 때

병목 진단으로 원인을 가른 뒤, 쿼리, 조회 모델, 배치, 쓰기 순으로 범위를 좁히는 편이 안전합니다.
조회 모델의 View 경험은 정답 레시피가 아니라 부작용을 남긴 사례이고, 이후 방향은 역정규화 테이블입니다.
