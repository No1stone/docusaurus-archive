---
slug: hermes-agent-memory-and-environment
title: "Hermes Agent의 자기 개선, 결국 실행 환경에 종속되는 것 아닐까?"
description: "Agent 내부 기억과 Origemite Archive처럼 Agent 밖에 지식을 두는 방식의 차이"
authors: []
tags:
  - hermes-agent
  - harness-engineering
  - ai-engineering
  - origemite-archive
date: 2026-10-25
---

# Hermes Agent의 자기 개선, 결국 실행 환경에 종속되는 것 아닐까?

최근 Hermes Agent를 살펴보다 흥미로운 기능을 발견했다.

Agent가 작업 과정에서 얻은 경험과 실수를 기억하고, 이를 다음 작업에 반영하면서 스스로 개선한다는 것이다.

단순히 대화 내용을 기억하는 것을 넘어 반복 작업을 Skills로 정리하고, 축적된 경험을 재사용한다는 점이 인상적이었다.

그런데 한 가지 의문이 생겼다.

**결국 그 기억은 어디에 저장되는 걸까?**

Hermes의 기억과 Skills는 기본적으로 로컬 파일과 데이터베이스에 저장된다. 엄밀히 말하면 하드웨어 자체에 종속되는 것은 아니다. 데이터를 복사하거나 동기화하면 다른 환경에서도 사용할 수 있다.

하지만 특정 Agent의 저장 구조와 실행 환경에 기억이 묶여 있다면, 다른 Agent로 전환할 때는 어떻게 될까?

## 내가 구축하는 방식은 조금 다르다

현재 구축 중인 Origemite Archive는 Markdown과 Git을 중심으로 기술 지식, 설계 결정, 구현 패턴, 시행착오를 축적하는 구조다.

여기에 Harness를 연결해 Cursor, Codex 등 서로 다른 Coding Agent가 필요한 Context를 선택적으로 활용하도록 설계하고 있다.

차이는 **기억의 소유권과 재사용 방식**에 있다.

- **Hermes Agent:** Agent가 경험을 축적하고 자신의 작업에 재활용한다.
- **Origemite Archive:** 지식을 Agent 외부에 축적하고 여러 Agent가 공유한다.

Hermes의 자동화된 자기 개선 방식은 충분히 매력적이다. 오히려 이런 기능을 활용해 얻은 경험을 외부 지식 저장소에 반영할 수도 있을 것이다.

다만 내가 지향하는 방향은 특정 Agent를 계속 똑똑하게 만드는 것이 아니다.

**Agent는 교체할 수 있어야 하고, 축적된 지식은 남아 있어야 한다.**

결국 중요한 것은 AI가 얼마나 많이 기억하느냐보다, 그 기억을 얼마나 독립적으로 관리하고 재사용할 수 있느냐가 아닐까.
