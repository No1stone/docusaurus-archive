---
id: adr-0011
title: "FE는 취약점이 해결된 React와 Node 패치 라인을 쓴다"
sidebar_label: "FE React/Node 패치 런타임"
description: "React Server Components 등 공개 취약점 대응을 위해 FE 런타임과 의존성을 패치된 버전으로 고정한다"
tags:
  - ADR
  - Security
  - React
  - Node
  - Frontend
status: accepted
slug: "/decisions/adr-0011"
---

# FE는 취약점이 해결된 React와 Node 패치 라인을 쓴다

| 항목 | 내용 |
|------|------|
| 상태 | Accepted |
| 결정일 | 2026-11-03 |
| 대상 | CMS 업무 백오피스 FE, 신규 React 앱, 관련 Node 런타임 |
| 목적 | 공개된 React/Node 보안 권고에 맞춰 패치 라인을 기본으로 둔다 |

## Context

2025년 말부터 React Server Components 구현체에서 미인증 RCE 등 치명적 취약점(CVE-2025-55182 및 후속 DoS·소스 노출 권고)이 공개되었습니다.
Next.js 등 RSC를 쓰는 스택은 프레임워크 패치 표까지 따릅니다.

Vite SPA처럼 RSC를 쓰지 않는 앱도 `react` / `react-dom`과 Node LTS를 방치하면 종속 경로·툴체인에서 낡은 버전에 묶일 수 있습니다.
하네스는 제품별 특수 버전보다 **작업 시점의 패치된 라인**을 쓰라고 명시합니다.

## Decision

1. 신규·유지보수 FE는 **취약점이 해결된 React 및 관련 패키지**를 사용합니다.
2. 로컬·CI·배포 Node는 **지원 중인 LTS(또는 프로젝트 합의 라인)의 패치 버전**을 사용합니다.
3. RSC / Next / 동등 프레임워크를 쓰면 해당 유지보수자가 공지한 **패치 버전표**를 따릅니다.
4. 정확한 버전 숫자는 이 ADR에 영구 고정하지 않습니다. 작업 전에 공식 advisory와 릴리스 노트를 확인하고 `package.json` / lock / `.nvmrc`(또는 동등)에 반영합니다.
5. CMS 업무 백오피스 Frontend knowledge와 build-env 문서는 본 ADR을 링크합니다.

### 참고 (작성 시점 예시, 곧 낡을 수 있음)

- React RSC 패키지: 영향 버전 19.0.0 / 19.1.0–19.1.1 / 19.2.0 → 패치 라인은 advisory의 최신 권고를 확인합니다 (초기 19.0.1 등으로 부족했던 후속 패치가 있음).
- Node: 사용 중인 major의 최신 보안 패치를 적용합니다.

## Consequences

- 에이전트·개발자는 “예전에 돌던 버전”보다 패치 라인을 우선합니다.
- lockfile 갱신과 CI Node 이미지 업데이트가 일상 작업이 됩니다.
- RSC 미사용 SPA라도 React major를 올릴 때는 changelog와 breaking을 함께 봅니다.

## Related

- [Frontend knowledge](/docs/knowledge/frontend/)
- [build-env-matrix](/docs/knowledge/frontend/operations/build-env-matrix)
- [ADR-0009](/docs/decisions/adr-0009) (PHP 보안 런타임 — 동일하게 패치 우선 원칙)
