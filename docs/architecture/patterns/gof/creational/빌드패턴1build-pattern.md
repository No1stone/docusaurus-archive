---
format: md
id: pattern-빌드패턴1build-pattern
title: "빌드패턴1(build pattern)"
description: "VO와 Builder 클래스로 객체를 조립하는 빌더 패턴 메모"
tags:
  - GoF
status: active
slug: /patterns/pattern-빌드패턴1build-pattern
---
# 빌드패턴1(build pattern)

> **개요:** VO를 만들고, 그 VO를 세팅하는 Builder 클래스로 인스턴스를 조립하는 빌더 패턴 메모입니다.

## 구조

1. VO를 생성합니다.
2. VO를 빌드하는 빌더 클래스를 만듭니다.

빌더 클래스 안에는 VO 필드를 둡니다.

```java
private Vo vo;
```

## 빌더 API (원 노트 스케치)

정적 팩토리로 빌더를 얻습니다.

```java
public static VoBuilder builder() {
    return new VoBuilder();
}
```

필드 setter 체인입니다.

```java
public VoBuilder 변수(파라미터) {
    vo.set변수(...);
    return this;
}
```

`build`에서 VO를 반환합니다.

```java
public Vo build() {
    return this.vo;
}
```

## 사용 흐름

1. `builder()`로 빌더 인스턴스를 만듭니다.
2. 각 필드 setter(`변수(...)`)를 호출합니다.
3. `build()`로 완성된 VO를 받습니다.
