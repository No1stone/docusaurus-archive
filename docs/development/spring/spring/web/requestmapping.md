---
format: md
id: k-requestmapping
title: "RequestMapping"
description: "RequestMapping"
tags:
  - Java
  - Spring
status: active
slug: /knowledge/k-requestmapping
---
# RequestMapping

```java
//member/* 이뒤에는 다통과
@Controller
@RequestMapping("member/*")
public class MemberController{

private final MemberController;

public MemberController(MemberService memberService){
this.memberService = memberService;
}
//컨트롤러 구분이없으면 알맞는 형으로 변경되서 온다.
@RequestMapping("add")
public String addMember(Medol medel){
medel.addAttribute("member", new member);
medel.addAttribute("guests", memberSerive.list());
return "memberList";
}
//두가지 주소를 콤마로 구분해서 받을수있음
@RequestMapping(value={"remove", "delete"}, method = RequestMethod.GET)
public String removeMember(@RequestParam("memberName")String memberName){
memberService.remove(memberName);
return "redirect:";
}
//{경로변수}라고한다.
//RESP형에 주로사용 
@RequestMapping("display/{member}")
public String displayMember(@pathVariable("member") String member, Model model){
model.addAttribute("member"), memberService.find(member).orElse(null);
return "member";
}

//그이외의 모든주소를 맵핑한다
@RequestMapping
public void memberList(){}

//제어권이없는 그냥메서드
public void memberLogic(String memberName){}

}
```
