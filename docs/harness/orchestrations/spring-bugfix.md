# Orchestration: `spring-bugfix`

> **개요:** 재현되는 버그를 최소로 고칩니다.
> 기본은 단일 에이전트입니다.
> 별도 에이전트는 [`implement.md`](/docs/harness/workflows/implement)입니다.

| Field | Value |
|-------|--------|
| ID | `spring-bugfix` |
| Status | active |
| Profile hint | `docs/harness/profiles/spring-api.md` |

## 적용 조건

**적용합니다.**

- 입력, 기대 결과, 실제 결과가 말로 고정되는 결함
- 수정 범위가 기존 동작의 복구인 경우

**적용하지 않습니다.**

- 재현이 안 되는 보고
- 새 기능 → [`spring-api-one-set`](/docs/harness/orchestrations/spring-api-one-set) 또는 기본 흐름
- 동작이 바뀌는 리팩터 → [`spring-refactor-layer`](/docs/harness/orchestrations/spring-refactor-layer)

## 입력과 미확정

**필요합니다.**

- 재현 입력과 기대·실제 결과
- 관찰 위치(로그, 화면, 테스트, API)

**미확정이면 수정하지 않습니다.**

- 기대 동작
- 수정해도 되는 파일 범위

## 읽을 문서와 템플릿

| Path | 언제 |
|------|------|
| `docs/harness/workflows/bugfix.md` | 이 상황의 절차 |
| `docs/harness/workflows/acceptance.md` | 통과 기준 형식 |
| `docs/knowledge/backend/design/testing/test-structure.md` | 재현 테스트를 둘 때 |
| 버그가 있는 층의 ExampleItem 대응 파일만 | 모양이 필요할 때. `docs/harness/templates/backend/spring/`에서 해당 층만 |
| `docs/architecture/postmortems/` | 증상이 같은 기록이 있을 때만 |

## 작업 순서와 산출물

1. 입력·기대·실제·관찰 위치를 고정합니다. → 재현 문장
2. 재현 테스트를 만들 수 있으면 수정 전에 작성해 실패를 확인합니다. → 실패하는 테스트
3. 최소 수정을 합니다. → 패치
4. 재현 테스트와 관련 회귀를 확인합니다. → 명령과 결과
5. 범위를 넘긴 변경이 없는지 확인합니다. → 완료 보고

## 단일 에이전트 기본 경로

한 에이전트가 재현, 수정, 검증을 합니다.
별도 QA 없이도 결함 해결과 범위 밖 변경 없음을 확인합니다.

## 별도 에이전트

| 조건 | 역할 |
|------|------|
| 코드 위치를 찾지 못함 | Scout |
| 수정이 공개 계약이나 여러 경계를 바꿈 | Reviewer |
| 같은 버그가 반복됨 | 후보만 기록. Curator는 사용자 요청 시 |

## 통과 기준과 검증

| 구분 | 기준 | 방법 |
|------|------|------|
| 정상 | 보고된 재현이 기대 결과로 바뀜 | 재현 테스트 또는 승인된 수동 재현 |
| 경계 | 인접 입력에서 회귀 없음 | 관련 기존 테스트 |
| 실패 | 러너·환경 문제는 구현 결함으로 단정하지 않음 | `BLOCKED`와 이유 |

도구: `backend-unit-test`.
화면만의 결함이면 `browser-manual`을 쓸 수 있습니다.

## 실패·정보 부족 시

- 재현이 안 되면 수정하지 않고 필요한 정보를 요청합니다.
- 테스트를 지워 통과시키지 않습니다.
- 승인된 수동 재현만 가능하면 방법과 한계를 적습니다.

## 완료 보고

원인 요약, 변경 파일, 검증 증거, 남은 위험, 반복 시 승격 후보를 적습니다.
