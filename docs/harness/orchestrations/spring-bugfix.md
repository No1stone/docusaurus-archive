# Orchestration: `spring-bugfix`

> **개요:** 재현되는 버그를 최소로 고치는 상황입니다.
> 실패하는 재현 테스트를 만든 뒤에 Implementer가 수정합니다.

| Field | Value |
|-------|--------|
| ID | `spring-bugfix` |
| When to use | 입력, 기대 결과, 실제 결과가 말로 고정되는 결함 |
| When not to use | 재현이 안 되는 보고, 새 기능, 동작이 바뀌는 리팩터 |
| Profile hint | `docs/harness/profiles/spring-api.md` |
| Status | active |

## Agent assembly

| Order | Role | Mission | Required |
|-------|------|---------|----------|
| 0 | Master | 입력, 기대, 실제, 관찰 위치를 고정합니다. 재현이 안 되면 `BLOCKED`입니다. | yes |
| 0a | Scout | 낯선 저장소면 읽기 전용 지도를 만듭니다. | no |
| 1 | Tester | 보고된 이유로 실패하는 재현 테스트를 먼저 작성합니다. | yes |
| 2 | Reviewer | 재현 테스트가 그 결함만 가리키는지 봅니다. | yes |
| 3 | Implementer | 그 테스트를 통과하는 최소 수정만 합니다. | yes |
| 4 | Tester | 재현 테스트가 통과하는지, 기존 테스트가 회귀하지 않는지 실행합니다. | yes |
| 5 | QA | 보고된 결함이 해결됐는지, 범위 밖 변경이 없는지 확인합니다. | yes |
| 6 | Curator | 같은 버그가 반복되면 Postmortem 승격을 제안합니다. | no |

모델 풀과 자유도는 각 역할 기본값입니다.

## Verification tools

| Tool | Rung / scope | Required | Evidence QA expects |
|------|--------------|----------|---------------------|
| `backend-unit-test` | 재현 테스트와 기존 `./gradlew test` | yes | 실패 로그, 이후 command + pass/fail counts |

러너가 없으면 Tester는 `BLOCKED`입니다.
Master가 수동 재현을 허용하기 전에는 수정하지 않습니다.

## Knowledge assembly

버그가 있는 층의 템플릿만 읽습니다.
과거 장애와 증상이 같을 때만 Postmortem을 읽습니다.

| Path | Who | Kind |
|------|-----|------|
| `docs/knowledge/backend/testing/test-structure.md` | Tester, Reviewer | current |
| `docs/harness/workflows/bugfix.md` | Master, Tester | current |
| `docs/harness/templates/backend/spring/` | Implementer | current |
| `docs/postmortems/` | Master | 증상이 같을 때만 |
