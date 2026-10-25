# Orchestration: `spring-external-contract`

> **개요:** 외부 스펙이나 나가는 HTTP 클라이언트의 요청·응답 계약을 맞춥니다.
> OpenAPI 변경 비교와 RestClient 헤더·본문 검증이 여기 포함됩니다.
> 하네스에 OpenAPI·RestClient 전용 템플릿은 없습니다.
> 대상 프로젝트의 스펙 파일과 기존 Client·테스트를 우선합니다.

| Field | Value |
|-------|--------|
| ID | `spring-external-contract` |
| Status | active |
| Profile hint | `docs/harness/profiles/spring-api.md` |

## 적용 조건

**적용합니다.**

- 외부 OpenAPI·스펙 버전이 바뀌어 Client fixture나 매핑을 갱신할 때
- RestClient·WebClient 등 나가는 호출의 헤더, 인증, 본문, 오류 응답 계약을 고정·검증할 때
- 운영 코드보다 테스트·fixture를 먼저 맞추는 것이 안전한 때

**적용하지 않습니다.**

- 내부 테이블 CRUD 한 세트 → [`spring-api-one-set`](/docs/harness/orchestrations/spring-api-one-set)
- 컬렉션으로 여러 API를 순서대로만 돌리는 작업 → [`api-collection-e2e`](/docs/harness/orchestrations/api-collection-e2e)
- 스펙 없이 새 연동 아키텍처를 설계하는 작업

## 입력과 미확정

**필요합니다.**

- 이전·이후 스펙 또는 변경 요약
- 대상 Client·Port 클래스와 기존 테스트·fixture 경로
- 인증 헤더 규칙(무엇을 넣고 무엇을 넣지 않는지)

**미확정이면 확인합니다.**

- 예시 시각·버전만 바뀐 것인지, 필드·필수 여부가 바뀐 것인지
- 더미·일회 키와 실키를 테스트에서 어떻게 구분하는지

## 읽을 문서와 템플릿

| Path | 언제 |
|------|------|
| `docs/harness/workflows/acceptance.md` | 계약·실패 기준을 정할 때 |
| `docs/knowledge/backend/testing/test-structure.md` | Client·계약 테스트 배치 |
| `docs/harness/context/coding-conventions.md` | 계층 경계가 헷갈릴 때 |
| `docs/architecture/adr/ADR-0004-blocking-flow-uses-mvc.md` | 블로킹 RestClient와 MVC 전제를 확인할 때 |

구현 템플릿 폴더는 이 상황의 기본 입력이 아닙니다.
대상 저장소의 기존 Client, fixture, WireMock·MockWebServer 패턴을 재사용합니다.

## 작업 순서와 산출물

1. 스펙 또는 계약을 비교합니다. → 변경 목록(필드, 헤더, 상태 코드)
2. 통과 기준을 정상·경계·실패로 적습니다. → 기준
3. 기존 테스트를 먼저 갱신하거나, 없으면 최소 계약 테스트를 추가합니다. → 실패하는 테스트
4. Client·매핑·헤더 설정을 최소로 맞춥니다. → 코드
5. 관련 테스트를 실행합니다. → 명령과 결과
6. 운영 주소·실키·고객 데이터가 들어가지 않았는지 확인합니다. → 완료 보고

## 단일 에이전트 기본 경로

스펙 비교와 fixture·테스트 갱신은 한 에이전트가 합니다.
레시피를 골라도 Reviewer를 기본 실행하지 않습니다.

## 별도 에이전트

| 조건 | 역할 |
|------|------|
| Client 위치·기존 패턴을 모름 | Scout |
| 인증·오류 계약이 여러 시스템에 공유되어 정합성이 중요함 | Reviewer |
| 사용자-visible 연동 화면 흐름이 같이 바뀜 | QA |

## 통과 기준과 검증

| 구분 | 기준 | 방법 |
|------|------|------|
| 정상 | 변경된 필수 필드·헤더가 요청에 반영됨 | `backend-unit-test` |
| 경계 | 생략 가능한 필드, 빈 값, 버전·시각만 변경 | fixture 단언 |
| 실패 | 4xx·5xx·타임아웃 매핑이 기존 규칙과 맞음 | 계약 테스트 |

도구: `backend-unit-test`.
컬렉션 전체 순회는 [`api-collection-e2e`](/docs/harness/orchestrations/api-collection-e2e)입니다.

## 실패·정보 부족 시

- 이전 스펙이 없으면 변경 목록을 사용자에게 요청합니다.
- 테스트를 약화해 맞추지 않습니다.
- 실키·운영 URL이 필요하면 중단하고 더미 경로를 요청합니다.

## 완료 보고

스펙 차이 요약, 변경한 Client·fixture·테스트, 검증 결과, 넣지 않은 헤더·필드, 남은 미확정을 적습니다.
