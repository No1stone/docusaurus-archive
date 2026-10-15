# Orchestration: `spring-api-one-set`

> **개요:** Spring REST API 테이블 한 세트를 추가하는 상황입니다.
> 기본 흐름과 별도 에이전트는 [`implement.md`](../workflows/implement.md)입니다.
> 확인 방법은 [`acceptance.md`](../workflows/acceptance.md)의 템플릿 기반 CRUD입니다.

| Field | Value |
|-------|--------|
| ID | `spring-api-one-set` |
| When to use | 테이블 하나에 대응하는 조회, 저장, 수정을 한 세트로 추가할 때 |
| When not to use | 버그 수정, 동작 유지 리팩터, 템플릿에 없는 구조 설계 |
| Profile hint | `docs/harness/profiles/spring-api.md` |
| Status | active |

## 이 상황

별도 에이전트는 [`implement.md`](../workflows/implement.md)를 따릅니다.
아래는 그 흐름 안에서 이 상황이 지키는 것입니다.

- 템플릿 기준을 재사용하고 이번 차이만 추가합니다.
- ExampleItem 템플릿의 구조, 메서드 목록, DTO 형태, 계층 책임을 유지합니다. 도메인명만 바꿉니다.
- 관련 테스트를 작성하고 실행합니다. 기존 테스트로 충분하면 중복을 만들지 않습니다.
- 요구사항과 회귀를 확인합니다. Reviewer와 QA를 별도로 실행하지 않아도 이 확인은 합니다.
- 반복되어 기준이 될 발견은 후보만 보고합니다.

모델 풀과 자유도는 각 역할 기본값입니다.
Freedom은 역할 기본값보다 높이지 않습니다.

## Verification tools

| Tool | Rung / scope | 검증 | 증거 |
|------|--------------|------|------|
| `backend-unit-test` | `./gradlew test`. 배치는 `docs/knowledge/backend/testing/test-structure.md` | 관련 테스트가 있을 때 | command와 pass/fail |
| `playwright-e2e` | 이 상황의 기본값이 아님 | 아님 | |
| `browser-manual` | 이 상황의 기본값이 아님 | 아님 | |

이 표의 검증은 별도 에이전트 실행이 아닙니다.
테스트 건수는 실행 증거이며 품질의 단독 기준이 아닙니다.

## Knowledge assembly

Implementer는 적용 템플릿과 채택된 Backend Knowledge를 읽습니다.

| Path | Who | Kind |
|------|-----|------|
| `docs/knowledge/backend/controller/controller-design.md` | 판단이 필요할 때 | current |
| `docs/knowledge/backend/facade/facade-design.md` | 판단이 필요할 때 | current |
| `docs/knowledge/backend/service/service-design.md` | 판단이 필요할 때 | current |
| `docs/knowledge/backend/testing/test-structure.md` | 테스트를 둘 때 | current |
| `docs/harness/workflows/acceptance.md` | 기준을 정할 때 | current |
| `docs/harness/templates/backend/spring/` | 구현 | current |
| `docs/harness/templates/backend/spring/testing/` | 테스트가 필요할 때 | current |

## Constraints

- `ExampleItem`은 도메인명으로 바꿉니다. 메서드 목록은 유지합니다.
- 템플릿이 없다는 이유만으로 구현을 중단하지 않습니다.
- 새 계층, 공개 계약, 의존성, 아키텍처 결정이 필요하면 선택지와 영향을 Master에게 전달하고, 결정 뒤에 진행합니다.
- 운영 DB, 자격증명, 고객 정보, 운영 주소를 넣지 않습니다.
