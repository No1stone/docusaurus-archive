# Testing template

> **개요:** ExampleItem 원셋의 단위·시나리오 테스트입니다.
> 배치 기준은 [테스트 기본 구조](/docs/knowledge/backend/testing/test-structure)입니다.
> 정상·경계·실패를 포함합니다.
> 이 아카이브에서는 Java 테스트를 실행하지 않습니다.
> 대상 프로젝트에 복사한 뒤 `./gradlew test`로 실행합니다.

프로젝트에 이미 있는 테스트 구조와 assertion 방식을 우선합니다.

## 파일

| 파일 | 자리 | 검증 |
|---|---|---|
| [`ExampleItemFacadeTest.java`](./ExampleItemFacadeTest.java) | 파사드와 같은 패키지 | 저장·조회 정상, 빈 ids 경계, 없는 id 실패 |
| [`ExampleItemServiceTest.java`](./ExampleItemServiceTest.java) | 서비스와 같은 패키지 | 빈·null ids, 빈 saveAll, 없는 id 실패 |
| [`ExampleItemScenarioTest.java`](./ExampleItemScenarioTest.java) | `scenario/{domain}/` | 저장→수정→조회→없는 id. 프로젝트에서는 실제 계층·DB로 교체 |

`ExampleItem`과 샘플 필드(`httpMethod`, `url`)는 치환 토큰입니다.

원셋 복사 안내는 [`../ONESET.md`](/docs/harness/templates/backend/spring/ONESET)입니다.
API E2E는 [`../e2e/`](../e2e/)입니다.
