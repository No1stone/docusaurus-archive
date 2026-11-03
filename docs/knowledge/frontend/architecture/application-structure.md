---
title: Application structure
description: FE 경량 헥사. 화면 연결, Flow, 개별 기능, 계약, Http·Demo 구현
---

# Application structure (경량 헥사)

> **채택 기준.** 웹 Frontend의 **경량 헥사**입니다.
> 기능별로 묶어 수정 위치를 찾고, 공개 조각·원셋을 조합하기 쉽게 둡니다.
> 백엔드와 구조는 같고, **유스케이스(개별 기능) 진입만 FE에서 완화**합니다.
> ExampleItem(`nutech/fe-v1`) 폴더는 이력 매핑입니다. 즉시 이사·빈 폴더 강제가 아닙니다.
> Flutter도 같은 책임. 화면 연결 이름만 상태관리에 맞춥니다. Flutter 입구·원셋: [Client Flutter](/docs/knowledge/client/flutter-harness/).

## 왜

- 수정할 기능·계약을 빠르게 찾습니다.
- 개별 기능·Flow·화면 연결·Demo/Http 구현을 원셋처럼 붙입니다.
- 한 줄만 전달하는 계층은 늘리지 않습니다. 이미 있는 개별 기능의 **조합·재사용**은 유지합니다.

## 호출 구조

```text
Page·Component
  → 화면 연결 (React: useXxx)
      ├── 공개 개별 기능 (SignIn, LoadProfile, …)
      └── 공개 조합 (LoginFlow, Coordinator, …)
            → 개별 기능 → 계약(Repository·Gateway 등)
                              ↑ 구현
                         Http · Local · Demo · 브라우저
```

대표 예:

```text
LoginPage
  → useLogin
      → LoginFlow
          SignIn                    → AuthRepository         → Http / Demo
          LoadProfile               → ProfileRepository      → Http / Demo
          (선택) RegisterDeviceToken → DeviceTokenRepository  → Http / Demo
```

각 개별 기능(UseCase)이 **자기 계약(Repository 등)** 을 쓰고, Flow는 그 기능들을 순서·조건으로 조합합니다.
## 책임과 네이밍 (FE 감각 · 닫힌 목록 아님)

| 역할 | 책임 | 이름 감각 | 예 |
|------|------|-----------|-----|
| Page·Component | 표시, 입력, 이벤트 | Page, Form, Table, Sheet | `LoginPage` |
| 화면 연결 | UI 상태, Application 호출, 캐시·렌더 연결 | React `useXxx`. Flutter는 ViewModel·Controller 등 | `useLogin` |
| 유스케이스 조합 | 기존 기능을 묶어 업무 흐름 | Flow·Coordinator·Facade 등. Processor·Manager **금지 아님** | `LoginFlow` |
| 개별 기능 | 재사용 가능한 한 가지 동작 | 동작 중심. 필요 시만 `UseCase` 접미사 | `SignIn`, `LoadProfile` |
| 계약 | Application이 필요로 하는 능력 | Repository·Gateway·Port·Provider 등 | `AuthRepository` |
| 구현 | 계약을 외부에 연결·변환 | Http·Local·Demo 등이 드러나게 | `HttpAuthRepository` |

함수·객체·클래스 중 적절한 형태를 씁니다.
백엔드 [ADR-0010](/docs/decisions/adr-0010)의 Facade 기본명·트랜잭션 경계를 FE에 이식하지 않습니다.

## 백엔드와 다른 점 (유스케이스 사용)

| | 백엔드 (요지) | 프론트 (채택) |
|--|---------------|---------------|
| 구조 | 경량 헥사 | **경량 헥사** |
| 공개 진입 | 조합 진입(Facade 등)을 강조하는 편 | 화면 연결이 **개별 기능과 조합 둘 다** 호출 가능 |
| 단일 기능 | 조합 뒤로 숨기는 경우가 많음 | 단일면 `SignIn` 등 **직접** 호출. 전 화면 Flow 강제 없음 |
| 다호출 | DB·업무 경계와 맞물릴 수 있음 | DB 단일 트랜잭션처럼 설명하지 않음 |

Flow·Facade는 화면용 BFF가 아닙니다.
여러 화면에서도 재사용할 수 있는 **Application의 업무 흐름·기능 조합**입니다.

## 호출 규칙

1. 화면 연결은 공개 개별 기능과 공개 조합을 모두 호출할 수 있습니다.
2. 다른 feature의 계약·구현을 직접 쓰지 않습니다. 그 feature의 공개 Application 진입점만 씁니다.
3. Application은 구체 구현체가 아니라 **계약**에 의존합니다.
4. 계약↔구현 연결은 `app/composition`(또는 동등 조립 지점)에서 합니다.
5. 순환 의존을 만들지 않습니다.
6. Flow·개별 기능 모듈은 **React 훅을 호출하지 않습니다.** 화면과 독립 TypeScript로 테스트합니다.

## 화면 연결 vs Application

| 두는 곳 | 내용 |
|---------|------|
| Application | 실행 순서·조건·기능 조합, 필수/선택 실패 정책 |
| 화면 연결 | 로딩·오류·선택·입력 상태, 렌더링, 조회 캐시와의 연결 |
| 서버 상태 계층 | 응답 캐시, invalidate, 재시도·취소(라이브러리 정책) |
| 구현체 | HTTP·직렬화·로컬/브라우저 저장소 |

훅과 Flow에 같은 처리 흐름을 중복하지 않습니다.
캐시 라이브러리의 재시도·취소와 Application 정책을 이중으로 쓰지 않습니다.

## 비동기 조합 (LoginFlow)

- 순서가 필요한 단계와 병렬 가능한 단계를 구분합니다.
- 필수 단계 실패와 선택 단계 실패를 구분합니다.
- 실패 후 이후 진행 여부, 재시도 가능 여부, 화면 종료·새 요청 시 취소/이전 결과 무시, 부분 성공 표시를 필요한 범위만 적습니다.
- 보상 처리·범용 워크플로 엔진을 만들지 않습니다.

## 데모와 실연동

같은 계약에 Demo 구현과 Http 구현을 바꿉니다.
화면·위젯·개별 기능을 불필요하게 두 벌로 복제하지 않습니다.
자세한 규칙은 [demo-vs-wired](./demo-vs-wired).

## 다운로드 (신규)

```text
화면 연결 훅 → ExportList(등 동작명) → 목록/파일 계약 → Http 구현
```

Page에서 `fetch*ForDownload`를 직접 부르는 것은 ExampleItem **이력**입니다.
[excel-download](/docs/harness/templates/frontend/excel-download/), [folder-structure](../folder-structure).

## 관련

- [folder-structure](../folder-structure)
- [state-ownership-model](../state/state-ownership-model)
- [ADR-0010](/docs/decisions/adr-0010) (BE 네이밍 참고, FE 용어 강제 아님)
- [ADR-0011](/docs/decisions/adr-0011) 패치 런타임
