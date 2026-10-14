# AGENTS.md

> **개요:** 짧은 진입점입니다.
> 이번 작업에 필요한 문서만 읽습니다.

## 기본 흐름

요청과 범위를 확인합니다.
필요한 프로젝트 규칙과 템플릿을 고릅니다.
통과 기준을 확인합니다.
구현과 필요한 테스트를 합니다.
검증합니다.
짧은 작업 기록을 남깁니다.

조건과 추가 절차는 [`docs/harness/workflows/implement.md`](./docs/harness/workflows/implement.md)입니다.
통과 기준은 [`docs/harness/workflows/acceptance.md`](./docs/harness/workflows/acceptance.md)입니다.
구현 우선순위는 [`docs/harness/agents/implementer.md`](./docs/harness/agents/implementer.md)입니다.

## 읽기

시작 시 [`docs/harness/CURRENT.md`](./docs/harness/CURRENT.md)와 이번 작업 문서만 읽습니다.
저장소 전체, `docs/history`, `docs/harness/history`, 모든 역할 문서, 모든 템플릿을 기본으로 읽지 않습니다.
이미 읽었고 바뀌지 않은 문서는 다시 읽지 않습니다.

## 레시피

있는 레시피는 재사용합니다.
새 레시피는 같은 상황이 반복될 때만 제안합니다.
모든 요청에 레시피를 만들지 않습니다.
역할 문서는 책임입니다.
매번 모든 역할을 별도 에이전트로 실행하지 않습니다.

## 규칙

프로젝트 규칙이 아카이브보다 우선입니다.
[`docs/harness/context/precedence.md`](./docs/harness/context/precedence.md)
Knowledge와 템플릿은 사용자가 갱신을 요청할 때만 고칩니다.
커밋은 [`docs/harness/context/git.md`](./docs/harness/context/git.md)입니다.
