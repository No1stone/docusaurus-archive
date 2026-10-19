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
| ADR-0001 | [원본은 Git 안의 Markdown으로 둡니다](./ADR-0001-markdown-git-as-engineering-source-of-truth.md) — 의사결정을 누적해 사람과 AI가 함께 관리하는 하네스 관점의 원본, 그리고 그 자리를 Markdown + Git에 둔 이유 | 채택 |
| ADR-0002 | [아카이브 화면은 Docusaurus로 둡니다](./ADR-0002-docusaurus-as-archive-reading-ui.md) — Markdown이라 에이전트가 읽고 쓰기 쉽고, React라 화면 커스텀이 쉬우며, 폴더 임포트로 그대로 쓸 수 있습니다 | 채택 |
| ADR-0004 | [블로킹 기반 업무 처리에 Spring MVC와 Virtual Threads를 선택한 이유](./ADR-0004-blocking-flow-uses-mvc.md) — JPA와 RestClient가 중심이면 유스케이스를 명령형 호출로 유지하고, Virtual Threads로 대기를 받습니다 | 채택 |

번호는 파일명과 `id`에만 둡니다.
다른 문서에서 가리킬 때는 "ADR-0002"처럼 번호로 부르고, 제목 자체에는 번호를 붙이지 않습니다.
