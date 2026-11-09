---
id: entity-enum-converter
title: 엔티티 enum 컨버터
description: AttributeConverter와 원셋 _Enum BizEnumProcessor ModelMapper 등록, 컨버터 마이그레이션을 연결합니다.
tags:
  - backend
  - jpa
  - enum
status: active
slug: "/knowledge/backend/entity/entity-enum-converter"
---

# JPA enum과 DB 공통코드를 AttributeConverter로 연결하기

업무 상태를 Java에서 enum으로 쓰더라도, DB에는 팀에서 정한 공통코드 문자열을 저장할 수 있습니다.<br />
예를 들어 코드가 `RSV_ACT_01`이라면, Java 상수 이름과 저장 문자열을 독립적으로 유지하고 싶을 수 있습니다.

| 매핑 | DB에 들어가는 값 |
|---|---|
| `@Enumerated(STRING)` | 기본적으로 Java enum 상수 이름 |
| `@Enumerated(ORDINAL)` | 상수의 순서 값 |
| `AttributeConverter` | 구현에서 정한 업무 코드 |

순서로 저장하면 enum의 중간에 항목을 삽입할 때 기존 숫자의 의미가 달라질 수 있습니다.<br />
이름으로 저장하면 상수명 변경 시 저장된 문자열과의 호환성을 확인해야 합니다.<br />
저장 코드를 별도로 두면 Java 이름을 바꾸더라도 그 코드가 유지되는지 검증할 수 있습니다.

## 원셋에서는 두 가지 변환이 일어납니다

```text
DB 코드 문자열 ↔ JPA AttributeConverter ↔ Java enum
API 코드 문자열 ↔ ModelMapper 변환기    ↔ Java enum
```

원셋의 enum 템플릿은 코드 변환을 위한 생성 클래스를 만들고, 해당 타입의 ModelMapper 변환도 등록합니다.<br />
JPA 변환은 컬럼에서 값을 읽고 쓸 때 적용되고, ModelMapper 변환은 객체를 매핑할 때 적용됩니다.

테스트에서는 기존 DB 코드로 엔티티를 읽고, 다시 저장했을 때 같은 코드가 남는지 확인합니다.<br />
이전에 쓰던 코드나 아직 배포되지 않은 새 코드가 들어올 수 있다면, 알 수 없는 값을 어떻게 처리할지도 정합니다.
[원셋 enum 템플릿](/docs/harness/templates/backend/spring/enum/) / [JPA 매핑 애노테이션](/docs/knowledge/backend/entity/entity-annotations-catalog)

## 코드 이름을 바꿔도 기존 행을 읽는지 확인하기

업무에서 `PENDING`을 `WAITING`이라고 부르기로 했다고 가정합니다.<br />
Java 상수 이름을 바꾸더라도 기존 예약 행에 저장된 코드를 유지한다면 데이터 이관 없이 읽을 수 있습니다.

테스트는 DB에 기존 코드를 넣고 엔티티를 읽는 방향과, 새 enum 상수를 저장하고 DB 코드를 확인하는 방향으로 나눕니다.<br />
API 요청과 응답에서 쓰는 코드도 같아야 한다면 ModelMapper 변환을 별도로 검증합니다.<br />
DB 변환이 동작했다고 해서 웹 DTO의 변환까지 적용됐다고 판단할 수는 없습니다.

## 참고 자료

- [Jakarta Persistence의 속성 변환과 열거형 매핑](https://jakarta.ee/specifications/persistence/3.2/jakarta-persistence-spec-3.2)
