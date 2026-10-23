---
format: md
id: pattern-어탭터-패턴adapter-pattern
title: "어탭터 패턴(adapter Pattern)"
description: "어탭터 패턴(adapter Pattern)"
tags:
  - GoF
  - Java
status: active
slug: /patterns/pattern-어탭터-패턴adapter-pattern
---
# 어탭터 패턴(adapter Pattern)

인터페이스로 할당된 타입이나 파라미터들을 변환해서 연결시켜주는 패턴

오버로딩과비슷

```java
package CodeTest.pattern.adapter;
public interface Adapter {
	public Double twiceOf(Float num);
	public Double halfOf(Float num);
}
```

```java
package CodeTest.pattern.adapter;
public class AdapterImpl implements Adapter {
	@Override
	public Double twiceOf(Float num) {
		return Math.doubled(num.doubleValue());
	}
	@Override
	public Double halfOf(Float num) {
		return Math.half(num);
	}
}
```

```java
package CodeTest.pattern.adapter;
public class Application {
	public static void main(String[] args) {
		//요구사항을 수행하는 인스턴스
		Adapter target = new AdapterImpl();
		System.out.println(target.twiceOf(100.0f));
		System.out.println(target.halfOf(100.3f));
	}
}
```

```java
package CodeTest.pattern.adapter;
public class Math {
	//두배 
	public static double twoTime(double num){return num*2;}
	//절반
	public static double half(double num){
		return num/2;
		}
	//강화된 알고리즘
	public static Double doubled(Double d){return d*2;}
}
```
