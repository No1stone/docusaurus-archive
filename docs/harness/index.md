---
sidebar_position: 1
title: Harness
---

# Harness

:::tip[처음이라면 작업 흐름과 원셋부터]

[작업 흐름](/docs/harness/workflows/implement)에서 작업 규모에 맞춰 어떤 자료를 읽고 검증하는지 확인할 수 있습니다.<br />
구현 형태가 궁금하다면 [원셋과 템플릿](./templates/)부터 열어 보세요.

:::

AI에게 비슷한 API를 만들어 달라고 해도, 요청을 받는 코드와 업무 로직을 어디에 둘지는 매번 다르게 나올 수 있습니다.<br />
그래서 반복해서 쓰는 구현과 테스트를 **원셋**으로 묶고, 이번 작업의 범위와 통과 기준을 함께 전달하는 방식을 정리했습니다.

제 하네스는 작업에 필요한 규칙과 예제를 찾아 쓰고, 결과를 어떤 근거로 확인할지 정하는 데 사용합니다.<br />
간단한 변경은 필요한 자료만 읽고, 검증할 범위가 넓을 때는 작업에 맞는 레시피와 도구를 고릅니다.

## 필요한 자료 찾기

| 찾고 있는 내용 | 읽을 곳 |
|---|---|
| 작업 흐름과 완료 기준 | [구현 흐름](/docs/harness/workflows/implement), [통과 기준](/docs/harness/workflows/acceptance) |
| 레시피를 고르고 적용하는 방법 | [오케스트레이션](/docs/harness/orchestration), [상황별 레시피](/docs/harness/orchestrations/) |
| Cursor, Codex에서 시작하는 방법 | [도구별 진입점](/docs/harness/entrypoints/) |
| 작업 역할과 검증 도구 | [에이전트 역할](/docs/harness/agents/), [도구](/docs/harness/tools/) |
| 프로젝트 규칙과 읽을 자료의 범위 | [공통 기준](/docs/harness/context/), [프로필](/docs/harness/profiles/), [문서 묶음](/docs/harness/bundles/) |
| 백엔드, 프론트엔드, 데이터베이스 구현 예제 | [템플릿](./templates/), [프론트엔드 원셋](./templates/frontend/), [DB 설계](/docs/harness/database/) |
| 현재 적용 기준과 이전 작업 | [현재 상태](/docs/harness/CURRENT), [작업 기록](/docs/harness/history/) |

구현 뒤에는 코드와 테스트 결과를 검토하고, 프로젝트의 계약이나 설계 기준을 바꾸는 결정은 개발자가 내립니다.
