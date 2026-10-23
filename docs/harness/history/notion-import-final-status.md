---
id: notion-import-final-status
title: Notion 이전 — 원본 전체 최종 상태
description: 원본 344건을 중복 없이 최종 상태로 집계
unlisted: true
---
# Notion 이전 — 원본 전체 최종 상태

> **개요:** 인벤토리 344건을 한 원본당 한 상태로만 집계합니다.
> 행 단위 JSON은 [notion-import-final-status.json](./notion-import-final-status.json)입니다.

기준일: 2026-10-23 (작성자 검토 반영 후).

## 최종 상태 (중복 없음, 합계 344)

| 최종 상태 | 건수 | 의미 |
|---|---|---|
| 조사·보완 완료 | 163 | 시범·배치 보완 + java time / 브라우저 흐름 / GitHub Actions |
| 원문 이전만 완료 | 109 | 원본 상태=완성, 본문 보존 이전 |
| 기존 글에 통합 | 53 | 민팃·아이컴시스 |
| 확인 보류 | 12 | 작성자 재검토 대기 (`draft` 또는 미작성). [목록](./notion-import-unclear-holds.md) |
| 제외 | 7 | 빈 페이지·컨테이너 6 + centos(제목만) 1 |
| **합계** | **344** | |

보류는 완료가 아닙니다.
프로덕션 빌드에는 `draft: true`로 넣지 않습니다.

## 민팃 장애 초안 (인벤토리 1건 밖)

| 파일 | 배포 |
|---|---|
| CloudWatch 로그 연동 장애 대응 | 게시 제외 (`draft`, 나중 재작성) |
| Redis 기동 장애 대응 | 게시 보류 (`draft`, 재작성 없음) |
