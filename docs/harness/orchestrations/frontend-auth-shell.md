---
title: Orchestration frontend-auth-shell
description: 로그인과 레이아웃 셸 얇은 레시피
---

# Orchestration: `frontend-auth-shell`

> **개요:** 로그인과 Admin 레이아웃 셸을 맞출 때 쓰는 얇은 레시피입니다.

| Field | Value |
|-------|--------|
| ID | `frontend-auth-shell` |
| Status | active |
| Profile hint | `docs/harness/profiles/cms-backoffice-fe.md` |

## 적용 조건

**적용합니다.**

- 인증 진입, 세션 복구, Admin 셸, 다크 토글만 손댈 때

**적용하지 않습니다.**

- CMS CRUD 전체 → [`frontend-cms-one-set`](/docs/harness/orchestrations/frontend-cms-one-set)

## 읽을 문서

| Path | 역할 |
|------|------|
| `docs/harness/templates/frontend/auth-login/README.md` | 로그인 슬롯 |
| `docs/harness/templates/frontend/layout-shell/README.md` | 레이아웃 |
| `docs/knowledge/frontend/architecture/runtime-architecture.md` | 런타임 |
| `docs/knowledge/frontend/design/dark-mode.md` | 다크 |

## 작업 순서

1. auth state 분기와 로그인 폼 pending을 확인합니다.
2. AdminLayout과 사이드바 key를 확인합니다.
3. 다크 토큰과 토글을 확인합니다.
4. Chrome smoke: 로그인 성공, 다크 전환, 메뉴 1회 이동.

## DoD

- 인증 상태에서 셸 진입
- 다크 토글 유지(localStorage)
- browser-manual 스모크 통과
