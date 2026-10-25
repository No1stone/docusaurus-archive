---
format: md
id: pattern-프로토타입prototype-pattern
title: "프로토타입(Prototype Pattern)"
description: "프로토타입(Prototype Pattern)"
tags:
  - GoF
  - Java
status: active
slug: /patterns/pattern-프로토타입prototype-pattern
---
# 프로토타입(Prototype Pattern)

원형을 놔두고 복사하는 기능이다

Interface CloneAble 사용

```java
package CodeTest.pattern.Prototype.exame;

public class Cat implements Cloneable{

	private String name;
	
	public void setName(String name) {
		this.name = name;
	}
	
	public String getName() {
		return name;
	}
	
	public Cat copy() throws CloneNotSupportedException {
		Cat ret = (Cat)this.clone();
		return ret;
	}
}
```

```java
package CodeTest.pattern.Prototype.exame;

public class Main {

public static void main(String[] args) throws CloneNotSupportedException {

	Cat navi =  new Cat();
	
	navi.setName("navi");
	
	Cat yo = navi.copy();
	yo.setName("yo");
	
	System.out.println(navi.getName());
	System.out.println(yo.getName());
	
	
}
}
```

프로토타입은 여러가시 사용방법이 있는듯하다.

추가로 정리 필요

클래스로부터 인스턴스 생성이 어려운경우

클론에이블로 복사해서 사용한다.
