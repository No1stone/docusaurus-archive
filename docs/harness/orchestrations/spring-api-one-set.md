# Orchestration: `spring-api-one-set`

> **개요:** ExampleItem 원셋(구현·단위/시나리오 테스트·Controller API E2E)을 복사한 뒤 도메인만 채웁니다.
> 안내 본문은 [`ONESET.md`](/docs/harness/templates/backend/spring/ONESET)입니다.
> 기본은 단일 에이전트입니다.
> 별도 에이전트는 [`implement.md`](/docs/harness/workflows/implement)입니다.

| Field | Value |
|-------|--------|
| ID | `spring-api-one-set` |
| Status | active |
| Profile hint | `docs/harness/profiles/spring-api.md` |

## 적용 조건

**적용합니다.**

- 테이블 CRUD 한 세트를 구현부터 테스트·Controller API E2E까지 같이 추가할 때
- 대상 저장소에 Controller → Facade → Service → Repository 패턴이 있거나 ExampleItem을 적용하기로 했을 때

**적용하지 않습니다.**

- 버그 수정 → [`spring-bugfix`](/docs/harness/orchestrations/spring-bugfix)
- 동작 유지 리팩터 → [`spring-refactor-layer`](/docs/harness/orchestrations/spring-refactor-layer)
- Controller API E2E 컬렉션만 수정·실행 → [`api-collection-e2e`](/docs/harness/orchestrations/api-collection-e2e)
- 외부 OpenAPI·RestClient 계약만, 현장 매뉴얼만 (공통 원셋 범위 밖)
- 외부 스펙 더미 연동 E2E만 (원셋 밖 추가 조건)

## 입력과 미확정

**필요합니다.**

- 도메인명, 테이블, 공개 경로
- 컬럼·필터 범위
- 로컬·데모 기동 방법과 테스트/컬렉션 실행 명령

**미확정이면 구현 전에 확인합니다.**

- 응답 봉투의 성공 `code`
- 없는 자원의 HTTP 상태
- 열거형 컬럼 여부

## 읽을 문서와 템플릿

폴더 전체를 읽지 않습니다.

| Path | 역할 |
|------|------|
| `docs/harness/templates/backend/spring/ONESET.md` | 복사 목록·치환·실행 순서 |
| `docs/harness/templates/backend/spring/README.md` | 원셋 범위 |
| `docs/harness/workflows/acceptance.md` | 통과 기준 |
| `docs/harness/context/coding-conventions.md` | 계층 규칙이 필요할 때 |
| `docs/development/spring/testing/test-structure.md` | 테스트 배치 |
| `docs/harness/templates/backend/spring/controller/ExampleItemController.java` | Controller |
| `docs/harness/templates/backend/spring/facade/ExampleItemFacade.java` | Facade |
| `docs/harness/templates/backend/spring/service/ExampleItemService.java` | Service |
| `docs/harness/templates/backend/spring/dto/ExampleItemReq.java` | Req |
| `docs/harness/templates/backend/spring/dto/ExampleItemRes.java` | Res |
| `docs/harness/templates/backend/spring/persistence/ExampleItem.java` | Entity |
| `docs/harness/templates/backend/spring/persistence/ExampleItemRepository.java` | Repository |
| `docs/harness/templates/backend/spring/persistence/ExampleItemSpecs.java` | Specs |
| `docs/harness/templates/backend/spring/testing/ExampleItemFacadeTest.java` | Facade 단위 |
| `docs/harness/templates/backend/spring/testing/ExampleItemServiceTest.java` | Service 단위 |
| `docs/harness/templates/backend/spring/testing/ExampleItemScenarioTest.java` | 시나리오 |
| `docs/harness/templates/backend/spring/e2e/ExampleItem.api.collection.json` | API E2E |
| `docs/harness/templates/backend/spring/e2e/ExampleItem.api.environment.json` | E2E 환경 |

**조건부:** `enum/`, `support/`는 ONESET.md와 같습니다.
Knowledge controller/facade/service는 책임이 헷갈릴 때만 읽습니다.

## 작업 순서와 산출물

1. ONESET.md의 복사 목록으로 파일을 복사합니다. → 대상 트리
2. 치환 표를 적용합니다. 경로·필드·응답 `code`를 구현·테스트·E2E에 맞춥니다. → 도메인 코드·컬렉션
3. `./gradlew test`로 Facade·Service·Scenario를 실행합니다. → 단위·시나리오 결과
4. 앱을 로컬·데모·테스트 DB로 기동합니다. → 기동 메모
5. Controller API 컬렉션을 실행합니다. 명령은 프로젝트 우선, 없으면 newman 예. → E2E 결과
6. (선택) 외부 통신이 있으면 스펙 더미 → 실제 Client 연동 E2E를 추가합니다.
7. 실패 원인을 확인한 뒤 관련 구현·설정·테스트만 수정합니다. 기대 결과 완화나 원셋 전체 재생성은 하지 않습니다. → 완료 보고

Controller API E2E만 다시 돌리거나 컬렉션만 고칠 때는 [`api-collection-e2e`](/docs/harness/orchestrations/api-collection-e2e)를 따릅니다.

## 단일 에이전트 기본 경로

익숙한 저장소에서는 한 에이전트가 복사·치환·테스트·E2E까지 합니다.

## 별도 에이전트

| 조건 | 역할 |
|------|------|
| 낯선 저장소 | Scout |
| 공개 계약·계층을 새로 정함 | Reviewer |
| 중요 UI 흐름이 같이 바뀜 | QA |

## 통과 기준과 검증

| 구분 | 기준 | 방법 |
|------|------|------|
| 정상 | 등록·조회·수정·삭제까지 테스트와 Controller E2E에서 통과 | `backend-unit-test`, 프로젝트 컬렉션 명령 |
| 경계 | 부분 수정 시 다른 필드 유지, `runId` 고유 데이터 | ServiceTest·시나리오·E2E |
| 실패 | 대표 입력 오류·없는 id가 성공 코드로 나오지 않음 | Facade/ServiceTest·E2E |

도구: `backend-unit-test`.
컬렉션 실행은 프로젝트 명령(카탈로그 밖 가능). 증거는 명령과 pass/fail입니다.

## 실패·정보 부족 시

- 경로·봉투·기동 방법이 없으면 구현을 멈추고 확인합니다.
- 저장소 패턴이 템플릿과 다르면 저장소 패턴을 따릅니다.
- 러너가 없으면 한계를 적습니다. 구현 결함으로 단정하지 않습니다.

## 완료 보고

복사·치환한 파일, `./gradlew test` 결과, 컬렉션 실행 결과, 바꾼 토큰, 남은 미확정을 적습니다.
