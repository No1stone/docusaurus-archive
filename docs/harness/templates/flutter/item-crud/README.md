---
title: Item CRUD
description: 목록→상세→등록·수정·삭제 Demo 원셋
---

# Item CRUD

> **상태: 구현 완료, Demo(메모리).** Http 미연동.
> [runbook](/docs/knowledge/client/flutter-harness/oneset-demo-runbook)

## 슬롯

검색, 상태 필터 Chip, 표시 Chip/Badge, 페이지네이션, 목록, 상세, 등록/수정 폼, 삭제, 넓은 화면 스플릿

## 코드

- `lib/oneset_demo/features/items/`
- Adapter: `adapters/demo/demo_item_repository.dart`

## 조작

셸 **Items** 탭.
필터, 검색, 더 보기, 등록, 상세, 수정, 삭제.
폭 ≥720에서 목록·상세 스플릿.
검색·필터·스크롤은 탭 이동 후에도 유지됩니다.
