# Spring ExampleItem 원셋

> **개요:** 테이블 한 세트의 구현, 단위·시나리오 테스트, API E2E입니다.
> 복사·치환·실행 순서는 [`ONESET.md`](./ONESET)입니다.

## 테이블 한 세트 (구현)

예제 도메인 id는 **ExampleItem** 입니다.
폴더는 실무 애플리케이션 도메인과 같습니다.

| Layer | Path |
|-------|------|
| 도메인 원셋 | [exampleitem/](./exampleitem/) |
| · Controller | [exampleitem/controller/](./exampleitem/controller/) |
| · Facade | [exampleitem/facade/](./exampleitem/facade/) |
| · DTO | [exampleitem/dto/](./exampleitem/dto/) |
| · persistence (Port·Adapter·entity·repo·spec) | [exampleitem/persistence/](./exampleitem/persistence/) |
| Support | [support/](./support/) |
| Testing | [testing/](./testing/) |
| API E2E | [e2e/](./e2e/) |
| 이넘 적용 변형 | [enum/](./enum/) |

```text
Controller → Facade → ExampleItemPort → ExampleItemAdapter → Repository
                         persistence/
tests: FacadeTest, AdapterTest, ScenarioTest
```

Inbound Port는 두지 않습니다. Outbound(영속·HTTP client)만 Port·Adapter입니다.

## 이넘 적용 한 세트

[enum/](./enum/) — 같은 폴더 구조에 `@BizEnum` 적용 예입니다.
