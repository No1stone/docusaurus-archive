---
format: md
id: pattern-추상팩토리abstract-factory
title: "추상팩토리(Abstract Factory)"
description: "추상팩토리(Abstract Factory)"
tags:
  - GoF
  - HTTP
  - Java
  - Linux
status: active
slug: /patterns/pattern-추상팩토리abstract-factory
---
# 추상팩토리(Abstract Factory)

인터페이스들별 기능을 나열

Factoty 라는 하나의 인터페이스로 모으고

인스턴스를 생성하는 클래스를 만들어 사용

인스턴스 생성하는 클래스 하단엔 구현시킨 클래스 존재

기타: System.getProperty("[os.name](http://os.name/)"); //내 OS를 확인하는법

```java
package CodeTest.pattern.Abstract2.abs;

public interface Button {
	
	public void click();

}
```

```java
package CodeTest.pattern.Abstract2.abs;

public interface GuiFac {

	public Button createButton();
	public TextArea createTextArea();
	
}
```

```java
package CodeTest.pattern.Abstract2.abs;

public interface TextArea {

	public String getText();
}
```

```java
package CodeTest.pattern.Abstract2.concreate;

import CodeTest.pattern.Abstract2.abs.Button;
import CodeTest.pattern.Abstract2.abs.GuiFac;
import CodeTest.pattern.Abstract2.abs.TextArea;

public class FactoryInstance {
	public static GuiFac getGuiFac() {
		switch (1) {
		case 0:
			return new MacGutFac();
		case 1:
			return new LinuxGuiFac();
		case 2:
			return new WinGutFac();
		}
		return null;
	}

	private static int getOsCode() {
		if (System.getProperty("os.name").equals("Mac OS X")) {
			return 0;
		}
		return 1;
	}
}

class LinuxButton implements Button {
	@Override
	public void click() {
		System.out.println("리눅스 버튼 ");
	}
}

class LinuxGuiFac implements GuiFac {
	@Override
	public Button createButton() {
		//
		return new LinuxButton();
	}

	@Override
	public TextArea createTextArea() {
		// TODO Auto-generated method stub
		return new LinuxTextArea();
	}
}

class LinuxTextArea implements TextArea {
	@Override
	public String getText() {
		return "리눅스 텍스트에어리어";
	}
}

class MacButton implements Button {
	@Override
	public void click() {
		System.out.println("맥 버튼 ");
	}
}

class MacGutFac implements GuiFac {
	@Override
	public Button createButton() {
		return new MacButton();
	}

	@Override
	public TextArea createTextArea() {
		return new MacTextArea();
	}
}

class MacTextArea implements TextArea {
	@Override
	public String getText() {
		return "맥 텍스트 에어리어";
	}
}

class WinButton implements Button {
	@Override
	public void click() {
		System.out.println("윈도우 버튼 ");
	}
}

class WinGutFac implements GuiFac {
	@Override
	public Button createButton() {
		return new WinButton();
	}

	@Override
	public TextArea createTextArea() {
		return new WinTextArea();
	}
}

class WinTextArea implements TextArea {
	@Override
	public String getText() {
		return "윈도우 텍스트 에어리어";
	}
}
```

```java
package CodeTest.pattern.Abstract2;

import CodeTest.pattern.Abstract2.abs.Button;
import CodeTest.pattern.Abstract2.abs.GuiFac;
import CodeTest.pattern.Abstract2.abs.TextArea;
import CodeTest.pattern.Abstract2.concreate.FactoryInstance;

public class Main {

	public static void main(String[] args) {
	GuiFac fac = FactoryInstance.getGuiFac();

	
	Button button = fac.createButton();
	TextArea area = fac.createTextArea();
	
	button.click();
	System.out.println(area.getText());
	System.out.println(System.getProperty("os.name"));
	
	
	
	
	}

}
```
