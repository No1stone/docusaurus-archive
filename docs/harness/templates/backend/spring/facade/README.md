# Facade template

> **개요:** 테이블 공개 애플리케이션 진입점입니다.
> Port만 주입합니다.
> Adapter, Repository, Spec, 엔티티를 직접 다루지 않습니다.

클래스 기본은 `@Transactional(readOnly = true, transactionManager = "transactionManager")` 이고, 쓰기만 `@Transactional` 입니다.
열거형 코드 재설정은 이 파일이 아니라 [enum 템플릿](../enum/) 입니다.

## Files

- [`ExampleItemFacade.java`](./ExampleItemFacade.java)
