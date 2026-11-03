---
title: Profile mobile-flutter
description: Flutter 모바일 셸·경량 헥사 Profile. ExampleItem nutag_app_v1
---

# Profile: mobile-flutter

> **개요:** 소비자·업무 모바일 Flutter 앱의 셸·공통 표면·경량 헥사 Profile입니다.
> ExampleItem: `nutech/nutag_app_v1` (초안 원셋).
> 웹 CMS 콘솔은 [cms-backoffice-fe](/docs/harness/profiles/cms-backoffice-fe)입니다.

## Question

Flutter 앱에 보통 어떤 골격·원셋·검증을 쓰는가?

## Asset map

### Knowledge

- [Flutter index](/docs/knowledge/client/flutter-harness/)
- [application-structure](/docs/knowledge/frontend/architecture/application-structure) (경량 헥사 공유)
- [demo-vs-wired](/docs/knowledge/frontend/architecture/demo-vs-wired) (계약←Demo/Http)

### Templates

- [Flutter templates](/docs/harness/templates/flutter/)
- [ONESET](/docs/harness/templates/flutter/ONESET)

### Verification

실행 기록의 단일 출처: [oneset-demo-runbook](/docs/knowledge/client/flutter-harness/oneset-demo-runbook).

| 검사 | 기록 |
|------|------|
| 포맷 | `dart format` |
| 정적 분석 | `flutter analyze` |
| 단위, Widget 테스트 | UseCase/Flow, Demo, 대표 페이지 |
| 번들 빌드 | `flutter build apk` 등 (가능 시) |
| 시뮬/기기 스모크 | 실행했을 때만 |

`analyze`/빌드 성공 ≠ 디자인, 사용자 검토 완료.

## Stack notes

- 전형: Flutter Material. 상태관리는 프로젝트 방식 유지 (ExampleItem은 StatefulWidget+서비스).
- 경량 헥사: Screen → VM → 기능|Flow → Repository ← Demo/Http/Local
- Chip/Badge: 표시명 Chip, 선택 Chip, 상태 Badge. 내부 코드는 debug만
- 앱 내 알림 설정과 OS 알림 권한을 분리. 미연동은 disabled + 안내
- 교체 항목: 인증, 푸시 SDK, 포털/농장 스코프, API base
- 기존 앱 진입(`main.dart`)을 원셋 데모로 바꾸지 않음 → `main_oneset_demo.dart`
- 확장(피드, 채팅, 지도, 미디어)은 Demo 골격. SDK/전송/업로드는 미연동
