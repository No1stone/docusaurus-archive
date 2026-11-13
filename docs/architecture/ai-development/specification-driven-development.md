---
id: architecture-specification-driven-development
title: "Specification-Driven Development"
description: "구현 전에 제품이 보장할 동작과 통과 기준을 명세로 두고, AI 구현과 테스트를 그 기준으로 검증하는 Specification-Driven Development를 설명합니다."
keywords:
  - Specification-Driven Development
  - SDD
  - 제품 명세
  - 통과 기준
  - requirements index
  - AI coding
sidebar_position: 3
slug: "/architecture/ai-development/specification-driven-development"
---

# Specification-Driven Development로 제품 동작 정하기

“주문 취소 기능을 만들어 주세요”라는 요청을 받으면 구현은 바로 시작할 수 있습니다.<br />
그런데 발송된 주문도 취소할 수 있는지, 이미 취소한 주문을 다시 취소하면 어떤 결과를 돌려줄지에 따라 필요한 코드와 테스트가 달라집니다.

제 하네스에서는 **구현 전에 제품이 보장할 동작과 통과 기준을 정합니다.**<br />
예를 들어 *발송 전에는 주문을 취소할 수 있고, 발송된 주문의 취소 요청은 거절하며 기존 주문 상태를 유지한다*고 적습니다.<br />
이 문장이 있으면 AI도 거절 응답과 주문 상태를 함께 검증해야 한다는 걸 알 수 있습니다.

## 명세는 필요한 곳부터 읽습니다

제품 명세는 도메인이나 애플리케이션 단위로 관리합니다.<br />
주문 취소 조건은 주문 도메인에 두고, 관리자 화면이 취소 버튼을 언제 보여주는지는 관리자 앱의 요구사항에 둡니다.<br />
각 단위의 폴더를 열면 필요한 문서를 고를 수 있도록 인덱스 세 개를 바로 아래에 둡니다.

| 인덱스 | 찾을 수 있는 내용 |
|---|---|
| `requirements-index.md` | 현재 제품이 보장하는 동작과 통과 기준 |
| `design-index.md` | 기능의 구성, 처리 흐름, 관련 설계 결정 |
| `work-index.md` | 작업 범위, 진행 상태, 실제 변경과 검증 결과 |

인덱스의 제목은 **「발송 전까지만 주문을 취소할 수 있다」**처럼 한 줄만 봐도 내용을 알 수 있게 씁니다.<br />
평소에는 제목을 훑고, 경계 조건이나 검증 근거가 필요할 때 상세 문서를 엽니다.

## 명세와 원셋을 함께 사용합니다

주문 취소 정책이 바뀌면 먼저 요구사항과 통과 기준을 갱신합니다.<br />
구현에서는 기존 변경 유즈케이스 원셋을 참고해 취소 조건을 적용하고, 거절 시 주문 상태가 유지되는지 테스트합니다.<br />
작업을 마치면 시작할 때 만든 작업 문서에 실제 변경과 검증 결과를 이어서 기록합니다.<br />
Jira를 쓰는 프로젝트라면 관련 티켓도 연결합니다.

SDD는 **대상 저장소의 지침에서 도입 여부를 확인한 뒤 적용**합니다.<br />
작은 기능은 기대 동작과 통과 기준 몇 줄로 시작할 수 있습니다.<br />
상태 전이나 여러 앱의 동작까지 함께 달라질 때는 관련 설계와 작업 내역을 연결합니다.<br />
구현할 때 따라야 할 규칙과 복사용 양식은 하네스의 [SDD 워크플로](/docs/harness/workflows/sdd/)와 [제품 명세 템플릿](/docs/harness/templates/sdd/)에서 확인합니다.

## 관련

- [AI 개발 아키텍처](/docs/architecture/ai-development)
- [Template-Driven Development](/docs/architecture/ai-development/template-driven-development)
