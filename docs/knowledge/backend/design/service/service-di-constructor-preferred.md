---
id: service-di-constructor-preferred
title: Service — 생성자 주입이 기본인 이유
description: 필수 의존에 생성자(또는 RequiredArgsConstructor)를 쓰는 이유와 필드 Autowired 함정을 정리합니다.
tags:
  - backend
  - spring
  - di
status: active
slug: "/knowledge/backend/service/service-di-constructor-preferred"
---

# Service — 생성자 주입이 기본인 이유

> **개요:** Spring 팀이 권하는 필수 의존 주입 방식과 원셋 관례를 맞춥니다.
> 허브는 [데이터 접근 경계](/docs/knowledge/backend/service/service-design)입니다.

---

## 왜 생성자인가

- 필드를 `final`로 둘 수 있습니다
- 빈이 클라이언트에 넘어올 때 **이미 초기화**되어 있습니다
- 필수 빈이 없으면 기동·생성 시점에 실패합니다 (숨은 NPE보다 낫습니다)
- 단위 테스트에서 `new Facade(portStub)`로 직접 조립하기 쉽습니다

필드 `@Autowired`는 반사로 넣고, final이 아니며, 테스트가 `@InjectMocks`에 기대기 쉽습니다.
신규 Adapter·Facade에는 쓰지 않습니다.

```java
@Service
@RequiredArgsConstructor
public class ExampleItemAdapter implements ExampleItemPort {
    private final ExampleItemRepository exampleItemRepository;
}
```

생성자 인자가 과도하게 많으면 클래스 책임이 过大한 신호입니다.
Port를 쪼개거나 Facade/Adapter를 나눕니다.

선택 의존만 setter·`ObjectProvider`를 검토합니다.

---

## `@RequiredArgsConstructor`와 `@AllArgsConstructor`

| | RequiredArgsConstructor | AllArgsConstructor |
|--|-------------------------|--------------------|
| 대상 | `final`(및 `@NonNull`) 필드 | 모든 필드 |
| 원셋 | **기본** | JPA 엔티티 등과 혼동 주의 |

`@Value`로 넣는 설정값은 final + 생성자 파라미터로 맞추거나, 호스트 관례를 문서화합니다.

발전사 전체는 [DI 발전사](/docs/knowledge/backend/service/service-di-evolution)입니다.

---

## 관련

- [DI 발전사](/docs/knowledge/backend/service/service-di-evolution)
- [어디에 무엇을 주입하나](/docs/knowledge/backend/service/service-di-injection-points)
