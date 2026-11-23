---
format: "md"
id: "spring-async-scheduling-index"
title: "비동기와 스케줄링"
description: "@Async, TaskExecutor, @Scheduled와 동시성 제어를 다루는 입구입니다."
slug: "/knowledge/backend/spring/async-scheduling"
sidebar_position: 0
status: "active"
tags:
  - "Spring"
keywords:
  - "비동기와 스케줄링"
  - "Spring"
  - "@Async"
  - "TaskExecutor"
  - "@Scheduled"
  - "Concurrency"
  - "스케줄링"
---
# 비동기와 스케줄링

작업을 다른 스레드에 위임하거나 정해진 시각에 실행하는 방법을 다룹니다.
한 프로세스의 실행기와 여러 인스턴스 사이의 중복 제어를 나누어 설명합니다.

## 읽는 순서

실행기와 큐의 용량, 실패 수집과 종료 정책을 먼저 정합니다.
주기 작업에서는 시간대, 실행 지연, 분산 선점과 재처리를 별도로 확인합니다.

| 글 | 다루는 내용 |
|---|---|
| [Async와 Executor](./async-and-executor.md) | Async의 프록시 실행, 실행기와 큐의 한도, 예외 수집 및 스레드 컨텍스트 전파를 설명합니다. |
| [Scheduled](./scheduled.md) | Scheduled의 cron, fixedRate와 fixedDelay를 비교하고 동적 등록과 시간대 및 이중화 시 실행을 설명합니다. |
| [동시 실행과 중복 실행 제어](./concurrency-control.md) | 스레드 풀과 분산 실행의 동시성 제어를 구분하고 락, DB 선점, 멱등성과 종료 복구의 관계를 설명합니다. |

## 예제의 기준

기본 설명은 Spring Boot 3.5와 Framework 6.2입니다.
다른 버전이 필요한 기능은 해당 글에서 구분합니다.
별도 언급이 없는 코드 조각은 import와 프로젝트 설정을 생략한 설명용이며, 필요한 협력 객체와 전제는 본문에 적었습니다.

이전 메모는 [Legacy](../legacy/index.md)에 보존합니다.
새 글에서 재사용한 예제는 현재 API와 주의점을 함께 설명합니다.

## 자주 묻는 질문

### @Async 기본 실행자는 무엇인가요?

별도 Executor를 지정하지 않으면 기본 단순 비동기 실행자를 씁니다. 운영에서는 이름 있는 TaskExecutor를 두는 편이 안전합니다.

### 스케줄 중복 실행을 막으려면?

단일 인스턴스 제한, 분산 락, 또는 스케줄러 설정의 동시 실행 정책을 확인합니다.

