---
id: postmortems
title: Postmortems
description: Failures, incidents, and design mistakes
unlisted: true
---
# Postmortems

> **개요:** 실패, 장애, 잘못된 설계 기록입니다.
> 교훈이 ADR, Knowledge로 흘러가게 합니다.

이 영역의 일부 글은 기존 노션 자료를 AI의 도움으로 일괄 이전·정리했습니다.
표현이 어색하거나 설명이 충분하지 않은 부분은 직접 확인하며 순차적으로 다듬고 있습니다.

Failures, incidents, bad designs, and operational problems.

Intended feedback path:

```text
Postmortem → Decision / ADR → Knowledge / Pattern → Template → Harness
```

Not default context for routine implementation; load when investigating past lessons.

## 있는 글

### 프로젝트 개선 사례

- [민팃 개선 사례](./mintit-improvement-cases.md) — 레거시 개선 묶음
- [아이컴시스 MSA·IAM 포트폴리오](./icomsys-msa-iam-portfolio/overview.md) — 권한·MSA·AWS·데이터 경로 사례 묶음

운영 장애 대응 초안(CloudWatch·Redis)은 작성자 검토로 게시에서 제외하거나 보류 중이며, 프로덕션 빌드에 포함하지 않습니다.
