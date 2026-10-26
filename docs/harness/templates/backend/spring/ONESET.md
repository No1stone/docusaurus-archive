# ExampleItem 원셋

> **개요:** 검증된 구현, 단위·시나리오 테스트, Controller API E2E를 한 세트로 둡니다.
> 새 작업에서는 재사용·복사 후 이번 도메인 차이만 채웁니다.
> 대상 저장소 규칙이 이 안내보다 우선합니다.
> 실행 원칙(토큰 최소 경로)은 [`implementer.md`](/docs/harness/agents/implementer)입니다.

## 목표

검증된 구현·단위/통합(시나리오)·내 서버 Controller API E2E를 함께 가져오고, 도메인 차이만 채웁니다.

공통 원셋 E2E는 내 서버 Controller API입니다.
외부 스펙 더미와 RestClient 연동 검증은 원셋에 넣지 않습니다.

## 도메인 폴더 구조

실무(`application.{domain}`)와 같습니다. **ExampleItem** 이 예제 도메인 id 입니다.

```text
exampleitem/
  controller/      # 원셋 확인용 (실무 entrance)
  facade/
  dto/
  persistence/
    ExampleItemPort.java
    ExampleItemAdapter.java
    entity/
    repository/
    spec/
```

- **Inbound Port 없음** — `Controller → Facade`
- **Outbound만 Port·Adapter** — `persistence/` (영속), 통신은 `client/` (`*ClientPort` / `*ClientAdapter`)

## 그대로 복사 / 프로젝트별로 채움

### 그대로 가져와 유지

- Controller → Facade → Port → Adapter → Repository 계층과 메서드 골격
- FacadeTest, AdapterTest, ScenarioTest 배치
- E2E 요청 순서: 등록 → 조회 → 수정 → 변경 조회 → 삭제 → 대표 입력 오류 → 없는 id
- `runId`로 실행마다 고유 데이터

### 프로젝트별로 채움

| 항목 | 예제 | 작업 시 |
|------|------|---------|
| 클래스·패키지·테이블 | `ExampleItem`, `le_example_item` | 도메인 규칙 |
| 공개 경로 | `/example-items` | `@RequestMapping` |
| Req/Res 필드 | `httpMethod`, `url`, … | 실제 컬럼·필터 |

## 복사할 파일

### 구현 (필수)

| 원본 | 대상 자리 (예) |
|------|----------------|
| `exampleitem/controller/ExampleItemController.java` | `entrance.{domain}/` |
| `exampleitem/facade/ExampleItemFacade.java` | `{domain}.facade` |
| `exampleitem/dto/*` | `{domain}.dto` |
| `exampleitem/persistence/ExampleItemPort.java` | `{domain}.persistence` |
| `exampleitem/persistence/ExampleItemAdapter.java` | `{domain}.persistence` |
| `exampleitem/persistence/entity/ExampleItem.java` | `{domain}.persistence.entity` |
| `exampleitem/persistence/repository/ExampleItemRepository.java` | `{domain}.persistence.repository` |
| `exampleitem/persistence/spec/ExampleItemSpecs.java` | `{domain}.persistence.spec` |

### 테스트 (필수)

| 원본 | 대상 자리 |
|------|-----------|
| `testing/ExampleItemFacadeTest.java` | 파사드와 같은 패키지 |
| `testing/ExampleItemAdapterTest.java` | persistence 패키지 |
| `testing/ExampleItemScenarioTest.java` | `scenario/{domain}/` |

### Controller API E2E (필수)

| 원본 | 대상 자리 |
|------|-----------|
| `e2e/ExampleItem.api.collection.json` | 프로젝트 컬렉션 폴더 |
| `e2e/ExampleItem.api.environment.json` | 프로젝트 환경 폴더 |

### 조건부

| 원본 | 조건 |
|------|------|
| `enum/` 적용 예 | 컬럼에 `@BizEnum`을 쓸 때 (같은 폴더 구조) |
| `support/` | 프로젝트에 동일 타입이 없을 때 |

## 실행 순서

```text
1. 구현·테스트·E2E 복사 후 이름·필드·경로·계약 치환
2. ./gradlew test
3. 앱 기동 후 Controller API 컬렉션 실행
4. 실패 시 원인 확인 후 관련 부분만 수정
```

## 오케스트레이션

- 원셋 전체: [`spring-api-one-set`](/docs/harness/orchestrations/spring-api-one-set)
- Controller API E2E만: [`api-collection-e2e`](/docs/harness/orchestrations/api-collection-e2e)
