---
sidebar_position: 1
title: Flutter
description: Flutter 경량 헥사, 셸 원셋 입구. ExampleItem nutag_app_v1
---

# Flutter

> **개요:** 모바일 Flutter의 **경량 헥사**와 기본 셸·원셋 입구입니다.
> 책임과 호출은 웹 [Frontend application-structure](/docs/knowledge/frontend/architecture/application-structure)와 같습니다. 화면 연결 이름만 ViewModel, Controller 등으로 맞춥니다.
> ExampleItem: `nutech/nutag_app_v1`. Demo로 조작 가능한 원셋이며, 제품 검증 완료 예제는 아닙니다.
> 콘솔 CMS FE는 [Frontend](/docs/knowledge/frontend/)를 봅니다. 이 트리가 웹 FE 문서를 대체하지 않습니다.

## 왜

- UI-only, 부분 연동 앱에도 Demo Adapter로 골격을 붙이고 Http를 나중에 연결합니다.
- 유명 앱에 반복되는 셸, 인증, 설정, 알림, 목록→상세를 원셋으로 복사합니다.

## 호출 구조

```text
Page·Widget
  → ViewModel·Controller (화면 연결)
      ├── 개별 기능 (SignIn, LoadProfile, ListItems, …)
      └── Flow (LoginFlow 등, 필요할 때)
            → Repository 등 계약
                ← Http / Local / Demo
```

대표:

```text
LoginPage
  → LoginViewModel
      → LoginFlow
          SignIn              → AuthRepository         → Demo / Http
          LoadProfile         → ProfileRepository      → Demo / Http
```

## ExampleItem 조사 요약 (nutag_app_v1)

| 항목 | 관찰 |
|------|------|
| SDK | `environment: sdk: ^3.10.4` |
| 상태관리 | 별도 Riverpod/Bloc 없음. `StatefulWidget` + ChangeNotifier |
| 진입 | `lib/main.dart` → `NutagApp` (실서비스) |
| 원셋 데모 진입 | `lib/main_oneset_demo.dart` (**기존 main 비대체**) |
| 원셋 코드 | `lib/oneset_demo/` |

기존 `lib/pages` 일괄 이사 없음.
실행, 코드 맵, 검증: [oneset-demo-runbook](./oneset-demo-runbook).

## Chip·Badge

공통코드는 **표시명 Chip** (`OnesetDisplayChip`), 필터는 **선택 Chip** (`OnesetFilterChip`)을 씁니다.
업무 상태는 Badge입니다.
내부 코드는 일반 사용자 Tooltip에 넣지 않고, 디버그 모드 Tooltip에만 둡니다.

## 인터랙션·로딩

웹과 동일한 기준입니다. [loading-action-ux](/docs/knowledge/frontend/design/loading-action-ux).
`OnesetPendingButton`, `OnesetSkeleton`, `OnesetAsyncBody`(최초 vs 재조회), `showOnesetToast`, `onesetPageRoute`를 Catalog와 Items·로그인·프로필에서 재사용합니다.

## 문서·원셋

| 문서 | 역할 |
|------|------|
| [application-structure](/docs/knowledge/frontend/architecture/application-structure) | 경량 헥사 공통 (FE 원본, Flutter 적용) |
| [Profile mobile-flutter](/docs/harness/profiles/mobile-flutter) | 자산 맵, 검증 |
| [Flutter ONESET](/docs/harness/templates/flutter/ONESET) | 원셋 규칙 |
| [templates/flutter](/docs/harness/templates/flutter/) | 셸, auth, settings, 확장 골격 등 |

## 상태

| 구분 | 의미 |
|------|------|
| 구현 완료 | Demo로 화면 조작 가능 |
| 자동 검증 완료 | analyze 또는 테스트 통과 |
| 기기 실행 확인 | 시뮬/기기 스모크 |
| 사용자 검토 | 디자인, 제품 확인 |

## 관련

- [Client](/docs/knowledge/client/)
- 설치 메모(이력): [flutter 설치](/docs/knowledge/k-flutter)
