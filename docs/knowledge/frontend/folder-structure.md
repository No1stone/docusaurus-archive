---
sidebar_position: 2
title: Folder structure
description: FE 경량 헥사. 기능별 폴더와 책임·호출 방향
---

# Folder structure

> **개요:** **경량 헥사**의 책임과 의존 방향을 폴더 예시로 보여 줍니다.
> 즉시 이사하거나 빈 폴더를 전부 만들지 않습니다.
> 호출·네이밍 본문은 [application-structure](./architecture/application-structure)입니다.
> ExampleItem 경로 예: `nutech/fe-v1/src` (이력 매핑용).

## 목표 트리 (책임 설명용 예시)

```text
src/
├── app/
│   └── composition/          # 계약과 Http·Demo 등 구현 연결
├── shared/
│   ├── ui/
│   └── infrastructure/       # 공통 HTTP client 등
└── features/
    └── auth/
        ├── presentation/
        │   ├── pages/
        │   ├── components/
        │   └── hooks/        # 화면 연결 useXxx
        ├── application/
        │   ├── usecases/     # SignIn, LoadProfile 등 (폴더명 예)
        │   └── flows/        # LoginFlow 등 조합 (Facade·Coordinator 가능)
        ├── domain/           # 필요한 모델·순수 규칙
        ├── ports/            # 계약 (Repository·Gateway 등 타입)
        └── adapters/
            ├── http/
            ├── local/
            └── demo/
```

Atomic Design(`atoms`/`molecules`/…)은 UI 구성 분류입니다. Application·계약·구현과 **별개 축**입니다.

## 책임

| 영역 | 책임 | 이름 감각 |
|------|------|-----------|
| Page·Component | 표시, 입력, 이벤트 | Page, Form, Table, Sheet |
| 화면 연결 | UI 상태, Application 호출, 캐시·렌더 | `useXxx` |
| 조합 | 개별 기능을 묶어 흐름 | Flow·Coordinator·Facade 등 |
| 개별 기능 | 재사용 가능한 한 동작 | `SignIn`, `LoadProfile` … |
| 계약 | Application이 필요로 하는 능력 | Repository·Gateway·Port·Provider |
| 구현 | 계약 구현 | Http·Local·Demo … |

기본 흐름:

```text
Page → useXxx → (개별 기능 | Flow) → 계약 ← Http·Demo 구현
```

- 화면 연결은 공개 개별 기능과 공개 조합을 **모두** 호출할 수 있습니다. 전 화면 Flow 강제 없음.
- Application은 구현체가 아니라 계약에 의존합니다. 조립은 `app/composition`.
- React Query·Zustand·특정 라우터를 강제하지 않습니다.
- 로컬 state로 충분하면 Store를 만들지 않습니다.

## ExampleItem 매핑 (이력)

| ExampleItem | 신규 책임에 대응하면 |
|-------------|----------------------|
| `components/pages/` | `features/*/presentation/pages` |
| `hooks/` (화면·조회 연결) | `presentation/hooks` 화면 연결 |
| `hooks/` 안에 섞인 업무 조합 | `application/flows` 또는 개별 기능으로 분리 권고 |
| `api/*.ts` | `adapters/http` (+ 계약 타입은 `ports/`) |
| `stores/` UI만 | presentation UI state. 서버 목록 복제 금지 |
| `components/organisms` 등 | presentation/components 또는 shared/ui |

## Page·훅의 HTTP 직접 호출

| 경로 | 신규 기준 |
|------|-----------|
| 목록·상세·mutation | Page·훅에서 Http 모듈 직접 호출 **금지**. 공개 개별 기능 또는 Flow |
| 엑셀 다운로드 | `useXxx` → `ExportList`(등) → 계약 → Http. [excel-download](/docs/harness/templates/frontend/excel-download/) |
| ExampleItem Page/`fetch*ForDownload` 직접 | **이력**. 신규에 복제하지 않음 |

## 레이아웃 슬롯명

`ManagementPageLayout` prop은 **`filter` / `list` / `sheets`** 입니다.
표 UI는 `list` 슬롯 안의 `ManagementTableShell`입니다.

## CMS 조립

1. 필터(UI state)와 목록 화면 연결 훅을 연결합니다.
2. `ManagementPageLayout`에 `filter`, `list`, `sheets`를 채웁니다.
3. 공통코드가 있으면 `nameMaps`를 Chip·Select에 전달합니다.
4. export가 있으면 다운로드 개별 기능·계약을 붙입니다.

## 관련

- [application-structure](./architecture/application-structure)
- [state-ownership-model](./state/state-ownership-model)
- [demo-vs-wired](./architecture/demo-vs-wired)
- [ADR-0011](/docs/decisions/adr-0011) 패치 런타임
