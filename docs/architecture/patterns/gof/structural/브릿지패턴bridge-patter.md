---
format: md
id: pattern-브릿지패턴bridge-patter
title: "브릿지패턴(Bridge Patter)"
description: "브릿지패턴(Bridge Patter)"
tags:
  - GoF
  - Java
status: active
slug: /patterns/pattern-브릿지패턴bridge-patter
---
# 브릿지패턴(Bridge Patter)

핵심: 구현되있는 기능들만 교체해서 사용한다.

인스턴스화되서 출력되는 부분은 변하지않는다.

인터페이스 생성

클래스로 인터페이스 기능을 델리게이트시킴

프린트해주는 클래스에 델리게이트시킨 클래스를 상속

인터페이스 → 델리게이트 → 프린트 구조가 완성

마치.. 녹즙기에 물건을 갈아넣으면.. 건더기와 쥬스가 분리되듯...

인풋이바뀌어도 출력된 건더기와 쥬스가 분리되는것은 같다...

여기에 기능펑션을 구현

기본 / 소리 / 빛 등등

구현된걸 인터페이스 임플리먼트시켜 구현시킴

구현체 → 인터페이스 → 델리게이트 → 프린트됨

기능구조

```java
package CodeTest.pattern.bridge.useing;

public interface MorseCodeFunction {
	public void dot();
	public void dash();
	public void space();
}
```

```java
package CodeTest.pattern.bridge.useing;

public class MorseCode {

	private MorseCodeFunction function;
	
	public MorseCode(MorseCodeFunction function) {
		super();
		this.function = function;
	}

	public void dot() {
		function.dot();
	}

	public void dash() {
		function.dash();
		}

	public void space() {
		function.space();
	}

}
```

```java
package CodeTest.pattern.bridge.useing;

public class PrintMorseCode extends MorseCode{
	

	
	public PrintMorseCode(MorseCodeFunction function) {
		super(function);
	}
	public PrintMorseCode j() {
	
		dot();dash();dash();dash();
		System.out.println();
		return this;
	}
	public PrintMorseCode a() {
		dot();dash();
		System.out.println();
		return this;
	}
	public PrintMorseCode n() {
		dash();dot();
		System.out.println();
		return this;
	}
	public PrintMorseCode g() {
		dash();dash();dot();
		System.out.println();
		return this;
	}
	

}
```

```java
package CodeTest.pattern.bridge.useing;

public class Main {

	public static void main(String[] args) {

		PrintMorseCode code1 = new PrintMorseCode(new DefaultFunction());
		PrintMorseCode code2 = new PrintMorseCode(new SoundFunction());
		PrintMorseCode code3 = new PrintMorseCode(new FlashFunction());
		
		code1.j().a().n().g();
		code2.j().a().n().g();
		code3.j().a().n().g();
		
		}

}
```

여기서부터 구현

```java
package CodeTest.pattern.bridge.useing;

import com.sun.el.lang.FunctionMapperImpl.Function;

public class DefaultFunction implements MorseCodeFunction {

	
	
	@Override
	public void dot() {

		System.out.print(".");
		
	}

	@Override
	public void dash() {
		
		System.out.print("-");
		
	}

	@Override
	public void space() {

		System.out.print(" ");
		
	}

}
```

```java
package CodeTest.pattern.bridge.useing;

import com.sun.el.lang.FunctionMapperImpl.Function;

public class FlashFunction implements MorseCodeFunction {

	
	
	@Override
	public void dot() {

		System.out.print("반짝");
		
	}

	@Override
	public void dash() {
		
		System.out.print("바안짝");
		
	}

	@Override
	public void space() {

		System.out.print(" ");
		
	}

}
```

```java
package CodeTest.pattern.bridge.useing;

public class SoundFunction implements MorseCodeFunction {

	@Override
	public void dot() {

		System.out.print("쩜");
		
	}

	@Override
	public void dash() {
		
		System.out.print("대쉬");
		
	}

	@Override
	public void space() {

		System.out.print(" ");
		
	}

}
```
