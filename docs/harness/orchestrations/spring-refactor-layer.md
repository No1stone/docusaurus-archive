# Orchestration: `spring-refactor-layer`

> **개요:** 동작은 유지하고 구조만 바꾸는 상황입니다.
> 별도 에이전트는 [`implement.md`](/docs/harness/workflows/implement)입니다.

| Field | Value |
|-------|--------|
| ID | `spring-refactor-layer` |
| When to use | 같은 입력에 같은 출력, 같은 예외, 같은 저장 상태를 유지하는 구조 변경 |
| When not to use | 새 동작, 공개 API 변경, 버그 수정 |
| Profile hint | `docs/harness/profiles/spring-api.md` |
| Status | active |

## 이 상황

별도 에이전트는 [`implement.md`](/docs/harness/workflows/implement)를 따릅니다.

- 바꿀 것과 바꾸면 안 되는 것을 먼저 고정합니다.
- 변경 전 기존 스위트가 통과하는지 기록합니다. 녹색이 아니면 시작하지 않습니다.
- 기존 검증 범위를 보존하고 동작이 유지되는지 확인합니다.
- 필요한 추가 테스트는 허용합니다. 삭제나 대체가 필요하면 이유를 기록합니다.
- 테스트 건수는 실행 증거이며 품질의 단독 기준이 아닙니다.
- 대상 영역에 스위트가 없으면 그렇게 알립니다. 특성 테스트를 먼저 넣기로 하기 전에는 구조를 바꾸지 않습니다.
- 범위와 제약을 넘지 않았는지는 별도 QA 없이도 확인합니다.
- 새 모양이 반복되면 후보만 보고합니다. 문서 갱신은 사용자가 요청할 때 합니다.

모델 풀과 자유도는 각 역할 기본값입니다.
Implementer 자유도는 역할 기본값인 낮음을 유지합니다.

## Verification tools

| Tool | Rung / scope | 검증 | 증거 |
|------|--------------|------|------|
| `backend-unit-test` | 변경 전후 같은 `./gradlew test` | 스위트가 있을 때 | 변경 전 통과 기록, 변경 후 command와 pass/fail. 기존 검증 범위 유지 |

이 표의 검증은 별도 에이전트 실행이 아닙니다.
테스트 건수가 달라도, 기존 검증이 남고 동작이 유지되면 그 자체로 실패가 아닙니다.

## Knowledge assembly

| Path | Who | Kind |
|------|-----|------|
| `docs/harness/workflows/refactor.md` | 이 상황 | current |
| `docs/harness/templates/backend/spring/` | 구현 | current |
| `docs/knowledge/backend/testing/test-structure.md` | 테스트를 둘 때 | current |
