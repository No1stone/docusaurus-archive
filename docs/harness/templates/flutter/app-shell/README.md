---
title: App shell
description: Flutter 메인 셸, 하단 탭 원셋
---

# App shell

> **상태: 구현 완료, Demo.**
> [runbook](/docs/knowledge/client/flutter-harness/oneset-demo-runbook)

## 슬롯

| 슬롯 | 요구 |
|------|------|
| root nav | Catalog / Items / Alarms / Settings |
| header | 탭 제목 |
| body | IndexedStack으로 탭 상태 유지 |

## 코드

- `nutech/nutag_app_v1/lib/oneset_demo/presentation/shell/oneset_shell_page.dart`

## 조작

로그인(또는 세션 복원) 후 하단 탭 전환.
검색·필터·설정 상태가 탭 이동 후에도 유지됩니다.
