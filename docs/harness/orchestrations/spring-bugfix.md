# Orchestration: `spring-bugfix`

> **개요:** 재현되는 버그를 최소로 고치는 상황입니다.
> 별도 에이전트는 [`implement.md`](../workflows/implement.md)입니다.
> 확인 방법은 [`acceptance.md`](../workflows/acceptance.md)의 버그 수정입니다.

| Field | Value |
|-------|--------|
| ID | `spring-bugfix` |
| When to use | 입력, 기대 결과, 실제 결과가 말로 고정되는 결함 |
| When not to use | 재현이 안 되는 보고, 새 기능, 동작이 바뀌는 리팩터 |
| Profile hint | `docs/harness/profiles/spring-api.md` |
| Status | active |

## 이 상황

별도 에이전트는 [`implement.md`](../workflows/implement.md)를 따릅니다.

- 입력, 기대, 실제, 관찰 위치가 고정되지 않으면 수정하지 않습니다.
- 재현 테스트를 만들 수 있으면 수정 전에 작성합니다. 수정 후 그 테스트와 기존 테스트의 회귀를 확인합니다.
- 러너가 없으면 구현 결함이 아닙니다. 승인된 범위 안에서 수동 재현과 검증을 수행하고 방법 및 한계를 기록합니다. 기대 동작이나 필요한 접근 범위가 불명확한 경우에만 확인합니다.
- 보고된 결함이 해결됐는지, 범위 밖 변경이 없는지는 별도 QA 없이도 확인합니다.
- 같은 버그가 반복되면 후보만 기록합니다. 문서 갱신은 사용자가 요청할 때 합니다.

모델 풀과 자유도는 각 역할 기본값입니다.

## Verification tools

| Tool | Rung / scope | 검증 | 증거 |
|------|--------------|------|------|
| `backend-unit-test` | 재현이 가능하면 재현 테스트와 기존 `./gradlew test` | 러너가 있을 때 | 실패 로그, 이후 command와 pass/fail |

이 표의 검증은 별도 에이전트 실행이 아닙니다.

## Knowledge assembly

버그가 있는 층의 템플릿만 읽습니다.
과거 장애와 증상이 같을 때만 Postmortem을 읽습니다.

| Path | Who | Kind |
|------|-----|------|
| `docs/knowledge/backend/testing/test-structure.md` | 테스트를 둘 때 | current |
| `docs/harness/workflows/bugfix.md` | 이 상황 | current |
| `docs/harness/templates/backend/spring/` | Implementer | current |
| `docs/postmortems/` | Master | 증상이 같을 때만 |
