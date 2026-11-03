---
title: Auth recovery
description: 비밀번호 재설정, 2FA pending 등 복구 흐름입니다.
---

# Auth recovery

> **개요:** 비밀번호 재설정, 2FA pending 등 복구 흐름입니다.
> ExampleItem 저장소: `nutech/fe-v1`.

## 슬롯

| 슬롯 | 요구 |
|------|------|
| recovery UI | password-reset 또는 동등 상태 |
| pending-2fa | 정책에 따라 로그인 폴백 가능 |

## fe-v1 경로

| 역할 | 경로 |
|------|------|
| App auth switch | `src/App.tsx` |

## 스모크

- [ ] 복구 상태에서 일반 메뉴가 노출되지 않음
- [ ] 완료 후 로그인 또는 authenticated로 복귀

