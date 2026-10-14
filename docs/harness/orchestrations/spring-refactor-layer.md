# Orchestration: `spring-refactor-layer`

> **개요:** 동작은 유지하고 구조만 바꾸는 상황입니다.
> 기존 테스트가 녹색인 것을 기록한 뒤에 Implementer가 변경합니다.

| Field | Value |
|-------|--------|
| ID | `spring-refactor-layer` |
| When to use | 같은 입력에 같은 출력, 같은 예외, 같은 저장 상태를 유지하는 구조 변경 |
| When not to use | 새 동작, 공개 API 변경, 버그 수정 |
| Profile hint | `docs/harness/profiles/spring-api.md` |
| Status | active |

## Agent assembly

| Order | Role | Mission | Required |
|-------|------|---------|----------|
| 0 | Master | 바꿀 것과 바꾸면 안 되는 것을 고정합니다. | yes |
| 0a | Scout | 낯선 저장소면 읽기 전용 지도를 만듭니다. | no |
| 1 | Tester | 기존 스위트를 실행하고 명령과 건수를 기록합니다. 녹색이 아니면 리팩터를 시작하지 않습니다. | yes |
| 2 | Implementer | 기록된 동작을 유지한 채 구조만 바꿉니다. | yes |
| 3 | Reviewer | 레이어 경계와 템플릿에서 벗어났는지만 봅니다. | yes |
| 4 | Tester | 같은 명령을 다시 실행합니다. 건수와 통과가 같아야 합니다. | yes |
| 5 | QA | 범위와 제약을 넘지 않았는지 확인합니다. | yes |
| 6 | Curator | 새 모양이 반복되어 기준이 될 때만 승격을 제안합니다. | no |

모델 풀과 자유도는 각 역할 기본값입니다.
Implementer 자유도는 역할 기본값인 낮음을 유지합니다.

## Verification tools

| Tool | Rung / scope | Required | Evidence QA expects |
|------|--------------|----------|---------------------|
| `backend-unit-test` | 변경 전후 같은 `./gradlew test` | yes | 두 번의 command + 같은 pass/fail counts |

대상 영역에 스위트가 없으면 Tester가 그렇게 알립니다.
Master가 특성 테스트를 먼저 넣기로 하기 전에는 구조를 바꾸지 않습니다.

## Knowledge assembly

| Path | Who | Kind |
|------|-----|------|
| `docs/harness/workflows/refactor.md` | Master, Tester, Reviewer | current |
| `docs/harness/templates/backend/spring/` | Implementer, Reviewer | current |
| `docs/knowledge/backend/testing/test-structure.md` | Tester | current |
