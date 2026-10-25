---
format: md
id: k-resourcebundlemessagesource
title: "ResourceBundleMessageSource"
description: "ResourceBundleMessageSource"
tags:
  - Java
  - Spring
status: active
slug: /knowledge/k-resourcebundlemessagesource
---
# ResourceBundleMessageSource

다국어를 지원하는 어플리케이션을 만들때 주로 사용

message_en_US.properties

```xml
alert.checkout=A shopping cart has been checked out.
alert.inverntory.check=A shopping cart with{0} has been checked out at {1}.
```

주의사항 messageSource라고 이름을 지어야 애플리케이션콘텍스트가 감지함

```java
@Configration
public class ShopConfigration{

@Bean
public ReloadableResourceBundleMessageSource messageSource(){
ReloadableResourceBundleMessageSource messageSource = 
new ReloadableResourceBundleMessageSource();
messageSource.setBasenames("classpath:messages");
messageSource.setCacheseconds(1);
return MessageSource;
}
}
```
