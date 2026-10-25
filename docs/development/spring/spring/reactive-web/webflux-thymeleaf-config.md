---
format: md
id: k-webflux-thymeleaf-config
title: "Webflux Thymeleaf Config"
description: "Webflux Thymeleaf Config"
tags:
  - Java
  - Spring
status: active
slug: /knowledge/k-webflux-thymeleaf-config
---
# Webflux Thymeleaf Config

Webflux config

```java
@Configuration
public class RoutsConfig implements ApplicationContextAware, WebFluxConfigurer {

	ApplicationContext context;

	@Override
	public void configureViewResolvers(ViewResolverRegistry registry) {
		registry.viewResolver(thymeleafReactiveViewResolver());
	}

	@Override
	public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {

	}

@Bean
	public ITemplateResolver thymeleafTemplateResolver() {
		final SpringResourceTemplateResolver resolver = new SpringResourceTemplateResolver();
		resolver.setApplicationContext(this.context);
		resolver.setPrefix("classpath:static/");
		resolver.setSuffix(".html");
		resolver.setTemplateMode(TemplateMode.HTML);
		resolver.setCacheable(false);
		resolver.setCheckExistence(false);
		return resolver;
	}

	@Bean
	public ISpringWebFluxTemplateEngine thymeleafTemplateEngine() {
		SpringWebFluxTemplateEngine templateEngine = new SpringWebFluxTemplateEngine();
		templateEngine.setTemplateResolver(thymeleafTemplateResolver());
		return templateEngine;
	}

	@Bean
	public ThymeleafReactiveViewResolver thymeleafReactiveViewResolver() {
		ThymeleafReactiveViewResolver viewResolver = new ThymeleafReactiveViewResolver();
		viewResolver.setTemplateEngine(thymeleafTemplateEngine());
		return viewResolver;
	}

// thymeleaf page render
	@Bean
	public RouterFunction<ServerResponse> index() { // /요청에 대한 페이지 정의
		return RouterFunctions.route(RequestPredicates.GET("/").and(RequestPredicates.accept(MediaType.TEXT_HTML)),
				req -> ServerResponse.ok().render("index", new HashMap<Object, Object>()));
	}

	// thymeleaf page render
	@Bean
	public RouterFunction<ServerResponse> firstpage() {
		return RouterFunctions.route(RequestPredicates.GET("/first").and(RequestPredicates.accept(MediaType.TEXT_HTML)),
				req -> ServerResponse.ok().render("firstpage", new HashMap<Object, Object>()));
	}

	// thymeleaf page render
	@Bean
	public RouterFunction<ServerResponse> test1page() {
		return RouterFunctions.route(
				RequestPredicates.GET("/testpage1").and(RequestPredicates.accept(MediaType.TEXT_HTML)),
				req -> ServerResponse.ok().render("testpage1", new HashMap<Object, Object>()));
	}

}

```
