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

## 참고 자료

- [Jakarta Persistence의 속성 변환과 열거형 매핑](https://jakarta.ee/specifications/persistence/3.2/jakarta-persistence-spec-3.2)
