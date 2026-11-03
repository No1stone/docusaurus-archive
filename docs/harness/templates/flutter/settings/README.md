---
title: Settings
description: 테마, 언어, 알림 설정 원셋
---

# Settings

> **상태: 구현 완료, Demo.**
> [runbook](/docs/knowledge/client/flutter-harness/oneset-demo-runbook)

## 코드

- `lib/oneset_demo/features/settings/demo_settings_controller.dart`
- `lib/oneset_demo/presentation/settings/oneset_settings_page.dart`
- 프로필: `features/auth/presentation/profile_*`

## 조작

셸 **Settings** 탭.
테마(시스템/밝게/어둡게), 언어(ko/en), 앱 내 알림 선호, 프로필 편집, 로그아웃.
OS 알림 권한 요청 버튼은 미연동으로 disabled입니다.
