---
format: "md"
id: "spring-spring-testing-unit-tests"
title: "단위 테스트"
description: "Spring 컨텍스트 없는 단위 테스트로 입력, 분기와 협력 계약을 검증하고 Mock과 fake의 선택 기준을 설명합니다."
slug: "/knowledge/backend/spring/spring-testing/unit-tests"
sidebar_position: 1
status: "active"
tags:
  - "Spring"
keywords:
  - "단위 테스트"
  - "Spring"
  - "Spring Test"
  - "@SpringBootTest"
  - "Testcontainers"
  - "@WebMvcTest"
---
# 단위 테스트

단위 테스트는 작게 정한 로직의 결과를 빠르게 확인하는 테스트입니다.
Spring을 사용하는 프로젝트에서도 모든 테스트가 컨텍스트를 띄울 필요는 없습니다.
생성자로 의존성을 받으면 실제 네트워크와 DB 없이 업무 판단을 검증할 수 있습니다.

## 결과가 보이는 작은 예제

```java
class NoticeServiceTest {
    @Test
    void sendsValidMessage() {
        List<String> sent = new ArrayList<>();
        NoticeService service = new NoticeService(sent::add);

        service.announce("점검 안내");

        assertThat(sent).containsExactly("점검 안내");
    }

    @Test
    void rejectsBlankMessage() {
        List<String> sent = new ArrayList<>();
        NoticeService service = new NoticeService(sent::add);

        assertThatThrownBy(() -> service.announce(" "))
                .isInstanceOf(IllegalArgumentException.class);
        assertThat(sent).isEmpty();
    }
}
```

JUnit Jupiter와 AssertJ가 있는 테스트이며, 서비스 구현은 [IoC와 DI](../spring-core/ioc-and-di.md)의 예제를 사용합니다.
동작 전 준비, 행동과 결과를 공백으로 구분합니다.
BDD 표현을 사용할 때 Given, When, Then은 이 세 역할을 드러내는 도구이며 주석 세 줄 자체가 품질을 보장하지는 않습니다.

## 대역이 필요한 위치

| 대역 | 사용 목적 | 주의점 |
|---|---|---|
| stub | 정해진 입력에 결과를 돌려줍니다. | 실제 계약과 다른 반환을 만들지 않습니다. |
| mock | 호출과 인수를 검증합니다. | 내부 구현 순서에 과도하게 결합하지 않습니다. |
| fake | 메모리 저장소처럼 작은 구현을 둡니다. | DB 잠금과 제약까지 재현했다고 보지 않습니다. |

협력 객체가 불렸는지만 확인하면 실제 반환 결과가 틀려도 통과할 수 있습니다.
가능하면 결과와 상태를 검증하고, 외부 부작용의 호출이 계약일 때 상호작용도 확인합니다.
호출 횟수를 검증할 때는 그 횟수가 요구사항인지 구현 세부인지 구분합니다.

## 단위 테스트가 검증하지 않는 것

직접 생성한 객체에는 AOP, 트랜잭션 프록시와 Bean Validation이 자동 적용되지 않습니다.
DTO에 `@NotBlank`가 있어도 `new`만으로 예외가 발생하지 않습니다.
검증기 자체를 호출하거나 실제 웹 바인딩 테스트를 해야 합니다.
Repository를 mock 처리한 테스트는 JPQL과 SQL의 유효성을 확인하지 않습니다.

시간은 Clock, ID 생성은 공급 객체처럼 제어 가능한 경계를 두면 테스트를 반복하기 쉽습니다.
비동기는 sleep으로 운 좋게 통과시키기보다 완료 신호와 제한 시간을 사용합니다.
테스트끼리 static 상태와 임시 파일을 공유하지 않도록 정리합니다.

성공 외에도 입력 없음, 경계값과 협력 객체 실패를 포함합니다.
반환값에 맞춰 기대값을 따라 고치는 대신, 먼저 업무의 통과 기준을 적고 구현 결과와 비교합니다.

Spring의 단위 테스트 관점은 [공식 테스트 문서](https://docs.spring.io/spring-framework/reference/6.2/testing/unit.html), 실행과 assertion은 [JUnit 5 사용자 안내](https://docs.junit.org/5.11.4/user-guide/)를 참고합니다.

## 자주 묻는 질문

### 슬라이스 테스트는 언제 쓰나요?

웹이나 JPA 등 계층만 빠르게 검증할 때 씁니다. 전체 맥락이 필요하면 @SpringBootTest로 올립니다.

### Testcontainers는 무엇에 쓰나요?

실제 DB나 브로커에 가까운 통합 검증에 사용합니다.

