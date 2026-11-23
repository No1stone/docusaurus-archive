---
id: spring-cloud-configuration-refresh-failure-and-recovery
title: 다중 인스턴스 갱신 확인과 실패 복구
description: 여러 인스턴스에 갱신이 적용됐는지 확인하고 실패를 복구하는 방법을 정리합니다.
slug: /knowledge/backend/spring-cloud/configuration/refresh-failure-and-recovery
sidebar_position: 8
status: active
tags: [Spring, Spring Cloud]
keywords:
  - "다중 인스턴스 갱신 확인과 실패 복구"
  - "Spring"
  - "Spring Cloud"
  - "Config Server"
  - "Config Client"
  - "Spring Cloud Bus"
  - "RefreshScope"
  - "인스턴스"
---
# 다중 인스턴스 갱신 확인과 실패 복구

설정 변경 API가 200을 반환해도 모든 앱이 새 설정을 적용했다고 단정할 수 없습니다.
이벤트 발행, 전달, 설정 재조회와 기능 반영이 서로 다른 단계이기 때문입니다.
다중 인스턴스에서는 적용 결과가 잠시 섞이는 상황까지 고려합니다.

```mermaid
flowchart LR
    Change[설정 revision] --> Publish[변경 알림]
    Publish --> Receive[인스턴스 수신]
    Receive --> Bind[재조회와 바인딩]
    Bind --> Apply[기능 반영 확인]
```

## 변경 식별자를 남깁니다

```yaml
app:
  configuration-revision: route-2026-11-19-01
```

예제용 revision을 설정과 함께 전달하고 인스턴스별 관측 정보로 기록할 수 있습니다.
이 값은 비밀이 아니어야 하며, 기록만 바뀌고 실제 라우트는 이전 상태인 상황도 시험합니다.
설정 revision과 기능의 검증 결과를 함께 봐야 합니다.

| 실패 단계 | 확인 및 복구 방향 |
|---|---|
| Git 변경 알림 누락 | webhook 기록과 재발행 |
| 브로커 전달 실패 | 연결, 소비 상태와 재접속 |
| 설정 재조회 실패 | Config 상태와 인증 |
| 바인딩 실패 | 값의 타입과 제약, 이전 revision 복구 |
| 새 기능 객체 생성 실패 | 외부 자원과 초기화 오류 |

갱신과 재시작은 같은 복구 수단이 아닙니다.
재시작하면 시작 시 필수 설정을 다시 읽지만 진행 중 요청과 로컬 상태가 영향을 받습니다.
한 인스턴스씩 새 설정을 검증하는 배포 전략이 더 적합할 수도 있습니다.

## 잘못된 라우트를 넣어 봅니다

테스트 환경에서 없는 필터 이름, 도달 불가 URI와 잘못된 값의 타입을 각각 적용합니다.
앱이 어떤 설정을 유지하는지, 새 요청이 어떻게 실패하는지와 이전 설정으로 수렴하는지 확인합니다.
모든 실패에서 이전값을 자동 보존한다고 가정하지 않습니다.

변경 검토에는 대상 앱, revision, 기대 동작과 되돌릴 revision을 포함합니다.
설정 갱신은 코드 배포보다 짧아 보여도 서비스 동작을 바꾸는 운영 변경입니다.
관리 API는 일반 사용자 경로와 분리합니다.

기반 동작은 [Bus 갱신 API](https://docs.spring.io/spring-cloud-bus/reference/spring-cloud-bus/bus-endpoints.html)와 [Refresh Scope](https://docs.spring.io/spring-cloud-commons/reference/spring-cloud-commons/application-context-services.html)를 참고합니다.

## 자주 묻는 질문

### 변경 식별자를 남깁니다에서 무엇을 확인하나요?

최소 설정으로 동작을 확인한 뒤 확장합니다. 성공과 실패를 경로별로 기록합니다.

### 잘못된 라우트를 넣어 봅니다에서 무엇을 확인하나요?

라우트 매칭과 필터 처리는 Gateway의 핵심입니다. YAML 설정과 Java 구성, 커스텀 필터를 구분합니다.
