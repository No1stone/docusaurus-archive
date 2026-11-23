---
format: "md"
id: "spring-batch-reader-processor-writer"
title: "Reader, Processor, Writer"
description: "Reader, Processor와 Writer의 역할 및 read의 null, 필터링, 상태 저장과 안정적인 페이징을 설명합니다."
slug: "/knowledge/backend/spring/batch/reader-processor-writer"
sidebar_position: 3
status: "active"
tags:
  - "Spring"
keywords:
  - "Reader, Processor, Writer"
  - "Spring"
  - "Spring Batch"
  - "Job"
  - "Step"
  - "Chunk"
  - "ItemReader"
  - "Restart"
---
# Reader, Processor, Writer

대량 처리에서 읽기, 변환과 쓰기를 나누면 같은 작업을 다른 입력과 출력에 연결하기 쉽습니다.
각 역할은 비슷한 메서드 형태를 가져도 종료와 실패를 표현하는 방법이 다릅니다.
Spring Batch 5.2 기준으로 그 계약을 구분합니다.

## 세 역할의 계약

| 역할 | 핵심 메서드 | 의미 |
|---|---|---|
| ItemReader | read | 다음 항목을 반환하며 null은 입력 종료입니다. |
| ItemProcessor | process | 변환 결과를 반환하며 null은 해당 항목 필터입니다. |
| ItemWriter | write | Chunk 단위 결과를 씁니다. |

```java
ItemReader<String> reader = new ListItemReader<>(List.of("alpha", " ", "beta"));
ItemProcessor<String, String> processor = value -> {
    String normalized = value.trim();
    return normalized.isEmpty() ? null : normalized.toUpperCase(Locale.ROOT);
};
ItemWriter<String> writer = chunk -> {
    for (String value : chunk) {
        System.out.println(value);
    }
};
```

메모리 입력과 콘솔 출력을 사용하는 계약 설명 예제입니다.
이 Writer가 운영 결과를 영속적으로 저장하거나 재시작을 보장하지는 않습니다.
Processor에서 null을 반환하는 필터와 예외를 skip하는 정책도 서로 다릅니다.

## 읽기 기준이 흔들리면 누락될 수 있습니다

DB 페이징 Reader는 안정적인 정렬이 필요합니다.
같은 정렬값이 반복되면 고유한 보조 키를 포함합니다.
읽으면서 검색 조건에 사용한 상태를 바꾸면 offset 기반 다음 페이지에서 행이 건너뛰어질 수 있습니다.

예를 들어 대기 상태 100개를 읽고 완료로 바꾼 뒤 두 번째 페이지를 offset 100으로 조회하면 남은 대기 행을 지나칠 수 있습니다.
고정된 대상 집합, 키 기반 접근이나 적절한 Reader 전략을 검토합니다.
Cursor와 페이징 중 무엇이 적합한지는 연결 점유와 DB 특성을 포함해 판단합니다.

## 상태와 생명주기

재시작 가능한 Reader는 읽은 위치 등 상태를 ExecutionContext에 저장할 수 있습니다.
ItemStream의 open, update와 close 계약을 따르고 필요한 delegate도 등록합니다.
Reader 객체가 존재한다는 사실만으로 모든 구현이 재시작과 스레드 안전성을 갖는 것은 아닙니다.

```mermaid
flowchart LR
    Open[상태 복원과 open] --> Read[읽기와 처리]
    Read --> Update[커밋 경계의 상태 갱신]
    Update --> Read
    Read --> Close[종료와 자원 정리]
```

Processor에서 매 항목마다 같은 코드 테이블을 조회하면 불필요한 DB 부하가 생길 수 있습니다.
읽기 전 준비할 참조 데이터와 항목별 조회를 구분합니다.
다만 캐시가 작업 전체의 일관성 기준을 바꾸는지도 설명해야 합니다.

Writer는 재시도에서 같은 항목을 다시 받을 수 있으므로 upsert, 유니크 키와 완료 표시 등 중복 처리 기준을 둡니다.
입력 없음, 필터 전부, 마지막 작은 Chunk와 중간 실패 후 재시작을 테스트합니다.

역할과 상태 계약은 [ItemReader](https://docs.spring.io/spring-batch/reference/5.2/readers-and-writers/item-reader.html)와 [ItemStream](https://docs.spring.io/spring-batch/reference/5.2/readers-and-writers/item-stream.html), 재사용 컴포넌트는 [표준 구현](https://docs.spring.io/spring-batch/reference/5.2/readers-and-writers/item-reader-writer-implementations.html)을 참고합니다.

## 자주 묻는 질문

### Chunk와 Tasklet은 언제 나누나요?

대량 읽기-처리-쓰기는 Chunk, 한 덩어리 작업은 Tasklet이 단순한 경우가 많습니다.

### 실패 후 재시작은 어디서 이어지나요?

실행 메타데이터와 커밋 구간을 보고 Step 진행 지점부터 이어갑니다.

