---
format: md
id: k-security-info
title: "Security Info"
description: "Security Info"
tags:
  - Java
  - Spring
status: active
slug: /knowledge/k-security-info
---
# Security Info

```java
package com.demo.test.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/hello")
public class HelloRestController {

	@GetMapping("/user")
	public String helloUser() {
		return "Hello User";
	}
	
	@GetMapping("/admin")
	public String helloAdmin() {
		return "Hello Admin";
	}
	
}
```

기본적으로 return String 을 반환하지만

Security Dependency를 적용하면

로그인이 필요하게됨

![security-info-1.png](/img/security-info/security-info-1.png)
