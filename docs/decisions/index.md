---
id: decisions
title: Decisions
description: Architecture Decision Records
---
# Decisions (ADR)

> **개요:** ADR(의사결정) 목록. 왜 지금 형태가 되었는지 추적한다.

Track why Architecture, Templates, and Harness took a particular shape.

## Records

| 번호 | 결정 | 상태 |
|------|------|------|
| ADR-0001 | [SSOT란?](./ADR-0001-markdown-git-as-engineering-source-of-truth.md) — 의사결정을 누적해 사람과 AI가 함께 관리하는 하네스 관점의 원본, 그리고 그 자리를 Markdown + Git에 둔 이유 | 채택 |
| ADR-0002 | [Docusaurus를 선택한 이유](./ADR-0002-docusaurus-as-archive-reading-ui.md) — Markdown이라 에이전트가 읽고 쓰기 쉽고, React라 화면 커스텀이 쉬우며, 폴더 임포트로 그대로 쓸 수 있다 | 채택 |
| ADR-0003 | [글 광고는 레이아웃이 넣는다](./ADR-0003-archive-ad-placement.md) — 홈 한 칸, 문서 본문·목차 두 칸. 하네스와 짧은 글에는 넣지 않는다 | 채택 |

번호는 파일명과 `id`에만 둔다. 다른 문서에서 가리킬 때는 "ADR-0002"처럼 번호로 부르고, 제목 자체에는 번호를 붙이지 않는다.
