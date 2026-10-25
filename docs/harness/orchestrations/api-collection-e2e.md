# Orchestration: `api-collection-e2e`

> **개요:** 내 서버 Controller API 순차 E2E 컬렉션만 추가·수정·실행합니다.
> 원셋의 E2E 템플릿은 [`ExampleItem e2e`](../templates/backend/spring/e2e/)입니다.
> 구현 원셋 전체는 [`spring-api-one-set`](/docs/harness/orchestrations/spring-api-one-set)입니다.
> 기본은 단일 에이전트입니다.

| Field | Value |
|-------|--------|
| ID | `api-collection-e2e` |
| Status | active |
| Profile hint | `docs/harness/profiles/spring-api.md` |

## 적용 조건

**적용합니다.**

- 이미 구현된 내 서버 API의 Controller CRUD 컬렉션만 고치거나 다시 실행할 때
- 원셋 복사 후 Controller API E2E 단계만 수행할 때
- 프로젝트가 Postman/Newman 또는 동등한 순차 실행을 쓸 때

**적용하지 않습니다.**

- 구현부터 테스트까지 새로 추가 → [`spring-api-one-set`](/docs/harness/orchestrations/spring-api-one-set)
- 브라우저 UI E2E만 (`playwright-e2e` 또는 `browser-manual`)
- 외부 스펙 더미 → RestClient 연동만 (원셋·이 오케스트레이션 밖 추가 조건)

가짜 CRUD나 더미 직접 호출로 Controller E2E를 대체하지 않습니다.
외부 연동 E2E와 확장 지점(삭제·없는 id)은 [`ONESET.md`](/docs/harness/templates/backend/spring/ONESET)입니다.

## 입력과 미확정

**필요합니다.**

- 컬렉션·환경 경로(없으면 ExampleItem e2e를 복사)
- 실행 명령
- `baseUrl`과 앱 기동 방법(테스트 DB·임시 포트)

## 읽을 문서와 템플릿

| Path | 언제 |
|------|------|
| `docs/harness/templates/backend/spring/e2e/README.md` | 시나리오·치환 |
| `docs/harness/templates/backend/spring/e2e/ExampleItem.api.collection.json` | 원셋 E2E |
| `docs/harness/templates/backend/spring/e2e/ExampleItem.api.environment.json` | baseUrl·runId |
| `docs/harness/templates/backend/spring/ONESET.md` | 원셋과 공유하는 치환 표 |
| `docs/harness/workflows/acceptance.md` | 통과 기준 |
| `docs/harness/tools/backend-unit-test.md` | 프로젝트에 API JUnit이 있을 때 |

## 작업 순서와 산출물

1. 시나리오 범위를 고정합니다. 기본은 등록 → 조회 → 수정 → 변경 조회 → 삭제 → 입력 오류 → 없는 id. → 포함할 요청
2. ExampleItem 컬렉션을 복사했거나 기존 컬렉션을 엽니다. → 파일
3. 경로·필드·`code`·`baseUrl`·대표 입력 오류를 치환합니다. → 컬렉션
4. 앱을 테스트 DB로 기동하고 프로젝트 명령으로 실행합니다. → 결과
5. 실패는 계약·단언·기동 중 어디인지 구분해 해당 요청만 고칩니다. → 완료 보고

## 단일 에이전트 기본 경로

컬렉션 수정과 실행은 한 에이전트가 합니다.

## 별도 에이전트

| 조건 | 역할 |
|------|------|
| 기동·컬렉션 위치를 모름 | Scout |
| 여러 팀 계약을 가로지름 | Reviewer |

## 통과 기준과 검증

| 구분 | 기준 | 방법 |
|------|------|------|
| 정상 | 등록·조회·수정·삭제 단언 통과, `itemId` 전달 | 프로젝트 컬렉션 명령 |
| 경계 | 부분 수정·`runId` 고유 데이터 | 컬렉션 |
| 실패 | 대표 입력 오류·없는 id가 성공 코드로 끝나지 않음 | 컬렉션 |

| Tool | 검증 |
|------|------|
| 프로젝트 컬렉션 실행 명령 | 기본. 카탈로그 밖이면 명령과 pass/fail만 보고 |
| `backend-unit-test` | 프로젝트에 API 순차 JUnit이 있을 때 |

## 실패·정보 부족 시

- 실행 명령이 없으면 중단합니다.
- 실서버·실키·운영 DB로 돌리지 않습니다.
- 삭제·없는 id 기대는 저장소 계약(ONESET 확장 지점)에 맞춥니다.

## 완료 보고

컬렉션 경로, 실행 명령, 요청·단언 수, 실패 여부, 치환한 경로·봉투를 적습니다.
Controller E2E와 외부 연동 E2E를 구분해서 적습니다.
