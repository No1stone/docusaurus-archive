---
title: Auth entry
description: 시작, 세션 복원, 로그인 LoginFlow
---

# Auth entry

> **상태: 구현 완료, Demo.**
> [runbook](/docs/knowledge/client/flutter-harness/oneset-demo-runbook)

## 조립

```text
Bootstrap → RestoreSession
OnesetLoginPage → LoginViewModel → LoginFlow
  SignIn → AuthRepository ← DemoAuthRepository
  LoadProfile → ProfileRepository ← DemoProfileRepository
SignOut → AuthRepository
```

## 코드

- `lib/oneset_demo/features/auth/`
- `lib/oneset_demo/app/composition.dart`

## 조작

앱 시작 시 세션 복원.
`password=fail`로 실패.
Settings에서 로그아웃.
