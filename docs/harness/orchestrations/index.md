# Task / Situation Orchestrations

> **개요:** 반복되는 상황의 레시피입니다.
> 목록의 적용 조건만 보고 고른 뒤, 필요한 파일 하나만 읽습니다.
> 레시피를 골라도 기본은 단일 에이전트입니다.
> 별도 에이전트 실행은 [`../workflows/implement.md`](/docs/harness/workflows/implement)입니다.
> 맞는 레시피가 없으면 기본 흐름으로 작업합니다.
> 없는 레시피를 매번 만들지 않습니다.
> 반복 가치가 있으면 후보만 제안하고, 등록은 사용자 승인 후입니다.

## 선택

| ID | 적용할 때 | 적용하지 않을 때 |
|----|-----------|------------------|
| [spring-api-one-set](/docs/harness/orchestrations/spring-api-one-set) | **공통 원셋.** 구현·단위/시나리오·API E2E를 복사 후 도메인만 채움 | 버그, 리팩터, E2E만 |
| [api-collection-e2e](/docs/harness/orchestrations/api-collection-e2e) | **원셋 E2E.** 컬렉션만 수정·실행 | 구현부터 추가, UI-only E2E |
| [spring-bugfix](/docs/harness/orchestrations/spring-bugfix) | 재현이 고정된 결함을 최소 수정 | 재현 불가, 새 기능 |
| [spring-refactor-layer](/docs/harness/orchestrations/spring-refactor-layer) | 동작 유지 구조 변경 | 공개 API·동작 변경 |
| [archive-promote-pattern](/docs/harness/orchestrations/archive-promote-pattern) | 반복된 구현을 아카이브 기준으로 올릴지 제안 | 한 번 쓴 코드, 구현 중 기능 |
| [spring-external-contract](/docs/harness/orchestrations/spring-external-contract) | (원셋 범위 밖) OpenAPI·RestClient 계약 | 내부 CRUD 원셋 |
| [docs-field-manual](/docs/harness/orchestrations/docs-field-manual) | (원셋 범위 밖) 관리자·현장 매뉴얼 | Knowledge 승격, API 구현만 |

## 레시피와 에이전트

```text
상황 판단
  → 위 표에서 레시피 선택 (또는 없음 → implement.md 기본 경로)
  → 단일 에이전트가 레시피의 순서·템플릿·검증을 수행
  → 별도 에이전트는 레시피에 적힌 조건 + implement.md 표일 때만
```

레시피 사용과 별도 에이전트 실행은 다릅니다.

## Layout

```text
docs/harness/orchestrations/
├── index.md
├── template.md
└── <situation-id>.md
```

## vs Bundle / Profile

| | Profile | Bundle | Orchestration |
|--|---------|--------|----------------|
| Usual stack combo | ✓ | | hint only |
| Read list helper | | ✓ | |
| Agents + knowledge + templates for a **situation** | | | ✓ |

## Naming

`{stack}-{situation}.md` 또는 `docs-{situation}.md`
