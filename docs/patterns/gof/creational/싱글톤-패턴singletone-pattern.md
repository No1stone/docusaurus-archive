---
format: md
id: pattern-싱글톤-패턴singletone-pattern
title: "싱글톤 패턴(singletone Pattern)"
description: "싱글톤 패턴(singletone Pattern)"
tags:
  - GoF
  - Java
status: active
slug: /patterns/pattern-싱글톤-패턴singletone-pattern
---
# 싱글톤 패턴(singletone Pattern)

인스턴스를 하나만 생성을해

다른곳에서 사용할때

동일한 주소값을 사용하게해서

같은결과를 얻는것.

```java
package com.parkgaram.dp.singleton;

public class Application {

	public static void main(String[] args) {
		SomeSystemComponent component = SomeSystemComponent.getInstance();
		
	}

}
```

```java
package com.parkgaram.dp.singleton;

public class SomeSystemComponent {

	private static SomeSystemComponent instance;
	
	private SomeSystemComponent() {
		
	}
	
	public static SomeSystemComponent getInstance(){
		if (instance == null) {
			
		}else {
			instance = new SomeSystemComponent();
		}
		return instance;
	}
}
```
