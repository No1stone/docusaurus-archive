---
format: "md"
id: "spring-batch-chunk-and-tasklet"
title: "Chunk와 Tasklet"
description: "Tasklet과 Chunk의 처리 및 커밋 단위를 비교하고 대량 작업의 메모리와 잠금, 멱등성 설계를 설명합니다."
slug: "/knowledge/backend/spring/batch/chunk-and-tasklet"
sidebar_position: 2
status: "active"
tags:
  - "Spring"
keywords:
  - "Chunk와 Tasklet"
  - "Spring"
  - "Spring Batch"
  - "Job"
  - "Step"
  - "Chunk"
  - "ItemReader"
  - "Restart"
---
# Chunk와 Tasklet

Step을 구현할 때는 한 번의 작업으로 표현할지, 항목을 일정 크기로 나누어 처리할지 선택합니다.
Tasklet과 Chunk는 코드 스타일뿐 아니라 트랜잭션 길이와 재시작 단위에도 영향을 줍니다.
이 글은 Spring Batch 5.2 빌더 API를 사용합니다.

## 한 동작으로 표현하는 Tasklet

```java
@Bean
Step prepareStep(JobRepository repository, PlatformTransactionManager manager) {
    return new StepBuilder("prepareStep", repository)
            .tasklet((contribution, context) -> {
                // 준비 조건 확인 등 짧은 작업
                return RepeatStatus.FINISHED;
            }, manager)
            .build();
}
```

Tasklet은 보통 한 번의 명확한 동작에 사용합니다.
필요하면 반복을 요청할 수 있으며 각 실행의 트랜잭션 경계도 고려해야 합니다.
하나의 거대한 루프를 넣으면 Chunk로 얻을 수 있는 중간 커밋과 카운터 관리가 사라집니다.

## 항목을 모아 처리하는 Chunk

```java
@Bean
Step exportStep(JobRepository repository, PlatformTransactionManager manager,
        ItemReader<SourceRow> reader, ItemProcessor<SourceRow, ExportRow> processor,
        ItemWriter<ExportRow> writer) {
    return new StepBuilder("exportStep", repository)
            .<SourceRow, ExportRow>chunk(100, manager)
            .reader(reader)
            .processor(processor)
            .writer(writer)
            .build();
}
```

Reader, Processor와 Writer 구현을 주입받는 구성 예제입니다.
읽은 항목들을 처리해 묶음으로 쓰고 커밋합니다.
Processor가 항목을 걸러내면 읽은 개수와 쓴 개수는 같지 않을 수 있습니다.

```mermaid
flowchart LR
    Reader[항목 읽기] --> Processor[변환과 필터]
    Processor --> Buffer[Chunk 구성]
    Buffer --> Writer[묶음 쓰기]
    Writer --> Commit[커밋과 상태 저장]
    Commit --> Reader
```

| 선택 | 적합한 작업 | 주의점 |
|---|---|---|
| Tasklet | 준비, 검증과 짧은 작업 단위 | 큰 루프와 장시간 트랜잭션 |
| Chunk | 많은 행의 반복 처리 | 크기, 재처리와 Writer 특성 |

## Chunk 크기는 측정으로 정합니다

크기를 늘리면 커밋 횟수를 줄일 수 있지만 메모리, 잠금 보유 시간과 실패 후 재처리 비용이 늘 수 있습니다.
100이 모든 시스템의 적정값은 아닙니다.
행 크기, DB 쓰기 방식, 네트워크 대기와 실패 빈도를 함께 봅니다.

Chunk가 롤백돼도 이미 수행한 외부 HTTP 호출이나 파일 쓰기가 자동 취소되지는 않습니다.
Writer의 외부 부작용은 같은 항목이 다시 실행될 수 있다고 가정하고 설계합니다.
파일 결과를 임시 경로에 쓰고 성공 후 공개하는 방식 등 별도 완료 절차를 고려할 수 있습니다.

검증은 경계 직전과 직후에서 실패를 발생시켜 커밋된 묶음과 재처리 묶음을 확인합니다.
성공 건수 외에도 롤백, skip와 filter 카운터를 구분합니다.

구성과 커밋 단위는 [Chunk 처리](https://docs.spring.io/spring-batch/reference/5.2/step/chunk-oriented-processing.html)와 [Step 설정](https://docs.spring.io/spring-batch/reference/5.2/step/chunk-oriented-processing/configuring.html)을 참고합니다.

## 자주 묻는 질문

### Chunk와 Tasklet은 언제 나누나요?

대량 읽기-처리-쓰기는 Chunk, 한 덩어리 작업은 Tasklet이 단순한 경우가 많습니다.

### 실패 후 재시작은 어디서 이어지나요?

실행 메타데이터와 커밋 구간을 보고 Step 진행 지점부터 이어갑니다.

