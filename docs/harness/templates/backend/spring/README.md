# Spring RestOutLog slice

> **개요:** 테이블 한 세트와, 그 컬럼에 열거형을 적용하는 세트입니다.
> 옆에 `.java` 소스가 있고 README 본문에 코드 블록으로도 보입니다.
> 예제에서 메서드나 필드를 생략하지 않습니다.

## 테이블 한 세트

컨트롤러, 파사드, 서비스, 리포지토리, DTO, 스펙, 엔티티입니다.
이 세트의 컬럼은 문자열입니다.

| Layer | Path |
|-------|------|
| Controller | [controller/](./controller/) |
| Facade | [facade/](./facade/) |
| Service | [service/](./service/) |
| DTO | [dto/](./dto/) |
| Entity, Repository, Spec | [persistence/](./persistence/) |
| Support | [support/](./support/) |

```text
controller → facade → service → repository
                         ↓
                    dto, spec, entity
```

## 이넘 적용 한 세트

[enum/](./enum/) 입니다.
테이블 세트 전체에 `httpMethod` 열거형을 적용한 소스, `BizEnumProcessor` 전체, `ModelMapperUtil.map` / `mapAll`, 생성 컨버터를 소스에 두지 않는 주의점이 있습니다.

Each folder README lists files and embeds the `.java` sources as code blocks.
Agents copy from those blocks or the raw `.java` files.
Do not shorten a method when copying.
