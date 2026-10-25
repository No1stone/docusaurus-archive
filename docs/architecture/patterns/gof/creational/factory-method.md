---
id: factory-method
title: Factory Method 패턴
description: Creator가 생성 절차를 고정하고 구체 객체 생성은 하위 타입에 맡기는 패턴
tags:
  - Java
  - GoF
  - patterns
status: active
slug: /patterns/factory-method
---
# Factory Method 패턴

> **개요:** Factory Method는 객체 생성의 공통 절차를 상위 타입에 두고, 어떤 객체를 만들지는 하위 타입이 결정하게 합니다.
> 아래는 학습용 예제이며, 이 아카이브의 채택된 백엔드 계층 규칙과는 별개입니다.

## 의도

생성 흐름(`init` → 생성 → `end`)은 같고, 만들어지는 제품만 바꾸고 싶을 때 사용합니다.
호출자는 구체 클래스 이름 대신 `Creator`의 `create`만 알면 됩니다.

한 해석은 “템플릿 메서드 집합체를 Strategy로 제어한다”는 표현입니다.
여기서는 Creator의 템플릿 메서드가 생성 절차를 고정하고, `createItem` 구현을 바꿔 제품을 고르는 형태로 이해하면 됩니다.

## 구성

| 역할 | 책임 |
|------|------|
| `Creator` | `create`로 생성 절차를 고정하고, `createItem` 등 훅을 추상으로 둡니다 |
| `Item` | 제품의 공통 사용 계약(`use`)을 정의합니다 |
| `DefaultItemCreator` | 구체 Creator. 기본 초기화·마무리와 `DefaultItem` 생성을 담당합니다 |
| `DefaultItem` | 이름만 다른 단순 제품입니다 |

학습 예제의 패키지 배치입니다.
`fw`에 추상 `Creator`·`Item`이 있고, 바깥에 구체 구현과 `Application`이 있습니다.

![Factory Method 예제 패키지 구조](/img/factory-method/package-structure.png)

## 예제

패키지 이름은 학습 예제 기준(`CodeTest.pattern.factoryMethod`)입니다.
실제 서비스 패키지 규칙과는 무관합니다.

```java
package CodeTest.pattern.factoryMethod.fw;

public abstract class Creator {

    public Item create(String itemName) {
        init(itemName);
        Item item = createItem(itemName);
        end(itemName);
        return item;
    }

    abstract protected String end(String itemName);

    abstract protected String init(String itemName);

    abstract protected Item createItem(String itemName);
}
```

```java
package CodeTest.pattern.factoryMethod.fw;

public abstract class Item {
    public abstract void use();
}
```

```java
package CodeTest.pattern.factoryMethod;

import CodeTest.pattern.factoryMethod.fw.Creator;
import CodeTest.pattern.factoryMethod.fw.Item;

public class DefaultItemCreator extends Creator {

    @Override
    protected String end(String itemName) {
        System.out.println("Default 마무리 작업!");
        return itemName;
    }

    @Override
    protected String init(String itemName) {
        System.out.println("Default 초기 작업!");
        return itemName;
    }

    @Override
    protected Item createItem(String itemName) {
        return new DefaultItem(itemName);
    }
}
```

```java
package CodeTest.pattern.factoryMethod;

import CodeTest.pattern.factoryMethod.fw.Item;

public class DefaultItem extends Item {

    private final String itemName;

    public DefaultItem(String itemName) {
        this.itemName = itemName;
    }

    @Override
    public void use() {
        System.out.println(itemName + " 사용했습니다!");
    }
}
```

```java
package CodeTest.pattern.factoryMethod;

import CodeTest.pattern.factoryMethod.fw.Creator;
import CodeTest.pattern.factoryMethod.fw.Item;

public class Application {
    public static void main(String[] args) {
        Creator creator = new DefaultItemCreator();

        Item item1 = creator.create("나무칼");
        Item item2 = creator.create("나무방패");
        Item item3 = creator.create("나무갑주");

        item1.use();
        item2.use();
        item3.use();
    }
}
```

## 적용 범위와 한계

- 제품 종류가 늘어날 때 Creator 하위 타입이나 `createItem` 분기만 확장하면 호출 코드를 덜 건드립니다.
- 생성 절차 자체가 제품마다 크게 달라지면 이 예제의 공통 `create` 골격이 맞지 않을 수 있습니다.
- Spring Bean 생성, Facade 조합과 같은 이 저장소의 백엔드 원셋 규칙과는 다른 층위의 학습 패턴입니다.

## 참고

- GoF Factory Method의 일반 개념은 공개된 패턴 설명을 따릅니다.
