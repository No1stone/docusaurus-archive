---
id: decisions
title: Decisions
description: Architecture Decision Records
---
# Decisions (ADR)

> **개요:** ADR(의사결정) 목록입니다.
> 왜 지금 형태가 되었는지 추적합니다.

Track why Architecture, Templates, and Harness took a particular shape.

## Records

| 번호 | 결정 | 상태 |
|------|------|------|
| ADR-0001 | [원본은 Git 안의 Markdown으로 둡니다](./ADR-0001-markdown-git-as-engineering-source-of-truth.md) — 설계 결정과 개발 기준을 Markdown과 Git에 남겨 사람과 AI가 같은 근거를 재사용합니다 | 채택 |
| ADR-0002 | [아카이브 화면은 Docusaurus로 둡니다](./ADR-0002-docusaurus-as-archive-reading-ui.md) — Markdown 원본은 유지하고, 문서 탐색과 React 기반 화면 구성을 Docusaurus에 맡깁니다 | 채택 |
| ADR-0004 | [블로킹 기반 업무 처리에 Spring MVC와 Virtual Threads를 선택한 이유](./ADR-0004-blocking-flow-uses-mvc.md) — JPA와 RestClient가 중심이면 유스케이스를 명령형 호출로 유지하고, Virtual Threads로 대기를 받습니다 | 채택 |
| ADR-0005 | [코드 컨벤션은 왜 생겼고, 왜 중요한가](./ADR-0005-code-conventions-as-team-agreement.md) — 여러 사람이 같은 코드를 오래 읽고 수정하기 위한 약속이며, AI 적용과 팀 규칙 변경은 별개다 | 채택 |
| ADR-0006 | [코드 컨벤션을 템플릿과 하네스로 연결한다](./ADR-0006-conventions-via-templates-and-harness.md) — 컨벤션을 템플릿으로 구조화하고 하네스가 선택·적용하며, 원셋 복사와 토큰 최소 경로로 일관된 변경을 만든다 | 채택 |
| ADR-0007 | [구글의 Harness²·RRSI와 내가 만드는 하네스의 방향](./ADR-0007-harness2-rrsi-and-local-harness-direction.md) — 연구와 맞닿은 고민을 참고하되, 공통 기준 변경은 사람이 승인하는 현재 방식을 유지한다 | 채택 |

번호는 파일명과 `id`에만 둡니다.
다른 문서에서 가리킬 때는 "ADR-0002"처럼 번호로 부르고, 제목 자체에는 번호를 붙이지 않습니다.
