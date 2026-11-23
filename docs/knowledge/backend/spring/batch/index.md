---
format: "md"
id: "spring-batch-index"
title: "Spring Batch"
description: "Job, Step, Chunk, Reader/Processor/Writer, 재시작과 실패 처리를 다루는 입구입니다."
slug: "/knowledge/backend/spring/batch"
sidebar_position: 0
status: "active"
tags:
  - "Spring"
keywords:
  - "Spring Batch"
  - "Spring"
  - "Job"
  - "Step"
  - "Chunk"
  - "ItemReader"
  - "Restart"
---
# Spring Batch

대량 작업을 단계와 커밋 단위로 나누고, 실행 이력과 실패 후 복구를 관리하는 방법을 다룹니다.
이 묶음의 예제는 Spring Batch 5.2를 기준으로 하며 Batch 6 빌더 예제와 구분합니다.

## 읽는 순서

Job과 Step의 실행 식별을 이해한 뒤 Tasklet과 Chunk를 선택합니다.
마지막으로 Reader의 상태와 Writer의 부작용이 재시작에서도 안전한지 확인합니다.

| 글 | 다루는 내용 |
|---|---|
| [Job과 Step](./job-and-step.md) | Spring Batch의 Job, Step, JobInstance와 JobExecution 및 식별 파라미터와 실행 메타데이터의 관계를 설명합니다. |
| [Chunk와 Tasklet](./chunk-and-tasklet.md) | Tasklet과 Chunk의 처리 및 커밋 단위를 비교하고 대량 작업의 메모리와 잠금, 멱등성 설계를 설명합니다. |
| [Reader, Processor, Writer](./reader-processor-writer.md) | Reader, Processor와 Writer의 역할 및 read의 null, 필터링, 상태 저장과 안정적인 페이징을 설명합니다. |
| [재시작과 실패 처리](./restart-and-failure.md) | Batch의 retry, skip과 restart를 구분하고 실행 식별, 부작용의 중복 및 장애 복구 검증 방법을 설명합니다. |

## 예제의 기준

기본 설명은 Spring Boot 3.5와 Framework 6.2입니다.
다른 버전이 필요한 기능은 해당 글에서 구분합니다.
별도 언급이 없는 코드 조각은 import와 프로젝트 설정을 생략한 설명용이며, 필요한 협력 객체와 전제는 본문에 적었습니다.

이전 메모는 [Legacy](../legacy/index.md)에 보존합니다.
새 글에서 재사용한 예제는 현재 API와 주의점을 함께 설명합니다.

## 자주 묻는 질문

### Chunk와 Tasklet은 언제 나누나요?

대량 읽기-처리-쓰기는 Chunk, 한 덩어리 작업은 Tasklet이 단순한 경우가 많습니다.

### 실패 후 재시작은 어디서 이어지나요?

실행 메타데이터와 커밋 구간을 보고 Step 진행 지점부터 이어갑니다.

