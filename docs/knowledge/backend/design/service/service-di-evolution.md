---
id: service-di-evolution
title: Service — DI 발전사
description: XML bean부터 Autowired 필드, 생성자 주입, RequiredArgsConstructor까지의 주입 방식 발전을 정리합니다.
tags:
  - backend
  - spring
  - di
status: active
slug: "/knowledge/backend/service/service-di-evolution"
---

# XML에서 생성자 주입까지, Spring 빈을 조립하는 코드가 달라진 과정

예전 프로젝트에서는 서비스가 어떤 매퍼를 쓰는지 확인하려면 클래스와 XML을 함께 열었습니다.<br />
클래스에는 필요한 필드가 있었고, 설정에는 그 필드에 들어갈 빈이 지정돼 있었습니다.

XML에서도 생성자를 쓸 수 있었고, 지금도 여러 조립 방법을 함께 사용할 수 있습니다.<br />
달라진 점은 필요한 협력자를 어디에서 읽고, 언제 확정할 수 있느냐입니다.

| 방식 | 의존을 읽는 곳 | 예 |
|---|---|---|
| XML 조립 | 빈 정의의 `constructor-arg` 또는 `property` | 서비스에 매퍼 연결 |
| 필드 주입 | 클래스 필드의 `@Autowired` | 컨테이너가 인스턴스 생성 후 주입 |
| Setter 주입 | setter 또는 설정 메서드 | 선택적인 협력자 설정 |
| 생성자 주입 | 클래스의 생성자 매개변수 | 생성 시 필수 Port 전달 |
| Lombok 생성자 | `final` 필드와 생성자 생성 애노테이션 | 원셋의 Facade와 Adapter |

원셋에서는 예약 Facade를 읽었을 때 어떤 Port가 필요한지 바로 찾을 수 있게 생성자 주입을 사용합니다.<br />
Lombok은 반복되는 생성자만 줄이고, 주입되는 협력자와 역할은 필드에 드러납니다.

예전 코드를 읽는다면 먼저 설정에서 실제 구현이 무엇인지 확인합니다.<br />
필드 주입을 생성자로 옮길 때는 여러 구현의 선택 기준도 같이 옮겨야 기존 빈 조립이 유지됩니다.
[XML과 매퍼 조립](/docs/knowledge/backend/service/service-di-xml-and-mapper) / [생성자 주입 선택](/docs/knowledge/backend/service/service-di-constructor-preferred)

## 필드 주입을 옮길 때 구현 선택도 옮기기

같은 Port를 구현하는 빈이 두 개라면 기존 필드의 `@Qualifier`가 어느 구현을 받는지 결정하고 있을 수 있습니다.<br />
필드를 `final`로 바꾸고 Lombok으로 생성자만 만들면, 한정자 애노테이션이 생성자 매개변수에 복사된다고 가정하기 어렵습니다.

변환 과정에서는 먼저 기존에 실제로 연결된 구현을 확인합니다.<br />
필요하면 명시적인 생성자 매개변수에 `@Qualifier`를 두고, 애플리케이션 컨텍스트 테스트에서 원하는 구현이 들어오는지 검증합니다.
