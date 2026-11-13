---
slug: /architecture/
id: architecture
title: Architecture
description: System design independent of a single library
unlisted: true
---

# Architecture

:::info[노션에서 옮겨 온 글을 다듬고 있습니다]

이곳의 일부 글은 기존 노션 자료를 AI로 일괄 이전한 기록입니다.<br />
이전 과정에서 문장이나 구성이 어색해진 글은 제가 하나씩 읽으며 표현과 예제를 다듬고 있습니다.

:::

서비스를 나누거나 통신 방식을 고를 때는 요청이 어디로 가고 누가 결과를 책임지는지부터 그려 봅니다.<br />
평소에는 짧게 끝나는 호출도 상대 서버가 늦어지거나 메시지가 다시 들어오면 그 경계가 드러납니다.

이곳에는 **어떤 책임을 한곳에 두었는지, 시스템 사이에서 요청과 데이터가 어떻게 이동하는지**를 기록합니다.<br />
이벤트 중심으로 시스템을 구성하는 이야기는 여기서, Kafka를 설정하고 메시지를 읽는 방법은 [기술 노트](/docs/knowledge/)에서 이어집니다.

| 찾고 있는 내용 | 읽을 곳 |
|---|---|
| 에이전트 구현에서 템플릿과 명세를 쓰는 방식 | [AI Development](/docs/architecture/ai-development) |
| 여러 시스템에서 반복되는 설계 문제와 해법 | [아키텍처 패턴](/docs/patterns/architecture-patterns) |
| 당시 검토한 선택지와 결정 이유 | [설계와 결정](/docs/decisions/) |
| MSA, 권한, AWS 환경을 구성하며 겪은 일 | [MSA와 IAM 포트폴리오](/docs/postmortems/msa-iam-portfolio/overview) |
| 기존 시스템에서 책임을 나누고 개선한 경험 | [레거시 개선 사례](/docs/postmortems/legacy-improvement-cases) |
