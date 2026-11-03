---
title: Auth login
description: 로그인과 세션 복구 진입입니다.
---

# Auth login

> **개요:** 로그인과 세션 복구 진입입니다.
> ExampleItem 저장소: `nutech/fe-v1`.

## 슬롯

| 슬롯 | 요구 |
|------|------|
| login form | id/password, 제출 pending |
| session restore | refresh 기반 복구 |
| auth states | unauthenticated 등 분기 |

## fe-v1 경로

| 역할 | 경로 |
|------|------|
| App | `src/App.tsx` |
| Auth template | `src/components/templates/AuthStateTemplate.tsx` |
| token | `src/utils/authTokenManager.ts` |

## 스모크

- [ ] 잘못된 비밀번호 시 에러 메시지
- [ ] 성공 시 authenticated 셸 진입
- [ ] 제출 중 버튼 pending

