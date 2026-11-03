---
sidebar_position: 10
title: 파티션 운영
description: 파티션 생성 배치의 대상 등록, 월 경계, pmax, 재실행, 실패 처리 기준과 스케줄 수단을 정리합니다.
---

# 파티션 운영

> **앞으로 적용할 규칙:** 파티션은 애플리케이션 배치로 관리합니다.
> **신규 구현 항목:** 공통 파티션 관리 스케줄러(아래 기준을 충족하는 구현).
> **기존 구현 설명:** FarmPro 배치는 Spring Batch Job을 Quartz로 등록하는 구조입니다. `@Scheduled`로 일괄 바꾸지 않습니다.

## 스케줄 수단 (확인분)

| 항목 | 내용 |
|------|------|
| 기존 구현 | `batch` / `batch-console` 등의 `QuartzInitializer`, `QuartzJobLauncher`, `@BatchJob` cron |
| 결정 | 공통 파티션 작업도 **같은 Quartz + Batch Job 등록 흐름**을 참고합니다 |
| 하지 않음 | 기존 Job을 `@Scheduled`로 일괄 전환하지 않습니다 |

Partner Gateway·콘솔 배치는 동일 Quartz 패턴을 쓰는 모듈이 있습니다.
신규 스케줄러는 그 패턴을 복사·확장하는 방향을 **기본 관례**로 둡니다.

## 운영 기준 (앞으로 적용할 규칙)

구현 전에 문서와 코드에서 아래를 채웁니다.

| 기준 | 설명 |
|------|------|
| 대상 등록 | 대부분 `created_at` 파티션. 시간 버킷 통계만 `stat_*_at` — 목록으로 등록 |
| 월 경계 | 다음 달(또는 N개월 앞) 파티션을 언제 만드는지 |
| `pmax` | MAXVALUE 파티션 유지·REORGANIZE 순서 |
| 재실행 | 이미 있는 파티션명에 대해 idempotent 하게 동작하는지 |
| 실패 처리 | 실패 시 로그·알림·다음 실행 재시도 정책 |

보관 만료 후 정리는 [삭제와 보관](./delete-retention)의 백업·아카이빙과 맞춥니다.
단순 DROP만으로 끝내지 않는 것이 기본 방향입니다.

스키마 패턴: [파티셔닝](./partitioning)
