---
format: "md"
id: "spring-transaction-programmatic-transactions"
title: "프로그래밍 방식의 트랜잭션"
description: "TransactionTemplate으로 명시적인 DB 처리 범위를 만들고 원격 호출과 롤백 및 재시도 경계를 나누는 방법을 설명합니다."
slug: "/knowledge/backend/spring/transaction/programmatic-transactions"
sidebar_position: 4
status: "active"
tags:
  - "Spring"
keywords:
  - "프로그래밍 방식의 트랜잭션"
  - "Spring"
  - "@Transactional"
  - "Propagation"
  - "Isolation"
  - "Rollback"
  - "TransactionManager"
  - "트랜잭션"
---
# 프로그래밍 방식의 트랜잭션

선언적 트랜잭션은 메서드 단위 경계를 표현하기 좋습니다.
한 메서드 안에서 DB 작업과 느린 외부 통신의 범위를 분리하고 싶다면 TransactionTemplate을 검토할 수 있습니다.
코드에 경계가 보이는 대신 트랜잭션 정책을 사용하는 코드가 늘어나는 선택입니다.

## 필요한 구간만 명시합니다

```java
@Service
class ExportService {
    private final TransactionTemplate transactions;
    private final ExportRepository repository;
    private final ExportClient client;

    ExportService(PlatformTransactionManager manager,
            ExportRepository repository, ExportClient client) {
        this.transactions = new TransactionTemplate(manager);
        this.repository = repository;
        this.client = client;
    }

    void export(Long id) {
        ExportData data = transactions.execute(status -> repository.load(id));
        client.send(data);
        transactions.executeWithoutResult(status -> repository.markSent(id));
    }
}
```

트랜잭션 매니저, 저장소와 클라이언트 구현을 생략한 부분 예제입니다.
위 흐름은 외부 통신 동안 DB 트랜잭션을 잡지 않지만 전체가 원자적인 것은 아닙니다.
전송은 성공하고 markSent가 실패할 수 있어 멱등 키와 재처리 정책이 필요합니다.

| 방식 | 경계 표시 | 적합한 상황 |
|---|---|---|
| Transactional | 메서드 선언 | 업무 단위가 메서드와 일치 |
| TransactionTemplate | 콜백 블록 | 처리 중 특정 구간만 묶음 |
| 직접 매니저 호출 | 시작, 커밋과 롤백 | 특수한 기반 기능 구현 |

## 기존 트랜잭션이 있으면 결과가 달라집니다

TransactionTemplate도 전파 설정을 따릅니다.
바깥에 이미 REQUIRED 트랜잭션이 있으면 기본 Template 호출은 그 안에 참여할 수 있습니다.
코드에 블록을 나눴다고 항상 연결이 반환되거나 트랜잭션이 두 개가 되는 것은 아닙니다.
외부 통신을 분리하려면 호출 상위 경계까지 함께 확인합니다.

공유 Template의 설정은 초기 구성 때 정합니다.
요청마다 전파와 시간 제한을 바꾸면 다른 호출과 설정이 섞일 수 있으므로 정책별 Template을 준비하거나 별도 설정 객체를 사용합니다.

## 명시적인 롤백

```java
transactions.executeWithoutResult(status -> {
    repository.update();
    if (!repository.isConsistent()) {
        status.setRollbackOnly();
    }
});
```

검증 실패를 예외 없이 표현하는 예제입니다.
호출자에게 실패 결과를 어떻게 전달할지도 정해야 하며, 롤백만 하고 성공 응답을 반환하지 않도록 합니다.
실패 후 재시도는 이미 실패한 트랜잭션 안에서 계속 수행하기보다 새 경계에서 전체 판단을 다시 하는 편이 필요할 수 있습니다.

검증에서는 전송 실패, 저장 실패와 재시도를 나눠 확인합니다.
외부 통신 시 DB 연결 점유가 실제로 해제되는지도 풀 지표로 볼 수 있습니다.
리액티브 경로에는 TransactionalOperator 등 별도 도구를 사용하며 Template을 그대로 대입하지 않습니다.

명시적 경계의 계약은 [프로그래밍 방식 트랜잭션](https://docs.spring.io/spring-framework/reference/6.2/data-access/transaction/programmatic.html)을 참고합니다.

## 자주 묻는 질문

### self-invocation에서 트랜잭션이 안 먹는 이유는?

같은 객체 내부 호출은 프록시를 우회할 수 있습니다. 별도 빈 호출이나 관점 재배치가 필요합니다.

### checked 예외는 기본 롤백되나요?

기본적으로 RuntimeException과 Error만 롤백합니다. checked는 rollbackFor로 지정합니다.

