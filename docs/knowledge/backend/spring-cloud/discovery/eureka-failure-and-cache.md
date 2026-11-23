---
id: spring-cloud-discovery-eureka-failure-and-cache
title: Heartbeat, 캐시와 장애 반영
description: heartbeat와 캐시 때문에 장애가 반영되는 과정을 정리합니다.
slug: /knowledge/backend/spring-cloud/discovery/eureka-failure-and-cache
sidebar_position: 5
status: active
tags: [Spring, Spring Cloud]
keywords:
  - "Heartbeat, 캐시와 장애 반영"
  - "Spring"
  - "Spring Cloud"
  - "Eureka"
  - "DiscoveryClient"
  - "LoadBalancer"
  - "Service Discovery"
  - "Heartbeat"
---
# Heartbeat, 캐시와 장애 반영

프로세스를 종료했는데 Eureka 대시보드와 호출 결과가 즉시 바뀌지 않을 수 있습니다.
서버가 인스턴스의 생존을 판단하는 시간과 호출자가 주소 목록을 갱신하는 시간이 다르기 때문입니다.
이 지연은 서비스 발견 구조의 운영 특성으로 다뤄야 합니다.

## 장애 반영은 여러 단계를 거칩니다

```mermaid
flowchart LR
    Stop[업무 앱 비정상 종료] --> Lease[heartbeat 누락과 만료 판단]
    Lease --> Registry[서버 목록 변경]
    Registry --> Fetch[클라이언트 목록 갱신]
    Fetch --> Select[호출 대상 선택에 반영]
```

Cloud LoadBalancer의 별도 캐시가 있다면 추가 지연이 생길 수도 있습니다.
특정 한 주기만 보고 전체 제거 시간이 같다고 계산하지 않습니다.
정상 종료의 등록 해제와 비정상 종료의 만료도 구분합니다.

| 상황 | 확인할 지점 |
|---|---|
| 대시보드에 남음 | lease, eviction과 서버 상태 |
| 대시보드에는 없지만 호출함 | 클라이언트와 LoadBalancer의 목록 및 캐시 |
| 등록은 있으나 연결 거절 | 잘못 광고한 주소와 실제 프로세스 |
| 네트워크 단절 중 대량 만료가 안 됨 | self-preservation 동작 |

Eureka의 self-preservation은 heartbeat가 대량으로 사라졌을 때 잘못된 제거를 줄이기 위한 보호 동작입니다.
앱 상태가 오래 남는다는 이유만으로 운영에서 무조건 끄는 것은 위험합니다.
네트워크 장애와 실제 앱 종료를 구별하기 어려운 상황을 먼저 생각합니다.

## 레지스트리만으로 실패를 다 막을 수는 없습니다

목록에서 선택한 직후 상대가 종료될 수도 있습니다.
따라서 클라이언트의 연결 및 응답 시간 제한이 필요하고, 재시도는 요청의 중복 실행 가능성을 고려합니다.
조회와 쓰기에 같은 재시도 정책을 일괄 적용하지 않습니다.

시험 환경에서 한 인스턴스만 강제 종료하고 서버 목록, 호출자 목록과 실제 오류 시각을 기록합니다.
서버 전체를 차단한 실험과 인스턴스 한 대를 종료한 실험을 분리해야 원인을 설명할 수 있습니다.

만료와 보호 설정은 [Eureka 공식 문서](https://docs.spring.io/spring-cloud-netflix/reference/4.3/spring-cloud-netflix.html), 추가 캐시는 [LoadBalancer 문서](https://docs.spring.io/spring-cloud-commons/reference/spring-cloud-commons/loadbalancer.html)를 함께 참고합니다.

## 자주 묻는 질문

### 장애 반영은 여러 단계를 거칩니다에서 무엇을 확인하나요?

최소 설정으로 동작을 확인한 뒤 확장합니다. 성공과 실패를 경로별로 기록합니다.

### 레지스트리만으로 실패를 다 막을 수는 없습니다에서 무엇을 확인하나요?

등록, 발견과 주소 선택은 책임이 다릅니다. Server와 Client 설정을 구분해 확인합니다.
