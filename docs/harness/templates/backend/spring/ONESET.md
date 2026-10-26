# ExampleItem 원셋

> **개요:** 검증된 구현, 단위·시나리오 테스트, Controller API E2E를 한 세트로 둡니다.
> 새 작업에서는 재사용·복사 후 이번 도메인 차이만 채웁니다.
> 대상 저장소 규칙이 이 안내보다 우선합니다.
> 실행 원칙(토큰 최소 경로)은 [`implementer.md`](/docs/harness/agents/implementer)입니다.

## 목표

검증된 구현·단위/통합(시나리오)·내 서버 Controller API E2E를 함께 가져오고, 도메인 차이만 채웁니다.

공통 원셋 E2E는 내 서버 Controller API입니다.
외부 스펙 더미와 RestClient 연동 검증은 원셋에 넣지 않습니다.
외부 통신이 있을 때만 추가합니다.

## 원셋 실행

- 구현·테스트·Controller API E2E를 함께 가져오고, 이번 도메인의 차이만 채웁니다.
- 예제명, 패키지, 필드, 경로, 계약, 기대 결과를 구현·테스트·E2E에 일관되게 맞춥니다.
- 저장소 규칙과 충돌하지 않는 구조·메서드·공통 처리는 유지합니다.
- 실패 원인을 확인한 뒤 관련 구현·설정·테스트 중 잘못된 부분만 수정합니다.
  통과를 위해 기대 결과를 임의로 완화하거나 원셋 전체를 다시 생성하지 않습니다.

## 그대로 복사 / 프로젝트별로 채움

### 그대로 가져와 유지

- Controller → Facade → Port → JPA Adapter → Repository 계층과 메서드 골격
- FacadeTest, AdapterTest, ScenarioTest 배치와 정상·경계·실패 골격
- E2E 요청 순서: 등록 → 조회 → 수정 → 변경 조회 → 삭제 → 대표 입력 오류 → 없는 id
- `runId`로 실행마다 고유 데이터를 쓰는 방식
- 충돌하지 않는 support·공통 응답 유틸 (프로젝트에 이미 있으면 재사용)

### 프로젝트별로 채움 (치환·계약)

| 항목 | 예제 | 작업 시 |
|------|------|---------|
| 클래스·패키지·테이블 | `ExampleItem`, `le_example_item` | 도메인 규칙 |
| 공개 경로 | `/example-items` | `@RequestMapping` |
| Req/Res 필드 | `httpMethod`, `url`, … | 실제 컬럼·필터 |
| 성공 `code` | `"OK"` | 프로젝트 응답 봉투 |
| E2E `baseUrl`, 인증 | 로컬 주소, 헤더 없음 | 기동·인증 방식 |
| E2E 06 입력 오류 | `NOT_A_VALID_METHOD` | 그 API의 대표 검증 실패 |

HT·파트너 키·운영 주소·실토큰은 넣지 않습니다.

### 확장 지점 (정책 강제 없음)

공통 템플릿은 아래를 비워 두거나 느슨한 단언만 둡니다.
저장소 계약에 맞게 채웁니다.
특정 삭제 방식이나 오류 HTTP 상태를 원셋이 새로 강제하지 않습니다.

| 지점 | 템플릿 상태 | 프로젝트에서 |
|------|-------------|--------------|
| `entity.delete()` | 본문 비움 | 하드 삭제, 소프트 삭제 등 저장소 정책 |
| 없는 id 조회 | “성공 코드가 아님” 수준 | HTTP 상태·응답 형태는 저장소 계약 |
| E2E 05 삭제·07 없는 id | 위 계약에 맞춘 기대 | 삭제 후 부재 단언 여부 포함 |

## 복사할 파일

### 구현 (필수)

| 원본 | 대상 자리 (예) |
|------|----------------|
| `controller/ExampleItemController.java` | `entrance.{domain}/` |
| `facade/ExampleItemFacade.java` | `{domain}.facade` |
| `port/ExampleItemPort.java` | `{domain}.port` |
| `adapter/JpaExampleItemAdapter.java` | `{domain}.adapter` |
| `dto/ExampleItemReq.java` | `{domain}.dto` |
| `dto/ExampleItemRes.java` | `{domain}.dto` |
| `persistence/ExampleItem.java` | `{domain}.entity` |
| `persistence/ExampleItemRepository.java` | `{domain}.repository` |
| `persistence/ExampleItemSpecs.java` | `{domain}.spec` |

### 테스트 (필수)

| 원본 | 대상 자리 |
|------|-----------|
| `testing/ExampleItemFacadeTest.java` | 파사드와 같은 패키지 |
| `testing/ExampleItemAdapterTest.java` | 어댑터와 같은 패키지 |
| `testing/ExampleItemScenarioTest.java` | `scenario/{domain}/` |

### Controller API E2E (필수)

| 원본 | 대상 자리 |
|------|-----------|
| `e2e/ExampleItem.api.collection.json` | 프로젝트 컬렉션 폴더 |
| `e2e/ExampleItem.api.environment.json` | 프로젝트 환경 폴더 |

### 조건부

| 원본 | 조건 |
|------|------|
| `enum/` 적용 예 | 컬럼에 `@BizEnum`을 쓸 때 |
| `support/` 개별 파일 | 프로젝트에 동일 타입이 없을 때 |
| 외부 연동 E2E | 외부 통신이 있을 때. 공통 원셋 밖 |

## 실행 순서

```text
1. 구현·테스트·E2E 복사 후 이름·필드·경로·계약 치환
2. ./gradlew test  (FacadeTest, AdapterTest, ScenarioTest)
3. 앱을 데모/로컬·테스트 DB로 기동
4. Controller API 컬렉션 실행
5. (선택) 외부 통신이 있으면 스펙 더미 → Client 연동 E2E
6. 실패 시 원인 확인 후 관련 구현·설정·테스트만 수정
```

## 오케스트레이션

- 원셋 전체: [`spring-api-one-set`](/docs/harness/orchestrations/spring-api-one-set)
- Controller API E2E만: [`api-collection-e2e`](/docs/harness/orchestrations/api-collection-e2e)
