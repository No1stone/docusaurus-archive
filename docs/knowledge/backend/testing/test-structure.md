---
id: test-structure
title: 테스트 기본 구조
description: Spring 테스트의 경계, 배치, 명명과 실행 기준
tags:
  - backend
  - testing
status: active
---
# 테스트 기본 구조

> **개요:** Spring 프로젝트에서 재사용하는 테스트 경계, 배치, 명명과 실행 기준입니다.
> 통과 기준은 통과 기준 문서를 따릅니다.
> 이 문서는 테스트 경계를 정합니다.
> 프로젝트에 이미 있는 테스트 구조가 이 문서보다 우선합니다.

이 페이지는 개념입니다.
최소 코드 골격은 [`testing 템플릿`](/docs/harness/templates/backend/spring/testing/)입니다.
통과 기준의 절차는 [`구현 전 통과 기준`](/docs/harness/workflows/acceptance)입니다.
아카이브에 둔 예시는 이 저장소에서 실행하지 않았습니다.
실행 완료된 표준으로 읽지 않습니다.

## 기본 폴더 구조

```text
src/test/
├── java/{기본 패키지}/
│   ├── {대상 코드와 같은 패키지}/
│   │   ├── XxxTest.java
│   │   └── XxxIntegrationTest.java
│   ├── scenario/{업무}/
│   │   └── XxxScenarioTest.java
│   └── testsupport/
└── resources/
    ├── application-test.yaml
    └── fixtures/

src/e2eTest/
```

단위, 슬라이스와 통합 테스트는 대상 코드의 패키지를 따릅니다.
여러 계층을 연결하는 업무 시나리오는 `scenario` 아래 업무 폴더에 배치합니다.

테스트 종류를 구분하기 위해 `unit/`, `slice/`, `integration/` 폴더를 추가하지 않습니다.
실제 애플리케이션의 패키지 이름이 `integration`인 경우에는 그 이름을 그대로 따릅니다.

필요한 테스트가 생길 때 폴더를 생성합니다.
공통 준비 코드는 반복이 확인된 경우에만 `testsupport`로 추출합니다.

## 테스트 경계

| 구분 | 실제 대상 | 대체 대상 | 검증 목적 |
|---|---|---|---|
| 단위 | Facade, TokenManager 등의 판단 로직 | 주변 Service와 Port | 정책, 분기, 결과 조합과 실패 처리 |
| MVC 슬라이스 | Controller와 Spring MVC 처리 | 업무 Facade | 입력 검증, 변환, 응답과 예외 매핑 |
| 데이터 통합 | Service, Repository와 테스트 DB | 운영 DB | 조회, 저장, 제약조건과 트랜잭션 |
| HTTP 통합 | REST 구현체와 실제 HTTP 클라이언트 | 외부 시스템을 로컬 스텁으로 대체 | 요청 및 응답 변환, 통신 실패 |
| 백엔드 시나리오 | 실제 내부 업무 계층과 테스트 DB | 외부 시스템 | 업무 흐름과 최종 상태 |
| Playwright E2E | 브라우저와 실행 중인 애플리케이션 | 통제된 외부 시스템 | 사용자 화면 흐름 |

시나리오는 업무 흐름을 나타내는 표현입니다.
단위 및 통합은 실제로 연결하는 범위를 나타내는 표현입니다.

모든 클래스에 모든 종류의 테스트를 생성하지 않습니다.
책임과 위험에 필요한 테스트를 선택합니다.

Service는 고정된 데이터 접근 계약을 검증합니다.
Facade는 유스케이스 정책과 결과 조합을 검증합니다.
Saga와 읽기 DB 분리 이후의 지연 정책은 아직 적용하지 않았습니다.
확장 대상입니다.

## 명명과 실행 규칙

| 이름 | 용도 |
|---|---|
| `XxxTest` | 단위 또는 슬라이스 |
| `XxxIntegrationTest` | 실제 DB 등의 통합 |
| `XxxHttpTest` | 로컬 HTTP 서버와 연결하는 통신 검증 |
| `XxxScenarioTest` | 백엔드 업무 흐름 |
| `XxxE2ETest` | 화면 E2E |

백엔드 기본 테스트는 `./gradlew test`로 함께 실행합니다.
종류별 실행 순서는 요구하지 않습니다.

Playwright는 프로젝트의 기존 실행 방식을 유지합니다.
대상 프로젝트가 Java Playwright와 `./gradlew e2eTest`를 쓰면 그 방식을 유지합니다.
Node 기반 실행으로 교체하지 않습니다.

추가 source set과 별도 실행 작업은 실행 시간이나 환경 분리 필요성이 확인된 경우에만 도입합니다.
테스트 DB와 외부 스텁 등 실행에 필요한 조건을 문서화합니다.
DB별 기능 검증에는 해당 DB가 필요합니다.
운영 DB, 실제 외부 연동 서버, 자격증명, 고객 정보, 운영 주소는 테스트에 넣지 않습니다.

## 시나리오 작성 규칙

하나의 시나리오는 다음 구조를 따릅니다.

```text
초기 상태 준비
→ 업무 행동 실행
→ 중간 결과 확인
→ 다음 업무 행동 실행
→ 최종 응답과 데이터 상태 확인
```

하나의 테스트 메서드 안에서 필요한 업무 순서를 유지합니다.
서로 다른 테스트 메서드의 실행 순서에 의존하지 않습니다.
기존 통합 테스트 메서드를 호출하여 시나리오를 구성하지 않습니다.

각 테스트가 자신의 초기 상태를 준비하고 데이터를 격리합니다.
공통 데이터 준비 기능은 재사용할 수 있습니다.
내부 호출 횟수보다 관찰 가능한 응답과 최종 상태를 중심으로 검증합니다.

assertion이 없는 테스트와, 단순 CRUD의 Repository 호출 여부만 반복하는 확인은 완료 증거가 아닙니다.

## 구현 전 순서

통과 기준과 작업별 확인 방법은 [구현 전 통과 기준](/docs/harness/workflows/acceptance)입니다.
이 페이지는 테스트의 배치와 경계만 정합니다.

## Related

- [Facade Design](../facade/facade-design.md)
- [Service의 책임과 분리 가능한 데이터 접근 경계](../service/service-design.md)
- [구현 전 통과 기준](/docs/harness/workflows/acceptance)
- [backend-unit-test](/docs/harness/tools/backend-unit-test)
- 템플릿(저장소): `docs/harness/templates/backend/spring/testing/`
