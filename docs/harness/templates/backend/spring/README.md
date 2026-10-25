# Spring ExampleItem 원셋

> **개요:** 테이블 한 세트의 구현, 단위·시나리오 테스트, API E2E입니다.
> 옆에 `.java`와 E2E JSON이 있습니다.
> 예제에서 메서드나 필드를 생략하지 않습니다.
> 복사·치환·실행 순서는 [`ONESET.md`](/docs/harness/templates/backend/spring/ONESET)입니다.

## 목표

검증된 구현·단위/시나리오 테스트·Controller API E2E를 원셋으로 템플릿화합니다.
새 작업에서는 복사 후 달라지는 부분만 채웁니다.
외부 스펙 더미와 RestClient 연동 E2E는 원셋에 넣지 않습니다.

## 테이블 한 세트 (구현)

컨트롤러, 파사드, 서비스, 리포지토리, DTO, 스펙, 엔티티입니다.
이 세트의 컬럼은 문자열 샘플입니다.
공개 경로는 `/example-items`입니다.

| Layer | Path |
|-------|------|
| Controller | [controller/](./controller/) |
| Facade | [facade/](./facade/) |
| Service | [service/](./service/) |
| DTO | [dto/](./dto/) |
| Entity, Repository, Spec | [persistence/](./persistence/) |
| Support | [support/](./support/) |
| Testing | [testing/](./testing/) |
| API E2E | [e2e/](./e2e/) |

```text
controller → facade → service → repository
                         ↓
                    dto, spec, entity
tests: FacadeTest, ServiceTest, ScenarioTest
e2e: Postman collection (create → get → put → get → delete → bad input → missing)
```

## 이넘 적용 한 세트

[enum/](./enum/) 입니다.
테이블 세트 전체에 `httpMethod` 열거형을 적용한 소스입니다.
원셋 기본 경로에는 포함하지 않습니다.
필요할 때만 복사합니다.

Each folder README lists files and embeds sources where useful.
Agents copy from the raw files or code blocks.
Do not shorten a method when copying.
