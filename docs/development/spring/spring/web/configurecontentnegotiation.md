---
format: md
id: k-configurecontentnegotiation
title: "configureContentNegotiation"
description: "configureContentNegotiation"
tags:
  - Java
  - Spring
status: active
slug: /knowledge/k-configurecontentnegotiation
---
# configureContentNegotiation

파일의 확장자 타입을 결정해주는 역할이다.

```java
@Configuration
public class ViewResolverConfiguration implements WebMvcConfigurer {

    @Override
    public void configureContentNegotiation(ContentNegotiationConfigurer configurer) {
        Map<String, MediaType> mediatypes = new HashMap<>();
        mediatypes.put("html", MediaType.TEXT_HTML);
        mediatypes.put("pdf", MediaType.valueOf("application/json"));
        mediatypes.put("xls", MediaType.valueOf("application/vnd.ms-excel"));
        mediatypes.put("xml", MediaType.APPLICATION_XML);
        mediatypes.put("json", MediaType.APPLICATION_JSON);
        configurer.mediaTypes(mediatypes);
    }

    @Bean
    public ViewResolver pdfViewResolver() {

        ResourceBundleViewResolver viewResolver = new ResourceBundleViewResolver();
        viewResolver.setOrder(0);
        viewResolver.setBasename("court-views-pdf");
        return viewResolver;
    }

    @Bean
    public ResourceBundleViewResolver viewResolver() {

        ResourceBundleViewResolver viewResolver = new ResourceBundleViewResolver();
        viewResolver.setOrder(0);
        viewResolver.setBasename("court-views");
        return viewResolver;
    }

    @Bean
    public InternalResourceViewResolver internalResourceViewResolver() {
        InternalResourceViewResolver viewResolver = new InternalResourceViewResolver();
        viewResolver.setOrder(1);
        viewResolver.setPrefix("/WEB-INF/jsp/");
        viewResolver.setSuffix(".jsp");
        return viewResolver;
    }

    @Bean
    public ContentNegotiatingViewResolver contentNegotiatingViewResolver(ContentNegotiationManager contentNegotiationManager) {

        ContentNegotiatingViewResolver viewResolver = new ContentNegotiatingViewResolver();
        viewResolver.setContentNegotiationManager(contentNegotiationManager);
        return viewResolver;
    }
}
```
