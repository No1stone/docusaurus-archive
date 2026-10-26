---
id: notion-import-attachments
title: Notion 첨부파일 이전 목록
description: 이미지·스크린샷·다이어그램 첨부 조사와 배치
unlisted: true
---

# Notion 첨부파일 이전 목록

> **개요:** 원문에서 참조하는 이미지·스크린샷·다이어그램을 조사한 결과입니다.
> 기준은 [notion-import-worklist.md](/docs/harness/history/notion-import-worklist)의 첨부 규칙을 따릅니다.

## 기준

- 본문이 참조하는 첨부를 최종 글 옆에 두고 경로를 고칩니다.
- AWS 계정 ID·일반 리소스 식별자만으로는 제외하지 않습니다.
- 비밀번호, Secret Access Key, API Secret, 액세스·세션 토큰, 개인키는 해당 부분만 마스킹합니다.
- 회사 비용·고객 정보 등은 인증 비밀과 구분해 아래 확인 목록에 둡니다.
- 통째로 빼기보다 마스킹으로 설명 흐름을 유지합니다.

## 시범 3건

| 문서 | 첨부 | 게시 |
|---|---|---|
| [Factory Method](/docs/patterns/factory-method) | `img/factory-method/package-structure.png` | 게시 |
| [ACM·ALB](/docs/knowledge/https-on-alb-with-acm) | `img/https-on-alb-with-acm/*.png` (4) | 게시 |
| [S3 API](/docs/knowledge/amazon-s3-api-reference) | 없음 | - |

## 회사·프로젝트 사례

| 문서 | 첨부 | 게시 |
|---|---|---|
| [MSA·IAM 포트폴리오](/docs/postmortems/msa-iam-portfolio/overview) | `static/img/msa-iam-portfolio/` (Enum·Query·비용 포함) | 게시 |
| [레거시 개선 사례](/docs/postmortems/legacy-improvement-cases) | 없음 | 게시 |
| CloudWatch·Redis 장애 초안 2글 | 없음 | `draft` (게시 제외·보류) |

## 일괄 이전 첨부

| 구분 | 상태 |
|---|---|
| 본문 연결 이미지 | `docs/knowledge/img/<slug>/`, `docs/architecture/patterns/img/<slug>/`. 연결분 miss 0 |
| 원문 `image.png` 재탐색 | 가능 분은 본문 복원. 상세는 JSON |
| `secret_hint` 패턴 | 아래 분류 참고 |

## 예제·비밀 분류

| 분류 | 처리 |
|---|---|
| 일반 식별자·설정 키워드 | 유지 |
| R2dbcService password 리터럴 | 예제 값으로 확인·유지 |
| 실제 Secret Access Key, API Secret, 토큰, 개인키 | 해당 분 마스킹(현재 배치에서 해당 없음) |

## 공개 판단 (확인 반영)

| 원본/파일 | 결과 | 본문 |
|---|---|---|
| 아이컴시스 Enum·Query·비용 | 공개 허용 | 본문·이미지 유지 |
| 민팃 개선 사례 | 공개 허용 | 회사명 유지 |
| 민팃 장애 2건 | 회사명 제거 후 분리 | `cloudwatch-log-integration-incident`, `redis-startup-race-incident` |

## 전체 원본 통계

| 구분 | 건수 |
|---|---|
| 본문에서 해석·연결한 이미지 참조 | 277 |
| 본문 참조이나 파일을 찾지 못함 | 0 |
| `_imports/notion` 아래 이미지·PDF 등 파일 | 274 |
| 본문에서 직접 참조되지 않은 자산 파일 | 85 |

기계 판독용 상세: [notion-import-attachments.json](./notion-import-attachments.json)
