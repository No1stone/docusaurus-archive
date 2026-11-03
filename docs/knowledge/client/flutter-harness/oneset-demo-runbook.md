---
sidebar_position: 2
title: Oneset demo runbook
description: nutag_app_v1 원셋 데모 실행, 코드 위치, 검증 상태
---

# Oneset demo runbook

> ExampleItem: `nutech/nutag_app_v1`
> 실서비스 진입 `lib/main.dart`는 변경하지 않습니다.

## 실행

```bash
cd nutech/nutag_app_v1
flutter run -t lib/main_oneset_demo.dart
```

흐름: **초기 로딩(세션 복원)** → 필요 시 **로그인(LoginFlow)** → 셸 탭 **Catalog / Items / Alarms / Settings**.

데모 로그인: 아이디 임의 + 비밀번호 `demo`.
실패 재현: 비밀번호 `fail`.
세션은 SharedPreferences에 userId만 남깁니다. 비밀번호는 저장하지 않습니다.

## 코드 맵

| 원셋 | 경로 | Adapter | 구현 / 검증 |
|------|------|---------|-------------|
| 진입 | `lib/main_oneset_demo.dart` | — | 구현 완료 |
| composition | `lib/oneset_demo/app/composition.dart` | Demo 조립 | 구현 완료 |
| 앱 시작·인증 | `features/auth/` (bootstrap, LoginFlow, SignOut, RestoreSession) | DemoAuth | 구현 완료, 단위·안전 테스트 |
| 프로필 | `features/auth/presentation/profile_*` | DemoProfile | 구현 완료 |
| 설정 | `features/settings/`, `presentation/settings/` | Demo Settings | 구현 완료 (테마, 언어, 앱 내 알림) |
| 알림 | `features/alarms/` | DemoAlarm | 구현 완료 (목록, 읽음, 상세) |
| CRUD | `features/items/` | DemoItem | 구현 완료 (검색, 필터, 페이지, 상세, 생성, 수정, 삭제) |
| 반응형 | `item_list_page` LayoutBuilder | — | ≥720px 목록·상세 스플릿 |
| UI 카탈로그 | `presentation/catalog/` | — | 인터랙션·pending·Skeleton·재조회·Chip/Badge |
| pending 버튼 | `shared/ui/oneset_pending_button.dart` | — | 로그인·프로필·Items·Catalog |
| Skeleton | `shared/ui/oneset_skeleton.dart` | — | 최초 로딩, 모션 감소 존중 |
| 화면 전환 | `shared/ui/oneset_page_route.dart` | — | fade/slide |
| 피드 | `features/feed/demo_feed_pages.dart` | Demo 골격 | 목록→상세, 좋아요 미연동 |
| 채팅 | `features/chat/demo_chat_pages.dart` | Demo 골격 | 목록→대화방, 전송 미연동 |
| 지도 | `features/map/demo_map_pages.dart` | Demo 골격 | 목록→상세, SDK 미연동 |
| 미디어 | `features/media/demo_media_pages.dart` | Demo 골격 | 목록→미리보기, 업로드 미연동 |
| empty-error | `shared/ui/oneset_async_body.dart` | — | Catalog에서 단계 전환 |
| Chip | `oneset_display_chip`, `oneset_filter_chip` | — | 표시/선택 분리, 코드는 debug Tooltip |
| Badge | `oneset_status_badge.dart` | — | 업무 상태 |
| toast | `oneset_toast.dart` | Demo SnackBar | OS 푸시 아님 |

Http Adapter는 계약 확정 전 **미구현**입니다.
Demo Item은 앱 재시작 시 초기화됩니다. 세션·테마·언어·앱 내 알림 선호는 prefs에 남을 수 있습니다.

## 조작 체크

| 원셋 | 조작 |
|------|------|
| 앱 시작·인증 | 재실행 시 세션 복원, `fail` 실패, Settings 로그아웃 |
| 프로필 | Settings → 프로필, 이름·소개 저장 |
| 설정 | 테마/언어 전환, 앱 내 알림 스위치, OS 권한 버튼 disabled |
| 알림 | Alarms 탭, 상세 진입 시 읽음 |
| CRUD | Items 검색·필터·더 보기·등록·상세·수정·삭제 |
| 반응형 | 넓은 화면에서 목록 선택 시 우측 상세 |
| 확장 | Catalog에서 피드/채팅/지도/미디어 진입 |

## 검증 상태 구분

| 구분 | 의미 |
|------|------|
| 구현 완료 | Demo로 화면 조작 가능 |
| 자동 검증 완료 | analyze 또는 테스트 통과 |
| 기기 실행 확인 | 시뮬/실기기 스모크 |
| 사용자 검토 | 디자인·제품 확인 |

## 검증 기록

| 검사 | 결과 |
|------|------|
| `flutter analyze lib/oneset_demo lib/main_oneset_demo.dart` | **자동 검증 완료** (No issues) |
| `flutter test test/oneset_demo` | **자동 검증 완료** (LoginFlow, dispose/레이스, 탭 유지, 페이지 실패 재시도, 스플릿 삭제) |
| `flutter build apk --debug -t lib/main_oneset_demo.dart` | **자동 검증 완료** (app-debug.apk) |
| iOS 빌드 | **미실행** |
| 시뮬 스모크 | **미실행** |
| 사용자 디자인 검토 | **미완료** |

## 관련

- [Flutter harness](./)
- [ONESET](/docs/harness/templates/flutter/ONESET)
- [mobile-flutter Profile](/docs/harness/profiles/mobile-flutter)
