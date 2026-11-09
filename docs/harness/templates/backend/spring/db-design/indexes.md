---
sidebar_position: 8
title: 인덱스
description: 공통코드 축 인덱스와 카디널리티 왼쪽 배치 관례를 정리합니다.
---

# 인덱스

> **상황별 선택:** 인덱스·UNIQUE를 둘지, 어떤 컬럼 조합인지는 **화면·트랜잭션**에 따라 엽니다.
> **기본 관례:** 둘 때는 공통코드와 주요 조회 조건을 출발점으로 하고, 복합 인덱스는 카디널리티가 높은 컬럼을 왼쪽에 둡니다.
> 목록 API 상한은 [PageQuery](/docs/harness/templates/backend/spring/support/) (기본 20 / 최대 100)와 함께 원셋 리드 경로를 막습니다.

전 테이블 일괄 인덱스 규칙은 두지 않습니다.
최종 순서는 실제 쿼리의 선두 조건, 동등·범위 검색, 정렬, 실행 계획을 확인해 정합니다.
논리 삭제 `status`가 조회 조건에 포함되는지도 함께 확인합니다.

이름을 붙일 때 형태 예: `ix_{테이블}_{컬럼…}`. `uk_` 등은 저장소 관례에 맡깁니다.

업무 `*_code`가 필터에 자주 쓰이는 이유는 [공통코드](./common-codes)를 봅니다.

일반론: [카디널리티와 컬럼 순서](/docs/knowledge/data/mysql/indexes/cardinality-and-column-order), [좌측 접두](/docs/knowledge/data/mysql/indexes/leftmost-prefix)
