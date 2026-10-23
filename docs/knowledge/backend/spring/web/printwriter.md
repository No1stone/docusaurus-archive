---
format: md
id: k-printwriter
title: "PrintWriter"
description: "PrintWriter"
tags:
  - HTTP
  - Java
  - Spring
status: active
slug: /knowledge/k-printwriter
---
# PrintWriter

```java
private final HttpServletRequest httpServletRequest;
private final HttpServletResponse httpServletResponse;

@Async
    public void test34(Long seq, String te) throws IOException {
        log.info("request - {}", httpServletRequest.getRequestURI());
        httpServletResponse.setContentType("text/event-stream");    // Header에 Content Type을 Event Stream으로 설정
        httpServletResponse.setCharacterEncoding("UTF-8");        // Header에 encoding을 UTF-8로 설정
        PrintWriter writer = httpServletResponse.getWriter();

        if (data.get(seq) != null) {
            for (String e : data.get(seq)) {
                writer.print(e);
                writer.print("\n");
            }
            ;
        }
    }
```
