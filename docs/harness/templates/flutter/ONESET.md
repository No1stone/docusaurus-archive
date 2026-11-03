---
sidebar_position: 2
title: Flutter ONESET
description: Flutter 셸, 공통 원셋. 경량 헥사 ExampleItem
---

# Flutter ExampleItem 원셋

> **상태: Demo 구현.** 검증된 제품 예제가 아니라 ExampleItem 기준 데모입니다.
> ExampleItem: `nutech/nutag_app_v1`
> 데모 진입: `lib/main_oneset_demo.dart`, 코드: `lib/oneset_demo/`
> 실행과 검증: [oneset-demo-runbook](/docs/knowledge/client/flutter-harness/oneset-demo-runbook)
> 경량 헥사: [application-structure](/docs/knowledge/frontend/architecture/application-structure), [Flutter](/docs/knowledge/client/flutter-harness/)

## 목표

유명 앱에 반복되는 셸, 인증, 설정, 알림, 목록→상세를 슬롯으로 맞춘 뒤 도메인만 채웁니다.
브랜드 UI를 복제하지 않습니다.

## 원셋 상태

| 원셋 | 구현 | 자동 검증 | 기기 실행 | 사용자 검토 |
|------|------|-----------|-----------|-------------|
| [app-shell](./app-shell/) | 완료 | 탭 유지 테스트 | 미실행 | 미완료 |
| [auth-entry](./auth-entry/) | 완료 (복원·로그인·로그아웃) | LoginFlow, dispose | 미실행 | 미완료 |
| [settings](./settings/) | 완료 (테마·언어·앱 내 알림) | — | 미실행 | 미완료 |
| [alarm-toast](./alarm-toast/) | 완료 (인앱 목록·토스트) | — | 미실행 | 미완료 |
| [empty-error](./empty-error/) | 완료 | — | 미실행 | 미완료 |
| [item-crud](./item-crud/) | 완료 (페이지·삭제·스플릿) | 레이스 테스트 | 미실행 | 미완료 |
| [ui-catalog](./ui-catalog/) | 완료 | — | 미실행 | 미완료 |
| [feed](./feed/) | Demo 골격 | — | 미실행 | 미완료 |
| [chat](./chat/) | Demo 골격 | — | 미실행 | 미완료 |
| [map](./map/) | Demo 골격 | — | 미실행 | 미완료 |
| [media](./media/) | Demo 골격 | — | 미실행 | 미완료 |

## 구조

```text
Page → ViewModel → UseCase | Flow → Port ← Demo / (Http 계약 후)
```

단일 기능은 UseCase를 직접 호출합니다.
여러 기능 조합이 필요할 때만 Flow를 둡니다 (예: LoginFlow).

## 검증 구분

포맷, `flutter analyze`, 테스트, 빌드, 시뮬 스모크는 각각 실행/미실행을 기록합니다.
현재 기록은 [runbook](/docs/knowledge/client/flutter-harness/oneset-demo-runbook)입니다.

## 복사 방식

1. README 슬롯 체크
2. `oneset_demo` 경로 또는 동등 feature 트리에 맞춤
3. Demo로 동작 확인 후 Http는 계약 확정 시만
4. 기존 `main.dart` 실서비스 진입은 건드리지 않음
