---
id: spring-cloud-project-map
title: 앱 라이브러리와 별도 운영 서버
description: Spring Cloud 프로젝트를 라우팅, 발견, 설정, 메시징, 실행과 테스트로 나누고 라이브러리와 운영 서버의 차이를 설명합니다.
slug: /knowledge/backend/spring-cloud/project-map
sidebar_position: 3
status: active
tags: [Spring, Spring Cloud]
keywords:
  - "앱 라이브러리와 별도 운영 서버"
  - "Spring"
  - "Spring Cloud"
  - "Release Train"
  - "BOM"
  - "Starter"
  - "Spring Boot"
  - "라이브러리"
---
# 프로젝트별 역할과 실행 형태

Spring Cloud 저장소를 처음 보면 모두 별도 서버처럼 느껴질 수 있습니다.
실제로는 앱에 넣는 라이브러리, 서버를 만드는 기능, 플랫폼 통합과 릴리스 관리 도구가 섞여 있습니다.
어떤 문제를 해결하는지와 무엇을 운영해야 하는지를 나눠 살펴봅니다.

이 글의 분류는 이해를 위한 역할 구분입니다.
전체 공식 목록과 최신 제공 범위는 [Spring Cloud 프로젝트 페이지](https://spring.io/projects/spring-cloud/)를 기준으로 확인합니다.

## 라우팅과 서비스 호출

| 프로젝트 | 제공하는 기능 | 실행 형태와 경계 |
|---|---|---|
| [Gateway](https://spring.io/projects/spring-cloud-gateway/) | 경로 조건과 필터를 적용해 요청을 전달합니다. | 서버 앱으로 구성할 수 있으며, 기능과 실행 모델에 따라 구현 계열을 선택합니다. |
| [Commons](https://spring.io/projects/spring-cloud-commons/) | DiscoveryClient 등 여러 구현이 공유하는 추상화를 제공합니다. | 주로 앱 내부 라이브러리입니다. 별도 레지스트리 제품 자체는 아닙니다. |
| [LoadBalancer](https://docs.spring.io/spring-cloud-commons/reference/spring-cloud-commons/loadbalancer.html) | 서비스 인스턴스 목록에서 호출 대상을 선택합니다. | Commons 저장소의 클라이언트 측 로드밸런싱 기능입니다. |
| [OpenFeign](https://docs.spring.io/spring-cloud-openfeign/reference/) | HTTP 호출 인터페이스를 Boot 설정과 연결합니다. | 앱에 추가하는 통합 라이브러리이며 별도 프록시 서버가 아닙니다. |
| [Circuit Breaker](https://docs.spring.io/spring-cloud-circuitbreaker/reference/) | Resilience4j 등 구현을 공통 API로 연결합니다. | 앱의 호출 경계에서 사용하는 라이브러리입니다. |

Gateway의 WebFlux 계열과 MVC 계열은 필터 API와 실행 모델이 다릅니다.
한쪽의 설정 키나 필터 예제를 다른 쪽에 그대로 적용하지 않습니다.
공통 라우팅이 필요한지, 특정 Controller에서 일부 요청만 프록시할지도 구분합니다.
[Gateway 공식 문서](https://docs.spring.io/spring-cloud-gateway/reference/)는 Server와 Proxy Exchange 및 각 웹 스택을 구분합니다.

OpenFeign의 feature-complete는 즉시 사용할 수 없다는 뜻이 아닙니다.
공식 안내가 신규 기능 확장보다 버그 수정 중심의 방향을 제시한다는 의미로 읽고, 신규 도입과 기존 유지보수를 나눠 판단합니다.
신규 HTTP 호출은 [Spring의 REST 클라이언트](../../spring/spring-web/outbound-http.md)와도 비교합니다.

Circuit Breaker는 실패율 등의 조건에 따라 호출을 제한하는 경계입니다.
그 자체로 모든 타임아웃과 재시도, 동시 요청 제한이 설정되는 것은 아닙니다.
업무 실패를 성공한 fallback으로 숨기지 않도록 반환 계약도 정합니다.

## 서비스 등록과 발견

| 프로젝트 | 기반 시스템 | 역할 |
|---|---|---|
| [Netflix](https://github.com/spring-cloud/spring-cloud-netflix) | Eureka | Eureka Server와 Client를 Spring 앱에 연결합니다. |
| [Consul](https://spring.io/projects/spring-cloud-consul/) | HashiCorp Consul | 서비스 발견과 설정 통합을 제공합니다. |
| [Zookeeper](https://docs.spring.io/spring-cloud-zookeeper/reference/) | Apache Zookeeper | 서비스 발견과 설정 통합을 제공합니다. |
| [Kubernetes](https://docs.spring.io/spring-cloud-kubernetes/reference/) | Kubernetes API와 리소스 | 서비스 발견과 설정 등을 Spring Cloud의 모델에 연결합니다. |

일반적으로 먼저 운영 환경에서 사용할 발견 경로를 정합니다.
Eureka, Consul과 Zookeeper를 모두 설치하는 기본 세트가 있는 것은 아닙니다.
기존 인프라, 네트워크 경계와 클라이언트 요구에 따라 선택합니다.

Kubernetes 안에서는 Service DNS로 호출할 수 있습니다.
앱이 Pod별 주소를 직접 알아야 하는 요구가 없다면 별도의 DiscoveryClient가 필요한지 검토합니다.
단순 DNS 접근, Kubernetes API 조회와 외부 레지스트리 조회는 권한과 장애 경계가 다릅니다.
세부 관계는 [등록, 발견과 로드밸런싱](../discovery/discovery-and-balancing.md)에 정리했습니다.

## 설정, 비밀과 관리 이벤트

| 프로젝트 | 주요 목적 | 별도 운영 또는 전제 |
|---|---|---|
| [Config](https://spring.io/projects/spring-cloud-config/) | 환경별 외부 설정을 제공하고 읽습니다. | Config Server와 설정 저장소를 구성할 수 있습니다. |
| [Vault](https://docs.spring.io/spring-cloud-vault/reference/) | Vault 비밀을 앱의 설정으로 연결합니다. | Vault 서버, 인증 수단과 정책이 필요합니다. |
| [Bus](https://docs.spring.io/spring-cloud-bus/reference/) | 설정 변경 등 관리 이벤트를 여러 인스턴스에 전달합니다. | AMQP 또는 Kafka 같은 메시징 전송 경로를 사용합니다. |

Config Server와 Vault는 모두 값을 제공할 수 있지만 관리 대상과 보안 기능이 다릅니다.
일반 설정의 버전 관리와 비밀 값의 접근 권한 및 수명 관리를 구분합니다.
Cloud Vault를 추가했다고 Vault 서버가 자동 설치되거나 앱 인증이 사라지지는 않습니다.

Spring Vault는 Vault API 사용을 지원하는 기반 프로젝트이고, Spring Cloud Vault는 그 위에서 외부 설정 통합을 제공합니다.
VaultTemplate 등으로 직접 비밀을 읽는 방법과 기동 설정으로 바인딩하는 방법은 필요와 갱신 시점이 다릅니다.

Bus는 이벤트를 전파하는 통로입니다.
이벤트가 도착했다고 모든 빈과 클라이언트 연결이 자동 재생성되는 것은 아닙니다.
설정 갱신을 지원하는 대상, 각 인스턴스의 적용 결과와 실패 복구를 별도로 확인합니다.

## 메시징과 실행 모델

| 프로젝트 | 다루는 범위 | 구분할 대상 |
|---|---|---|
| [Stream](https://docs.spring.io/spring-cloud-stream/reference/) | 메시지 입출력을 Binder로 Kafka, RabbitMQ 등에 연결합니다. | 브로커 자체와 전달 의미는 별도로 존재합니다. |
| [Function](https://spring.io/projects/spring-cloud-function/) | Supplier, Function, Consumer 등의 함수 모델을 여러 실행 환경에 연결합니다. | 반드시 외부 서버리스에 배포해야 하는 것은 아닙니다. |
| [Task](https://spring.io/projects/spring-cloud-task/) | 실행 후 끝나는 앱의 실행 정보를 관리합니다. | Batch의 항목 처리와 Step 재시작 모델을 대신하는 것은 아닙니다. |

Stream을 사용하면 연결 설정과 공통 메시징 모델을 활용할 수 있습니다.
그러나 Kafka의 오프셋, 파티션과 consumer group이 사라지는 것은 아닙니다.
브로커를 바꿀 때 전달 순서와 재시도, 트랜잭션 의미까지 같다고 가정하지 않습니다.

Spring Kafka나 Spring AMQP를 직접 사용하는 방식과 Stream의 Binder를 사용하는 방식은 선택지입니다.
브로커 기능을 어느 정도 직접 사용할지와 공통 모델을 어디까지 유지할지에 따라 판단합니다.
Stream을 쓴다고 재처리와 중복 방지 정책이 불필요해지지는 않습니다.

Task는 단기 실행 앱의 생명주기를, Batch는 작업의 단계와 커밋 및 복구 단위를 다룹니다.
함께 사용할 수 있지만 일반 배치 개발에 항상 둘 다 필요한 것은 아닙니다.
[Spring Batch의 Job과 Step](../../spring/batch/job-and-step.md)과 비교하면 차이를 보기 쉽습니다.

## 계약 테스트와 플랫폼 통합

| 프로젝트 | 역할 | 확인할 범위 |
|---|---|---|
| [Contract](https://docs.spring.io/spring-cloud-contract/reference/) | 생산자와 소비자 사이의 계약 테스트와 stub 활용을 지원합니다. | 실제 네트워크와 전체 업무 시나리오 검증을 별도로 둡니다. |
| [Open Service Broker](https://spring.io/projects/spring-cloud-open-service-broker/) | Open Service Broker API를 구현하는 서버를 만들도록 지원합니다. | DB 등 서비스를 플랫폼에 제공하는 연동에 사용하며 Kafka 같은 메시지 브로커와 다릅니다. |

Contract는 서로 배포 시점이 다른 서비스의 요청과 응답 기대를 검증하는 데 활용할 수 있습니다.
명세가 실제 제공 동작과 연결되는 테스트가 있는지 확인하고, stub만 성공한 결과를 실환경 연동 성공으로 표현하지 않습니다.

AWS, Azure, GCP와 Alibaba 연계 프로젝트도 공식 Cloud 목록에서 찾아볼 수 있습니다.
이들은 외부 클라우드 서비스 접근을 돕지만 운영 조직, 배포판과 지원 버전 체계가 모두 같지는 않습니다.
Spring Cloud 조직 저장소 목록에 모든 연계 프로젝트가 같은 이름과 위치로 존재한다고 가정하지 않습니다.
필요한 클라우드의 공식 프로젝트에서 소유자와 지원 정책을 확인합니다.

## 제품 기능이 아닌 저장소도 있습니다

| 저장소 종류 | 예시 | 읽는 목적 |
|---|---|---|
| 공통 기반 코드 | spring-cloud-commons | 구현 사이의 계약과 공통 기능을 봅니다. |
| 버전 조합 관리 | spring-cloud-release | Release Train과 BOM을 확인합니다. |
| 공통 빌드 지원 | spring-cloud-build | 프로젝트들의 빌드 및 릴리스 기반을 봅니다. |
| 예제와 문서, CI | 저장소별 샘플 및 자동화 | 기능 사용과 개발 절차를 참고합니다. |

저장소 수를 세어 설치할 서버 수로 해석하지 않습니다.
도입할 때는 필요한 기능, 앱에 추가할 의존성, 실제 운영할 프로세스와 외부 자원을 나눠 적으면 비용과 장애 경계가 드러납니다.
다음으로 [Starter, BOM과 Release Train](./starters-and-release-train.md)을 확인하면 각 프로젝트의 버전을 따로 섞는 실수를 줄일 수 있습니다.

## 자주 묻는 질문

### 라우팅과 서비스 호출에서 무엇을 확인하나요?

항목의 책임과 적용 경계를 확인합니다. 운영 환경과 버전 지원을 기준으로 적용합니다.

### 서비스 등록과 발견에서 무엇을 확인하나요?

등록, 발견과 주소 선택은 책임이 다릅니다. Server와 Client 설정을 구분해 확인합니다.
