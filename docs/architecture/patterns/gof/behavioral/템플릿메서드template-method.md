---
format: md
id: pattern-템플릿메서드template-method
title: "템플릿메서드(Template Method)"
description: "템플릿메서드(Template Method)"
tags:
  - GoF
  - Java
status: active
slug: /patterns/pattern-템플릿메서드template-method
---
# 템플릿메서드(Template Method)

템플릿메서드는 하위클래스만 사용해서 재정의 해야하기때문에

프로텍티드(protected O) 사용

외부 호출 X ( private X)

추상클래스에서 구현체에 접근하는걸 통제함.

```java
package CodeTest.pattern.templatemethod;
public abstract class AbstConnectHelper {
	abstract protected String doSecurity(String info);
	abstract protected String authentication(String id, String password);
	abstract protected int authorization(String userName);
	abstract protected String connection(String info);
	public String requestConnection(String info) {
		String id, password, userName, decodedInfo, userInfo;
		// 암호화된 정보를 복호화 합니다.
		decodedInfo = doSecurity(info);
		// decodedInfo에서 id 와 password를 추출
		id = "abc";
		password = "abc";
		userInfo = authentication(id, password);
		// userInfo에서 userName을 찾아 냅니다.
		userName = "abc";
		int result = authorization(userName);
		switch (result) {
		case 0:// 무료회원
			break;
		case 1:// 유료회원
			break;
		case 2:// 게임 마스터
			break;
		case 3:// 접속 권한 없음
			break;
		default:
			break;
		}
		return connection(userInfo);
	}
}
```

```java
package CodeTest.pattern.templatemethod;
public class Application {
	public static void main(String[] args) {
		AbstConnectHelper abstConnectHelper = new ConcreteConnectHelper();	
		abstConnectHelper.requestConnection("info");
	}
}
```

```java
package CodeTest.pattern.templatemethod;
public class ConcreteConnectHelper extends AbstConnectHelper {
	@Override
	protected String doSecurity(String info) {
		return info;
	}
	@Override
	protected String authentication(String id, String password) {
		if(id.equals("abc")|password.equals("abc"))
			return "true info";
		else
			return "false info";
	}
	@Override
	protected int authorization(String userName) {	
		return 0;
	}
	@Override
	protected String connection(String info) {	
		return info;
	}
}
```
