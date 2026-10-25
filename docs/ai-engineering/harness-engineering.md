---
id: harness-engineering
title: "하네스 엔지니어링(Harness Engineering)이란"
description: "테스트·배포·운영 하네스와 플랫폼 엔지니어링 관점에서 본 하네스 엔지니어링"
tags:
  - harness-engineering
  - ai-engineering
  - devops
  - platform-engineering
status: active
sidebar_position: 1
---

# 하네스 엔지니어링(Harness Engineering)이란

소프트웨어 엔지니어링에서 "하네스(Harness)"는 원래 자동차나 전자제품의 배선 하네스처럼 여러 구성 요소를 연결하고 제어하는 역할을 의미한다.

개발 분야에서는 주로 **테스트 하네스(Test Harness)**, **배포 하네스(Deployment Harness)**, **운영 하네스(Operation Harness)** 와 같은 개념으로 사용되며, 복잡한 시스템을 안정적으로 실행하고 검증하기 위한 기반 환경을 의미한다.

Andrej Karpathy

```plaintext
# AGENTS.md

> **Read first:** Coding agents must read and apply this document before implementing or changing this repository (unless the user explicitly narrows scope).

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

Don't assume. Don't hide confusion. Surface tradeoffs.

Before implementing:

- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them.
- If a simpler approach exists, say so.
- If something is unclear, stop. Name what's confusing.

## 2. Simplicity First

Minimum code that solves the problem. Nothing speculative.

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" that wasn't requested.
- No error handling for impossible scenarios.
- If 200 lines could be 50, rewrite it.

## 3. Surgical Changes

Touch only what you must. Clean up only your own mess.

- Don't "improve" adjacent code or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice dead code, mention it — don't delete it.

## 4. Goal-Driven Execution

Define success criteria. Loop until verified.

Transform tasks into verifiable goals:

- "Add validation" → "Write tests, then make them pass"
- "Fix the bug" → "Reproduce it in a test, then fix"
- "Refactor X" → "Ensure tests pass before and after"

---

## Repository-specific (FarmPro)

단일 소스는 본 **`AGENTS.md`** 이다. 일부 도구·습관은 루트 **`CLAUDE.md`** 만 연다; 그 파일은 **`AGENTS.md`** 로 안내하는 스텁으로 두었다.

Cursor 및 기타 코딩 에이전트는 본 **`AGENTS.md`** 를 이 워크스페이스의 **최우선 행동 지침**으로 따른다. 구현·리팩터·디버깅 전에 위 본문 전체를 기준으로 한다 (본문은 **짧게 유지**해 스킵되지 않게 한다; 세부는 패키지 가이드).

프로젝트별 세부 규칙은 각 패키지 문서에 있다 (예: `fe-v1/docs/guidelines`). 공통 지침과 함께 적용하며, 충돌 시 사용자에게 질문한다.
```

## 왜 필요한가?

현대 서비스는 단순한 애플리케이션 하나로 구성되지 않는다.

- API 서버
- 데이터베이스
- Redis
- Kafka
- Elasticsearch
- Kubernetes
- CI/CD 파이프라인

등 다양한 구성 요소가 함께 동작한다.

이러한 환경에서 개발자는 단순히 비즈니스 로직만 구현하는 것이 아니라, 전체 시스템이 안정적으로 연결되고 운영될 수 있도록 관리해야 한다.

하네스 엔지니어링은 이러한 연결 구조를 자동화하고 표준화하는 역할을 수행한다.

## 하네스 엔지니어링의 주요 영역

### 1. 테스트 하네스

테스트를 실행하기 위한 환경을 자동으로 구성한다.

예시:

- Testcontainers
- Embedded Redis
- Embedded Kafka
- Mock Server

```plaintext
Application    ↓Test Harness    ↓Redis / Kafka / DB 자동 구성
```

개발자는 실제 운영 환경과 유사한 상태에서 테스트를 수행할 수 있다.

### 2. 배포 하네스

애플리케이션 배포 과정을 자동화한다.

예시:

- GitHub Actions
- Jenkins
- ArgoCD
- Helm

```plaintext
Git Push    ↓Build    ↓Docker Image    ↓Kubernetes Deploy
```

반복 작업을 줄이고 배포 오류를 최소화한다.

### 3. 운영 하네스

서비스 운영에 필요한 공통 기능을 제공한다.

예시:

- Prometheus
- Grafana
- OpenTelemetry
- Zipkin
- AlertManager

```plaintext
Application    ↓Metrics / Logs / Traces    ↓Observability Platform
```

장애 분석과 성능 모니터링을 쉽게 수행할 수 있다.

## 플랫폼 엔지니어링과의 관계

최근에는 하네스 엔지니어링이 플랫폼 엔지니어링의 일부로 발전하고 있다.

플랫폼 팀은 개발자들이 비즈니스 로직에 집중할 수 있도록 다음과 같은 기능을 제공한다.

- 표준 CI/CD
- 표준 모니터링
- 표준 보안 정책
- 표준 Kubernetes 배포 환경

즉, 개발자가 직접 인프라를 구축하는 대신 플랫폼을 활용할 수 있도록 만드는 것이다.

## 결론

하네스 엔지니어링은 단순한 테스트 도구를 만드는 작업이 아니다.

개발, 배포, 운영 전반에 걸쳐 반복적인 작업을 자동화하고, 안정적인 실행 환경을 제공하는 엔지니어링 영역이다.

특히 MSA, Kubernetes, DevOps 환경에서는 비즈니스 기능 개발만큼 중요한 역할을 수행하며, 플랫폼 엔지니어링의 핵심 구성 요소로 자리 잡고 있다.
