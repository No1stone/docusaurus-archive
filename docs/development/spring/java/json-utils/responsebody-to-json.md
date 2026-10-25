---
format: md
id: k-responsebody-to-json
title: "@ResponseBody To Json"
description: "@ResponseBody To Json"
tags:
  - Java
  - Spring
status: active
slug: /knowledge/k-responsebody-to-json
---
# @ResponseBody To Json

많이 한거라 설명 생략

```java
@Controller
public class RestMemberController{

@RequestMapping("/members")
@ResponseBody
public Members getRestMebers(){
Members members = new Member();
members.addMembers(memberService.findAll());
return members;
}

}
```
