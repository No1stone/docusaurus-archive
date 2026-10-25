---
format: md
id: k-httputils
title: "HTTPUtils"
description: "HTTPUtils"
tags:
  - AWS
  - HTTP
  - Java
  - Spring
status: active
slug: /knowledge/k-httputils
---
# HTTPUtils

```java
import javax.servlet.http.HttpServletRequest;

import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

public class HttpUtils {
public static String getRemoteIP() {
	HttpServletRequest req = ((ServletRequestAttributes)RequestContextHolder.currentRequestAttributes()).getRequest();
    String ip = req.getHeader("X-FORWARDED-FOR");
    if (ip == null) {
        ip = req.getRemoteAddr();
    }
    return ip;
}
}
```
