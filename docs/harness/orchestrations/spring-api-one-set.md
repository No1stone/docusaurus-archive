# Orchestration: `spring-api-one-set`

> **개요:** Spring REST API 테이블 한 세트를 추가하는 상황입니다.
> 익숙한 저장소면 [`implement.md`](../workflows/implement.md)의 기본 흐름만 사용합니다.
> 통과 기준은 템플릿 기준을 재사용하고 이번 차이만 추가합니다.
> Reviewer, QA, Scout, Curator는 그 문서의 추가 절차일 때만 참여합니다.

| Field | Value |
|-------|--------|
| ID | `spring-api-one-set` |
| When to use | 테이블 하나에 대응하는 조회, 저장, 수정을 한 세트로 추가할 때 |
| When not to use | 버그 수정, 동작 유지 리팩터, 템플릿에 없는 구조 설계 |
| Profile hint | `docs/harness/profiles/spring-api.md` |
| Status | active |

## Agent assembly

| Order | Role | Mission | Required |
|-------|------|---------|----------|
| 0 | Master | 범위와 제외 범위를 정리하고, 기준 검토 후 통과 기준을 확정합니다. | yes |
| 0a | Scout | 낯선 저장소면 읽기 전용 지도를 만듭니다. | no |
| 1 | Tester | 통과 기준, 테스트 골격, 기대한 동작이 없을 때 실패하는 테스트를 작성합니다. | yes |
| 2 | Reviewer | 기준이 요구사항을 담고 불필요한 구현 제약을 강요하지 않는지 봅니다. | yes |
| 3 | Implementer | 확정된 기준과 프로젝트 규칙으로 구현합니다. 이 상황은 ExampleItem 템플릿을 씁니다. 메서드를 생략하지 않습니다. | yes |
| 4 | Tester | 같은 테스트를 실행합니다. 테스트를 지우거나 기대 결과를 약화하지 않습니다. | yes |
| 5 | QA | 요청한 엔드포인트, 요구사항 충족, 기존 동작의 회귀를 확인합니다. | yes |
| 6 | Curator | 반복되어 기준이 될 때만 승격을 제안합니다. | no |

모델 풀과 자유도는 각 역할 기본값입니다.
Freedom은 역할 기본값보다 높이지 않습니다.

## Verification tools

| Tool | Rung / scope | Required | Evidence QA expects |
|------|--------------|----------|---------------------|
| `backend-unit-test` | `./gradlew test`. 배치는 `docs/knowledge/backend/testing/test-structure.md` | yes | command + pass/fail counts |
| `playwright-e2e` | 이 상황의 기본값이 아님 | no | |
| `browser-manual` | 이 상황의 기본값이 아님 | no | |

## Knowledge assembly

Implementer는 템플릿만 읽습니다.
Knowledge는 Master와 Reviewer가 기준을 볼 때 읽습니다.

| Path | Who | Kind |
|------|-----|------|
| `docs/knowledge/backend/controller/controller-design.md` | Master, Reviewer | current |
| `docs/knowledge/backend/facade/facade-design.md` | Master, Reviewer | current |
| `docs/knowledge/backend/service/service-design.md` | Master, Reviewer | current |
| `docs/knowledge/backend/testing/test-structure.md` | Master, Tester, Reviewer | current |
| `docs/harness/workflows/acceptance.md` | Master, Tester, Reviewer | current |
| `docs/harness/templates/backend/spring/` | Implementer, Tester | current |
| `docs/harness/templates/backend/spring/testing/` | Tester, Implementer | current |

## Constraints

- `ExampleItem`은 도메인명으로 바꿉니다. 메서드 목록은 유지합니다.
- 템플릿이 없다는 이유만으로 구현을 중단하지 않습니다.
- 새 계층, 공개 계약, 의존성, 아키텍처 결정이 필요하면 선택지와 영향을 Master에게 전달하고, 결정 뒤에 진행합니다.
- 운영 DB, 자격증명, 고객 정보, 운영 주소를 넣지 않습니다.
