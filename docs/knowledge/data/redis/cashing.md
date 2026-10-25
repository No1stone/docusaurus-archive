---
format: md
id: k-cashing
title: "Cashing"
description: "캐시 Read/Modify 흐름을 단계로 정리한 메모 (원 제목 Cashing 유지)"
tags:
  - Redis
status: active
slug: /knowledge/k-cashing
---
# Cashing

> **개요:** 캐시에서 데이터를 읽고 쓰는 흐름을 단계로 적어 둔 메모입니다.
> 원 노트 제목 철자(Cashing)는 그대로 둡니다.

## Read

1. Cache에 Data 존재 유무를 확인합니다.
2. Data가 있다면 cache의 Data를 사용합니다.
3. Data가 없다면 실제 DB Data를 사용합니다.
4. DB에서 가져온 Data를 Cache에 저장합니다.

## Modify

1. Data를 Cache에 저장합니다.
2. Cache에 있는 Data를 일정 기간 동안 확인합니다.
3. 모여 있는 Data를 DB에 저장합니다.
4. Cache에 있는 Data를 삭제합니다.

읽기는 cache-aside에 가깝고, 수정은 write-behind처럼 버퍼 후 DB 반영하는 흐름으로 적어 두었습니다.
